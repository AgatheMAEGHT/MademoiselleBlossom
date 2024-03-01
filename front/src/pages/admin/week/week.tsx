import React from 'react';

import './week.css';
import { requester } from '../../../components/requester';
import Alert, { displayAlert } from '../../../components/alert_TODO/alert';

function WeekAdmin() {

    const [colors, setSolors] = React.useState<{ name: string, id: number }[]>([]);

    function displayColors(): JSX.Element {
        let elements: JSX.Element[] = [];

        for (let i = 0; i < colors.length; i++) {
            elements.push(
                <div className='admin-week-colors-color' key={i}>
                    <div style={{ backgroundColor: colors[i].name }}></div>
                    <input type='color' value={colors[i].name} onChange={(e) => { editColor(e.target.value, i) }} className='admin-week-colors-display' />
                    <button className='admin-week-colors-delete' onClick={() => { removeColor(i) }}>Supprimer la couleur</button>
                </div>
            )
        }

        return <div id="admin-week-colors-list">
            {elements.length > 0 ? elements : <p><i>Aucune couleur ajoutée</i></p>}
        </div>
    }

    function editColor(name: string, id: number) {
        setSolors(colors.map(color => color.id === id ? { name: name, id: id } : color))
    }

    function removeColor(id: number) {
        let newColor: { name: string, id: number }[] = colors.filter((_, i) => i !== id);
        for (let i = id; i < newColor.length; i++) {
            newColor[i].id--;
        }

        setSolors(newColor);
    }

    function addColor() {
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

    function postColors() {
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
            <p>Penses à sauvegarder avec le bouton <b>Sauvegarder les couleurs</b> en bas de la page</p>

            <p>Prévisualisation du dégradé</p>
            <div id="admin-week-gradient" style={{ background: createGradient() }}></div>

            <div id='admin-week-colors'>
                {displayColors()}
                <button className='admin-button' onClick={() => { addColor() }}>Ajouter une couleur</button>
                <button className='admin-button' onClick={() => { postColors() }}>Sauvegarder les couleurs</button>
            </div>
            <Alert id="week-colors-saved" message="Les couleurs ont été sauvegardées" />
            <Alert id="week-colors-error" message="Une erreur est survenue lors de la sauvegarde" />
        </div>
    );
}

export default WeekAdmin;
