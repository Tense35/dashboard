import { Usuario } from "../models/Usuario.model";

export interface iUsuario 
{
    ok: boolean,
    data?: UsuarioData,
    total?: number
}

export interface UsuarioData
{
    email: string,
    nombre?: string,
    password?: string,
    imagen?: string,
    estado?: boolean
}

export interface ObtenerUsuario
{
    total: number,
    data: Usuario[];
}