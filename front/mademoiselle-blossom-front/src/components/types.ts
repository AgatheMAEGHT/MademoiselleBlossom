export type driedFlowerTags = {
    color: string,
    size: string,
    shape: string
}

export type driedFlowerTile = {
    name: string,
    images: string[],
    price: number,
    tags: driedFlowerTags
}

export type driedFlowerCatalog = driedFlowerTile[]