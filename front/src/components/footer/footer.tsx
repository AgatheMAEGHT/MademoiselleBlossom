import React from 'react';

import './footer.css';

function Footer() {
    return (
        <div id="footer">
            <div className='footer-col'>
                {/*<a className='footer-url' href="/conditions-de-livraison">Livraisons</a>*/}
                <a className='footer-url' href="/contact">À propos de Mademoiselle Blossom</a>
            </div>
            <div className='footer-col'>
                {/*<a className='footer-url' href="/cgv">Conditions Générales de Ventes</a>*/}
                <a className='footer-url' href="/mentions-legales">Mentions légales</a>
            </div>
        </div >
    );
}

export default Footer;
