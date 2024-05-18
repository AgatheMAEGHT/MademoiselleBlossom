import React from 'react';

import { alertStatus, articleDB, catalog, favoriteDB } from '../../components/types';
import { requester } from '../../components/requester';
import Alert, { displayAlert } from '../../components/alert/alert';

import '../../components/catalogs.css';
import MetaData from '../../components/metaData';

function DriedFlowers() {
    const [driedFlowers, setDriedFlowers] = React.useState<catalog>([]);
    const [favorites, setFavorites] = React.useState<favoriteDB[]>([]);

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester('/article?populate=true&types=dried', 'GET'));
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
    function editIsFavorite(articleId: string, favorite: string) {
        if (!localStorage.getItem("access_token")) {
            displayAlert('need-login');
            return;
        }
        if (favorite) {
            requester("/favorite/delete?_id=" + favorite, "DELETE").then((res: any) => {
                if (res) {
                    setFavorites(prev => prev?.filter((fav: favoriteDB) => fav._id !== favorite));
                }
            });
            return;
        } else {
            requester("/favorite/create", "POST", { article: articleId }).then((res: any) => {
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
                        id='dried-tile-img-buttons-fav'
                        className='dried-tile-img-button'
                        src={favorite ? "/icons/heart_full.svg" : "/icons/heart.svg"}
                        title='Ajouter aux favoris'
                        alt="ajouter aux favoris"
                        onClick={() => editIsFavorite(article._id, favorite?._id)}
                    />
                    {/*<div
                        id='dried-tile-img-buttons-cart'
                        className='dried-tile-img-button'
                        title='Ajouter au panier'
                    >
                        <img
                            className='header-top-button-icon'
                            src={"/icons/cart.svg"}
                            id="header-button-cart"
                        />
                        Ajouter au panier
        </div>*/}
                </div>
                <a href={"/fleurs-sechees/" + article.name}>
                    <img
                        className="dried-tile-img"
                        src={imageUrl}
                        alt={"couronne de fleurs séchées " + article.name}
                    />
                </a>
                <div className="dried-tile-name">{article.name}</div>
                <div className="dried-tile-price">{article.price.toString()}€</div>
            </div>
        );
    }

    function persoTile() {
        return <div className="dried-tile" key="couronne-personnalisable">
            <a href="/fleurs-sechees/couronne-personnalisable">
                <img
                    className="dried-tile-img"
                    src="/couronnes-personnalisables/home.jpg"
                    alt="couronne de fleurs séchées personnalisable"
                />
            </a>
            <div className="dried-tile-name">Couronne Personnalisable</div>
            <div className="dried-tile-price">de 35€ à 60€</div>
        </div>;
    }

    function displayTiles() {
        let driedFlowersList: JSX.Element[] = [];
        let row: JSX.Element[] = [persoTile()];
        for (let i = 0; i < 2; i++) {
            if (driedFlowers[i]) {
                row.push(catalogTile(driedFlowers[i]));
            }
        }

        driedFlowersList.push(<div key={0} className="dried-flowers-row">{row}</div>);
        for (let i = 2; i < driedFlowers?.length; i += 3) {
            row = [];
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
        <div className='page catalog'>
            <MetaData title="Fleurs Séchées" url="/fleurs-sechees" />
            <h2 className="page-title">Fleurs Séchées</h2>
            {driedFlowers.length > 0 ?
                <div id="dried-flowers-catalog">
                    {displayTiles()}
                </div> :
                <div><i>Malheureusement, il n'y a pas de fleurs séchées pour le moment</i></div>
            }
            <Alert message="Pour ajouter un article en favoris, connectez-vous" id="need-login" status={alertStatus.info} />
        </div>
    );
}

export default DriedFlowers;
