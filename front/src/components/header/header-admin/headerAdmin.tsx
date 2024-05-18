import React from 'react';
import { useNavigate } from 'react-router-dom';

import { burgerHeader } from '../../burgerHeader';

import './headerAdmin.css';

function HeaderAdmin() {
    let navigate = useNavigate();

    // Remove burger menu when resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            burgerHeader(true);
        }
    });

    return (
        <div>
            <div id="header-admin-buttons">
                {/*<div className='admin-header-item' id="inspi">
                    <a href="/admin" className='link'>Statistiques</a>
                </div>
                <div className='admin-header-item' id="inspi">
                    <span>Commandes</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <a className='admin-header-dropdown-item link' href="/admin/commandes/accueil">En attente</a>
                        <a className='admin-header-dropdown-item link' href="/admin/commandes/contact">Envoyés</a>
                    </div>
    </div>*/}

                <a href="/admin/fleurs-de-la-semaine" className='admin-header-item link'>Fleurs de la semaine</a>
                <a href="/admin/fleurs-sechees" className='admin-header-item link'>Fleurs séchées</a>

                <a href="/admin/evenements" className='admin-header-item link'>Évènements</a>

                <a href="/admin/components" className='admin-header-item link'>Éléments</a>
            </div>

            <div id="header-buttons-mobile-admin">
                {/* <p className='header-admin-item-small' onClick={() => { burgerHeader(); navigate("/admin") }}>Statistiques</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page'>Commandes</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/commandes/accueil") }}>En attente</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/commandes/contact") }}>Envoyés</p> */}
                {/* <hr className='header-admin-lines' /> */}
                <p className='header-admin-item-small header-admin-item-small-no-page'>Catalogue</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/fleurs-sechees"); }}>Fleurs séchées</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/fleurs-de-la-semaine"); }}>Fleurs de la semaine</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page' onClick={() => { burgerHeader(); navigate("/admin/evenements"); }}>Évènements</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page' onClick={() => { burgerHeader(); navigate("/admin/components"); }}>Éléments</p>
            </div>
        </div>
    );
}

export default HeaderAdmin;
