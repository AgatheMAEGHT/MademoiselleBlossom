import React from 'react';

import { catalog } from '../../components/types';
import CatalogTile from '../../components/catalog-tile/catalogTile';
import { requester } from '../../components/requester';

import './driedFlowers.css';

function DriedFlowers() {

    const [driedFlowers, setDriedFlowers] = React.useState<catalog>([]);

    React.useEffect(() => {
        requester('/article', 'GET').then((res: any) => {
            console.log(res);
            if (res) {
                setDriedFlowers(res);
            }
        })
    }, []);

    function displayDriedFlowers() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < driedFlowers?.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<CatalogTile key={driedFlowers[i]._id} name={driedFlowers[i].name} price={driedFlowers[i].price} images={driedFlowers[i].files} id={driedFlowers[i]._id} />);
            if (driedFlowers[i + 1]) {
                row.push(<CatalogTile key={driedFlowers[i + 1]._id} name={driedFlowers[i + 1].name} price={driedFlowers[i + 1].price} images={driedFlowers[i + 1].files} id={driedFlowers[i + 1]._id} />);
                if (driedFlowers[i + 2]) {
                    row.push(<CatalogTile key={driedFlowers[i + 2]._id} name={driedFlowers[i + 2].name} price={driedFlowers[i + 2].price} images={driedFlowers[i + 2].files} id={driedFlowers[i + 2]._id} />);
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div id="homepage">
            <h2 id="dried-title">Couronnes de Fleurs Séchées</h2>
            <div id="dried-flowers-catalog">
                {displayDriedFlowers()}
            </div>
        </div>
    );
}

export default DriedFlowers;
