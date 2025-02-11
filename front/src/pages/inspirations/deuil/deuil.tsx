import React from 'react';

import MetaData from '../../../components/metaData';

import '../inspirations.css';

function Deuil() {
    // Src image in public folder
    return (
        <div id="inspiration">
            <MetaData title="Deuil" url="/inspirations/deuil" />
            <h1 className="page-title">Deuil</h1>

            <h3 className='inspirations-subtitle'><i>Les fleurs sont les mots muets de l'amour, de la compassion et du réconfort.</i></h3>

            <p className='inspirations-text'>La boutique Mademoiselle Blossom vous accompagne dans ces moments délicats de la vie avec des créations florales adaptées, empreintes de douceur et de réconfort.</p>

            <div className='inspirations-horizontal-area'>
                <img src='/inspirations/deuil/couronne-orange.jpg' alt="couronne-orange" className='inspiration-image inspirations-horizontal' id="bouquet-orange" />
                <div className='inspirations-horizontal-line'>
                    <img src='/inspirations/deuil/couronne-rouge-blanc.jpg' alt="couronne-rouge-blanc" className='inspiration-image' />
                    <img src='/inspirations/deuil/croix-orange2.jpg' alt="croix-orange" className='inspiration-image' />
                    <img src='/inspirations/deuil/coeur-orange.jpg' alt="coeur-orange" className='inspiration-image' />
                </div>
            </div>

            <p className='inspirations-text'>Je suis à votre écoute pour vous accompagner au mieux dans le choix des fleurs, des créations ainsi que des couleurs en fonction de vos besoins. En ces instants, laissez les fleurs exprimer ce que les mots ne peuvent pas dire.</p>

            <div className="inspirations-horizontal-two-images-area">
                <img src='/inspirations/deuil/coeur-blanc.jpg' alt="coeur-blanc" className='inspiration-image inspirations-horizontal-two-images' />
                <img src='/inspirations/deuil/couronne-blanc.jpg' alt="couronne-blanc" className='inspiration-image inspirations-horizontal-two-images' />
            </div>

            <p className='inspirations-text'>Afin que vous puissiez envisager sereinement les arrangements floraux de la cérémonie, je vous invite à me contacter à votre convenance pour un devis personnalisé gratuit.</p>

            <div className="inspirations-vertical-stack-area">
                <img src='/inspirations/deuil/couronne-rouge-blanc-nom.jpg' alt="couronne-rouge-blanc-nom" className='inspiration-image inspirations-vertical-stack-main' />
                <div className='inspirations-vertical-stack'>
                    <img src='/inspirations/deuil/couronne-rouge2.jpg' alt="couronne-rouge2" className='inspiration-image' />
                    <img src='/inspirations/deuil/couronne-rouge.jpg' alt="couronne-rouge" className='inspiration-image' />
                </div>
            </div>
        </div>
    );
}

export default Deuil;