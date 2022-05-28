export class SignUpInfo {
    //authorities: string[];
    nombreUsuario: string;
    username: string;

    constructor(nombreUsuario: string, username: string) {
        //this.authorities = ['admin'];
        this.nombreUsuario = nombreUsuario;
        this.username = username;
    }
}
