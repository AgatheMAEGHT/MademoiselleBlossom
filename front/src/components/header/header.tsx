import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../Mademoiselle_blossom-transparent.png';

import { burgerHeader } from '../burgerHeader';

import './header.css';

function Header() {
    let logged: string | null = localStorage.getItem("logged");
    let navigate = useNavigate();

    return (
        <div id="header">
            <div id="header-top">
                <div id="header-top-buttons">
                    <div>
                        <img onClick={() => (burgerHeader())} className='header-top-button' id='header-top-button-burger' src='/icons/burger.svg' alt='burger menu' />
                    </div>
                    {!logged || logged === "" ?
                        <div id="header-top-buttons-right">
                            <p onClick={() => navigate("/se-connecter")} className='header-top-button'>Se connecter</p>
                            <p className='header-top-button'>Mon panier</p>
                        </div>
                        :
                        <div id="header-top-buttons-right">
                            <p onClick={() => navigate("/mon-compte")} className='header-top-button'>Mon compte</p>
                            <p onClick={() => navigate("/favoris")} className='header-top-button' id="header-top-button-withicon">
                                Mes favoris
                                <img
                                    className='header-top-button-icon'
                                    src={"/icons/heart_full.svg"}
                                    alt="ajouter aux favoris"
                                    onClick={() => navigate("/favoris")}
                                /></p>
                            <p className='header-top-button'>Mon panier</p>
                        </div>
                    }
                </div>
                <div id="header-logo-area">
                    <img src={logo} id="header-logo" className='header-item' alt="logo" onClick={() => { navigate("/") }} />
                    <p id="header-name">Mademoiselle Blossom</p>
                </div>
            </div>
        </div>
    );
}

export default Header;
