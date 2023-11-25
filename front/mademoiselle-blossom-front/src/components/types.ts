export type driedFlowerTile = {
    id: string,
    name: string,
    images: string[],
    price: number,
}

/* FROM DB */
export type article = {
    _id: string,
    name: string,
    files: string[],
    price: number,
    stock: number,
    description: string,

    color: string[],
    tone: string[],
    size: number,
    shape: string
}

export type catalog = article[]

/* Pop UP */
export type alert = {
    message: string,
    type: string
}