import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../Mademoiselle_blossom-transparent.png';

import './header.css';

function Header() {
    let navigate = useNavigate();

    let evnt: boolean = true;
    let evntName: string = "Fête des grand-mères";

    return (
        <div id="header">
            <div id="header-top">
                <div id="header-top-buttons">
                    <p className='header-top-button'>Mon compte</p>
                    <p className='header-top-button'>Panier</p>
                </div>
                <div id="header-logo-area">
                    <img src={logo} id="header-logo" className='header-item' alt="logo" onClick={() => { navigate("/") }} />
                    <h1 id="header-name">Mademoiselle Blossom</h1>
                </div>
            </div>
            <div id="header-buttons">
                <div className='header-item' id="catag">
                    <span>Catalogue</span>
                    <div className="header-dropdowm" id='catag-dropdown'>
                        <p className='header-dropdown-item' onClick={() => { navigate("/fleur-sechees") }}>Fleurs séchées</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                    </div>
                </div>
                <div className='header-item' id="inspi">
                    <span onClick={() => { navigate("/inspirations") }}>Inspirations</span>
                    <div className="header-dropdowm" id="inspi-dropdown">
                        <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/mariage") }}>Mariage</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/deuil") }}>Deuil</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/anniversaire") }}>Anniversaire</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/naissance") }}>Naissance</p>
                    </div>
                </div>
                {evnt && <p className='header-item'>{evntName}</p>}
                <p className='header-item' onClick={() => { navigate("/contact") }}>Contactez-moi</p>
            </div>
        </div>
    );
}

export default Header;
