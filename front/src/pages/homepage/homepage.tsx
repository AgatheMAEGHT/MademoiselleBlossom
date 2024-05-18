import React from 'react';

import MetaData from '../../components/metaData';
import { translateCarousel } from '../../components/translateCarousel';

import './homepage.css';

function Homepage() {
    const [tr, setTr] = React.useState<number>(0);

    return (
        <div id="homepage">
            <MetaData title="Mademoiselle Blossom" url="" />
            <div id="home-top">
                <div id="home-carousel">
                    <div id="home-carousel-dir-buttons-area">
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(1, 30, 4, tr, setTr, "home-carousel-list")}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel images' />
                        </div>
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(-1, 30, 4, tr, setTr, "home-carousel-list")}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                        </div>
                    </div>
                    <div id="home-carousel-list">
                        <img src='/accueil/accueil_couronne.jpg' alt="couronne" className='home-carousel-img' />
                        <img src='/accueil/accueil_rose.jpg' alt="bouquet-rose-pale" className='home-carousel-img' />
                        <img src='/accueil/accueil_plante.jpg' alt="bouquet-arc-rose" className='home-carousel-img' />
                        <img src='/accueil/accueil_rouge.jpg' alt="bouquet-rose-pale" className='home-carousel-img' />
                    </div>
                </div>
                <div id="home-top-buttons-area">
                    <a className='home-top-buttons' href="/fleurs-sechees">Fleurs séchées</a>
                    <a className='home-top-buttons' href="/fleurs-de-la-semaine">Fleurs de la semaine</a>
                    <a className='home-top-buttons' href="/fleurs-sechees/couronne-personnalisable">Commande sur mesure</a>
                </div>
            </div>

            <div className='home-text-and-img'>
                <img src='/bouquet_seche.jpg' alt="bouquet-arc-rose" className='home-img-tall' />
                <p className='paragraph'>Bienvenue chez Mademoiselle Blossom !<br /><br />
                    J'ai à cœur d'égayer chaque moment de votre vie à l'aide de création florale unique et personnalisable. Explorez ma sélection en ligne pour trouver l'inspiration et laissez-moi transformer vos envies en réalité fleurie. Faites de chaque jour une occasion spéciale...</p>
            </div>
        </div>
    );
}

export default Homepage;
