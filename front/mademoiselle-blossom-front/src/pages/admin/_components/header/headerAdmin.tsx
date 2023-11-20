import React from 'react';
import { useNavigate } from 'react-router-dom';

import { burgerHeader } from '../../../../components/burgerHeader';

import './headerAdmin.css';

function HeaderAdmin() {
    let navigate = useNavigate();

    return (
        <div>
            <div id="header-admin-buttons">
                <div className='admin-header-item' id="inspi">
                    <span onClick={() => { navigate("/admin/informations") }}>Statistiques</span>
                </div>
                <div className='admin-header-item' id="inspi">
                    <span onClick={() => { navigate("/admin/informations") }}>Commandes</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/commandes/accueil") }}>En attente</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/commandes/contact") }}>Envoyés</p>
                    </div>
                </div>
                <div className='admin-header-item' id="catag">
                    <span onClick={() => { navigate("/admin/inspirations") }}>Catalogue</span>
                    <div className="admin-header-dropdowm" id='catag-dropdown'>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/fleurs-sechees") }}>Fleurs séchées</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                    </div>
                </div>
                <div className='admin-header-item' id="inspi">
                    <span onClick={() => { navigate("/admin/evenements") }}>Évènements</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements") }}>Gérer les évènements</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/noel") }}>Noël</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/st-valentin") }}>Saint Valentin</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/paques") }}>Pâques</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/toussaint") }}>Toussaint</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/meres") }}>Fête des mères</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/peres") }}>Fête des pères</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/grand-meres") }}>Fête des Grand-mères</p>
                    </div>
                </div>
                <div className='admin-header-item' id="inspi">
                    <span onClick={() => { navigate("/admin/inspirations") }}>Inspirations</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/mariage") }}>Mariage</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/deuil") }}>Deuil</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/naissance") }}>Naissance</p>
                    </div>
                </div>
                <div className='admin-header-item' id="inspi">
                    <span onClick={() => { navigate("/admin/informations") }}>Informations</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/informations/accueil") }}>Accueil</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/informations/contact") }}>Contact</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/informations/livraisons") }}>Livraisons</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/informations/a-propos") }}>À propos</p>
                    </div>
                </div>
            </div>
            <div id="header-buttons-mobile-admin">
                <p className='header-admin-item-small' onClick={() => { burgerHeader(); navigate("/admin/statistiques") }}>Statistiques</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small' onClick={() => { burgerHeader(); navigate("/admin/commandes") }}>Commandes</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/commandes/accueil") }}>En attente</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/commandes/contact") }}>Envoyés</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page'>Catalogue</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/fleurs-sechees") }}>Fleurs séchées</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small' onClick={() => { burgerHeader(); navigate("/admin/inspirations") }}>Inspirations</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/mariage") }}>Mariage</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/deuil") }}>Deuil</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/naissance") }}>Naissance</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page'>Évènements</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements") }}>Gérer les évènements</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/noel") }}>Noël</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/st-valentin") }}>Saint Valentin</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/paques") }}>Pâques</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/toussaint") }}>Toussaint</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/meres") }}>Fête des mères</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/peres") }}>Fête des pères</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/grand-meres") }}>Fête des Grand-mères</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small' onClick={() => { burgerHeader(); navigate("/admin/informations") }}>Informations</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/accueil") }}>Accueil</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/contact") }}>Contact</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/livraisons") }}>Livraisons</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/a-propos") }}>À propos</p>
            </div>
        </div>
    );
}

export default HeaderAdmin;
