export interface Producto
{
    ok: boolean,
    data?: ProductoData
    msg?: string,
    total?: number
}

export interface ProductoData
{
    id_producto: number,
    id_categoria: number,
    color: string,
    talla: string,
    nombre: string,
    genero: string,
    precio: number,
    descripcion: string,
    imagen: string,
    iva: number,
    destacar: boolean,
    descuento: number,
    stock: number,
    estado: boolean,
    precioFinal: number
}