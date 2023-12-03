import React from 'react';
import { useNavigate } from 'react-router-dom';

import { articleDB, catalog, favoriteDB } from '../../components/types';
import { requester } from '../../components/requester';

import './driedFlowers.css';

function DriedFlowers() {
    let navigate = useNavigate();

    const [driedFlowers, setDriedFlowers] = React.useState<catalog>([]);
    const [favorites, setFavorites] = React.useState<favoriteDB[]>([]);

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester('/article?populate=true', 'GET'));
        if (localStorage.getItem("access_token")) {
            promises.push(requester('/favorite', 'GET'));
        }

        Promise.all(promises).then((res: any) => {
            if (res) {
                if (res[0]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                setDriedFlowers(res[0] ?? []);

                if (res[1]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                setFavorites(res[1] ?? []);
            }
        })
    }, []);

    /* TILE */
    function editIsFavorite(article: string, favorite: string) {
        if (favorite) {
            requester("/favorite/delete?_id=" + favorite, "DELETE").then((res: any) => {
                if (res) {
                    setFavorites(prev => prev?.filter((fav: favoriteDB) => fav._id !== favorite));
                }
            });
            return;
        } else {
            requester("/favorite/create", "POST", { article: article }).then((res: any) => {
                if (res) {
                    setFavorites(prev => [...prev, res]);
                }
            });
        }
    }

    function catalogTile(article: articleDB) {
        let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + article.files[0];
        let favorite: favoriteDB = favorites?.filter((favorite: favoriteDB) => favorite.article === article._id)[0];

        return (
            <div className="dried-tile" key={article._id}>
                <div className="dried-tile-img-buttons">
                    <img
                        className='dried-tile-img-buttons-fav'
                        src={favorite ? "/icons/heart_full.svg" : "/icons/heart.svg"}
                        title='Ajouter aux favoris'
                        alt="ajouter aux favoris"
                        onClick={() => editIsFavorite(article._id, favorite?._id)}
                    />
                    <div className='dried-tile-img-buttons-cart' title='Ajouter au panier'>Ajouter au panier</div>
                </div>
                <img
                    className="dried-tile-img"
                    src={imageUrl}
                    alt={"courone de fleurs séchées " + article.name}
                    onClick={() => navigate("/fleurs-sechees/" + article.name)}
                />
                <div className="dried-tile-name">{article.name}</div>
                <div className="dried-tile-price">{article.price.toString()}€</div>
            </div>
        );
    }

    function displayTiles() {
        let driedFlowersList: JSX.Element[] = [];
        for (let i = 0; i < driedFlowers?.length; i += 3) {
            let row: JSX.Element[] = [];
            for (let j = 0; j < 3; j++) {
                if (driedFlowers[i + j]) {
                    row.push(catalogTile(driedFlowers[i + j]));
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
                {displayTiles()}
            </div>
        </div>
    );
}

export default DriedFlowers;
