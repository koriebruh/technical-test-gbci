import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangePassRequest:
 *       type: object
 *       properties:
 *         current_password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: SecurePass123!
 *         new_password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewSecurePass456!
 *         confirm_password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewSecurePass456!
 *       required:
 *         - current_password
 *         - new_password
 *         - confirm_password
 */
const ChangePassSchema = z.object({
    current_password: z.string().min(8),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
});

type ChangePassRequestProps = z.infer<typeof ChangePassSchema>;

class ChangePassRequest {
    public props: ChangePassRequestProps;

    constructor(props: unknown) {
        this.props = ChangePassSchema.parse(props);
    }
}

export { ChangePassRequest };
