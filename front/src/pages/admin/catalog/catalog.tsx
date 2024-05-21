import React from 'react';

import { catalog } from '../../../components/types';
import { requester } from '../../../components/requester';
import { AdminDriedCatalogTile } from '../_components/catalog-tile-admin/catalogTile';

import './catalog.css';

function CatalogAdmin(props: { articleType: string, event: boolean }) {
    const [flowers, setFlowers] = React.useState<catalog>([]);

    React.useEffect(() => {
        requester('/article?populate=true&limit=100&types=' + props.articleType, 'GET').then((res: any) => {
            setFlowers(res);
        })
        // eslint-disable-next-line
    }, []);

    function displayDriedFlowers() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < flowers?.length; i += 3) {
            let row: JSX.Element[] = [];
            row.push(<AdminDriedCatalogTile key={flowers[i]._id} name={flowers[i].name} price={flowers[i].price.toString()} images={flowers[i].files} id={flowers[i]._id} />);
            if (flowers[i + 1]) {
                row.push(<AdminDriedCatalogTile key={flowers[i + 1]._id} name={flowers[i + 1].name} price={flowers[i + 1].price.toString()} images={flowers[i + 1].files} id={flowers[i + 1]._id} />);
                if (flowers[i + 2]) {
                    row.push(<AdminDriedCatalogTile key={flowers[i + 2]._id} name={flowers[i + 2].name} price={flowers[i + 2].price.toString()} images={flowers[i + 2].files} id={flowers[i + 2]._id} />);
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - {window.location.pathname.split("/")[window.location.pathname.split("/").length - 1].replace("fleurs-sechees", "Fleurs Séchées").replaceAll("%C3%AA", "ê").replaceAll("%C3%A8", "è").replaceAll("_", " ")}</h1>
            <a className='admin-button' href={"/admin/" + (props.event ? "evenements/" : "") + window.location.pathname.split("/")[window.location.pathname.split("/").length - 1] + "/nouveau"}>Ajouter un article</a>
            <div id="admin-dried-catalog">
                {displayDriedFlowers()}
            </div>
        </div>
    );
}

export default CatalogAdmin;
