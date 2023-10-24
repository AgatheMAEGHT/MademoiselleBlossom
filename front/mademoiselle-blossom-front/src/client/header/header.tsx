import React from 'react';

import logo from '../../logo.svg';

import './header.css';

function Header() {
    let evnt: boolean = true;

    return (
        <div id="header">
            <img src={logo} id="header-logo" alt="logo" />
            <p>Mademoiselle Blossom</p>
            <p>Catalogue</p>
            <p>Inspirations</p>
            {evnt && <p>Évènement</p>}
        </div>
    );
}

export default Header;
