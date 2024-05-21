import React from 'react';
import { useParams } from 'react-router-dom';

import MetaData from '../../components/metaData';
import { alertStatus, articleDB } from '../../components/types';
import { requester } from '../../components/requester';
import { columnImagesTranslateCarousel, translateCarousel } from '../../components/translateCarousel';
import Alert, { displayAlert } from '../../components/alert/alert';

import './catalogItempage.css';

function CatalogItempage() {
    let params = useParams();

    const [tr, setTr] = React.useState<number>(0);
    const [trBig, setTrBig] = React.useState<number>(0);
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
        species: [],
        files: [],
    });

    React.useEffect(() => {
        let promises: Promise<any>[] = [];
        promises.push(requester(`/article?populate=true&name=${params.itemName?.replaceAll("_", " ")}`, 'GET'));
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
        });
        // eslint-disable-next-line
    }, []);

    function displayBigImage(display: boolean) {
        if (display) {
            document.getElementById("big-carousel")?.setAttribute("style", "display: flex");
            document.getElementById("big-carousel-area")?.setAttribute("style", "display: flex");
            if (window.innerHeight < window.innerWidth) {
                document.getElementById("item-page")?.setAttribute("style", "height: 30vh; overflow-y: hidden");
            }
        } else {
            document.getElementById("big-carousel")?.setAttribute("style", "display: none");
            document.getElementById("big-carousel-area")?.setAttribute("style", "display: none");
            document.getElementById("item-page")?.setAttribute("style", "height: fit-content; overflow-y: initial");
        }
    }

    function images() {
        let imagesList: JSX.Element[] = [];
        item?.files?.forEach((img, index) => {
            let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + img;
            imagesList.push(<img key={index} className='home-carousel-img' src={imageUrl} alt="carousel" />);
        });
        return imagesList;
    }

    function bigImages() {
        let imagesList: JSX.Element[] = [];
        item?.files?.forEach((img, index) => {
            let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + img;
            imagesList.push(<img key={index} className='item-page-carousel-img' src={imageUrl} alt="carousel" />);
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
            imagesList.push(<img key={i} className='item-page-images-col' src={imageUrl} alt={item.name} style={border} onClick={() => columnImagesTranslateCarousel(i, 30, item?.files?.length, tr, setTr, "item-page-carousel-list")} />);
        }
        return imagesList;
    }

    function imagesColMobile() {
        let imagesList: JSX.Element[] = [];
        let selected: number = (tr / 60) ?? 0;
        if (selected < 0) {
            selected = -selected;
        }

        for (let i = 0; i < item?.files?.length; i++) {
            let border: React.CSSProperties = selected === i ? { border: '3px solid var(--color-2-darker2)' } : { padding: '3px' };
            let imageUrl: string = (process.env.REACT_APP_API_URL ?? "") + (process.env.REACT_APP_DOWNLOAD_URL ?? "") + item?.files[i];
            imagesList.push(<img key={i} className='item-page-images-col' src={imageUrl} alt={item.name} style={border} onClick={() => columnImagesTranslateCarousel(i, 30, item?.files?.length, tr, setTr, "item-page-carousel-list")} />);
        }
        return imagesList;
    }

    function editIsFavorite(article: string, favorite: string) {
        if (!localStorage.getItem("access_token")) {
            displayAlert('need-login');
            return;
        }
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
                    setFavId(res._id);
                }
            });
        }
    }

    function displayDescription() {
        return item.description.split("\n").map((line, index) => <p key={index}>{line}</p>);
    }

    return (
        <div id="item-page">
            <MetaData title={item?.name} url={"/fleurs-sechees/" + params.itemName} />
            <div id="item-page-top">
                <div id="item-page-images">
                    <div id='item-page-images-col'>
                        {imagesCol()}
                    </div>
                    <div id='item-page-images-col-mobile'>
                        {imagesColMobile()}
                    </div>
                    <div id="home-carousel">
                        {(item.files.length > 1) ?
                            <div id="home-carousel-dir-buttons-area">
                                <div className='home-carousel-dir-buttons' onClick={() => { translateCarousel(1, 80, item?.files?.length, trBig, setTrBig, "item-page-carousel-list-big", true); translateCarousel(1, 30, item?.files?.length, tr, setTr, "item-page-carousel-list") }}>
                                    <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel' />
                                </div>
                                <div id="item-page-carousel-display-big" onClick={() => displayBigImage(true)}>
                                </div>
                                <div className='home-carousel-dir-buttons' onClick={() => { translateCarousel(-1, 80, item?.files?.length, trBig, setTrBig, "item-page-carousel-list-big", true); translateCarousel(-1, 30, item?.files?.length, tr, setTr, "item-page-carousel-list") }}>
                                    <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                                </div>
                            </div>
                            :
                            <div id="home-carousel-dir-buttons-area">
                                <div id="item-page-carousel-display-big-alone" onClick={() => displayBigImage(true)}></div>
                            </div>
                        }
                        <div id="item-page-carousel-list">
                            {images()}
                        </div>
                    </div>
                </div>
                <div id="item-page-infos">
                    <h1 id="item-page-info-name">{item?.name}</h1>
                    <div id="item-page-info-price">{item?.price}€</div>
                    <div id="item-page-info-stock">{item?.size} cm</div>
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
                    {/*<div id="item-page-info-add-to-cart"}>
                    <img
                    className='header-top-button-icon'
                    src={"/icons/cart.svg"}
                    id="header-button-cart"
                    />
                    Ajouter au panier
                </div>*/}
                </div>
            </div>
            <div id="item-page-description">{displayDescription()}</div>
            <div id="item-page-description">Pour plus de renseignements ou pour passer commande, n'hésitez pas à me contacter par mail à ma<i className='contact-info-separation'>puis</i>demoiselle<i className='contact-info-separation'>puis</i>.<i className='contact-info-separation'>puis</i>blossom<i className='contact-info-separation'>puis</i>34<i className='contact-info-separation'>puis</i>@<i className='contact-info-separation'>puis</i>g<i className='contact-info-separation'>puis</i>mail<i className='contact-info-separation'>puis</i>.<i className='contact-info-separation'>puis</i>com ou par téléphone au <i className='contact-info-separation'>numéro </i>06 <i className='contact-info-separation'>puis</i>16 <i className='contact-info-separation'>puis</i>28 <i className='contact-info-separation'>puis</i>28 <i className='contact-info-separation'>puis</i>83.</div>
            <div id="big-carousel-area" onClick={() => displayBigImage(false)}></div>
            <div id="big-carousel">
                {(item.files.length > 1) && <div id="item-page-big-carousel-dir-buttons-area">
                    <div className='item-page-big-dir-buttons' onClick={() => { translateCarousel(1, 80, item?.files?.length, trBig, setTrBig, "item-page-carousel-list-big", true); translateCarousel(1, 30, item?.files?.length, tr, setTr, "item-page-carousel-list") }}>
                        <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel' />
                    </div>
                    <div className='item-page-big-dir-buttons' onClick={() => { translateCarousel(-1, 80, item?.files?.length, trBig, setTrBig, "item-page-carousel-list-big", true); translateCarousel(-1, 30, item?.files?.length, tr, setTr, "item-page-carousel-list") }}>
                        <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                    </div>
                </div>}
                <div id="item-page-carousel-list-big">
                    {bigImages()}
                </div>
            </div>
            <Alert message="Pour ajouter un article en favoris, connectez-vous" id="need-login" status={alertStatus.info} />
        </div>
    );
}

export default CatalogItempage;
