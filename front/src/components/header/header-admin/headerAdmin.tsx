import React from 'react';
import { useNavigate } from 'react-router-dom';

import { burgerHeader } from '../../burgerHeader';

import './headerAdmin.css';

function HeaderAdmin() {
    let navigate = useNavigate();

    return (
        <div>
            <div id="header-admin-buttons">
                <div className='admin-header-item' id="inspi">
                    <a href="/admin" className='link'>Statistiques</a>
                </div>
                <div className='admin-header-item' id="inspi">
                    <span>Commandes</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <a className='admin-header-dropdown-item link' href="/admin/commandes/accueil">En attente</a>
                        <a className='admin-header-dropdown-item link' href="/admin/commandes/contact">Envoyés</a>
                    </div>
                </div>
                <div className='admin-header-item' id="catag">
                    <span>Catalogue</span>
                    <div className="admin-header-dropdowm" id='catag-dropdown'>
                        <a href="/admin/fleurs-sechees" className='admin-header-dropdown-item link'>Fleurs séchées</a>
                        <a className='admin-header-dropdown-item link' href="/admin/fleurs-de-la-semaine">Fleurs de la semaine</a>
                    </div>
                </div>
                {/*<div className='admin-header-item' id="inspi">
                    <span>Inspirations</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/mariage") }}>Mariage</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/deuil") }}>Deuil</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/inspirations/naissance") }}>Naissance</p>
                    </div>
    </div>*/}
                <div className='admin-header-item' id="inspi">
                    <a href="/admin/evenements" className='link'>Évènements</a>
                    {/*<div className="admin-header-dropdowm" id="inspi-dropdown">
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements") }}>Gérer les évènements</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/noel") }}>Noël</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/st-valentin") }}>Saint Valentin</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/paques") }}>Pâques</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/toussaint") }}>Toussaint</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/meres") }}>Fête des mères</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/peres") }}>Fête des pères</p>
                        <p className='admin-header-dropdown-item' onClick={() => { navigate("/admin/evenements/grand-meres") }}>Fête des Grand-mères</p>
</div>*/}
                </div>
                <div className='admin-header-item' id="inspi">
                    <span>Informations</span>
                    <div className="admin-header-dropdowm" id="inspi-dropdown">
                        <a className='admin-header-dropdown-item link' href="/admin/informations/accueil">Accueil</a>
                        <a className='admin-header-dropdown-item link' href="/admin/informations/contact">Contact</a>
                        <a className='admin-header-dropdown-item link' href="/admin/informations/livraisons">Livraisons</a>
                        <a className='admin-header-dropdown-item link' href="/admin/informations/a-propos">À propos</a>
                    </div>
                </div>
            </div>

            <div id="header-buttons-mobile-admin">
                <p className='header-admin-item-small' onClick={() => { burgerHeader(); navigate("/admin") }}>Statistiques</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page'>Commandes</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/commandes/accueil") }}>En attente</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/commandes/contact") }}>Envoyés</p>
                <hr className='header-admin-lines' />
                <p className='header-admin-item-small header-admin-item-small-no-page'>Catalogue</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/fleurs-sechees") }}>Fleurs séchées</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/fleurs-de-la-semaine") }}>Fleurs de la semaine</p>
                <hr className='header-admin-lines' />
                {/*<p className='header-admin-item-small header-admin-item-small-no-page'>Inspirations</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/mariage") }}>Mariage</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/deuil") }}>Deuil</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/anniversaire") }}>Anniversaire</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/inspirations/naissance") }}>Naissance</p>
<hr className='header-admin-lines' />*/}
                <p className='header-admin-item-small header-admin-item-small-no-page'>Évènements</p>
                {/*<p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements") }}>Gérer les évènements</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/noel") }}>Noël</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/st-valentin") }}>Saint Valentin</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/paques") }}>Pâques</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/toussaint") }}>Toussaint</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/meres") }}>Fête des mères</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/peres") }}>Fête des pères</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/evenements/grand-meres") }}>Fête des Grand-mères</p>
<hr className='header-admin-lines' />*/}
                <p className='header-admin-item-small header-admin-item-small-no-page'>Informations</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/accueil") }}>Accueil</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/contact") }}>Contact</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/livraisons") }}>Livraisons</p>
                <p className='header-admin-dropdown-item' onClick={() => { burgerHeader(); navigate("/admin/informations/a-propos") }}>À propos</p>
            </div>
        </div>
    );
}

export default HeaderAdmin;
