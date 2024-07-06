import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { requester, requesterFile } from '../../../../components/requester';
import Alert, { displayAlert } from '../../../../components/alert/alert';
import { article, newArticleDB, colorDB, toneDB, select, newColorDB, newToneDB, speciesDB, newSpeciesDB, editArticleOptions, selectColor, alertStatus } from '../../../../components/types';

import '../../catalog-edit/catalogEdit.css';

function WeekEditAdmin() {
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
        firstFile: "" as unknown as File,
        files: [] as unknown as [string | File],
    });

    /* Elements */
    const [colorAlreadyTaken, setColorAlreadyTaken] = React.useState(false);
    const [toneAlreadyTaken, setToneAlreadyTaken] = React.useState(false);
    const [speciesAlreadyTaken, setSpeciesAlreadyTaken] = React.useState(false);

    const [color, setColor] = React.useState({ name: "", hexa: "#ffffff" });
    const [tone, setTone] = React.useState("");
    const [species, setSpecies] = React.useState("");

    const [options, setOptions] = React.useState<editArticleOptions>({
        colors: [],
        tones: [],
        shapes: [],
        names: [],
        species: [],
    });

    const typeOptions: select[] = [
        { value: "dried", label: "Fleurs séchées" },
        { value: "fresh", label: "Fleurs fraîches" },
        { value: "freshCompo", label: "Fleurs fraîches (Compositions)" },
        { value: "christmas", label: "Fleurs de Noël" },
        { value: "valentine", label: "Fleurs de la Saint-Valentin" },
        { value: "pascal", label: "Fleurs de Pâques" },
        { value: "toussaint", label: "Fleurs de la Toussaint" },
        { value: "mother", label: "Fleurs de la fête des mères" },
        { value: "grandmother", label: "Fleurs de la fête des grands-mères" },
        { value: "father", label: "Fleurs de la fête des pères" },
    ];

    React.useEffect(() => {
        let newOptions = {
            colors: [],
            tones: [],
            shapes: [],
            names: [],
            species: [],
        };
        let promises: Promise<any>[] = [];

        promises.push(requester('/article-color', 'GET'));
        promises.push(requester('/article-tone', 'GET'));
        promises.push(requester('/article-species', 'GET'));
        promises.push(requester('/article?limit=100', 'GET'));
        promises.push(requester(`/article?populate=true&name=${params.itemName?.replaceAll("_", " ")}`, 'GET'));

        Promise.all(promises).then((res) => {
            newOptions.colors = res[0]?.map((elt: colorDB) => ({ value: elt._id, label: elt.name, hexa: elt.hexa }));
            newOptions.tones = res[1]?.map((elt: toneDB) => ({ value: elt._id, label: elt.name }));
            newOptions.species = res[2]?.map((elt: speciesDB) => ({ value: elt._id, label: elt.name }));
            newOptions.names = res[3]?.map((elt: any) => elt.name);
            setOptions(newOptions);

            if (res[4]) {
                if (res[4]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                res[4][0].firstFile = (res[4][0].files.length > 0) ? res[4][0].files[0] : "";
                let files = [];
                for (let i = 1; i < res[4][0].files.length; i++) {
                    files.push(res[4][0].files[i]);
                }
                res[4][0].files = files;
                if (res[4][0].colors === undefined || res[4][0].colors === null) {
                    res[4][0].colors = [];
                }
                if (res[4][0].tones === undefined || res[4][0].tones === null) {
                    res[4][0].tones = [];
                }
                if (res[4][0].species === undefined || res[4][0].species === null) {
                    res[4][0].species = [];
                }

                setArticle(res[4][0]);
            }
        });
        //eslint-disable-next-line
    }, []);

    function displayColors() {
        return article.colors.map((elt: colorDB) => {
            let color: string = "#" + elt.hexa;
            return <div key={elt._id} className='admin-form-color' style={{ background: color }}></div>;
        });
    }

    /* Check functions */
    function checkAlreadyExists() {
        let name: select = options.names?.filter((elt: select) => elt.label === (article.species[0]?.name + " " + article.colors[0]?.name))[0];
        if (name && name?.value !== article._id) {
            setNameAlreadyTaken(true);
        } else {
            setNameAlreadyTaken(false);
        }
    }

    function checkName(e: string) {
        let name: select = options.names?.filter((elt: select) => elt.label === e)[0];
        if (name && name?.value !== article?._id) {
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

    /* Post article */
    function postFile() {
        // Check if firstFile filled
        if (article.firstFile === undefined || article.firstFile === null || article.firstFile === "" as unknown as File) {
            displayAlert('admin-alert-postfile-firstfile');
            return;
        }

        let promises: Promise<any>[] = [];
        let image: string = "";

        if (typeof article.firstFile !== "string") {
            let type: string = "image/" + article.firstFile.name.split('.')[1];
            promises.push(requesterFile('/file/create', 'POST', article.firstFile, type));
        } else {
            image = article.firstFile.split('.')[0];
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
                image = res[0]._id.toString();
            }
            editArticle([image]);
        });
    }

    function editArticle(files: string[]) {
        // Check if all fields are filled
        if (article.species.length === 0 || article.colors.length === 0 || article.tones.length === 0 || files.length === 0) {
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
            type: article.type,
            name: article.name ?? (article.species[0]?.name + " " + article.colors.map((elt: colorDB) => elt.name).join(" ")),
            description: article.description ?? "",
            price: parseFloat(article.price.toString().replace(",", ".")) ?? 0,
            stock: article.stock,
            size: 0,
            shape: "",
            colors: article.colors.map((elt: colorDB) => elt._id),
            species: article.species.map((elt: speciesDB) => elt._id),
            tones: article.tones.map((elt: toneDB) => elt._id),
            files: files,
        };

        // Create new article
        requester('/article/update', 'PUT', tmpArticle).then((res: any) => {
            if (res?._id) {
                navigate('/admin/fleurs-de-la-semaine');
            } else {
                console.log(res);
                displayAlert('admin-alert-editarticle');
            }
        });
    }

    function deleteArticle() {
        requester(`/article/delete?_id=${article._id}`, 'DELETE').then(() => {
            navigate('/admin/fleurs-de-la-semaine');
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

    /* Post Elements */
    function postColor() {
        // Check if all fields are filled
        if (color.name === "" || color.hexa === "") {
            displayAlert('form-mandatory-color');
            return;
        }

        // Check if color already taken
        if (colorAlreadyTaken) {
            displayAlert('form-alreadytaken-color');
            return;
        }
        // Check if hexa already taken
        if (options.colors?.filter((elt: selectColor) => elt.hexa === color.hexa).length > 0) {
            displayAlert('form-alreadytaken-hexa');
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

        // Check if tone already taken
        if (toneAlreadyTaken) {
            displayAlert('form-alreadytaken-tone');
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

    function postSpecies() {
        // Check if all fields are filled
        if (species === "") {
            displayAlert('form-mandatory-species');
            return;
        }

        // Check if species already taken
        if (speciesAlreadyTaken) {
            displayAlert('form-alreadytaken-species');
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

    /* Display */
    if (article._id === "") {
        return (<div></div>);
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - Modifier une fleur fraiche</h1>
            <div id="admin-article-delete-area">
                <button className='admin-button admin-delete-button' onClick={() => confirmDelete()}>Supprimer l'article</button>
                <div id="admin-article-delete-popup">
                    <p>Veux-tu vraiment supprimer cet article ?</p>
                    <button className='admin-button admin-delete-button' onClick={() => deleteArticle()}>Oui</button>
                    <button className='admin-button' onClick={() => cancelDelete()}>Non</button>
                </div>
            </div>
            <div className='admin-form'> {/* Article */}
                <h2>Modifier une fleur - {article?.name ?? ""}</h2>
                <div className='admin-form-element'> {/* Name */}
                    <label htmlFor='admin-form-input-name' className='admin-form-label'>Nom</label>
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
                <p className="admin-form-input-info">Si te ne donnes pas de nom à une fleur fraiche, par défaut ce sera le nom de l'espèce (la première s'il y en a plusieurs) suivi de toutes les couleurs.</p>
                {nameAlreadyTaken && <div id="admin-form-element-alreadytaken">Cette fleur existe déjà</div>}
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
                <div className='admin-form-element'> {/* Species */}
                    <label htmlFor='admin-form-input-species' className='admin-form-label'>Espèce(s)<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-input-select'>
                        <Select
                            name="species"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-2-darker)',
                                }),
                            }}
                            isSearchable
                            isClearable
                            isMulti
                            options={options.species}
                            defaultValue={article.species.map((elt: speciesDB) => ({ label: elt.name, value: elt._id })) ?? []}
                            onChange={(elt) => { setArticle({ ...article, species: (elt ? elt.map((elt: select) => ({ _id: elt.value, name: elt.label })) : []) }); checkAlreadyExists(); }}
                            id='admin-form-input-species'
                        />
                    </div>
                </div>
                <div className='admin-form-element'> {/* Color */}
                    <label htmlFor='admin-form-input-colors' className='admin-form-label'>Couleur(s)<p className='form-mandatory'>*</p></label>
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
                {(article.colors.length !== 0) && <div className='admin-form-element'> {/* Display Colors */}
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
                <div className='admin-form-element'> {/* Stock */}
                    <label htmlFor='admin-form-input-stock' className='admin-form-label'>Stock</label >
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
                <div className='admin-form-element'> {/* Image */}
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
                <div className='admin-form-element'>
                    <p>Image sélectionnée</p>
                    <div></div>
                </div>
                <div> {/* Display Images */}
                    <div id='admin-form-images'>
                        {article.firstFile && <div id="admin-form-image-first">
                            {(typeof (article.firstFile) !== "string") ?
                                <img key={article.firstFile.name} className='admin-form-image' src={URL.createObjectURL(article.firstFile)} alt={article.firstFile.name} /> :
                                <img key={article.firstFile} className='admin-form-image' src={(process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + article.firstFile} alt={article.firstFile} />
                            }
                        </div>}
                    </div>
                </div>
                <div className='admin-form-element'> {/* Occasion */}
                    <label htmlFor='admin-form-input-tones' className='admin-form-label'>Occasion<p className='form-mandatory'>*</p></label>
                    <div className='admin-form-input-select'>
                        <Select
                            name="tones"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-2-darker)',
                                }),
                            }}
                            isSearchable
                            isClearable
                            options={typeOptions}
                            defaultValue={typeOptions[typeOptions.findIndex((elt: select) => elt.value === "fresh") ?? 0]}
                            onChange={(e) => setArticle({ ...article, type: e?.value ?? "" })}
                            id='admin-form-input-tones'
                        />
                    </div>
                </div>
                <p className="admin-form-input-info">Tu peux utiliser le type "Fleurs fraîches (Compositions)" pour les idées de compositions florales</p>
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

                <h3 className='admin-form-sub-title'>Créer une couleur de fleur</h3>
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

                <h3 className='admin-form-sub-title'>Créer un ton de fleur</h3>
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
                <button className='admin-button' onClick={() => postSpecies()}>Ajouter l'espèce</button>
            </div>
            <Alert message="Aucune image de couverture n'est sélectionnée" id="admin-alert-postfile-firstfile" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de l'envoi des images" id="admin-alert-postfile-sendfiles" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory" status={alertStatus.error} />
            <Alert message="Ce nom est déjà pris par une autre création" id="form-name-alreadytaken" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de l'article" id="admin-alert-editarticle" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-color" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de la couleur" id="admin-alert-createcolor" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-tone" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création du ton" id="admin-alert-createtone" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-species" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de la'espèce" id="admin-alert-createspecies" status={alertStatus.error} />
            <Alert message="Cette couleur existe déjà" id="form-alreadytaken-hexa" status={alertStatus.error} />
            <Alert message="Ce nom de couleur existe déjà" id="form-alreadytaken-color" status={alertStatus.error} />
            <Alert message="Ce ton existe déjà" id="form-alreadytaken-tone" status={alertStatus.error} />
            <Alert message="Cette variété existe déjà" id="form-alreadytaken-species" status={alertStatus.error} />
        </div>
    );
}

export default WeekEditAdmin;
