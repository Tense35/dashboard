import { Usuario } from "../models/Usuario.model";

export interface ObtenerUsuario
{
    total: number,
    data: Usuario[];
}