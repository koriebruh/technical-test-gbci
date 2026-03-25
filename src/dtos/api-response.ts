/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: object
 *           nullable: true
 *         errors:
 *           type: object
 *           nullable: true
 *           example: { code: 'ERROR_CODE' }
 *         meta:
 *           type: object
 *           properties:
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: '2026-03-25T10:30:45.123Z'
 *             correlationId:
 *               type: string
 *               format: uuid
 *               example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 *             service:
 *               type: string
 *               example: auth-service
 *             version:
 *               type: string
 *               example: 1.0.0
 *           required:
 *             - timestamp
 *             - correlationId
 *       required:
 *         - success
 *         - meta
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *         errors:
 *           type: object
 *           example: { code: 'ERROR_CODE' }
 *         meta:
 *           type: object
 */
export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string>;
    meta: Meta;
};

export type Meta = {
    timestamp: Date;
    correlationId: string;
    service?: string;
    version?: string;
};