import React from 'react';

import '../inspirations.css';

function Mariage() {
    // Src image in public folder
    return (
        <div id="inspiration">
            <h1 className='page-title'>Mariage</h1>
            <h3 className='inspirations-subtitle'><i>Sublimez votre mariage avec des créations uniques</i></h3>
            <div className="inspirations-vertical-stack-area">
                <img src='/inspirations/mariage/coeur1.jpg' alt="coeur1" className='inspiration-image inspirations-vertical-stack-main' />
                <div className='inspirations-vertical-stack'>
                    <img src='/inspirations/mariage/bouquet-arc-rose.jpg' alt="bouquet-arc-rose" className='inspiration-image' />
                    <img src='/inspirations/mariage/bouquet-rose-pale.jpg' alt="bouquet-rose-pale" className='inspiration-image' />
                </div>
            </div>

            <p className='inspirations-text'>La boutique Mademoiselle Blossom vous accompagne dans l'un des moments les plus important de votre vie. Chaque mariage est unique, c'est pour cela que je m'engage à créer des arrangements floraux qui reflètent votre style, votre personnalité et votre histoire.</p>

            <div className='inspirations-vertical-tripanel'>
                <div className='inspirations-vertical-tripanel-stack'>
                    <img src='/inspirations/mariage/bouquet-rose.jpg' alt="bouquet-rose" className='inspiration-image' />
                    <img src='/inspirations/mariage/broche-rose.jpg' alt="broche-rose" className='inspiration-image' />
                </div>
                <img src='/inspirations/mariage/courone-tete1.jpg' alt="courone-tete1" className='inspiration-image inspiration-vertical-tripanel-tall' />
                <img src='/inspirations/mariage/courone-tete2.jpg' alt="courone-tete2" className='inspiration-image inspiration-vertical-tripanel-tall' />
            </div>

            <div className='inspirations-vertical-tripanel'>
                <div className='inspirations-vertical-tripanel-stack'>
                    <img src='/inspirations/mariage/courone.jpg' alt="broche-rose" className='inspiration-image' />
                    <img src='/inspirations/mariage/bouquet-blanc-gros.jpg' alt="bouquet-blanc-gros" className='inspiration-image' />
                </div>
                <img src='/inspirations/mariage/panier1.jpg' alt="panier1" className='inspiration-image inspiration-vertical-tripanel-tall' />
                <div className='inspirations-vertical-tripanel-stack'>
                    <img src='/inspirations/mariage/bouquet-blanc.jpg' alt="bouquet-blanc" className='inspiration-image' />
                    <img src='/inspirations/mariage/panier2.jpg' alt="panier2" className='inspiration-image' />
                </div>
            </div>

            <p className='inspirations-text'>Les créations florales ne se résument pas qu'à de simples bouquets. Chaque petit détail compte pour créer votre jour parfait, des arches aux compositions de tables en passant par les boutonnières, les couronnes qui habillerons vos têtes et les peignes fleuris, je travaille avec vous pour donner vie à vos visions.</p>

            <div className="inspirations-vertical-stack-area">
                <div className='inspirations-vertical-stack'>
                    <img src='/inspirations/mariage/bouquet-rose-petit.jpg' alt="bouquet-rose-petit" className='inspiration-image' />
                    <img src='/inspirations/mariage/bouquet-rose-fonce.jpg' alt="bouquet-rose-fonce" className='inspiration-image' />
                </div>
                <img src='/inspirations/mariage/table-rose.jpg' alt="table-rose" className='inspiration-image inspirations-vertical-stack-main' />
            </div>

            <div className='inspirations-horizontal-line'>
                <img src='/inspirations/mariage/bouquet-blanc2.jpg' alt="bouquet-blanc2" className='inspiration-image' />
                <img src='/inspirations/mariage/broche-blanche.jpg' alt="broche-blanche" className='inspiration-image' />
                <img src='/inspirations/mariage/bouquet-rose-blanc.jpg' alt="bouquet-rose-blanc" className='inspiration-image' />
            </div>

            <p className='inspirations-text'>Pour commencer à planifier votre mariage et vos envies avec un devis personnalisé gratuit, je vous invite à me contacter à votre convenance.</p>

            <div className='inspirations-horizontal-area'>
                <img src='/inspirations/mariage/bouquet-orange.jpg' alt="bouquet-orange" className='inspiration-image inspirations-horizontal' id="bouquet-orange" />
                <div className='inspirations-horizontal-line'>
                    <img src='/inspirations/mariage/bouquet-sophistique.jpg' alt="bouquet-sophistique" className='inspiration-image' />
                    <img src='/inspirations/mariage/bouquet-couleurs.jpg' alt="bouquet-couleurs" className='inspiration-image' />
                    <img src='/inspirations/mariage/bouquet-rose-blanc2.jpg' alt="bouquet-rose-blanc2" className='inspiration-image' />
                </div>
            </div>


            <div className='inspirations-vertical-bipanel'>
                <img src='/inspirations/mariage/bouquet-blanc-beige.png' alt="bouquet-blanc-beige" className='inspiration-image inspiration-vertical-bipanel-tall' />
                <img src='/inspirations/mariage/broche-jaune.png' alt="broche-jaune" className='inspiration-image' />
            </div>

        </div>
    );
}

export default Mariage;