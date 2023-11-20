import React from 'react';

import './driedFlowers.css';
import { driedFlowerCatalog } from '../../components/types';
import CatalogTile from '../../components/catalog-tile/catalogTile';

function DriedFlowers() {

    const [driedFlowers, setDriedFlowers] = React.useState<driedFlowerCatalog>([
        { name: "Marine", price: 10, images: ["https://picsum.photos/1000/500"], tags: { color: "red", size: "rose", shape: "rond" } },
        { name: "Anna", price: 10, images: ["https://picsum.photos/1000/501"], tags: { color: "red", size: "rose", shape: "rond" } },
        { name: "Louise", price: 10, images: ["https://picsum.photos/1000/502"], tags: { color: "red", size: "rose", shape: "rond" } },
        { name: "Éléna", price: 10, images: ["https://picsum.photos/1000/503"], tags: { color: "red", size: "rose", shape: "rond" } },
        { name: "Estelle", price: 10, images: ["https://picsum.photos/1000/504"], tags: { color: "red", size: "rose", shape: "rond" } },
        { name: "Coralie", price: 10, images: ["https://picsum.photos/1000/505"], tags: { color: "red", size: "rose", shape: "rond" } },
        { name: "Jeanne", price: 10, images: ["https://picsum.photos/1000/506"], tags: { color: "red", size: "rose", shape: "rond" } },
    ]);

    function displayDriedFlowers() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < driedFlowers.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<CatalogTile name={driedFlowers[i].name} price={driedFlowers[i].price} images={driedFlowers[i].images} tags={driedFlowers[i].tags} />);
            if (driedFlowers[i + 1]) {
                row.push(<CatalogTile name={driedFlowers[i + 1].name} price={driedFlowers[i + 1].price} images={driedFlowers[i + 1].images} tags={driedFlowers[i + 1].tags} />);
                if (driedFlowers[i + 2]) {
                    row.push(<CatalogTile name={driedFlowers[i + 2].name} price={driedFlowers[i + 2].price} images={driedFlowers[i + 2].images} tags={driedFlowers[i + 2].tags} />);
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div id="homepage">
            <h2 id="dried-title">Fleurs séchées</h2>
            <div id="dried-flowers-catalog">
                {displayDriedFlowers()}
            </div>
        </div>
    );
}

export default DriedFlowers;
