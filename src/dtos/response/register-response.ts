type RegisterResponseProps = {
    id: string;
    name: string;
    email: string;
    role: string;
}

class RegisterResponse {
    constructor(public props: RegisterResponseProps) { }
}

export { RegisterResponse }