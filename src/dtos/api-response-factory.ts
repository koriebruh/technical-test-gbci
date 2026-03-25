import { headers } from "next/headers";
import { Meta, ApiResponse } from "./api-response";
import { AppConfig } from "../config/app-config";

export class ApiResponseFactory {
    static async success<T>(
        data: T,
        message = "OK",
        meta?: Partial<Meta>
    ): Promise<ApiResponse<T>> {
        return {
            success: true,
            message,
            data,
            meta: await this.buildMeta(meta),
        };
    }

    static async error(
        message = "Error",
        errors?: Record<string, string>,
        meta?: Partial<Meta>
    ): Promise<ApiResponse<null>> {
        return {
            success: false,
            message,
            errors,
            meta: await this.buildMeta(meta),
        };
    }

    private static async buildMeta(meta?: Partial<Meta>): Promise<Meta> {
        return {
            timestamp: new Date(),
            correlationId: meta?.correlationId ?? (await this.getCorrelationId()),
            service: AppConfig.APP.NAME,
            version: AppConfig.APP.VERSION,
        };
    }

    private static async getCorrelationId(): Promise<string> {
        const headersList = await headers();
        return headersList.get("x-correlation-id") || crypto.randomUUID();
    }
}