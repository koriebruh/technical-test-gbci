/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date-time
 *         weight:
 *           type: number
 *         height:
 *           type: number
 *         interests:
 *           type: array
 *           items:
 *             type: string
 */
export type GetProfileResponseProps = {
    email: string;
    name: string;
    birthday: Date;
    weight: number;
    height: number;
    interests: string[];
}

export class GetProfileResponse {
    constructor(public props: GetProfileResponseProps) {}
}
