import React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { requester, requesterFile } from '../../../components/requester';
import Alert, { displayAlert } from '../../../components/alert/alert';
import { article, newArticleDB, colorDB, shapeDB, toneDB, select, newArticleOptions, newColorDB, newToneDB, speciesDB, newSpeciesDB, selectColor, alertStatus } from '../../../components/types';

import '../_components/catalogEdit.css';
import "./edit-components.css";

function EditComponentsAdmin() {
    /* Elements Variables */
    const [colorAlreadyTaken, setColorAlreadyTaken] = React.useState(false);
    const [toneAlreadyTaken, setToneAlreadyTaken] = React.useState(false);
    const [shapeAlreadyTaken, setShapeAlreadyTaken] = React.useState(false);
    const [speciesAlreadyTaken, setSpeciesAlreadyTaken] = React.useState(false);

    const [color, setColor] = React.useState({ name: "", hexa: "#ffffff" });
    const [tone, setTone] = React.useState("");
    const [shape, setShape] = React.useState("");
    const [species, setSpecies] = React.useState("");

    /* Options */
    const [options, setOptions] = React.useState<newArticleOptions>({
        colors: [],
        tones: [],
        shapes: [],
        species: [],
        names: [],
    });

    const [optionsEdit, setOptionsEdit] = React.useState<newArticleOptions>({
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
        promises.push(requester('/article?limit=100', 'GET'));

        Promise.all(promises).then((res) => {
            newOptions.colors = res[0]?.map((elt: colorDB) => ({ value: elt._id, label: elt.name, hexa: elt.hexa }));
            newOptions.tones = res[1]?.map((elt: toneDB) => ({ value: elt._id, label: elt.name }));
            newOptions.shapes = res[2]?.map((elt: shapeDB) => ({ value: elt._id, label: elt.name }));
            newOptions.species = res[3]?.map((elt: speciesDB) => ({ value: elt._id, label: elt.name }));
            newOptions.names = res[4]?.map((elt: any) => elt.name);
            setOptions(newOptions);
            setOptionsEdit(newOptions);
        });

    }, []);

    function checkOptions(e: string, option: select[], setAlreadyTaken: React.Dispatch<React.SetStateAction<boolean>>) {
        if (option?.filter((elt: select) => elt.label === e).length > 0) {
            setAlreadyTaken(true);
        } else {
            setAlreadyTaken(false);
        }
    }

    /* Delete functions */
    function deleteColor(index: number) {
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

    function deleteTone(index: number) {
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

    function deleteShape(index: number) {
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

    function deleteSpecies(index: number) {
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

    /* Edit functions */
    function editColor(index: number) {
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

    function editTone(index: number) {
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

    function editShape(index: number) {
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

    function editSpecies(index: number) {
        // Create new species object to send to the server
        let tmpSpecies: newSpeciesDB = {
            name: optionsEdit.species[index].label ?? "",
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

    /* Create functions */
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

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - Ajouter un article séché</h1>

            <div className='admin-form'> {/* Article */}
                <h2>Modifier des éléments</h2>
                <h3>Couleurs</h3>
                <div className='admin-edit-elements-list'>
                    {optionsEdit.colors && optionsEdit.colors.map((elt: selectColor, index) => (
                        <div key={elt.value} className='admin-edit-elements'>
                            <div className='admin-edit-elements-line admin-edit-elements-left'>
                                <label htmlFor={`admin-form-input-color-${elt.label}`} className='admin-form-label admin-edit-elements-label'>{options.colors[index].label}</label>
                                <div className='admin-edit-elements-line admin-edit-elements-center'>
                                    <div className='admin-form-element-right'>
                                        <input
                                            className='admin-form-input admin-form-input-right admin-edit-elements-input'
                                            type="text"
                                            name="color"
                                            id={`admin-form-input-color-${elt.label}`}
                                            value={elt.label}
                                            onChange={e => { setOptionsEdit({ ...optionsEdit, colors: optionsEdit.colors.map((color: selectColor) => color.value === elt.value ? { value: color.value, label: e.target.value, hexa: color.hexa } : color) }) }}
                                        />
                                    </div>
                                    <input
                                        className='admin-edit-element-color'
                                        value={"#" + elt.hexa}
                                        onChange={e => setOptionsEdit({ ...optionsEdit, colors: optionsEdit.colors.map((color: selectColor) => color.value === elt.value ? { value: color.value, label: color.label, hexa: e.target.value.replace("#", "") } : color) })}
                                        type="color"
                                        name="color"
                                    />
                                </div>
                            </div>
                            <div className='admin-edit-elements-line admin-edit-elements-right'>
                                <button className='admin-button' onClick={() => editColor(index)} disabled={options.colors[index].hexa == elt.hexa && options.colors[index].label == elt.label} >Modifier</button>
                                <button className='admin-button admin-delete-button' onClick={() => deleteColor(index)} >Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>

                <h3>Tons</h3>
                {optionsEdit.tones && optionsEdit.tones.map((elt: select, index) => (
                    <div key={elt.value} className='admin-edit-elements admin-edit-elements-line'>
                        <label htmlFor={`admin-form-input-tone-${elt.label}`} className='admin-form-label admin-edit-elements-label'>{elt.label}</label>
                        <div className='admin-form-element-right'>
                            <input
                                className='admin-form-input admin-form-input-right'
                                type="text"
                                name="tone"
                                id={`admin-form-input-tone-${elt.label}`}
                                value={elt.label}
                                onChange={e => setOptionsEdit({ ...optionsEdit, tones: optionsEdit.tones.map((tone: select) => tone.value === elt.value ? { value: tone.value, label: e.target.value } : tone) })}
                            />
                        </div>
                        <div className='admin-edit-elements-buttons'>
                            <button className='admin-button' onClick={() => editTone(index)} disabled={options.tones[index].label == elt.label} >Modifier</button>
                            <button className='admin-button admin-delete-button' onClick={() => deleteTone(index)} >Supprimer</button>
                        </div>
                    </div>
                ))}

                <h3>Formes</h3>
                {optionsEdit.shapes && optionsEdit.shapes.map((elt: select, index) => (
                    <div key={elt.value} className='admin-edit-elements admin-edit-elements-line'>
                        <label htmlFor={`admin-form-input-shape-${elt.label}`} className='admin-form-label admin-edit-elements-label'>{elt.label}</label>
                        <div className='admin-form-element-right'>
                            <input
                                className='admin-form-input admin-form-input-right'
                                type="text"
                                name="shape"
                                id={`admin-form-input-shape-${elt.label}`}
                                value={elt.label}
                                onChange={e => setOptionsEdit({ ...optionsEdit, shapes: optionsEdit.shapes.map((shape: select) => shape.value === elt.value ? { value: shape.value, label: e.target.value } : shape) })}
                            />
                        </div>
                        <div className='admin-edit-elements-buttons'>
                            <button className='admin-button' onClick={() => editShape(index)} disabled={options.shapes[index].label == elt.label} >Modifier</button>
                            <button className='admin-button admin-delete-button' onClick={() => deleteShape(index)} >Supprimer</button>
                        </div>
                    </div>
                ))}

                <h3>Variétés</h3>
                {optionsEdit.species && optionsEdit.species.map((elt: select, index) => (
                    <div key={elt.value} className='admin-edit-elements admin-edit-elements-line'>
                        <label htmlFor={`admin-form-input-species-${elt.label}`} className='admin-form-label admin-edit-elements-label'>{elt.label}</label>
                        <div className='admin-form-element-right'>
                            <input
                                className='admin-form-input admin-form-input-right'
                                type="text"
                                name="species"
                                id={`admin-form-input-species-${elt.label}`}
                                value={elt.label}
                                onChange={e => setOptionsEdit({ ...optionsEdit, species: optionsEdit.species.map((species: select) => species.value === elt.value ? { value: species.value, label: e.target.value } : species) })}
                            />
                        </div>
                        <div className='admin-edit-elements-buttons'>
                            <button className='admin-button' onClick={() => editSpecies(index)} disabled={options.species[index].label == elt.label} >Modifier</button>
                            <button className='admin-button admin-delete-button' onClick={() => deleteSpecies(index)} >Supprimer</button>
                        </div>
                    </div>
                ))}

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
            <Alert message="Une erreur est survenue lors de la création de l'article" id="admin-alert-createarticle" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-color" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de la couleur" id="admin-alert-createcolor" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-tone" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création du ton" id="admin-alert-createtone" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-shape" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de la forme" id="admin-alert-createshape" status={alertStatus.error} />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-species" status={alertStatus.error} />
            <Alert message="Une erreur est survenue lors de la création de l'espèce" id="admin-alert-createspecies" status={alertStatus.error} />
        </div >
    );
}

export default EditComponentsAdmin;
