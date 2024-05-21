import React from 'react';

import { articleDB } from '../../components/types';
import { columnImagesTranslateCarousel, translateCarousel } from '../../components/translateCarousel';

import './catalogItempage.css';
import MetaData from '../../components/metaData';

function CouronnePersonnalisable() {
    const [tr, setTr] = React.useState<number>(0);
    const [trBig, setTrBig] = React.useState<number>(0);
    const item: articleDB = {
        _id: "",
        type: "",
        name: "Couronne personnalisable",
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
        files: ["home.jpg", "mamie.jpg", "eliott.jpg"],
    };

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
            let imageUrl: string = "/couronnes-personnalisables/" + img;
            imagesList.push(<img key={index} className='home-carousel-img' src={imageUrl} alt="carousel" />);
        });
        return imagesList;
    }

    function bigImages() {
        let imagesList: JSX.Element[] = [];
        item?.files?.forEach((img, index) => {
            let imageUrl: string = "/couronnes-personnalisables/" + img;
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
            let imageUrl: string = "/couronnes-personnalisables/" + item?.files[i];
            imagesList.push(<img key={i} className='item-page-images-col' src={imageUrl} alt={item.name} style={border} onClick={() => columnImagesTranslateCarousel(i, 30, item?.files?.length, tr, setTr, "item-page-carousel-list")} />);
        }
        return imagesList;
    }

    return (
        <div id="item-page">
            <MetaData title="Couronne personnalisable" url="/fleurs-sechees/couronne-personnalisable" />
            <div id="item-page-top">
                <div id="item-page-images">
                    <div id='item-page-images-col'>
                        {imagesCol()}
                    </div>
                    <div id="home-carousel">
                        {(item.files.length > 1) && <div id="home-carousel-dir-buttons-area">
                            <div className='home-carousel-dir-buttons' onClick={() => { translateCarousel(1, 80, item?.files?.length, trBig, setTrBig, "item-page-carousel-list-big", true); translateCarousel(1, 30, item?.files?.length, tr, setTr, "item-page-carousel-list") }}>
                                <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel' />
                            </div>
                            <div id="item-page-carousel-display-big" onClick={() => displayBigImage(true)}>
                            </div>
                            <div className='home-carousel-dir-buttons' onClick={() => { translateCarousel(-1, 80, item?.files?.length, trBig, setTrBig, "item-page-carousel-list-big", true); translateCarousel(-1, 30, item?.files?.length, tr, setTr, "item-page-carousel-list") }}>
                                <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                            </div>
                        </div>}
                        <div id="item-page-carousel-list">
                            {images()}
                        </div>
                    </div>
                </div>
                <div id="item-page-infos">
                    <h1 id="item-page-info-name">{item?.name}</h1>
                    <div>Tailles possibles :</div>
                    <div id="item-page-info-price">25cm - 35€</div>
                    <div id="item-page-info-price">35cm - 45€</div>
                    <div id="item-page-info-price">50cm - 60€</div>
                </div>
            </div>
            <div id="item-page-description">Couleurs possibles : orange, bleu, rose, naturel, rouge.</div>
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
        </div>
    );
}

export default CouronnePersonnalisable;
