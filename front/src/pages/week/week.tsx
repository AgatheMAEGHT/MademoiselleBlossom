import React from 'react';

import { articleDB, articleType, catalog } from '../../components/types';
import { requester } from '../../components/requester';

import '../../components/catalogs.css';
import MetaData from '../../components/metaData';

function Week() {
    const [freshFlowers, setDriedFlowers] = React.useState<catalog>([]);
    const [compositions, setCompositions] = React.useState<catalog>([]);
    const [colors, setColors] = React.useState<{ name: string, id: number }[]>([]);

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester('/article?populate=true&types=' + articleType.week, 'GET'));
        promises.push(requester('/article?populate=true&types=' + articleType.weekCompo, 'GET'));
        promises.push(requester('/colors-of-the-week', 'GET'));

        Promise.all(promises).then((res: any) => {
            if (res) {
                if (res[0]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                setDriedFlowers(res[0] ?? []);
                setCompositions(res[1] ?? []);

                setColors(res[2] ? res[2][0]?.hexas?.map((elt: any, i: number) => { return { name: "#" + elt, id: i } }) : []);
            }
        })
    }, []);

    function createGradient(): string {
        if (colors.length === 0) {
            return "white";
        } else if (colors.length === 1) {
            return colors[0].name;
        }

        let gradient = "linear-gradient(to right, ";
        for (let i = 0; i < colors.length; i++) {
            gradient += colors[i].name + (i !== colors.length - 1 ? ", " : "");
        }
        gradient += ")";

        return gradient;
    }

    /* TILE */
    function catalogTile(article: articleDB) {
        let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + article.files[0];

        return (
            <div className="dried-tile" key={article._id}>
                <a href={"/fleurs-sechees/" + article.name}>
                    <img
                        className="dried-tile-img"
                        src={imageUrl}
                        alt={"couronne de fleurs séchées " + article.name}
                    />
                </a>
                <div className="dried-tile-name">{article.name}</div>
            </div>
        );
    }

    function displayTiles(flowers: catalog) {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < flowers?.length; i += 3) {
            let row: JSX.Element[] = [];
            for (let j = 0; j < 3; j++) {
                if (flowers[i + j]) {
                    row.push(catalogTile(flowers[i + j]));
                }
            }
            driedFlowersList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return driedFlowersList;
    }

    return (
        <div className="page catalog">
            <MetaData title="Fleurs de la semaine" url="/fleurs-de-la-semaine" />
            <h2 className="page-title">Fleurs de la Semaine</h2>
            {colors.length > 0 && <div id="week-gradient" style={{ background: createGradient() }}></div>}
            {freshFlowers.length > 0 ?
                <div id="dried-flowers-catalog">
                    {displayTiles(freshFlowers)}
                </div> :
                <div className='paragraph-center'><i>Malheureusement, il n'y a pas de fleurs fraiches pour le moment</i></div>
            }

            <hr className='horizontal-bar' />

            <h2 className="page-title">Idées de Compositions Florales</h2>
            {compositions.length > 0 ?
                <div id="dried-flowers-catalog">
                    {displayTiles(compositions)}
                </div> :
                <div className='paragraph-center'><i>Malheureusement, il n'y a pas de fleurs fraiches pour le moment</i></div>
            }
        </div>
    );
}

export default Week;
