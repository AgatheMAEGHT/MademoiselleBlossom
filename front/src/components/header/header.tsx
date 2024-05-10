import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../Mademoiselle_blossom-transparent.png';

import { burgerHeader } from '../burgerHeader';

import './header.css';

function Header() {
    let logged: string | null = localStorage.getItem("logged");
    let navigate = useNavigate();

    // Remove burger menu when resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            burgerHeader(true);
        }
    });

    return (
        <div id="header">
            <div id="header-top">
                <div id="header-top-buttons">
                    <div>
                        <img onClick={() => (burgerHeader())} className='header-top-button' id='header-top-button-burger' src='/icons/burger.svg' alt='burger menu' />
                    </div>
                    {!logged || logged === "" ?
                        <div id="header-top-buttons-right">
                            <a href="/se-connecter" className='header-top-button link'>Se connecter</a>
                            {/*<a className='header-top-button'>Mon panier</a>*/}
                        </div>
                        :
                        <div id="header-top-buttons-right">
                            <a href="/mon-compte" className='header-top-button header-top-button-withicon link'>
                                Mon compte
                                <img
                                    className='header-top-button-icon'
                                    src={"/icons/profile.svg"}
                                    id="header-button-profile"
                                />
                            </a>
                            <a href="/favoris" className='header-top-button header-top-button-withicon link'>
                                Mes favoris
                                <img
                                    className='header-top-button-icon'
                                    src={"/icons/heart_full.svg"}
                                />
                            </a>
                            {/*<a href="/panier" className='header-top-button header-top-button-withicon link'>
                                Mon panier
                                <img
                                    className='header-top-button-icon'
                                    src={"/icons/cart.svg"}
                                    id="header-button-cart"
                                />
    </a>*/}
                        </div>
                    }
                </div>
                <div id="header-logo-area">
                    <a href='/'>
                        <img src={logo} id="header-logo" className='header-item' alt="logo" onClick={() => { navigate("/"); }} />
                    </a>
                    <p id="header-name">Mademoiselle Blossom</p>
                </div>
            </div>
        </div>
    );
}

export default Header;
