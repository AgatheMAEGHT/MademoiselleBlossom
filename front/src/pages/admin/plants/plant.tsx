import React from 'react';

import { alertStatus, articleType, catalog } from '../../../components/types';
import { requester } from '../../../components/requester';
import Alert, { displayAlert } from '../../../components/alert/alert';
import { AdminDriedCatalogTile, AdminFreshCatalogTile } from '../_components/catalog-tile-admin/catalogTile';

import './plant.css';

function PlantAdmin() {
    // Flowers
    const [plants, setPlants] = React.useState<catalog>([]);

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester('/article?populate=true&types=' + articleType.plant, 'GET'));

        Promise.all(promises).then((res) => {
            setPlants(res[0].sort((a: any, b: any) => a.name.localeCompare(b.name)));
        });
    }, []);

    function displayFreshFlowers(list: catalog) {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < list?.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<AdminDriedCatalogTile key={list[i]._id} name={list[i].name} price={list[i].price.toString()} images={list[i].files} id={list[i]._id} />);
            if (list[i + 1]) {
                row.push(<AdminDriedCatalogTile key={list[i + 1]._id} name={list[i + 1].name} price={list[i].price.toString()} images={list[i + 1].files} id={list[i + 1]._id} />);
                if (list[i + 2]) {
                    row.push(<AdminDriedCatalogTile key={list[i + 2]._id} name={list[i + 2].name} price={list[i].price.toString()} images={list[i + 2].files} id={list[i + 2]._id} />);
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-week-page-title'>Admin - Plantes</h1>
            <a className='admin-button' href='/admin/plantes/nouveau'>Ajouter une plante</a>
            <div className="admin-fresh-catalog">
                {displayFreshFlowers(plants)}
            </div>
        </div>
    );
}

export default PlantAdmin;
