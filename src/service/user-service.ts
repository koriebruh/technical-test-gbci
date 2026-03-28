import bcrypt from "bcryptjs";
import { UserRepository, UpdateUserPayload } from "../repository/user-repository";
import { JwtUtil, JwtPayload } from "../libs/jwt";

import { RegisterRequest } from "@/dtos/request/register-request";
import { RegisterResponse } from "@/dtos/response/register-response";
import { LoginRequest } from "@/dtos/request/login-request";
import { LoginResponse } from "@/dtos/response/login-response";
import { CreateProfileRequest } from "@/dtos/request/create-profile-request";
import { UpdateProfileRequest } from "@/dtos/request/update-profile-request";
import { ChangePassRequest } from "@/dtos/request/change-pass-request";
import { GetProfileResponse } from "@/dtos/response/get-profile";
import { UpdateProfileResponse } from "@/dtos/response/update-profile-response";
import { RabbitMQUtil } from "../libs/rabbitmq";
import {
  UserAlreadyExistsException,
  UserNotFoundException,
  InvalidCredentialsException,
  PasswordChangeException,
  ProfileUpdateException
} from "../exceptions/user-exception";
import { AppConfig } from "../config/app-config";

const SALT_ROUNDS = AppConfig.SECURITY.SALT_ROUNDS;

interface RefreshTokenResponse {
  access_token: string;
}

export const AuthService = {

    // Regsiter New users
    async register(request: RegisterRequest): Promise<RegisterResponse> {
        console.info(`[AuthService] register - Attempting to register user: ${request.props.email}`);
        const user = await UserRepository.findByEmail(request.props.email);
        if (user) {
            console.warn(`[AuthService] register - User already exists: ${request.props.email}`);
            throw new UserAlreadyExistsException(request.props.email);
        }

        try {
            const hashedPassword = await bcrypt.hash(request.props.password, SALT_ROUNDS);
            const newUser = await UserRepository.create({
                ...request.props,
                password: hashedPassword,
            });

            const userId = String(newUser._id);
            const response = new RegisterResponse({
                id: userId,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            });

            // Publish event to RabbitMQ
            await RabbitMQUtil.publish('user.registered', { event: 'USER_REGISTERED', payload: response });
            console.info(`[AuthService] register - Successfully registered user: ${request.props.email}`);
            return response;
        } catch (error) {
            console.error(`[AuthService] register - Error registering user: ${request.props.email}`, error);
            throw error;
        }
    },

    // Login
    async login(request: LoginRequest): Promise<LoginResponse> {
        console.info(`[AuthService] login - Attempting to login user: ${request.props.email}`);
        const user = await UserRepository.findByEmail(request.props.email);
        if (!user) {
            console.warn(`[AuthService] login - User not found: ${request.props.email}`);
            throw new UserNotFoundException("User");
        }
        const isPasswordMatch = await bcrypt.compare(request.props.password, user.password);
        if (!isPasswordMatch) {
            console.warn(`[AuthService] login - Invalid password for user: ${request.props.email}`);
            throw new InvalidCredentialsException();
        }
        const userId = String(user._id);
        const payload: JwtPayload = {
            sub: user.email,
            id: userId,
            email: user.email,
            role: user.role,
            type: "access",
        };
        const token = await JwtUtil.sign(payload);

        const refreshTokenPayload: JwtPayload = { ...payload, type: "refresh" };
        const refreshToken = await JwtUtil.signRefreshToken(refreshTokenPayload);

        const response = new LoginResponse({
            access_token: token,
            refresh_token: refreshToken,
            expires_in: 3600,
            type: "Bearer",
        });

        // Publish event to RabbitMQ
        await RabbitMQUtil.publish('user.logged_in', { event: 'USER_LOGGED_IN', payload: { email: user.email, id: payload.id } });
        console.info(`[AuthService] login - Successfully logged in user: ${request.props.email}`);
        return response;
    },

    // Create Profile
    async createProfile(userId: string, request: CreateProfileRequest): Promise<UpdateProfileResponse> {
        console.info(`[AuthService] createProfile - Attempting to create profile for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) {
            console.warn(`[AuthService] createProfile - User not found: ${userId}`);
            throw new UserNotFoundException("User");
        }

        try {
            const updatePayload: UpdateUserPayload = request.props;
            await UserRepository.updateOne(userId, updatePayload);
            await RabbitMQUtil.publish('user.profile_created', { event: 'PROFILE_CREATED', payload: { userId, data: request.props } });
            console.info(`[AuthService] createProfile - Successfully created profile for user: ${userId}`);
            return new UpdateProfileResponse({ message: "Profile created successfully" });
        } catch (error) {
            console.error(`[AuthService] createProfile - Error creating profile for user: ${userId}`, error);
            throw new ProfileUpdateException("Failed to create profile");
        }
    },

    // Get Profile
    async getProfile(userId: string): Promise<GetProfileResponse> {
        console.info(`[AuthService] getProfile - Fetching profile for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) {
            console.warn(`[AuthService] getProfile - User not found: ${userId}`);
            throw new UserNotFoundException("User");
        }
        console.info(`[AuthService] getProfile - Successfully fetched profile for user: ${userId}`);
        return new GetProfileResponse({
            email: user.email,
            name: user.name,
            birthday: user.birthday,
            weight: user.weight,
            height: user.height,
            interests: user.interests
        });
    },

    // Update Profile
    async updateProfile(userId: string, request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
        console.info(`[AuthService] updateProfile - Attempting to update profile for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) {
            console.warn(`[AuthService] updateProfile - User not found: ${userId}`);
            throw new UserNotFoundException("User");
        }

        try {
            const updatePayload: UpdateUserPayload = request.props;
            await UserRepository.updateOne(userId, updatePayload);
            await RabbitMQUtil.publish('user.profile_updated', { event: 'PROFILE_UPDATED', payload: { userId, data: request.props } });
            console.info(`[AuthService] updateProfile - Successfully updated profile for user: ${userId}`);
            return new UpdateProfileResponse({ message: "Profile updated successfully" });
        } catch (error) {
            console.error(`[AuthService] updateProfile - Error updating profile for user: ${userId}`, error);
            throw new ProfileUpdateException();
        }
    },

    // Logout
    async logout(userId: string): Promise<void> {
        console.info(`[AuthService] logout - Attempting logout for user: ${userId}`);
        try {
            await RabbitMQUtil.publish('user.logged_out', { event: 'USER_LOGGED_OUT', payload: { userId } });
            console.info(`[AuthService] logout - Successfully logged out user: ${userId}`);
        } catch (error) {
            console.error(`[AuthService] logout - Event publish error for user: ${userId}`, error);
        }
    },

    // Get New Refresh
    async refreshToken(token: string): Promise<RefreshTokenResponse> {
        console.info('[AuthService] refreshToken - Attempting to refresh token');
        try {
            const decoded = await JwtUtil.verify(token);

            if (decoded.type !== 'refresh') {
                console.warn('[AuthService] refreshToken - Provided token is not a refresh token');
                throw new Error("Invalid token type");
            }

            const user = await UserRepository.findById(decoded.id);
            if (!user) {
                console.warn(`[AuthService] refreshToken - User not found: ${decoded.id}`);
                throw new UserNotFoundException("User");
            }

            const payload: JwtPayload = {
                sub: user.email,
                id: String(user._id),
                email: user.email,
                role: user.role,
                type: "access",
            };

            const accessToken = await JwtUtil.sign(payload);

            await RabbitMQUtil.publish('user.token_refreshed', { event: 'TOKEN_REFRESHED', payload: { userId: decoded.id } });
            console.info(`[AuthService] refreshToken - Successfully refreshed token for user: ${decoded.id}`);

            return { access_token: accessToken };
        } catch (error) {
            console.error("[AuthService] refreshToken - Error refreshing token:", error);
            throw new InvalidCredentialsException();
        }
    },

    // change password
    async changePassword(userId: string, request: ChangePassRequest): Promise<void> {
        console.info(`[AuthService] changePassword - Init for user: ${userId}`);
        const user = await UserRepository.findById(userId, false);
        if (!user) {
            console.warn(`[AuthService] changePassword - User not found: ${userId}`);
            throw new UserNotFoundException("User");
        }

        if (request.props.new_password !== request.props.confirm_password) {
             console.warn(`[AuthService] changePassword - Validation failed: new_password and confirm_password do not match for user: ${userId}`);
             throw new PasswordChangeException("New password and confirm password do not match");
        }

        const isPasswordMatch = await bcrypt.compare(request.props.current_password, user.password);
        if (!isPasswordMatch) {
             console.warn(`[AuthService] changePassword - Attempted to change password but current password was invalid for user: ${userId}`);
             throw new PasswordChangeException("Invalid current password");
        }

        try {
            const hashedPassword = await bcrypt.hash(request.props.new_password, SALT_ROUNDS);
            await UserRepository.updateOne(userId, { password: hashedPassword });
            await RabbitMQUtil.publish('user.password_changed', { event: 'PASSWORD_CHANGED', payload: { userId } });
            console.info(`[AuthService] changePassword - Successfully changed password for user: ${userId}`);
        } catch (error) {
            console.error(`[AuthService] changePassword - Critical error saving new password for user: ${userId}`, error);
            throw new PasswordChangeException("Failed to save new password");
        }
    }
}