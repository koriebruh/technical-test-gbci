import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../service/user-service";
import { RegisterRequest } from "../dtos/request/register-request";
import { LoginRequest } from "../dtos/request/login-request";
import { CreateProfileRequest } from "../dtos/request/create-profile";
import { UpdateProfileRequest } from "../dtos/request/update-profile";
import { RabbitMQUtil } from "../libs/rabbitmq";
import { ExceptionHandler } from "../exceptions/exception-handler";
import { ApiResponseFactory } from "../dtos/api-response-factory";

export const UserController = {

    async register(req: NextRequest) {
        try {
            const body = await req.json();
            const request = new RegisterRequest(body);

            // Send event from controller
            await RabbitMQUtil.publish('controller.register.invoked', { path: req.nextUrl.pathname, email: body.email });

            const response = await AuthService.register(request);

            return NextResponse.json(await ApiResponseFactory.success(response, "User registered successfully"), { status: 201 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async login(req: NextRequest) {
        try {
            const body = await req.json();
            const request = new LoginRequest(body);

            // Send event from controller
            await RabbitMQUtil.publish('controller.login.invoked', { path: req.nextUrl.pathname, email: body.email });

            const response = await AuthService.login(request);

            return NextResponse.json(await ApiResponseFactory.success(response, "Login successful"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async createProfile(req: NextRequest) {
        try {
            const body = await req.json();
            const request = new CreateProfileRequest(body);
            await RabbitMQUtil.publish('controller.createProfile.invoked', { path: req.nextUrl.pathname, userId });
            const response = await AuthService.createProfile(userId, request);
            return NextResponse.json(await ApiResponseFactory.success(response, "Profile created successfully"), { status: 201 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async getProfile(req: NextRequest) {
        try {
            await RabbitMQUtil.publish('controller.getProfile.invoked', { path: req.nextUrl.pathname, userId });
            const response = await AuthService.getProfile(userId);
            return NextResponse.json(await ApiResponseFactory.success(response, "Profile fetched successfully"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async updateProfile(req: NextRequest) {
        try {
            const body = await req.json();
            const request = new UpdateProfileRequest(body);
            await RabbitMQUtil.publish('controller.updateProfile.invoked', { path: req.nextUrl.pathname, userId });
            const response = await AuthService.updateProfile(userId, request);
            return NextResponse.json(await ApiResponseFactory.success(response, "Profile updated successfully"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async logout(req: NextRequest) {
        try {
            await RabbitMQUtil.publish('controller.logout.invoked', { path: req.nextUrl.pathname, userId });
            await AuthService.logout(userId);
            return NextResponse.json(await ApiResponseFactory.success(null, "Logout successful"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async changePassword(req: NextRequest) {
        try {
            const body = await req.json();
            await RabbitMQUtil.publish('controller.changePassword.invoked', { path: req.nextUrl.pathname, userId });
            await AuthService.changePassword(userId, body.newPassword);
            return NextResponse.json(await ApiResponseFactory.success(null, "Password changed successfully"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async refreshToken(req: NextRequest) {
        try {
            await RabbitMQUtil.publish('controller.refreshToken.invoked', { path: req.nextUrl.pathname, userId });
            const response = await AuthService.refreshToken();
            return NextResponse.json(await ApiResponseFactory.success(response, "Token refreshed successfully"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    }
};
