import React from 'react';

import { alertStatus, articleType, catalog } from '../../../components/types';
import { requester } from '../../../components/requester';
import Alert, { displayAlert } from '../../../components/alert/alert';
import { AdminFreshCatalogTile } from '../_components/catalog-tile-admin/catalogTile';

import './week.css';

function WeekAdmin() {
    // Color gradient
    const [colors, setColors] = React.useState<{ name: string, id: number; }[]>([]);

    function displayColorsOfGradient(): JSX.Element {
        let elements: JSX.Element[] = [];

        for (let i = 0; i < colors.length; i++) {
            elements.push(
                <div className='admin-week-colors-color' key={i}>
                    <div style={{ backgroundColor: colors[i].name }}></div>
                    <input type='color' value={colors[i].name} onChange={(e) => { editColorOfGradient(e.target.value, i); }} className='admin-week-colors-display' />
                    <button className='admin-week-colors-delete' onClick={() => { removeColorFromGradient(i); }}>Supprimer la couleur</button>
                </div>
            );
        }

        return <div id="admin-week-colors-list">
            {elements.length > 0 ? elements : <p><i>Aucune couleur ajoutée</i></p>}
        </div>;
    }

    function editColorOfGradient(name: string, id: number) {
        setColors(colors.map(color => color.id === id ? { name: name, id: id } : color));
    }

    function removeColorFromGradient(id: number) {
        let newColor: { name: string, id: number; }[] = colors.filter((_, i) => i !== id);
        for (let i = id; i < newColor.length; i++) {
            newColor[i].id--;
        }

        setColors(newColor);
    }

    function addColorToGradient() {
        setColors(prev => [...prev, { name: "#ffffff", id: colors.length }]);
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
        let tmp: string[] = colors.map((elt: { name: string, id: number; }) => elt.name.replace("#", ""));
        requester('/colors-of-the-week/create', "POST", { hexas: tmp }).then((res: any) => {
            if (res?._id) {
                displayAlert("week-colors-saved");
            } else {
                console.log(res);
                displayAlert("week-colors-error");
            }
        });
    }

    // Flowers
    const [flowers, setFlowers] = React.useState<catalog>([]);
    const [compositions, setCompositions] = React.useState<catalog>([]);
    const [weekFlowers, setWeekFlowers] = React.useState<catalog>([]);
    const [weekCompositions, setWeekCompositions] = React.useState<catalog>([]);

    React.useEffect(() => {
        let promises: Promise<any>[] = [];

        promises.push(requester('/article?populate=true&types=' + articleType.fresh, 'GET'));
        promises.push(requester('/article?populate=true&types=' + articleType.freshCompo, 'GET'));
        promises.push(requester('/article?populate=true&types=' + articleType.week, 'GET'));
        promises.push(requester('/article?populate=true&types=' + articleType.weekCompo, 'GET'));
        promises.push(requester('/colors-of-the-week', 'GET'));

        Promise.all(promises).then((res) => {
            setFlowers(res[0].sort((a: any, b: any) => a.name.localeCompare(b.name)));
            setCompositions(res[1].sort((a: any, b: any) => a.name.localeCompare(b.name)));
            setWeekFlowers(res[2].sort((a: any, b: any) => a.name.localeCompare(b.name)));
            setWeekCompositions(res[3].sort((a: any, b: any) => a.name.localeCompare(b.name)));
            setColors(res[4] ? res[4][0]?.hexas?.map((elt: any, i: number) => { return { name: "#" + elt, id: i }; }) : []);
        });
    }, []);

    function displayFreshFlowers(list: catalog) {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < list?.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<AdminFreshCatalogTile key={list[i]._id} name={list[i].name} images={list[i].files} article={list[i]} id={list[i]._id} />);
            if (list[i + 1]) {
                row.push(<AdminFreshCatalogTile key={list[i + 1]._id} name={list[i + 1].name} images={list[i + 1].files} article={list[i + 1]} id={list[i + 1]._id} />);
                if (list[i + 2]) {
                    row.push(<AdminFreshCatalogTile key={list[i + 2]._id} name={list[i + 2].name} images={list[i + 2].files} article={list[i + 2]} id={list[i + 2]._id} />);
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
            <button className='admin-button' onClick={() => { addColorToGradient(); }}>Ajouter une couleur</button>
            <button className='admin-button' onClick={() => { postGradient(); }}>Sauvegarder les couleurs</button>
            <Alert id="week-colors-saved" message="Les couleurs ont été sauvegardées" status={alertStatus.success} />
            <Alert id="week-colors-error" message="Une erreur est survenue lors de la sauvegarde" status={alertStatus.error} />

            <h2>Fleurs</h2>
            <h3>Fleurs de la semaine</h3>
            <div className="admin-fresh-catalog">
                {displayFreshFlowers(weekFlowers)}
            </div>
            <h3>Compositions de la semaine</h3>
            <div className="admin-fresh-catalog">
                {displayFreshFlowers(weekCompositions)}
            </div>
            <hr className='horizontal-bar'/>

            <h3>Toutes les Fleurs Fraiches</h3>
            <a className='admin-button' href='/admin/fleurs-de-la-semaine/nouveau'>Ajouter une fleur</a>
            <div className="admin-fresh-catalog">
                {displayFreshFlowers(flowers)}
            </div>
            <h3>Toutes les Compositions de Fleurs Fraiches</h3>
            <p className="admin-form-input-info">Tu dois ajouter les Compositions Florales aux fleurs de la semaine pour qu'elles apparaissent côté client.<br /><br /></p>
            <a className='admin-button' href='/admin/fleurs-de-la-semaine/nouveau?type=compo'>Ajouter une fleur</a>
            <div className="admin-fresh-catalog">
                {displayFreshFlowers(compositions)}
            </div>
        </div>
    );
}

export default WeekAdmin;
