import { z } from "zod";

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
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type LoginRequestProps = z.infer<typeof LoginSchema>;

class LoginRequest {
    public props: LoginRequestProps;

    constructor(props: unknown) {
        this.props = LoginSchema.parse(props);
    }
}

export { LoginRequest };
