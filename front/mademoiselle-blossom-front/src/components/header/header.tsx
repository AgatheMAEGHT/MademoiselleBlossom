import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../Mademoiselle_blossom-transparent.png';

import { burgerHeader } from '../burgerHeader';

import './header.css';

function Header() {
    let isLogged: string | null = localStorage.getItem("logged");
    let navigate = useNavigate();

    return (
        <div id="header">
            <div id="header-top">
                <div id="header-top-buttons">
                    <div>
                        <img onClick={() => (burgerHeader())} className='header-top-button' id='header-top-button-burger' src='/icons/burger.svg' />
                    </div>
                    <div id="header-top-buttons-right">
                        {isLogged === "none" ?
                            <p onClick={()=> navigate("/se-connecter")} className='header-top-button'>Se connecter</p> :
                            <p className='header-top-button'>Mon compte</p>
                        }
                        <p className='header-top-button'>Panier</p>
                    </div>
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
