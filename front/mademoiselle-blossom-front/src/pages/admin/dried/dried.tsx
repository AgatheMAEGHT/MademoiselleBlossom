import React from 'react';
import { useNavigate } from 'react-router-dom';

import AdminCatalogTile from '../_components/catalog-tile-admin/catalogTile';
import { catalog } from '../../../components/types';

import './dried.css';

function CatalogAdmin() {
    let navigate = useNavigate();
    let [flowers, setFlowers] = React.useState<catalog>(fetchFlowers());

    function fetchFlowers(): catalog {
        
        return [];
    }

    function displayDriedFlowers() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < flowers.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<AdminCatalogTile key={flowers[i]._id} name={flowers[i].name} price={flowers[i].price} images={flowers[i].files} id={flowers[i]._id} />);
            if (flowers[i + 1]) {
                row.push(<AdminCatalogTile key={flowers[i + 1]._id} name={flowers[i + 1].name} price={flowers[i + 1].price} images={flowers[i + 1].files} id={flowers[i + 1]._id} />);
                if (flowers[i + 2]) {
                    row.push(<AdminCatalogTile key={flowers[i + 2]._id} name={flowers[i + 2].name} price={flowers[i + 2].price} images={flowers[i + 2].files} id={flowers[i + 2]._id} />);
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - Fleurs séchées</h1>
            <div></div>
            <button className='admin-button' onClick={() => navigate("/admin/fleurs-sechees/nouveau")}>Ajouter un article</button>
            <div>
                {displayDriedFlowers()}
            </div>
        </div>
    );
}

export default CatalogAdmin;
