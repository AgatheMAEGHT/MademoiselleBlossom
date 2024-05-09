import React from 'react';

import './week.css';
import { requester } from '../../../../components/requester';
import Alert, { displayAlert } from '../../../../components/alert_TODO/alert';
import { article, newArticleDB, colorDB, shapeDB, toneDB, select, newArticleOptions, newColorDB, newToneDB, speciesDB, newSpeciesDB } from '../../../../components/types';

function WeekNewAdmin() {
    /* Variables */
    const [colorAlreadyTaken, setColorAlreadyTaken] = React.useState(false);
    const [toneAlreadyTaken, setToneAlreadyTaken] = React.useState(false);
    const [speciesAlreadyTaken, setSpeciesAlreadyTaken] = React.useState(false);

    const [color, setColor] = React.useState({ name: "", hexa: "#ffffff" });
    const [tone, setTone] = React.useState("");
    const [species, setSpecies] = React.useState("");

    const [options, setOptions] = React.useState<newArticleOptions>({
        colors: [],
        tones: [],
        shapes: [],
        names: [],
        species: [],
        type: "",
    });

    React.useEffect(() => {
        let newOptions = {
            colors: [],
            tones: [],
            shapes: [],
            names: [],
            species: [],
            type: "",
        }
        let promises: Promise<any>[] = [];

        promises.push(requester('/article-color', 'GET'));
        promises.push(requester('/article-tone', 'GET'));
        promises.push(requester('/article-shape', 'GET'));
        promises.push(requester('/article-type', 'GET'));
        promises.push(requester('/article-species', 'GET'));
        promises.push(requester('/article?limit=100', 'GET'));

        Promise.all(promises).then((res) => {
            newOptions.colors = res[0]?.map((elt: colorDB) => ({ value: elt._id, label: elt.name }));
            newOptions.tones = res[1]?.map((elt: toneDB) => ({ value: elt._id, label: elt.name }));
            newOptions.shapes = res[2]?.map((elt: shapeDB) => ({ value: elt._id, label: elt.name }));
            newOptions.species = res[2]?.map((elt: speciesDB) => ({ value: elt._id, label: elt.name }));
            newOptions.type = res[3]?.filter((elt: string) => (elt === "Fleurs séchées"))[0]?._id ?? "";
            newOptions.names = res[4]?.map((elt: any) => elt.name);
            setOptions(newOptions);
        });

    }, []);

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
        }

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

        // Create new species object to send to the server
        let tmpSpecies: newSpeciesDB = {
            name: species ?? "",
        }

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

    function checkOptions(e: string, option: select[], setAlreadyTaken: React.Dispatch<React.SetStateAction<boolean>>) {
        if (option?.filter((elt: select) => elt.label === e).length > 0) {
            setAlreadyTaken(true);
        } else {
            setAlreadyTaken(false);
        }
    }

    // Color gradient
    const [colors, setSolors] = React.useState<{ name: string, id: number }[]>([]);

    function displayColorsOfGradient(): JSX.Element {
        let elements: JSX.Element[] = [];

        for (let i = 0; i < colors.length; i++) {
            elements.push(
                <div className='admin-week-colors-color' key={i}>
                    <div style={{ backgroundColor: colors[i].name }}></div>
                    <input type='color' value={colors[i].name} onChange={(e) => { editColorOfGradient(e.target.value, i) }} className='admin-week-colors-display' />
                    <button className='admin-week-colors-delete' onClick={() => { removeColorFromGradient(i) }}>Supprimer la couleur</button>
                </div>
            )
        }

        return <div id="admin-week-colors-list">
            {elements.length > 0 ? elements : <p><i>Aucune couleur ajoutée</i></p>}
        </div>
    }

    function editColorOfGradient(name: string, id: number) {
        setSolors(colors.map(color => color.id === id ? { name: name, id: id } : color))
    }

    function removeColorFromGradient(id: number) {
        let newColor: { name: string, id: number }[] = colors.filter((_, i) => i !== id);
        for (let i = id; i < newColor.length; i++) {
            newColor[i].id--;
        }

        setSolors(newColor);
    }

    function addColorToGradient() {
        setSolors(prev => [...prev, { name: "#ffffff", id: colors.length }]);
    }

    function createGradient(): string {
        if (colors.length === 0) {
            return "white";
        } else if (colors.length === 1) {
            return colors[0].name;
        }

        let gradient = "linear-gradient(to right, ";
        for (let i = 0; i < colors.length; i++) {
            gradient += colors[i].name + (i !== colors.length - 1 ? ", " : "");
        }
        gradient += ")";

        return gradient;
    }

    function postGradient() {
        let tmp: string[] = colors.map((elt: { name: string, id: number }) => elt.name.replace("#", ""));
        requester('/admin/week', "POST", { colors: tmp }).then((res: any) => {
            if (res._confirm === "ok") {
                displayAlert("week-colors-saved");
            } else {
                console.log(res);
                displayAlert("week-colors-error");
            }
        })
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-week-page-title'>Admin - Fleurs de la semaine</h1>

            <h2>Couleurs</h2>
            <p><i>Prévisualisation du dégradé</i></p>
            <div id="admin-week-gradient" style={{ background: createGradient() }}></div>

            {displayColorsOfGradient()}
            <button className='admin-button' onClick={() => { addColorToGradient() }}>Ajouter une couleur</button>
            <button className='admin-button' onClick={() => { postGradient() }}>Sauvegarder les couleurs</button>
            <Alert id="week-colors-saved" message="Les couleurs ont été sauvegardées" />
            <Alert id="week-colors-error" message="Une erreur est survenue lors de la sauvegarde" />

            <h2>Fleurs</h2>

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

                <h3 className='admin-form-sub-title'>Créer un ton de fleur</h3>
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

                <h3 className='admin-form-sub-title'>Créer une variété de fleur</h3>
                <div className='admin-form-element'> {/* Species Name */}
                    <label htmlFor='admin-form-input-new-species' className='admin-form-label'>Nom de la variété</label>
                    <div className='admin-form-element-right'>
                        {speciesAlreadyTaken && <div id="admin-form-element-alreadytaken">Cette variété existe déjà</div>}
                        <input
                            value={species}
                            onChange={e => { setSpecies(e.target.value); checkOptions(e.target.value, options.species, setSpeciesAlreadyTaken) }}
                            className='admin-form-input admin-form-input-right'
                            type="text"
                            name="species"
                            id="admin-form-input-new-species"
                        />
                    </div>
                </div>
                <button className='admin-button' onClick={() => postSpecies()}>Ajouter l'espèce</button>
            </div>
            <Alert message="Aucune image de couverture n'est sélectionnée" id="admin-alert-postfile-firstfile" />
            <Alert message="Une erreur est survenue lors de l'envoi des images" id="admin-alert-postfile-sendfiles" />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory" />
            <Alert message="Ce nom est déjà pris par une autre création" id="form-name-alreadytaken" />
            <Alert message="Une erreur est survenue lors de la création de l'article" id="admin-alert-createarticle" />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-color" />
            <Alert message="Une erreur est survenue lors de la création de la couleur" id="admin-alert-createcolor" />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-tone" />
            <Alert message="Une erreur est survenue lors de la création du ton" id="admin-alert-createtone" />
            <Alert message="Certains champs obligatoires ne sont pas remplis" id="form-mandatory-species" />
            <Alert message="Une erreur est survenue lors de la création de la'espèce" id="admin-alert-createspecies" />

        </div>
    );
}

export default WeekNewAdmin;
