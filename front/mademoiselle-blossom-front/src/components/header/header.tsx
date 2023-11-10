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
            <div id="header-buttons">
                <div className='header-item' id="catag">
                    <span>Catalogue</span>
                    <div className="header-dropdowm" id='catag-dropdown'>
                        <p className='header-dropdown-item' onClick={() => { navigate("/fleurs-sechees") }}>Fleurs séchées</p>
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
                {evnt && <div id="header-item-event">
                    <p className='header-item-bold'>Évènement</p>
                    <p className='header-item'>{evntName}</p>
                </div>}
                <p className='header-item' onClick={() => { navigate("/contact") }}>Contactez-moi</p>
            </div>
        </div>
    );
}

export default Header;
