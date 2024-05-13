import React from 'react';

import { colorDB, driedFlowerTile, freshFlowerTile, newArticleDB, speciesDB, toneDB } from '../../../../components/types';

import { requester } from '../../../../components/requester';
import { displayAlert } from '../../../../components/alert/alert';

import '../../../../components/catalog-tile/catalogTile.css';

export function AdminDriedCatalogTile(props: driedFlowerTile) {
    let imageUrl = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + props.images[0];

    return (
        <a className="dried-tile" key={props.id} href={"fleurs-sechees/" + props.name.replaceAll(" ", "_")}>
            <img className="dried-tile-img" src={imageUrl} alt={"couronne de fleurs séchées " + props.name} />
            <div className="dried-tile-name">{props.name}</div>
            <div className="dried-tile-price">{props.price}€</div>
        </a>
    );
}

export function AdminFreshCatalogTile(props: freshFlowerTile) {
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
            <a key={props.id} href={"fleurs-de-la-semaine/" + props.name.replaceAll(" ", "_")}>
                <img className="dried-tile-img" src={imageUrl} alt={props.name + "fraiche"} />
            </a>
            <div className="dried-tile-name admin-fresh-name">{props.name}</div>
            {props.article.type === "fresh" ?
                <div className='admin-fresh-tile-button' onClick={() => addToWeek()}>Ajouter à la semaine</div> :
                <div className='admin-fresh-tile-button' onClick={() => removeFromWeek()}>Retirer de la semaine</div>
            }
        </div>
    );
}
