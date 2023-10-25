import React from 'react';

import logo from '../../logo.svg';

import './header.css';

function Header() {
    let evnt: boolean = true;
    let evntName: string = "Fête des grand-mères";

    return (
        <div id="header">
            <div id="header-top"></div>
            <div id="header-buttons">
                <img src={logo} id="header-logo" className='header-item' alt="logo" />
                <p>Mademoiselle Blossom</p>
                <div className='header-item' id="catag">
                    <span>Catalogue</span>
                    <div className="header-dropdowm" id='catag-dropdown'>
                        <p className='header-dropdown-item'>Fleurs séchées</p>
                    </div>
                </div>
                <div className='header-item' id="inspi">
                    <span>Inspirations</span>
                    <div className="header-dropdowm" id="inspi-dropdown">
                        <p className='header-dropdown-item'>Mariage</p>
                        <p className='header-dropdown-item'>Deuil</p>
                        <p className='header-dropdown-item'>Anniversaire</p>
                        <p className='header-dropdown-item'>Naissance</p>
                    </div>
                </div>
                {evnt && <p className='header-item'>{evntName}</p>}
            </div>
        </div>
    );
}

export default Header;
