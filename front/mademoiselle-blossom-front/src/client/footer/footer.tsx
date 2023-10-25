import React from 'react';

import logo from '../../Mademoiselle_blossom_fit.png';

import './footer.css';

function Footer() {
    return (
        <div id="footer">
            <img src={logo} id="footer-logo" alt="logo" />
            <div className='footer-col'>
                <p className='footer-url'>Livraisons</p>
                <p className='footer-url'>À propos de Mademoiselle Blossom</p>
                <p className='footer-url'>Contactez-moi</p>
            </div>
            <div className='footer-col'>
                <p className='footer-url'>Conditions Générales de Ventes</p>
                <p className='footer-url'>Mentions légales</p>
            </div>
        </div>
    );
}

export default Footer;
