import React from 'react';
import { useNavigate } from 'react-router-dom';

import './headerAdmin.css';

function HeaderAdmin() {
    let navigate = useNavigate();

    return (
        <div id="header-admin">
            <div className='header-item' id="catag">
                <span>Catalogue</span>
                <div className="admin-header-dropdowm" id='catag-dropdown'>
                    <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/fleurs-sechees") }}>Fleurs séchées</p>
                    <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                </div>
            </div>
            <div className='header-item' id="inspi">
                <span onClick={() => { navigate("/admin/inspirations") }}>Inspirations</span>
                <div className="admin-header-dropdowm" id="inspi-dropdown">
                    <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/mariage") }}>Mariage</p>
                    <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/deuil") }}>Deuil</p>
                    <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                    <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/naissance") }}>Naissance</p>
                </div>
            </div>
            <p className='header-item' onClick={() => { navigate("/admin/evenements") }}>Évènements</p>
            <p className='header-item' onClick={() => { navigate("/admin/informations") }}>Informations</p>
        </div>
    );
}

export default HeaderAdmin;
