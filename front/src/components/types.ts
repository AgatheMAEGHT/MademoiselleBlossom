export type metaHead = {
    title: string,
    url: string
};

/* ==================== *
*     Catalogs Tiles
*  ==================== */
export type freshFlowerTile = {
    id: string,
    name: string,
    images: string[],
    article: articleDB,
};

export type driedFlowerTile = {
    id: string,
    name: string,
    images: string[],
    price: string,
};

export type driedFlowerTileClient = {
    id: string,
    name: string,
    images: string[],
    price: string,
    favorite: { _id: string, article: string; },
};


/* ==================== *
*        FROM DB
*  ==================== */
//Color
export type colorDB = {
    _id: string,
    name: string,
    hexa: string;
};

export type newColorDB = {
    name: string,
    hexa: string;
};

//Tone
export type toneDB = {
    _id: string,
    name: string,
};

export type newToneDB = {
    name: string,
};

//Shape
export type shapeDB = {
    _id: string,
    name: string,
};

export type newShapeDB = {
    name: string,
};

//Species
export type speciesDB = {
    _id: string,
    name: string,
};

export type newSpeciesDB = {
    name: string,
};

//Article
export type articleDB = {
    _id: string,
    type: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    size: number,
    shape: shapeDB;
    colors: colorDB[],
    tones: toneDB[],
    species: speciesDB[],
    files: string[],
};

export type newArticleDB = {
    _id: string,
    type: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    size: number,
    shape: string;
    colors: string[],
    species: string[],
    tones: string[],
    files: string[],
};

export type favoriteDB = {
    _id: string,
    article: string;
};

export type favoritePopulatedDB = {
    _id: string,
    article: articleDB;
};

/* ===================== *
 *       END OF DB 
* ====================== */

export type article = {
    _id: string,
    type: string,
    name: string,
    description: string,
    price: string,
    stock: number,
    size: number,
    shape: shapeDB,
    colors: colorDB[],
    tones: toneDB[],
    species: speciesDB[],
    firstFile: File | string,
    files: [File | string],
};

export type catalog = articleDB[];

export type newArticleOptions = {
    colors: selectColor[],
    tones: select[],
    shapes: select[],
    species: select[],
    names: string[],
};

export type editArticleOptions = {
    colors: selectColor[],
    tones: select[],
    shapes: select[],
    species: select[],
    names: select[],
};

export type select = {
    value: string;
    label: string,
};

export type selectColor = {
    value: string;
    label: string,
    hexa: string,
};

export enum articleType {
    fresh = "fresh",
    freshCompo = "freshCompo",
    week = "week",
    weekCompo = "weekCompo",
    plant = "plant",
    dried = "dried",
    christmas = "christmas",
    valentine = "valentine",
    easter = "easter",
    toussaint = "toussaint",
    mother = "mother",
    grandMother = "grandMother",
    father = "father"
};

/* Pop UP */
export enum alertStatus {
    success = "success",
    error = "error",
    warning = "warning",
    info = "info",
};

export type alert = {
    message: string,
    status: alertStatus,
    id: string,
};