import { type } from "os"

export type driedFlowerTile = {
    id: string,
    name: string,
    images: string[],
    price: string,
}

/* FROM DB */
export type articleDB = {
    _id: string,
    name: string,
    description: string,
    files: string[],
    price: number,
    stock: number,
    tones: string[],
    size: number,
    shape: string
    type: string,
    colors: { name: string, value: string }[],
}

export type article = {
    _id: string,
    name: string,
    description: string,
    files: string[],
    price: string,
    stock: number,
    tones: string[],
    size: number,
    shape: string
    type: string,
    colors: string[],
}

export type catalog = article[]

export type select = {
    value: string
    label: string,
}

/* Pop UP */
export type alert = {
    message: string,
    type: string
}