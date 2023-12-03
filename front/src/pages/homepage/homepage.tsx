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
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(1, 30, 5, tr, setTr)}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} />
                        </div>
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(-1, 30, 5, tr, setTr)}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' />
                        </div>
                    </div>
                    <div id="home-carousel-list">
                        <img className='home-carousel-img' src="https://picsum.photos/1000/500" alt="carousel" />
                        <img className='home-carousel-img' src="https://picsum.photos/1000/501" alt="carousel" />
                        <img className='home-carousel-img' src="https://picsum.photos/1000/502" alt="carousel" />
                        <img className='home-carousel-img' src="https://picsum.photos/1000/503" alt="carousel" />
                        <img className='home-carousel-img' src="https://picsum.photos/1000/504" alt="carousel" />
                    </div>
                </div>
                <div id="home-top-buttons-area">
                    <div className='home-top-buttons' onClick={() => navigate("/fleurs-sechees")}>Fleurs séchées</div>
                    <div className='home-top-buttons' onClick={() => navigate("/fleurs-de-la-semaine")}>Fleurs de la semaine</div>
                    <div className='home-top-buttons' onClick={() => navigate("")}>Commande sur mesure</div>
                </div>
            </div>
            <p>Ici c'est le texte que Emma va écrire. Je ne sais pas encore ce que c'est mais elle va trouver. En tout cas c'est un super texte. Il contient plein de mots et de lettres. Il parlera probablement de fleurs, de livraison ou de comment trouver Mademoiselle Blossom.</p>
            <p>Ici c'est le texte que Emma va écrire. Je ne sais pas encore ce que c'est mais elle va trouver. En tout cas c'est un super texte. Il contient plein de mots et de lettres. Il parlera probablement de fleurs, de livraison ou de comment trouver Mademoiselle Blossom.</p>
            <p>Ici c'est le texte que Emma va écrire. Je ne sais pas encore ce que c'est mais elle va trouver. En tout cas c'est un super texte. Il contient plein de mots et de lettres. Il parlera probablement de fleurs, de livraison ou de comment trouver Mademoiselle Blossom.</p>
            <p>Ici c'est le texte que Emma va écrire. Je ne sais pas encore ce que c'est mais elle va trouver. En tout cas c'est un super texte. Il contient plein de mots et de lettres. Il parlera probablement de fleurs, de livraison ou de comment trouver Mademoiselle Blossom.</p>
        </div>
    );
}

export default Homepage;
