import React from 'react';
import { useNavigate } from 'react-router-dom';

import { catalog } from '../../../components/types';
import { requester } from '../../../components/requester';
import Alert, { displayAlert } from '../../../components/alert_TODO/alert';
import { AdminFreshCatalogTile } from '../_components/catalog-tile-admin/catalogTile';

import './week.css';

function WeekAdmin() {
    let navigate = useNavigate();

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

    // Flowers
    const [flowers, setFlowers] = React.useState<catalog>([]);

    React.useEffect(() => {
        requester('/article?populate=true&limit=100&types=fresh', 'GET').then((res: any) => {
            setFlowers(res);
        })
    }, []);

    function displayFreshFlowers() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < flowers?.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<AdminFreshCatalogTile key={flowers[i]._id} species={flowers[i].name} images={flowers[i].files} id={flowers[i]._id} color={flowers[i].colors[0].name} />);
            if (flowers[i + 1]) {
                row.push(<AdminFreshCatalogTile key={flowers[i + 1]._id} species={flowers[i + 1].name} images={flowers[i + 1].files} id={flowers[i + 1]._id} color='' />);
                if (flowers[i + 2]) {
                    row.push(<AdminFreshCatalogTile key={flowers[i + 2]._id} species={flowers[i + 2].name} images={flowers[i + 2].files} id={flowers[i + 2]._id} color='' />);
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
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
            <h3>Fleurs de la semaine</h3>
            <h3>Toutes les fleurs</h3>
            <a className='admin-button' href='/admin/fleurs-de-la-semaine/nouveau'>Ajouter une fleur</a>
            <div id="admin-dried-catalog">
                {displayFreshFlowers()}
            </div>
        </div>
    );
}

export default WeekAdmin;
