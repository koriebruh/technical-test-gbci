import { z } from "zod";

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
const UpdateProfileSchema = z.object({
    name: z.string().optional(),
    birthday: z.string().transform((str) => new Date(str)).optional(),
    weight: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    interests: z.array(z.string()).optional(),
});

export type UpdateProfileRequestProps = z.infer<typeof UpdateProfileSchema>;

export class UpdateProfileRequest {
    public props: UpdateProfileRequestProps;

    constructor(props: unknown) {
        this.props = UpdateProfileSchema.parse(props);
    }
}
