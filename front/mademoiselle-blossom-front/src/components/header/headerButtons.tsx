import React from 'react';
import { useNavigate } from 'react-router-dom';

import { burgerHeader } from '../burgerHeader';

import './header.css';
import HeaderAdmin from '../../pages/admin/_components/header/headerAdmin';

function HeaderButtons() {
    let navigate = useNavigate();
    let isAdmin: string | null = localStorage.getItem("admin");

    let evntName: string = "Fête des grand-mères";
    let evnt: boolean = true;

    return (
        <div id="header-buttons-area">
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
            {isAdmin && <HeaderAdmin />}
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

                    {isAdmin && <div id="header-buttons-mobile-admin">
                        <p className='header-admin-item-small' onClick={() => { navigate("/admin/inspirations") }}>Catalogue</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/fleurs-sechees") }}>Fleurs séchées</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                        <hr id='header-line-client-separator' />
                        <p className='header-admin-item-small' onClick={() => { navigate("/admin/inspirations") }}>Inspirations</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/inspirations/mariage") }}>Mariage</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/inspirations/deuil") }}>Deuil</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/inspirations/naissance") }}>Naissance</p>
                        <hr id='header-line-client-separator' />
                        <p className='header-admin-item-small' onClick={() => { navigate("/admin/evenements") }}>Évènements</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements") }}>Gérer les évènements</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/noel") }}>Noël</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/st-valentin") }}>Saint Valentin</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/paques") }}>Pâques</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/toussaint") }}>Toussaint</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/meres") }}>Fête des mères</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/peres") }}>Fête des pères</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/evenements/grand-meres") }}>Fête des Grand-mères</p>
                        <hr id='header-line-client-separator' />
                        <p className='header-admin-item-small' onClick={() => { navigate("/admin/informations") }}>Informations</p>
                        <p className='header-admin-dropdown-item' onClick={() => { navigate("/admin/inspirations/contact") }}>Contact</p>
                    </div>}
                </div>
                <div id="header-hide-page" onClick={() => burgerHeader()}></div>
            </div>
        </div >
    );
}

export default HeaderButtons;
