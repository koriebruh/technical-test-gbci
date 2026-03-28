import { NextRequest, NextResponse } from "next/server";
import { RegisterRequest } from "../dtos/request/register-request";
import { LoginRequest } from "../dtos/request/login-request";
import { CreateProfileRequest } from "../dtos/request/create-profile-request";
import { UpdateProfileRequest } from "../dtos/request/update-profile-request";
import { ChangePassRequest } from "../dtos/request/change-pass-request";
import { RabbitMQUtil } from "../libs/rabbitmq";
import { ExceptionHandler } from "../exceptions/exception-handler";
import { ApiResponseFactory } from "../dtos/api-response-factory";
import { JwtUtil } from "../libs/jwt";
import { AuthService } from "../service/user-service";

// Helper to extract user ID from token without re-verification (Middleware handles verification)
const getUserId = (req: NextRequest): string => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || "";
    // We trust middleware has validated this token for protected routes
    const decoded = JwtUtil.decode(token);
    return decoded ? decoded.id : "";
};

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
            const userId = getUserId(req);

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
            const userId = getUserId(req);

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
            const userId = getUserId(req);

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
            const userId = getUserId(req);

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
            const userId = getUserId(req);

            const request = new ChangePassRequest(body);
            await RabbitMQUtil.publish('controller.changePassword.invoked', { path: req.nextUrl.pathname, userId });
            await AuthService.changePassword(userId, request);
            return NextResponse.json(await ApiResponseFactory.success(null, "Password changed successfully"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    },

    async refreshToken(req: NextRequest) {
        try {
            const authHeader = req.headers.get("authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                 return NextResponse.json(await ApiResponseFactory.error("Missing or invalid authorization token"), { status: 401 });
            }
            const token = authHeader.split(" ")[1];

            // For refresh token, we can get userId from the decoded refresh token inside AuthService or decode here if needed for logging
            // But since your AuthService.refreshToken takes the token, it will extract user ID.
            // However, to keep consistent logging in controller which uses userId:
            const decoded = JwtUtil.decode(token);
            const userId = decoded ? decoded.id : "unknown";

            await RabbitMQUtil.publish('controller.refreshToken.invoked', { path: req.nextUrl.pathname, userId });
            const response = await AuthService.refreshToken(token);
            return NextResponse.json(await ApiResponseFactory.success(response, "Token refreshed successfully"), { status: 200 });
        } catch (error) {
            return ExceptionHandler.handle(error);
        }
    }
};
