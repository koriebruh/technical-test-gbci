/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *         refresh_token:
 *           type: string
 *           example: dummy-refresh-token
 *         expires_in:
 *           type: integer
 *           example: 3600
 *         type:
 *           type: string
 *           example: Bearer
 */
type LoginResponseProps = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    type: "Bearer";
}


class LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    type: "Bearer";

    constructor(props: LoginResponseProps) {
        this.access_token = props.access_token;
        this.refresh_token = props.refresh_token;
        this.expires_in = props.expires_in;
        this.type = props.type;
    }
}

export { LoginResponse }