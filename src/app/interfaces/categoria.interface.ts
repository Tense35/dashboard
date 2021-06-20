export interface Categoria
{
    ok: boolean,
    data?: CategoriaData
    msg?: string,
    total?: number
}

export interface CategoriaData
{
    id_categoria: number,
    nombre: string,
    descripcion: string,
    estado: boolean,
}