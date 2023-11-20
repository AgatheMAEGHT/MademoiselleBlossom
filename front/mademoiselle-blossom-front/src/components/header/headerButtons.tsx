import React from 'react';
import { useNavigate } from 'react-router-dom';

import { burgerHeader } from '../burgerHeader';

import './header.css';
import HeaderAdmin from '../../pages/admin/_components/header/headerAdmin';

function HeaderButtons() {
    let navigate = useNavigate();
    let logged: string | null = localStorage.getItem("logged");

    let evntName: string = "Fête des grand-mères";
    let evnt: boolean = true;

    return (
        <div id="header-buttons-area">
            <div id="header-buttons-pc">
                <div id="header-buttons">
                    <p className='header-item' onClick={() => { navigate("/fleurs-sechees") }}>Fleurs séchées</p>
                    <p className='header-item' onClick={() => { navigate("/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>

                    <div className='header-item' id="inspi">
                        <span onClick={() => { navigate("/inspirations") }}>Inspirations</span>
                        <div className="header-dropdowm" id="inspi-dropdown">
                            <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/mariage") }}>Mariage</p>
                            <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/deuil") }}>Deuil</p>
                            <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/anniversaire") }}>Anniversaire</p>
                            <p className='header-dropdown-item' onClick={() => { navigate("/inspirations/naissance") }}>Naissance</p>
                        </div>
                    </div>
                    {evnt && <div id="header-item-event">
                        <p className='header-item-bold'>Évènement</p>
                        <p className='header-item'>{evntName}</p>
                    </div>}
                    <p className='header-item' onClick={() => { navigate("/contact") }}>Contactez-moi</p>
                </div>
                {logged === "admin" && <HeaderAdmin />}
            </div>
            <div id="header-buttons-mobile">
                <div id="header-buttons-mobile-area">
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/fleurs-sechees") }}>Fleurs séchées</p>
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                    <hr className='header-lines' />
                    {evnt && <div id="header-item-event-small">
                        <p className='header-item-small'>{evntName}</p>
                        <p className='header-item-bold'>Évènement</p>
                    </div>}
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/inspirations") }}>Inspirations</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/mariage") }}>Mariage</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/deuil") }}>Deuil</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/anniversaire") }}>Anniversaire</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/naissance") }}>Naissance</p>
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/contact") }}>Contactez-moi</p>

                    <hr id='header-line-client-admin-separator' />

                    {logged === "admin" && <HeaderAdmin />}
                </div>
                <div id="header-hide-page" onClick={() => burgerHeader()}></div>
            </div>
        </div >
    );
}

export default HeaderButtons;
