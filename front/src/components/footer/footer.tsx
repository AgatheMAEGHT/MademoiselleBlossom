import React from 'react';
import { useNavigate } from 'react-router-dom';

import './footer.css';

function Footer() {
    let navigate = useNavigate();

    return (
        <div id="footer">
            <div className='footer-col'>
                {/*<p className='footer-url' onClick={() => { navigate("/conditions-de-livraisons") }}>Livraisons</p>*/}
                <p className='footer-url' onClick={() => { navigate("/contact") }}>À propos de Mademoiselle Blossom</p>
            </div>
            <div className='footer-col'>
                {/*<p className='footer-url' onClick={() => { navigate("/cgv") }}>Conditions Générales de Ventes</p>*/}
                <p className='footer-url' onClick={() => { navigate("/legal") }}>Mentions légales</p>
            </div>
        </div>
    );
}

export default Footer;
