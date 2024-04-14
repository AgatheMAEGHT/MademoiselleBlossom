import React from 'react';
import { useNavigate } from 'react-router-dom';

import { translateCarousel } from '../../components/translateCarousel';

import './homepage.css';

function Homepage() {
    let navigate = useNavigate();
    const [tr, setTr] = React.useState<number>(0);

    return (
        <div id="homepage">
            <div id="home-top">
                <div id="home-carousel">
                    <div id="home-carousel-dir-buttons-area">
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(1, 30, 4, tr, setTr)}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel images' />
                        </div>
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(-1, 30, 4, tr, setTr)}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                        </div>
                    </div>
                    <div id="home-carousel-list">
                        <img src='/accueil/accueil_courone.jpg' alt="courone" className='home-carousel-img' />
                        <img src='/accueil/accueil_rose.jpg' alt="bouquet-rose-pale" className='home-carousel-img' />
                        <img src='/accueil/accueil_plante.png' alt="bouquet-arc-rose" className='home-carousel-img' />
                        <img src='/accueil/accueil_rouge.jpg' alt="bouquet-rose-pale" className='home-carousel-img' />
                    </div>
                </div>
                <div id="home-top-buttons-area">
                    <div className='home-top-buttons' onClick={() => navigate("/fleurs-sechees")}>Fleurs séchées</div>
                    <div className='home-top-buttons' onClick={() => navigate("/fleurs-de-la-semaine")}>Fleurs de la semaine</div>
                    <div className='home-top-buttons' onClick={() => navigate("")}>Commande sur mesure</div>
                </div>
            </div>

            <div className='home-text-and-img'>
                <img src='/bouquet_seche.jpg' alt="bouquet-arc-rose" className='home-img-tall' />
                <p className='paragraph'>Bienvenue chez Mademoiselle Blossom !<br /><br />
                    J'ai à cœur d'égayer chaque moment de votre vie à l'aide de création florale unique et personnalisable. Explorer ma sélection en ligne pour trouver l'inspiration et laissez-moi transformer vos envies en réalité fleurie. Faites de chaque jour une occasion spéciale...</p>
            </div>
        </div>
    );
}

export default Homepage;
