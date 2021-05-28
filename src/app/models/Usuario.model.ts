export class Usuario
{
    constructor
    ( 
        public email: string, 
        public nombre: string, 
        public estado: boolean, 
        public imagen: string,
        public password?: string
    ) {}

    get imagenUrl()
    {
        return this.imagen;
    }
}