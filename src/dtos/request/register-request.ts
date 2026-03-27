import { z } from "zod";

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
const RegisterSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
});

type RegisterRequestProps = z.infer<typeof RegisterSchema>;

class RegisterRequest {
    public props: RegisterRequestProps;

    constructor(props: unknown) {
        this.props = RegisterSchema.parse(props);
    }
}

export { RegisterRequest };
