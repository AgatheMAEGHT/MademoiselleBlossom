import React from 'react';
import { useNavigate } from 'react-router-dom';

import { driedFlowerTile } from '../../../../components/types';

import '../../../../components/catalog-tile/catalogTile.css';

function AdminCatalogTile(props: driedFlowerTile) {
    let navigate = useNavigate();

    let imageUrl = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + props.images[0];

    return (
        <div className="dried-tile" key={props.id} onClick={() => navigate("/fleurs-sechees/" + props.name)}>
            <div className="dried-tile-img-buttons">
                <div></div>
                <div className='dried-tile-img-buttons-cart' title="Modifier l'article">Modifier l'article</div>
            </div>
            <img className="dried-tile-img" src={imageUrl} alt={"courone de fleurs séchées " + props.name} />
            <div className="dried-tile-name">{props.name}</div>
            <div className="dried-tile-price">{props.price}€</div>
        </div>
    );
}

export default AdminCatalogTile;
