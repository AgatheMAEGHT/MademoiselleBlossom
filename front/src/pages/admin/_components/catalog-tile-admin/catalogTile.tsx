import React from 'react';
import { useNavigate } from 'react-router-dom';

import { articleDB, colorDB, driedFlowerTile, freshFlowerTile, newArticleDB, speciesDB, toneDB } from '../../../../components/types';

import '../../../../components/catalog-tile/catalogTile.css';
import { requester } from '../../../../components/requester';
import { displayAlert } from '../../../../components/alert_TODO/alert';

export function AdminDriedCatalogTile(props: driedFlowerTile) {
    let navigate = useNavigate();

    let imageUrl = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + props.images[0];

    return (
        <div className="dried-tile" key={props.id} onClick={() => navigate(props.name.replaceAll(" ", "_"))}>
            <img className="dried-tile-img" src={imageUrl} alt={"courone de fleurs séchées " + props.name} />
            <div className="dried-tile-name">{props.name}</div>
            <div className="dried-tile-price">{props.price}€</div>
        </div>
    );
}

export function AdminFreshCatalogTile(props: freshFlowerTile) {
    let navigate = useNavigate();

    let imageUrl = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + props.images[0];

    function addToWeek() {
        let tmpArticle: newArticleDB = {
            _id: props.article._id,
            type: "week",
            name: props.article.name,
            description: props.article.description ?? "",
            price: parseFloat(props.article.price.toString().replace(",", ".")) ?? 0,
            stock: props.article.stock,
            size: props.article.size,
            shape: "",
            colors: props.article.colors.map((elt: colorDB) => elt._id) ?? [],
            species: props.article.species.map((elt: speciesDB) => elt._id) ?? [],
            tones: props.article.tones.map((elt: toneDB) => elt._id) ?? [],
            files: props.article.files.map((elt: string) => elt.split('.')[0]) ?? [],
        }

        requester('/article/update', 'PUT', tmpArticle).then((res: any) => {
            if (res?._id) {
                console.log("res:");
                console.log(res);
                window.location.reload();
            } else {
                displayAlert('admin-alert-createspecies');
            }
        });
    }

    function removeFromWeek() {
        let tmpArticle: newArticleDB = {
            _id: props.article._id,
            type: "fresh",
            name: props.article.name,
            description: props.article.description ?? "",
            price: parseFloat(props.article.price.toString().replace(",", ".")) ?? 0,
            stock: props.article.stock,
            size: props.article.size,
            shape: "",
            colors: props.article.colors.map((elt: colorDB) => elt._id) ?? [],
            species: props.article.species.map((elt: speciesDB) => elt._id) ?? [],
            tones: props.article.tones.map((elt: toneDB) => elt._id) ?? [],
            files: props.article.files.map((elt: string) => elt.split('.')[0]) ?? [],
        }

        requester('/article/update', 'PUT', tmpArticle).then((res: any) => {
            if (res?._id) {
                console.log("res:");
                console.log(res);
                window.location.reload();
            } else {
                displayAlert('admin-alert-createspecies');
            }
        });
    }

    return (
        <div className="dried-tile">
            <div className="dried-tile" key={props.id} onClick={() => navigate(props.name.replaceAll(" ", "_"))}>
                <img className="dried-tile-img" src={imageUrl} alt={props.name + "fraiche"} />
                <div className="dried-tile-name">{props.name}</div>
            </div>
            {props.article.type === "fresh" ?
                <div className='admin-fresh-tile-button' onClick={() => addToWeek()}>Ajouter à la semaine</div> :
                <div className='admin-fresh-tile-button' onClick={() => removeFromWeek()}>Retirer de la semaine</div>
            }
        </div>
    );
}
