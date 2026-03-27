/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Operation successful
 */
export type UpdateProfileResponseProps = {
    message: string;
}

export class UpdateProfileResponse {
    message: string;

    constructor(props: UpdateProfileResponseProps) {
        this.message = props.message;
    }
}
