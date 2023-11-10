import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../Mademoiselle_blossom-transparent.png';

import './header.css';

function HeaderTop() {
    let navigate = useNavigate();

    let evnt: boolean = true;
    let evntName: string = "Fête des grand-mères";

    return (
        <div id="header-top">
            <div id="header-top-buttons">
                <p className='header-top-button'>Mon compte</p>
                <p className='header-top-button'>Panier</p>
            </div>
            <div id="header-logo-area">
                <img src={logo} id="header-logo" className='header-item' alt="logo" onClick={() => { navigate("/") }} />
                <p id="header-name">Mademoiselle Blossom</p>
            </div>
        </div>
    );
}

export default HeaderTop;
