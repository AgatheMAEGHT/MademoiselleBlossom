import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { articleDB } from '../../components/types';
import { requester } from '../../components/requester';
import { columnImagesTranslateCarousel, translateCarousel } from '../../components/translateCarousel';

import './driedFlowersItempage.css';

function DriedFlowersItempage() {
    let params = useParams();
    let navigate = useNavigate();

    const [tr, setTr] = React.useState<number>(0);
    const [favId, setFavId] = React.useState<string>("");
    const [item, setItem] = React.useState<articleDB>({
        _id: "",
        type: "",
        name: "",
        description: "",
        price: 30,
        stock: 1,
        size: 0,
        shape: {
            _id: "",
            name: "",
        },
        colors: [],
        tones: [],
        files: [],
    });

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester(`/article?populate=true&name=${params.itemName}`, 'GET'));
        if (localStorage.getItem("access_token")) {
            promises.push(requester('/favorite', 'GET'));
        }

        Promise.all(promises).then((res: any) => {
            if (res) {
                if (res[0]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                setItem(res[0][0]);

                if (res[1]?.err) {
                    console.log("error while fetching dried flowers");
                    return;
                }
                setFavId(res[1]?.filter((fav: any) => fav.article === res[0][0]?._id)[0]?._id ?? "");
            }
        })

    }, []);

    function images() {
        let imagesList: JSX.Element[] = [];
        item?.files?.forEach((img, index) => {
            let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + img;
            imagesList.push(<img key={index} className='home-carousel-img' src={imageUrl} alt="carousel" />);
        });
        return imagesList;
    }

    function imagesCol() {
        let imagesList: JSX.Element[] = [];
        let selected: number = (tr / 30) ?? 0;
        if (selected < 0) {
            selected = -selected;
        }

        for (let i = 0; i < item?.files?.length; i++) {
            let border: React.CSSProperties = selected === i ? { border: '3px solid var(--color-2-darker2)' } : { padding: '3px' };
            let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + item?.files[i];
            imagesList.push(<img key={i} className='item-page-images-col' src={imageUrl} alt="sélection d'image" style={border} onClick={() => columnImagesTranslateCarousel(i, 30, item?.files?.length, tr, setTr)} />);
        }
        return imagesList;
    }

    function editIsFavorite(article: string, favorite: string) {
        if (favorite) {
            requester("/favorite/delete?_id=" + favorite, "DELETE").then((res: any) => {
                if (!res.err) {
                    setFavId("");
                }
            });
            return;
        } else {
            requester("/favorite/create", "POST", { article: article }).then((res: any) => {
                if (!res.err) {
                    console.log(res);
                    setFavId(res._id);
                }
            });
        }
    }

    return (
        <div id="item-page">
            <div id="item-page-top">
                <div id="item-page-images">
                    <div id='item-page-images-col'>
                        {imagesCol()}
                    </div>
                    <div id="home-carousel">
                        <div id="home-carousel-dir-buttons-area">
                            <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(1, 30, item?.files?.length, tr, setTr)}>
                                <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel images' />
                            </div>
                            <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(-1, 30, item?.files?.length, tr, setTr)}>
                                <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                            </div>
                        </div>
                        <div id="home-carousel-list">
                            {images()}
                        </div>
                    </div>
                </div>
                <div id="item-page-infos">
                    <h1 id="item-page-info-name">{item?.name}</h1>
                    <div id="item-page-info-price">{item?.price}€</div>
                    <div id="item-page-info-stock">{item?.stock} en stock</div>
                    <div id="item-page-info-favorite" onClick={() => editIsFavorite(item?._id, favId)}>
                        <img
                            id="item-page-info-favorite-icon"
                            src={(favId === "") ? "/icons/heart.svg" : "/icons/heart_full.svg"}
                            title='Ajouter aux favoris'
                            className='header-top-button-icon'
                            alt="ajouter aux favoris"
                        ></img>
                        Ajouter aux favoris
                    </div>
                    {/*<div id="item-page-info-add-to-cart" onClick={() => navigate("/panier")}>
                    <img
                    className='header-top-button-icon'
                    src={"/icons/cart.svg"}
                    id="header-button-cart"
                    />
                    Ajouter au panier
                </div>*/}
                </div>
            </div>
            <div id="item-page-description">{item?.description}</div>
        </div>
    );
}

export default DriedFlowersItempage;
