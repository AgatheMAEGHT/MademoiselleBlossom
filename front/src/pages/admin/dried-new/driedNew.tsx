import React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { requester, requesterFile } from '../../../components/requester';
import { article, newArticleDB, colorDB, shapeDB, toneDB, typeDB, select, newArticleOptions, newColorDB, newToneDB } from '../../../components/types';

import './driedNew.css';

function NewDriedAdmin() {
    let navigate = useNavigate();

    /* Article Variables */
    const [nameAlreadyTaken, setNameAlreadyTaken] = React.useState(false);
    const [article, setArticle] = React.useState<article>({
        _id: "",
        type: {
            _id: "",
            name: "",
        },
        name: "",
        description: "",
        price: "",
        stock: 1,
        size: 0,
        shape: {
            _id: "",
            name: "",
        },
        colors: [],
        tones: [],
        firstFile: "" as unknown as File,
        files: [] as unknown as FileList,
    });

    /* Elements Variables */
    const [colorAlreadyTaken, setColorAlreadyTaken] = React.useState(false);
    const [toneAlreadyTaken, setToneAlreadyTaken] = React.useState(false);
    const [shapeAlreadyTaken, setShapeAlreadyTaken] = React.useState(false);

    const [color, setColor] = React.useState({ name: "", hexa: "#ffffff" });
    const [tone, setTone] = React.useState("");
    const [shape, setShape] = React.useState("");

    /* Options */
    const [options, setOptions] = React.useState<newArticleOptions>({
        colors: [],
        tones: [],
        shapes: [],
        names: [],
        type: "",
    });

    React.useEffect(() => {
        let newOptions = {
            colors: [],
            tones: [],
            shapes: [],
            names: [],
            type: "",
        }
        let promises: Promise<any>[] = [];

        promises.push(requester('/article-color', 'GET'));
        promises.push(requester('/article-tone', 'GET'));
        promises.push(requester('/article-shape', 'GET'));
        promises.push(requester('/article-type', 'GET'));
        promises.push(requester('/article?limit=100', 'GET'));

        Promise.all(promises).then((res) => {
            newOptions.colors = res[0]?.map((elt: colorDB) => ({ value: elt._id, label: elt.name }));
            newOptions.tones = res[1]?.map((elt: toneDB) => ({ value: elt._id, label: elt.name }));
            newOptions.shapes = res[2]?.map((elt: shapeDB) => ({ value: elt._id, label: elt.name }));
            newOptions.type = res[3]?.filter((elt: typeDB) => (elt.name === "Fleurs séchées"))[0]?._id ?? "";
            newOptions.names = res[4]?.map((elt: any) => elt.name);
            setOptions(newOptions);
        });

    }, []);

    /* Check functions */
    function checkName(e: string) {
        if (options.names?.includes(e)) {
            setNameAlreadyTaken(true);
        } else {
            setNameAlreadyTaken(false);
        }
    }

    function checkOptions(e: string, option: select[], setAlreadyTaken: React.Dispatch<React.SetStateAction<boolean>>) {
        if (option?.filter((elt: select) => elt.label === e).length > 0) {
            setAlreadyTaken(true);
        } else {
            setAlreadyTaken(false);
        }
    }

    /* Submit functions */
    function postFile() {
        // Check if firstFile filled
        if (article.firstFile === undefined || article.firstFile === null || article.firstFile === "" as unknown as File) {
            alert("Aucune image de couverture n'est sélectionnée");
            return;
        }

        let promises: Promise<any>[] = [];

        let type: string = "image/" + article.firstFile.name.split('.')[article.firstFile.name.split('.').length - 1];
        promises.push(requesterFile('/file/create', 'POST', article.firstFile.stream(), type));

        for (let i = 0; i < article.files.length; i++) {
            type = "image/" + article.files[i].name.split('.')[article.files[i].name.split('.').length - 1];

            promises.push(requesterFile('/file/create', 'POST', article.files[i].stream(), type));
        }

        Promise.all(promises).then((res) => {
            res.forEach(result => {
                if (result.err) {
                    console.log(result.err);
                    alert("Une erreur est survenue lors de l'envoi des images");
                    return;
                }
            });

            let images: string[] = res.map((elt: any) => elt._id);
            postArticle(images);
        });
    }

    function postArticle(files: string[]) {
        // Check if all fields are filled
        if (article.name === "" || article.price === "" || article.stock === 0 || article.colors.length === 0 || article.tones.length === 0 || article.shape.name === "" || article.size === 0) {
            alert("Certains champs obligatoires ne sont pas remplis");
            return;
        }

        // Check if name already taken
        if (nameAlreadyTaken) {
            alert("Ce nom est déjà pris par une autre création");
            return;
        }

        // Create new article object to send to the server
        let tmpArticle: newArticleDB = {
            _id: "",
            type: options.type,
            name: article.name ?? "",
            description: article.description ?? "",
            price: parseFloat(article.price.replace(",", ".")) ?? 0,
            stock: article.stock ?? 0,
            size: article.size ?? 0,
            shape: article.shape._id ?? "",
            colors: article.colors.map((elt: colorDB) => elt._id) ?? [],
            tones: article.tones.map((elt: toneDB) => elt._id) ?? [],
            files: files,
        }

        // Create new article
        requester('/article/create', 'POST', tmpArticle).then((res: any) => {
            console.log(res);
            if (res._id) {
                navigate('/admin/fleurs-sechees');
            } else {
                console.log(res);
                alert("Une erreur est survenue lors de la création de l'article");
            }
        });
    }

    function postColor() {
        // Check if all fields are filled
        if (color.name === "" || color.hexa === "") {
            alert("Le nom de la couleur ou la couleur ne sont pas remplis");
            return;
        }

        // Create new color object to send to the server
        let tmpColor: newColorDB = {
            name: color.name ?? "",
            hexa: color.hexa.replace("#", "") ?? "",
        }

        // Create new color
        requester('/article-color/create', 'POST', tmpColor).then((res: any) => {
            if (res._id) {
                if (options.colors === undefined) {
                    setOptions({ ...options, colors: [{ value: res._id, label: res.name }] });
                    return;
                } else {
                    setOptions({ ...options, colors: [...options.colors, { value: res._id, label: res.name }] });
                }
            } else {
                console.log(res);
                alert("Une erreur est survenue lors de la création de la couleur");
            }
        });
    }

    function postTone() {
        // Check if all fields are filled
        if (tone === "") {
            alert("Le nom du ton n'est pas rempli");
            return;
        }

        // Create new tone object to send to the server
        let tmpTone: newToneDB = {
            name: tone ?? "",
        }

        // Create new tone
        requester('/article-tone/create', 'POST', tmpTone).then((res: any) => {
            if (res._id) {
                if (options.tones === undefined) {
                    setOptions({ ...options, tones: [{ value: res._id, label: res.name }] });
                    return;
                } else {
                    setOptions({ ...options, tones: [...options.tones, { value: res._id, label: res.name }] });
                }
            } else {
                alert("Une erreur est survenue lors de la création du ton");
            }
        });
    }

    function postShape() {
        // Check if all fields are filled
        if (shape === "") {
            alert("Le nom de la forme n'est pas rempli");
            return;
        }

        // Create new shape object to send to the server
        let tmpShape: newToneDB = {
            name: shape ?? "",
        }

        // Create new shape
        requester('/article-shape/create', 'POST', tmpShape).then((res: any) => {
            if (res._id) {
                if (options.tones === undefined) {
                    setOptions({ ...options, shapes: [{ value: res._id, label: res.name }] });
                    return;
                } else {
                    setOptions({ ...options, shapes: [...options.shapes, { value: res._id, label: res.name }] });
                }
            } else {
                console.log(res);
                alert("Une erreur est survenue lors de la création de la forme");
            }
        });
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'> Page Administrateur <br /> Ajouter un article</h1>

            <div className='admin-form'> {/* Article */}
                <h2>Créer un article</h2>
                <div className='admin-form-element'> {/* Name */}
                    <label htmlFor='admin-form-input-name' className='admin-form-label'>Nom<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-element-right'>
                        {nameAlreadyTaken && <div id="admin-form-element-alreadytaken">Ce nom est déjà pris par une autre création</div>}
                        <input
                            value={article.name}
                            onChange={e => { setArticle({ ...article, name: e.target.value }); checkName(e.target.value) }}
                            className='admin-form-input admin-form-input-right'
                            id="admin-form-input-name"
                            type="text"
                            name="name"
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Price */}
                    <label htmlFor='admin-form-input-price' className='admin-form-label'>Prix (en €)<p className='form-mandatory'>*</p></label>
                    <input
                        value={article.price}
                        onChange={e => setArticle({ ...article, price: e.target.value })}
                        className='admin-form-input'
                        id='admin-form-input-price'
                        type="text"
                        name="price"
                    />
                </div>
                <div className='admin-form-element'> {/* Stock */}
                    <label htmlFor='admin-form-input-stock' className='admin-form-label'>Stock<p className='form-mandatory'>*</p></label >
                    <input
                        min="0"
                        value={article.stock}
                        onChange={e => setArticle({ ...article, stock: parseInt(e.target.value) })}
                        className='admin-form-input'
                        id="admin-form-input-stock"
                        type="number"
                        name="stock"
                    />
                </div>
                <div className='admin-form-element'> {/* Description */}
                    <label htmlFor='admin-form-input-description' className='admin-form-label'>Description</label>
                    <input
                        value={article.description}
                        onChange={e => setArticle({ ...article, description: e.target.value })}
                        className='admin-form-input'
                        id="admin-form-input-description"
                        type="text"
                        name="description"
                    />
                </div>
                <div className='admin-form-element'> {/* Colors */}
                    <label htmlFor='admin-form-input-colors' className='admin-form-label'>Couleurs<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-input-select'>
                        <Select
                            name="colors"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? 'blue' : 'var(--color-2-darker)',
                                }),
                            }}
                            isMulti
                            isSearchable
                            isClearable
                            options={options.colors}
                            onChange={(e) => setArticle({ ...article, colors: (e ? e.map((elt: select) => ({ _id: elt.value, name: elt.label, hexa: "" })) : []) })}
                            id='admin-form-input-colors'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Tones */}
                    <label htmlFor='admin-form-input-tones' className='admin-form-label'>Tons<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-input-select'>
                        <Select
                            name="tones"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-2-darker)',
                                }),
                            }}
                            isMulti
                            isSearchable
                            isClearable
                            options={options.tones}
                            onChange={(e) => setArticle({ ...article, tones: (e ? e.map((elt: select) => ({ _id: elt.value, name: elt.label })) : []) })}
                            id='admin-form-input-tones'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Size */}
                    <label htmlFor='admin-form-input-size' className='admin-form-label'>Taille (en cm)<p className='form-mandatory'>*</p></label>
                    <input
                        step={0.01}
                        min="0"
                        value={article.size}
                        onChange={e => setArticle({ ...article, size: parseFloat(e.target.value) })}
                        className='admin-form-input'
                        id="admin-form-input-size"
                        type="number"
                        name="size"
                    />
                </div>
                <div className='admin-form-element'> {/* Shape */}
                    <label htmlFor='admin-form-input-shapes' className='admin-form-label'>Forme<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-input-select'>
                        <Select
                            name="shapes"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-2-darker)',
                                }),
                            }}
                            isSearchable
                            isClearable
                            options={options.shapes}
                            onChange={(elt) => setArticle({ ...article, shape: (elt ? ({ _id: elt.value, name: elt.label }) : { _id: "", name: "" }) })}
                            id='admin-form-input-shapes'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Image 1 */}
                    <label htmlFor='admin-form-input-files' className='admin-form-label'>Image de couverture<p className='form-mandatory'>*</p></label>
                    <input
                        onChange={e => setArticle({ ...article, firstFile: (e.target.files ?? [] as unknown as FileList)[0] })} // TODO: check if it works
                        className='admin-form-input'
                        id='admin-form-input-files'
                        type="file"
                        name="images"
                        accept='image/*'
                    />
                </div>
                <div className='admin-form-element'> {/* Images */}
                    <label htmlFor='admin-form-input-files' className='admin-form-label'>Images secondaires</label>
                    <input
                        onChange={e => setArticle({ ...article, files: (e.target.files ?? [] as unknown as FileList) })}
                        className='admin-form-input'
                        id='admin-form-input-files'
                        type="file"
                        name="images"
                        multiple
                        accept='image/*'
                    />
                </div>
                <div>   {/* Display Images */}
                    <div>
                        <p>Images sélectionnées</p>
                        <p className="admin-form-input-info">Pour sélectionner plusieurs images, maintient la touche <i>Maj</i> enfoncée et sélectionne les images de ton choix</p>
                    </div>
                    <div id='admin-form-images'>
                        {article.firstFile && <div id="admin-form-image-first">
                            <img className='admin-form-image' src={URL.createObjectURL(article.firstFile)} alt={article.firstFile.name} />
                            <p className="admin-form-input-info">Image de couverture</p>
                        </div>}
                        {Array.from(article.files || []).map((elt: File) => <img key={elt.name} className='admin-form-image' src={URL.createObjectURL(elt)} alt={elt.name} />)}
                    </div>
                </div>
                <button className='admin-button' onClick={() => postFile()}>Ajouter l'article</button>
                <div id="form-mandatory-info">
                    <p className='form-mandatory'>*</p>
                    <p id="form-mandatory-text">Champs obligatoires</p>
                </div>
            </div>
            <div className='admin-form'> {/* Elements */}
                <h2>Créer des éléments</h2>
                <p className='admin-form-infotext'>Les éléments créés ici seront disponibles pour tous les articles.<br />
                    Ils servent à donner plus d'informations sur les articles et à les trier dans le catalogue.<br />
                </p>


                <h3 className='admin-form-sub-title'>Créer une couleur d'article</h3>
                <div className='admin-form-element'> {/* Color Name */}
                    <label htmlFor='admin-form-input-new-colorname' className='admin-form-label'>Nom de la couleur</label>
                    <div className='admin-form-element-right'>
                        {colorAlreadyTaken && <div id="admin-form-element-alreadytaken">Cette couleur existe déjà</div>}
                        <input
                            value={color.name}
                            onChange={e => { setColor({ ...color, name: e.target.value }); checkOptions(e.target.value, options.colors, setColorAlreadyTaken) }}
                            className='admin-form-input admin-form-input-right'
                            type="text"
                            name="colorName"
                            id='admin-form-input-new-colorname'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Color Hexa */}
                    <label htmlFor='admin-form-input-new-color' className='admin-form-label'>Couleur</label>
                    <input
                        value={color.hexa}
                        onChange={e => setColor({ ...color, hexa: e.target.value })}
                        id="admin-form-input-new-color" type="color" name="color"
                    />
                </div>
                <button className='admin-button' onClick={() => postColor()} >Ajouter la couleur</button>


                <h3 className='admin-form-sub-title'>Créer un ton d'article</h3>
                <div className='admin-form-element'> {/* Tone Name */}
                    <label htmlFor='admin-form-input-new-tone' className='admin-form-label'>Nom du ton</label>
                    <div className='admin-form-element-right'>
                        {toneAlreadyTaken && <div id="admin-form-element-alreadytaken">Ce ton existe déjà</div>}
                        <input
                            value={tone}
                            onChange={e => { setTone(e.target.value); checkOptions(e.target.value, options.tones, setToneAlreadyTaken) }}
                            className='admin-form-input admin-form-input-right'
                            type="text"
                            name="tone"
                            id="admin-form-input-new-tone"
                        />
                    </div>
                </div>
                <button className='admin-button' onClick={() => postTone()}>Ajouter le ton</button>


                <h3 className='admin-form-sub-title'>Créer une forme d'article</h3>
                <div className='admin-form-element'> {/* Shape Name */}
                    <label htmlFor='admin-form-input-new-shape' className='admin-form-label'>Nom de la forme</label>
                    <div className='admin-form-element-right'>
                        {shapeAlreadyTaken && <div id="admin-form-element-alreadytaken">Cette forme existe déjà</div>}
                        <input
                            value={shape}
                            onChange={e => { setShape(e.target.value); checkOptions(e.target.value, options.shapes, setShapeAlreadyTaken) }}
                            className='admin-form-input admin-form-input-right'
                            type="text"
                            name="shape"
                            id="admin-form-input-new-shape"
                        />
                    </div>
                </div>
                <button className='admin-button' onClick={() => postShape()}>Ajouter la forme</button>
            </div>
        </div>
    );
}

export default NewDriedAdmin;
