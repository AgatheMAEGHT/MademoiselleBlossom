import { type } from "os"

export type driedFlowerTags = {
    color: string,
    size: number,
    tone: string,
    shape: string
}

export type driedFlowerTile = {
    id: string,
    name: string,
    images: string[],
    price: number,
    tags: driedFlowerTags
}

export type driedFlowerCatalog = driedFlowerTile[]

export type alert = {
    message: string,
    type: string
}