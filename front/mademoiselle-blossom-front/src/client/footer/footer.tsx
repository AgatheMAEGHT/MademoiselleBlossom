import React from 'react';

import logo from '../../logo.svg';

import './footer.css';

function Footer() {
    return (
        <div id="footer">
            <img src={logo} id="footer-logo" alt="logo" />
            <div>
                <p>Livraisons</p>
                <p>À propos de Mademoiselle Blossom</p>
                <p>Contactez-moi</p>
            </div>
            <div>
                <p>Conditions Générales de Ventes</p>
                <p>Mentions légales</p>
            </div>
        </div>
    );
}

export default Footer;
