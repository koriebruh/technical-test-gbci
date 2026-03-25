/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe Updated
 *         birthday:
 *           type: string
 *           format: date
 *           example: 1995-06-15
 *         weight:
 *           type: number
 *           example: 78
 *           minimum: 0
 *         height:
 *           type: number
 *           example: 180
 *           minimum: 0
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ['coding', 'music', 'gaming']
 */
export type UpdateProfileRequestProps = {
    name?: string;
    birthday?: Date;
    weight?: number;
    height?: number;
    interests?: string[];
}

export class UpdateProfileRequest {
    constructor(public props: UpdateProfileRequestProps) {}
}
