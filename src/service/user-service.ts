import bcrypt from "bcryptjs";
import { UserRepository, UpdateUserPayload } from "../repository/user-repository";
import { JwtUtil, JwtPayload } from "../libs/jwt";

import { RegisterRequest } from "@/dtos/request/register-request";
import { RegisterResponse } from "@/dtos/response/register-response";
import { LoginRequest } from "@/dtos/request/login-request";
import { LoginResponse } from "@/dtos/response/login-response";
import { CreateProfileRequest } from "@/dtos/request/create-profile";
import { UpdateProfileRequest } from "@/dtos/request/update-profile";
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

const SALT_ROUNDS = 12;

interface RefreshTokenResponse {
  access_token: string;
}

export const AuthService = {

    // Regsiter New users
    async register(request: RegisterRequest): Promise<RegisterResponse> {
        const user = await UserRepository.findByEmail(request.props.email);
        if (user) {
            throw new UserAlreadyExistsException(request.props.email);
        }
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

        return response;
    },


    // Login
    async login(request: LoginRequest): Promise<LoginResponse> {
        const user = await UserRepository.findByEmail(request.props.email);
        if (!user) {
            throw new UserNotFoundException("User");
        }
        const isPasswordMatch = await bcrypt.compare(request.props.password, user.password);
        if (!isPasswordMatch) {
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

        return response;

    },

    // Create Profile
    async createProfile(userId: string, request: CreateProfileRequest): Promise<UpdateProfileResponse> {
        console.log(`[AuthService] createProfile called for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) throw new UserNotFoundException("User");

        const updatePayload: UpdateUserPayload = request.props;
        await UserRepository.updateById(userId, updatePayload);
        await RabbitMQUtil.publish('user.profile_created', { event: 'PROFILE_CREATED', payload: { userId, data: request.props } });
        return new UpdateProfileResponse({ message: "Profile created successfully" });
    },

    // Get Profile
    async getProfile(userId: string): Promise<GetProfileResponse> {
        console.log(`[AuthService] getProfile called for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) throw new UserNotFoundException("User");
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
        console.log(`[AuthService] updateProfile called for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) throw new UserNotFoundException("User");

        try {
            const updatePayload: UpdateUserPayload = request.props;
            await UserRepository.updateById(userId, updatePayload);
            await RabbitMQUtil.publish('user.profile_updated', { event: 'PROFILE_UPDATED', payload: { userId, data: request.props } });
            return new UpdateProfileResponse({ message: "Profile updated successfully" });
        } catch {
            throw new ProfileUpdateException();
        }
    },

    // Logout
    async logout(userId: string): Promise<void> {
        console.log(`[AuthService] logout called for user: ${userId}`);
        await RabbitMQUtil.publish('user.logged_out', { event: 'USER_LOGGED_OUT', payload: { userId } });
    },

    // Get New Refresh
    async refreshToken(token: string): Promise<RefreshTokenResponse> {
        console.log('[AuthService] refreshToken called');

        try {
            const decoded = await JwtUtil.verify(token);

            if (decoded.type !== 'refresh') {
                throw new Error("Invalid token type");
            }

            const user = await UserRepository.findById(decoded.id);
            if (!user) {
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

            return { access_token: accessToken };
        } catch (error) {
            console.error("RefreshToken Error:", error);
            throw new InvalidCredentialsException();
        }
    },

    // change password
    async changePassword(userId: string, newPassword: string): Promise<void> {
        console.log(`[AuthService] changePassword called for user: ${userId}`);
        const user = await UserRepository.findById(userId);
        if (!user) throw new UserNotFoundException("User");

        try {
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await UserRepository.updateById(userId, { password: hashedPassword });
            await RabbitMQUtil.publish('user.password_changed', { event: 'PASSWORD_CHANGED', payload: { userId } });
        } catch {
            throw new PasswordChangeException();
        }
    }
}