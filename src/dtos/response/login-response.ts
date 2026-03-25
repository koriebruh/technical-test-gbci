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
    constructor(public props: LoginResponseProps) { }
}

export { LoginResponse }