/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           example: user
 */
type RegisterResponseProps = {
    id: string;
    name: string;
    email: string;
    role: string;
}

class RegisterResponse {
    id: string;
    name: string;
    email: string;
    role: string;

    constructor(props: RegisterResponseProps) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.role = props.role;
    }
}

export { RegisterResponse }