import React from 'react';
import { useNavigate } from 'react-router-dom';

import { articleDB, favoritePopulatedDB } from '../../components/types';
import { requester } from '../../components/requester';

import './favorites.css';

function Favorites() {
    let navigate = useNavigate();

    const [favorites, setFavorites] = React.useState<favoritePopulatedDB[]>([]);

    React.useEffect(() => {
        requester('/favorite?populate=true', 'GET').then((res: any) => {
            if (res?.err) {
                console.log("error while fetching dried flowers");
                return;
            }
            setFavorites(res ?? []);
        })
    }, []);

    function editIsFavorite(article: string, favorite: string) {
        if (favorite) {
            requester("/favorite/delete?_id=" + favorite, "DELETE").then((res: any) => {
                if (res) {
                    setFavorites(prev => prev?.filter((fav: favoritePopulatedDB) => fav._id !== favorite));
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
        let favorite: favoritePopulatedDB = favorites?.filter((favorite: favoritePopulatedDB) => favorite.article._id === article._id)[0];

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
        let favoritesList: JSX.Element[] = [];
        for (let i = 0; i < favorites?.length; i += 3) {
            let row: JSX.Element[] = [];
            for (let j = 0; j < 3; j++) {
                if (favorites[i + j]) {
                    row.push(catalogTile(favorites[i + j].article));
                }
            }
            favoritesList.push(<div key={i} className="dried-flowers-row">{row}</div>);
        }

        return favoritesList;
    }

    return (
        <div id="catalog" className='page'>
            <h2 id="dried-title">Couronnes de Fleurs Séchées</h2>
            <div id="dried-flowers-catalog">
                {displayTiles()}
            </div>
        </div>
    );
}

export default Favorites;
