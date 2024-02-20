import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../inspirations.css';

function Deuil() {
    let navigate = useNavigate();
    // Src image in public folder
    return (
        <div id="mariage">
            <h1>Deuil</h1>

            <div className='inspirations-horizontal-area'>
                <img src='/inspirations/deuil/courone-orange.jpg' alt="courone-orange" className='inspiration-image inspirations-horizontal' id="bouquet-orange" />
                <div className='inspirations-horizontal-line'>
                    <img src='/inspirations/deuil/courone-rouge-blanc.png' alt="courone-rouge-blanc" className='inspiration-image' />
                    <img src='/inspirations/deuil/croix-orange.png' alt="croix-orange" className='inspiration-image' />
                    <img src='/inspirations/deuil/coeur-orange.jpg' alt="coeur-orange" className='inspiration-image' />
                </div>
            </div>

            <div className="inspirations-horizontal-two-images-area">
                <img src='/inspirations/deuil/coeur-blanc.jpg' alt="coeur-blanc" className='inspiration-image inspirations-horizontal-two-images' />
                <img src='/inspirations/deuil/courone-blanc.jpg' alt="courone-blanc" className='inspiration-image inspirations-horizontal-two-images' />
            </div>

            <div className="inspirations-vertical-stack-area">
                <img src='/inspirations/deuil/courone-rouge-blanc-nom.jpg' alt="courone-rouge-blanc-nom" className='inspiration-image inspirations-vertical-stack-main' />
                <div className='inspirations-vertical-stack'>
                    <img src='/inspirations/deuil/courone-rouge2.jpg' alt="courone-rouge2" className='inspiration-image' />
                    <img src='/inspirations/deuil/courone-rouge.jpg' alt="courone-rouge" className='inspiration-image' />
                </div>
            </div>
        </div>
    );
}

export default Deuil;