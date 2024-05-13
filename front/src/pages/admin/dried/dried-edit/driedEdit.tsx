import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { requester, requesterFile } from '../../../../components/requester';
import { article, newArticleDB, colorDB, shapeDB, toneDB, select, editArticleOptions, newColorDB, newToneDB, speciesDB, newSpeciesDB, selectColor, alertStatus } from '../../../../components/types';
import Alert, { displayAlert } from '../../../../components/alert/alert';

import '../../_components/catalogEdit.css';

function EditDriedAdmin() {
    let navigate = useNavigate();
    let params = useParams();

    /* Article Variables */
    const [nameAlreadyTaken, setNameAlreadyTaken] = React.useState(false);
    const [article, setArticle] = React.useState<article>({
        _id: "",
        type: "",
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
        species: [],
        firstFile: "" as unknown as string | File,
        files: [] as unknown as [string | File],
    });

    /* Elements */
    const [colorAlreadyTaken, setColorAlreadyTaken] = React.useState(false);
    const [toneAlreadyTaken, setToneAlreadyTaken] = React.useState(false);
    const [shapeAlreadyTaken, setShapeAlreadyTaken] = React.useState(false);
    const [speciesAlreadyTaken, setSpeciesAlreadyTaken] = React.useState(false);

    const [color, setColor] = React.useState({ name: "", hexa: "#ffffff" });
    const [tone, setTone] = React.useState("");
    const [shape, setShape] = React.useState("");
    const [species, setSpecies] = React.useState("");

    const [options, setOptions] = React.useState<editArticleOptions>({
        colors: [],
        tones: [],
        shapes: [],
        species: [],
        names: [],
    });

    React.useEffect(() => {
        let newOptions = {
            colors: [],
            tones: [],
            shapes: [],
            species: [],
            names: [],
        };
        let promises: Promise<any>[] = [];

        promises.push(requester('/article-color', 'GET'));
        promises.push(requester('/article-tone', 'GET'));
        promises.push(requester('/article-shape', 'GET'));
        promises.push(requester('/article-species', 'GET'));
        promises.push(requester('/article', 'GET'));
        promises.push(requester(`/article?populate=true&name=${params.itemName?.replaceAll("_", " ")}`, 'GET'));

        Promise.all(promises).then((res) => {
            newOptions.colors = res[0]?.map((elt: colorDB) => ({ value: elt._id, label: elt.name, hexa: elt.hexa }));
            newOptions.tones = res[1]?.map((elt: toneDB) => ({ value: elt._id, label: elt.name }));
            newOptions.shapes = res[2]?.map((elt: shapeDB) => ({ value: elt._id, label: elt.name }));
            newOptions.species = res[3]?.map((elt: speciesDB) => ({ value: elt._id, label: elt.name }));
            newOptions.names = res[4]?.map((elt: any) => ({ value: elt._id, label: elt.name }));
            if (res[5]) {
                if (res[5]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                res[5][0].firstFile = (res[5][0].files.length > 0) ? res[5][0].files[0] : "";
                let files = [];
                for (let i = 1; i < res[5][0].files.length; i++) {
                    files.push(res[5][0].files[i]);
                }
                res[5][0].files = files;
                if (res[5][0].colors === undefined || res[5][0].colors === null) {
                    res[5][0].colors = [];
                }
                if (res[5][0].tones === undefined || res[5][0].tones === null) {
                    res[5][0].tones = [];
                }
                if (res[5][0].species === undefined || res[5][0].species === null) {
                    res[5][0].species = [];
                }

                setArticle(res[5][0]);
            }
            setOptions(newOptions);
        });
    }, []);

    function displayColors() {
        return article.colors.map((elt: colorDB) => {
            let color: string = "#" + elt.hexa;
            return <div key={elt._id} className='admin-form-color' style={{ background: color }}></div>;
        });
    }

    /* Check functions */
    function checkName(e: string) {
        let name: select = options.names?.filter((elt: select) => elt.label === e)[0];
        if (name && name?.value !== article._id) {
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

    /* File functions */
    function addFiles(files: [File | string]) {
        let newFiles = article.files;
        for (let i = 0; i < files.length; i++) {
            newFiles.push(files[i]);
        }
        setArticle({ ...article, files: newFiles });
    }

    function removeFile(index: number) {
        let newFiles = article.files;
        newFiles.splice(index, 1);
        setArticle({ ...article, files: newFiles });
    }

    function displayFile(key: string, src: string, alt: string, index: number) {
        return <div className='admin-form-image-tile'>
            <div className='admin-form-image-delete' onClick={() => removeFile(index)}>
                <p className='admin-form-image-delete-text'>Supprimer</p>
            </div>
            <img key={key} className='admin-form-image' src={src} alt={alt} />
        </div>;
    }

    /* Submit functions */
    function postFile() {
        // Check if firstFile filled
        if (article.firstFile === undefined || article.firstFile === null || article.firstFile === "" as unknown as File) {
            displayAlert('admin-alert-postfile-firstfile');
            return;
        }

        let promises: Promise<any>[] = [];
        let images: string[] = [];

        if (typeof article.firstFile !== "string") {
            let type: string = "image/" + article.firstFile.name.split('.')[article.firstFile.name.split('.').length - 1];
            promises.push(requesterFile('/file/create', 'POST', article.firstFile.stream(), type));
            images.push("");
        } else {
            images.push(article.firstFile.split('.')[0]);
        }

        for (let i = 0; i < article.files.length; i++) {
            let file = article.files[i];
            if (typeof file === "string") {
                images.push(file.split('.')[0]);
                continue;
            }
            let type: string = "image/" + file.name.split('.')[file.name.split('.').length - 1];
            promises.push(requesterFile('/file/create', 'POST', file.stream(), type));
        }

        Promise.all(promises).then((res) => {
            res.forEach(result => {
                if (result.err) {
                    console.log(result.err);
                    displayAlert('admin-alert-postfile-sendfiles');
                    return;
                }
            });
            if (typeof article.firstFile !== "string") {
                images[0] = res[0]._id.toString();
                res.map((elt: any, key) => (key !== 0) && images.push(elt._id.toString()));
            } else {
                res.map((elt: any) => images.push(elt._id.toString()));
            }
            editArticle(images);
        });
    }

    function editArticle(files: string[]) {
        // Check if all fields are filled
        if (article.name === "" || article.price === "" || article.stock === 0 || article.colors.length === 0 || article.tones.length === 0 || article.shape.name === "" || article.size === 0 || files.length === 0) {
            displayAlert('form-mandatory');
            return;
        }

        // Check if name already taken
        if (nameAlreadyTaken) {
            displayAlert('form-name-alreadytaken');
            return;
        }

        // Create new article object to send to the server
        let tmpArticle: newArticleDB = {
            _id: article._id,
            type: "dried",
            name: article.name,
            description: article.description ?? "",
            price: parseFloat(article.price.toString().replace(",", ".")) ?? 0,
            stock: article.stock,
            size: article.size,
            shape: article.shape._id,
            colors: article.colors.map((elt: colorDB) => elt._id) ?? [],
            species: article.species.map((elt: speciesDB) => elt._id) ?? [],
            tones: article.tones.map((elt: toneDB) => elt._id) ?? [],
            files: files,
        };

        // Create new article
        requester('/article/update', 'PUT', tmpArticle).then((res: any) => {
            if (res._id) {
                navigate('/admin/fleurs-sechees');
            } else {
                console.log(res);
                displayAlert('admin-alert-editarticle');
            }
        });
    }

    function postColor() {
        // Check if all fields are filled
        if (color.name === "" || color.hexa === "") {
            displayAlert('form-mandatory-color');
            return;
        }

        // Create new color object to send to the server
        let tmpColor: newColorDB = {
            name: color.name ?? "",
            hexa: color.hexa.replace("#", "") ?? "",
        };

        // Create new color
        requester('/article-color/create', 'POST', tmpColor).then((res: any) => {
            if (res._id) {
                if (options.colors === undefined) {
                    setOptions({ ...options, colors: [{ value: res._id, label: res.name, hexa: res.hexa }] });
                    return;
                } else {
                    console.log(res._id, res.name, res.hexa);
                    setOptions({ ...options, colors: [...options.colors, { value: res._id, label: res.name, hexa: res.hexa }] });
                }
                setColor({ name: "", hexa: "#ffffff" });
            } else {
                console.log(res);
                displayAlert('admin-alert-createcolor');
            }
        });
    }

    function postTone() {
        // Check if all fields are filled
        if (tone === "") {
            displayAlert('form-mandatory-tone');
            return;
        }

        // Create new tone object to send to the server
        let tmpTone: newToneDB = {
            name: tone ?? "",
        };

        // Create new tone
        requester('/article-tone/create', 'POST', tmpTone).then((res: any) => {
            if (res._id) {
                if (options.tones === undefined) {
                    setOptions({ ...options, tones: [{ value: res._id, label: res.name }] });
                    return;
                } else {
                    setOptions({ ...options, tones: [...options.tones, { value: res._id, label: res.name }] });
                }
                setTone("");
            } else {
                displayAlert('admin-alert-createtone');
            }
        });
    }

    function postShape() {
        // Check if all fields are filled
        if (shape === "") {
            displayAlert('form-mandatory-shape');
            return;
        }

        // Create new shape object to send to the server
        let tmpShape: newToneDB = {
            name: shape ?? "",
        };

        // Create new shape
        requester('/article-shape/create', 'POST', tmpShape).then((res: any) => {
            if (res._id) {
                if (options.tones === undefined) {
                    setOptions({ ...options, shapes: [{ value: res._id, label: res.name }] });
                    return;
                } else {
                    setOptions({ ...options, shapes: [...options.shapes, { value: res._id, label: res.name }] });
                }
                setShape("");
            } else {
                console.log(res);
                displayAlert('admin-alert-createshape');
            }
        });
    }

    function postSpecies() {
        // Check if all fields are filled
        if (species === "") {
            displayAlert('form-mandatory-species');
            return;
        }

        // Create new species object to send to the server
        let tmpSpecies: newSpeciesDB = {
            name: species ?? "",
        };

        // Create new species
        requester('/article-species/create', 'POST', tmpSpecies).then((res: any) => {
            if (res._id) {
                if (options.tones === undefined) {
                    setOptions({ ...options, species: [{ value: res._id, label: res.name }] });
                    return;
                } else {
                    setOptions({ ...options, species: [...options.species, { value: res._id, label: res.name }] });
                }
                setSpecies("");
            } else {
                console.log(res);
                displayAlert('admin-alert-createspecies');
            }
        });
    }

    function deleteArticle() {

        requester(`/article/delete?_id=${article._id}`, 'DELETE').then(() => {
            navigate('/admin/fleurs-sechees');
        });
    }

    function confirmDelete() {
        let popup = document.getElementById("admin-article-delete-popup");
        if (popup) {
            popup.style.display = "flex";
        }
    }

    function cancelDelete() {
        let popup = document.getElementById("admin-article-delete-popup");
        if (popup) {
            popup.style.display = "none";
        }
    }

    /* Display */
    if (article._id === "") {
        return (<div></div>);
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - Modifier un article</h1>
            <div id="admin-article-delete-area">
                <button className='admin-button admin-delete-button' onClick={() => confirmDelete()}>Supprimer l'article</button>
                <div id="admin-article-delete-popup">
                    <p>Veux-tu vraiment supprimer cet article ?</p>
                    <button className='admin-button admin-delete-button' onClick={() => deleteArticle()}>Oui</button>
                    <button className='admin-button' onClick={() => cancelDelete()}>Non</button>
                </div>
            </div>
            <div className='admin-form'> {/* Article */}
                <h2>Modifier {article.name}</h2>
                <div className='admin-form-element'> {/* Name */}
                    <label htmlFor='admin-form-input-name' className='admin-form-label'>Nom<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-element-right'>
                        {nameAlreadyTaken && <div id="admin-form-element-alreadytaken">Ce nom est déjà pris par une autre création</div>}
                        <input
                            value={article.name}
                            onChange={e => { setArticle({ ...article, name: e.target.value }); checkName(e.target.value); }}
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
                    <textarea
                        value={article.description}
                        onChange={e => setArticle({ ...article, description: e.target.value })}
                        className='admin-form-input'
                        id="admin-form-input-description"
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
                            defaultValue={article.colors.map((elt: colorDB) => ({ label: elt.name, value: elt._id, hexa: elt.hexa })) ?? []}
                            options={options.colors}
                            onChange={(e) => setArticle({ ...article, colors: (e ? e.map((elt: selectColor) => ({ _id: elt.value, name: elt.label, hexa: elt.hexa })) : []) })}
                            id='admin-form-input-colors'
                        />
                    </div>
                </div>
                {(article.colors.length !== 0) && <div className='admin-form-element'> {/* Colors */}
                    <div></div>
                    <div id='admin-form-color-list'>
                        {displayColors()}
                    </div>
                </div>}
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
                            defaultValue={article.tones.map((elt: toneDB) => ({ label: elt.name, value: elt._id })) ?? []}
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
                            defaultValue={{ label: article.shape.name, value: article.shape._id }}
                            options={options.shapes}
                            onChange={(elt) => setArticle({ ...article, shape: (elt ? ({ _id: elt.value, name: elt.label }) : { _id: "", name: "" }) })}
                            id='admin-form-input-shapes'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Species */}
                    <label htmlFor='admin-form-input-species' className='admin-form-label'>Espèces de fleurs</label>
                    <div className='admin-form-input-select'>
                        <Select
                            name="species"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-2-darker)',
                                }),
                            }}
                            isMulti
                            isSearchable
                            isClearable
                            defaultValue={article.species.map((elt: speciesDB) => ({ label: elt.name, value: elt._id })) ?? []}
                            options={options.species}
                            onChange={(e) => setArticle({ ...article, species: (e ? e.map((elt: select) => ({ _id: elt.value, name: elt.label })) : []) })}
                            id='admin-form-input-species'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Image 1 */}
                    <label className='admin-form-label'>Image de couverture<p className='form-mandatory'>*</p></label>
                    <input
                        onChange={e => setArticle({ ...article, firstFile: (e.target.files ?? [] as unknown as FileList)[0] })} // TODO: check if it works
                        className='admin-form-input'
                        id='admin-form-input-file'
                        type="file"
                        name="images"
                        accept='image/*'
                        placeholder="Remplacer l\'image de couverture"
                        defaultValue={typeof (article.firstFile) === "string" ? "" : article.firstFile.name}
                    />
                </div>
                <p className="admin-form-input-info">L'image de couverture déjà sauvegardée n'apparait pas ici mais dans la liste <b>Images sélctionnées</b>.</p>
                <div className='admin-form-element'> {/* Images */}
                    <label className='admin-form-label'>Images secondaires</label>
                    <input
                        onChange={e => addFiles((e.target.files ?? []) as unknown as [File | string])}
                        className='admin-form-input'
                        id='admin-form-input-files'
                        type="file"
                        name="images"
                        multiple
                        accept='image/*'
                    />
                </div>
                <p className="admin-form-input-info">Les images déjà sauvegardées n'apparaissent pas ici mais dans la liste <b>Images sélctionnées</b>.</p>
                <p className="admin-form-input-info">Pour sélectionner plusieurs images en même temps, maintient la touche <i>Ctrl</i> enfoncée et sélectionne les images de ton choix.</p>
                <div className='admin-form-element'>
                    <p>Images sélectionnées</p>
                    <div></div>
                </div>
                <div> {/* Display Images */}
                    <div id='admin-form-images'>
                        {article.firstFile && <div id="admin-form-image-first">
                            {(typeof (article.firstFile) !== "string") ?
                                <img key={article.firstFile.name} className='admin-form-image' src={URL.createObjectURL(article.firstFile)} alt={article.firstFile.name} /> :
                                <img key={article.firstFile} className='admin-form-image' src={(process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + article.firstFile} alt={article.firstFile} />
                            }
                            <p className="admin-form-input-info">Image de couverture</p>
                        </div>}
                        {Array.from(article.files || []).map((elt: File | string, index) => (typeof (elt) !== "string") ?
                            displayFile(elt.name, URL.createObjectURL(elt), elt.name, index) :
                            displayFile(elt, (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + elt, elt, index))
                        }
                    </div>
                </div>
                <button className='admin-button' onClick={() => postFile()}>Modifier l'article</button>
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
                            onChange={e => { setColor({ ...color, name: e.target.value }); checkOptions(e.target.value, options.colors, setColorAlreadyTaken); }}
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
                            onChange={e => { setTone(e.target.value); checkOptions(e.target.value, options.tones, setToneAlreadyTaken); }}
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
                            onChange={e => { setShape(e.target.value); checkOptions(e.target.value, options.shapes, setShapeAlreadyTaken); }}
                            className='admin-form-input admin-form-input-right'
                            type="text"
                            name="shape"
                            id="admin-form-input-new-shape"
                        />
                    </div>
                </div>
                <button className='admin-button' onClick={() => postShape()}>Ajouter la forme</button>

                <h3 className='admin-form-sub-title'>Créer une variété de fleur</h3>
                <div className='admin-form-element'> {/* Species Name */}
                    <label htmlFor='admin-form-input-new-species' className='admin-form-label'>Nom de la variété</label>
                    <div className='admin-form-element-right'>
                        {speciesAlreadyTaken && <div id="admin-form-element-alreadytaken">Cette variété existe déjà</div>}
                        <input
                            value={species}
                            onChange={e => { setSpecies(e.target.value); checkOptions(e.target.value, options.species, setSpeciesAlreadyTaken); }}
                            className='admin-form-input admin-form-input-right'
                            type="text"
                            name="species"
                            id="admin-form-input-new-species"
                        />
                    </div>
                </div>
                <button className='admin-button' onClick={() => postSpecies()}>Ajouter la variété</button>
            </div>
            <Alert message="Aucune image de couverture n'est sélectionnée" id="admin-alert-postfile-firstfile" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de l'envoi des images" id="admin-alert-postfile-sendfiles" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory" status={alertStatus.error} />
            <Alert message="Ce nom est déjà pris par une autre création" id="form-name-alreadytaken" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la modification de l'article" id="admin-alert-editarticle" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-color" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de la couleur" id="admin-alert-createcolor" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-tone" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création du ton" id="admin-alert-createtone" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-shape" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de la forme" id="admin-alert-createshape" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-species" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de l'espèce" id="admin-alert-createspecies" status={alertStatus.error} />
        </div>
    );
}

export default EditDriedAdmin;