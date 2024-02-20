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
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(1, 30, 3, tr, setTr)}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' style={{ transform: "rotate(180deg)" }} alt='fleche gauche carousel images' />
                        </div>
                        <div className='home-carousel-dir-buttons' onClick={() => translateCarousel(-1, 30, 3, tr, setTr)}>
                            <img className='home-carousel-dir-buttons-arrow' src='/icons/arrow.png' alt='fleche droite carousel' />
                        </div>
                    </div>
                    <div id="home-carousel-list">
                        <img src='/inspirations/deuil/coeur-blanc.jpg' alt="coeur-blanc" className='home-carousel-img' />
                        <img src='/inspirations/mariage/bouquet-arc-rose.jpg' alt="bouquet-arc-rose" className='home-carousel-img' />
                        <img src='/inspirations/mariage/bouquet-rose-pale.jpg' alt="bouquet-rose-pale" className='home-carousel-img' />
                    </div>
                </div>
                <div id="home-top-buttons-area">
                    <div className='home-top-buttons' onClick={() => navigate("/fleurs-sechees")}>Fleurs séchées</div>
                    <div className='home-top-buttons' onClick={() => navigate("/fleurs-de-la-semaine")}>Fleurs de la semaine</div>
                    <div className='home-top-buttons' onClick={() => navigate("")}>Commande sur mesure</div>
                </div>
            </div>
            <p>Je suis Emma, une fleuriste passionnée détenant un CAP et un BP en fleuristerie résidant dans le sud de la France (Hérault). En tant qu'artisan fleuriste, j'ai à cœur de créer des compositions florales pour vos événements, apportant une touche personnalisée pour toutes les occasions. Ma sensibilité ainsi que mon amour pour les fleurs se manifestent dans chacune de mes créations, offrant ainsi une touche spéciale à chaque arrangement floral.</p>

            <div className='home-text-and-img'>
                <img src='/bouquet-seche.jpg' alt="bouquet-arc-rose" className='home-img-tall' />
                <p>Je suis Emma, une fleuriste passionnée détenant un CAP et un BP en fleuristerie résidant dans le sud de la France (Hérault). En tant qu'artisan fleuriste, j'ai à cœur de créer des compositions florales pour vos événements, apportant une touche personnalisée pour toutes les occasions. Ma sensibilité ainsi que mon amour pour les fleurs se manifestent dans chacune de mes créations, offrant ainsi une touche spéciale à chaque arrangement floral.</p>
            </div>
            <p>Je suis Emma, une fleuriste passionnée détenant un CAP et un BP en fleuristerie résidant dans le sud de la France (Hérault). En tant qu'artisan fleuriste, j'ai à cœur de créer des compositions florales pour vos événements, apportant une touche personnalisée pour toutes les occasions. Ma sensibilité ainsi que mon amour pour les fleurs se manifestent dans chacune de mes créations, offrant ainsi une touche spéciale à chaque arrangement floral.</p>
            <p>Je suis Emma, une fleuriste passionnée détenant un CAP et un BP en fleuristerie résidant dans le sud de la France (Hérault). En tant qu'artisan fleuriste, j'ai à cœur de créer des compositions florales pour vos événements, apportant une touche personnalisée pour toutes les occasions. Ma sensibilité ainsi que mon amour pour les fleurs se manifestent dans chacune de mes créations, offrant ainsi une touche spéciale à chaque arrangement floral.</p>
        </div>
    );
}

export default Homepage;
