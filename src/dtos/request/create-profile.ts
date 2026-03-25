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
export type CreateProfileRequestProps = {
    name: string;
    birthday: Date;
    weight: number;
    height: number;
    interests: string[];
}

export class CreateProfileRequest {
    constructor(public props: CreateProfileRequestProps) {}
}
