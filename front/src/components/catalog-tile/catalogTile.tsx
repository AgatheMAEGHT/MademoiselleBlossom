import React from 'react';
import { useNavigate } from 'react-router-dom';

import { driedFlowerTile } from '../types';

import './catalogTile.css';

function CatalogTile(props: driedFlowerTile) {
    let navigate = useNavigate();

    return (
        <div className="dried-tile" key={props.id} onClick={() => navigate("/fleurs-sechees/" + props.name)}>
            <div className="dried-tile-img-buttons">
                <img className='dried-tile-img-buttons-fav' src="/icons/heart.svg" title='Ajouter aux favoris' alt="ajouter aux favoris" />
                <div className='dried-tile-img-buttons-cart' title='Ajouter au panier'>Ajouter au panier</div>
            </div>
            <img className="dried-tile-img" src={props.images[0]} alt={"courone de fleurs séchées " + props.name} />
            <div className="dried-tile-name">{props.name}</div>
            <div className="dried-tile-price">{props.price}€</div>
        </div>
    );
}

export default CatalogTile;
