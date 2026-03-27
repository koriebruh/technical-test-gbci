import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         birthday:
 *           type: string
 *           format: date
 *           example: 1995-06-15
 *         weight:
 *           type: number
 *           example: 75
 *           minimum: 0
 *         height:
 *           type: number
 *           example: 180
 *           minimum: 0
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ['coding', 'music']
 *       required:
 *         - name
 *         - birthday
 *         - weight
 *         - height
 *         - interests
 */
const CreateProfileSchema = z.object({
    name: z.string().min(1),
    birthday: z.string().transform((str) => new Date(str)), // Accept string, transform to Date
    weight: z.number().min(0),
    height: z.number().min(0),
    interests: z.array(z.string()),
});

export type CreateProfileRequestProps = z.infer<typeof CreateProfileSchema>;

export class CreateProfileRequest {
    public props: CreateProfileRequestProps;

    constructor(props: unknown) {
        this.props = CreateProfileSchema.parse(props);
    }
}
