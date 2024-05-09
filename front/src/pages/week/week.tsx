import React from 'react';

import { articleDB, catalog } from '../../components/types';
import { requester } from '../../components/requester';

import '../../components/catalogs.css';

function Week() {

    const [weekFlowers, setWeekFlowers] = React.useState<catalog>([]);

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester('/week?populate=true', 'GET'));

        Promise.all(promises).then((res: any) => {
            if (res) {
                if (res[0]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                setWeekFlowers(res[0] ?? []);
            }
        })
    }, []);

    /* TILE */
    function catalogTile(article: articleDB) {
        let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + article.files[0];

        return (
            <div className="dried-tile" key={article._id}>
                <img
                    className="dried-tile-img"
                    src={imageUrl}
                    alt={"courone de fleurs séchées " + article.name}
                />
                <div className="dried-tile-name">{article.name}</div>
            </div>
        );
    }

    function displayTiles() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < weekFlowers?.length; i += 3) {
            let row: JSX.Element[] = [];
            for (let j = 0; j < 3; j++) {
                if (weekFlowers[i + j]) {
                    row.push(catalogTile(weekFlowers[i + j]));
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div id="catalog" className='page'>
            <h2 className="page-title">Fleurs de la semaine</h2>
            <div id="dried-flowers-catalog">
                {displayTiles()}
            </div>
        </div>
    );
}

export default Week;
