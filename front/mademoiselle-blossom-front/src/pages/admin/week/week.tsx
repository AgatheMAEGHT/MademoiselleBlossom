import React from 'react';

import HeaderAdmin from '../_components/header/headerAdmin';

import './week.css';

function WeekAdmin() {

    const [colors, setSolors] = React.useState<{ name: string, id: number }[]>([]);

    function displayColors(): JSX.Element {
        let elements: JSX.Element[] = [];

        for (let i = 0; i < colors.length; i++) {
            elements.push(
                <div className='admin-colors-level' key={i}>
                    <div className='admin-colors-display' style={{ backgroundColor: "#" + colors[i].name }}></div>
                    <textarea className='admin-colors-name' value={colors[i].name} onChange={(e) => { editLevel(e.target.value, i) }} />
                    <button className='admin-colors-delete' onClick={() => { removeColor(i) }}>Supprimer la couleur</button>
                </div>
            )
        }

        return <div id="admin-colors">
            {elements}
        </div>
    }

    function editLevel(name: string, id: number) {
        setSolors(colors.map(level => level.id === id ? { name: name, id: id } : level))
    }

    function removeColor(id: number) {
        let newColor: { name: string, id: number }[] = colors.filter((_, i) => i != id);
        for (let i = id; i < newColor.length; i++) {
            newColor[i].id--;
        }

        setSolors(newColor);
    }

    function addColor() {
        setSolors(prev => [...prev, { name: "", id: colors.length }]);
    }


    return (
        <div>
            <HeaderAdmin />
            <div className='admin-page'>
                <h1 className='admin-page-title'>Admin - Fleurs de la semaine</h1>
                <p>Penses à sauvegarder avec le bouton envoyer en bas de la page</p>

                <div id='admin-colors'>
                    <p className='admin-element-title'>Couleurs de la semaine en codes hexadécimaux que tu peux trouver grace au site <a href="https://htmlcolorcodes.com/" target="_blank">htmlcolorcodes.com</a></p>

                    {displayColors()}
                    <button onClick={() => { addColor() }}>Ajouter une couleur</button>
                </div>
            </div>
        </div>
    );
}

export default WeekAdmin;
