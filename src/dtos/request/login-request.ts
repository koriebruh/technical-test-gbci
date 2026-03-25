/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePass123!
 *       required:
 *         - email
 *         - password
 */
type LoginRequestProps = {
    email: string;
    password: string;
}

class LoginRequest {
    constructor(public props: LoginRequestProps) {}
}

export { LoginRequest };
