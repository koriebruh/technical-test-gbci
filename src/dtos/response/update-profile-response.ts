export type UpdateProfileResponseProps = {
    message: string;
}

export class UpdateProfileResponse {
    message: string;

    constructor(props: UpdateProfileResponseProps) {
        this.message = props.message;
    }
}
