/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePass123!
 *           minLength: 8
 *       required:
 *         - name
 *         - email
 *         - password
 */
type RegisterRequestProps = {
    name: string;
    email: string;
    password: string;
    birthday: Date;
    weight: number;
    height: number;
    interests: string[];
}

class RegisterRequest {
    constructor(public props: RegisterRequestProps) { }
}

export { RegisterRequest }
