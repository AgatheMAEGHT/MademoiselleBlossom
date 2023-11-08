import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../../Mademoiselle_blossom_fit.png';

import './headerAdmin.css';

function HeaderAdmin() {
    let navigate = useNavigate();

    return (
        <div id="header">
            <div id="header-top">
                <div id="header-logo-area">
                    <img src={logo} id="header-logo" className='header-item' alt="logo" onClick={() => { navigate("/admin") }} />
                    <h1 id="header-name">Mademoiselle Blossom Admin</h1>
                </div>
            </div>
            <div id="header-buttons">
                <div className='header-item' id="catag">
                    <span>Catalogue</span>
                    <div className="header-dropdowm" id='catag-dropdown'>
                        <p className='header-dropdown-item' onClick={() => { navigate("/admin/fleur-sechees") }}>Fleurs séchées</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/admin/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                    </div>
                </div>
                <div className='header-item' id="inspi">
                    <span onClick={() => { navigate("/admin/inspirations") }}>Inspirations</span>
                    <div className="header-dropdowm" id="inspi-dropdown">
                        <p className='header-dropdown-item' onClick={() => { navigate("/admin/inspirations/mariage") }}>Mariage</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/admin/inspirations/deuil") }}>Deuil</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                        <p className='header-dropdown-item' onClick={() => { navigate("/admin/inspirations/naissance") }}>Naissance</p>
                    </div>
                </div>
                <p className='header-item' onClick={() => { navigate("/admin/evenements") }}>Évènements</p>
                <p className='header-item' onClick={() => { navigate("/admin/informations") }}>Informations</p>
            </div>
        </div>
    );
}

export default HeaderAdmin;
