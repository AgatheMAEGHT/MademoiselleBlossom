import React from 'react';

import { useNavigate } from 'react-router-dom';

import './profile.css';

function Profile() {
    let navigate = useNavigate();

    function logout() {
        localStorage.removeItem('logged');
        localStorage.removeItem('access_token');
        localStorage.removeItem('expire_date');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        navigate('/');
    }

    return (
        <div id="profile">
            <h2>Mon compte</h2>
            <div className='profile-container'>
                <h3>Informations personnelles</h3>
                <div id="profile-container-infos">
                    <div className="profile-container-info">
                        <label htmlFor="text">Prénom</label>
                        <label htmlFor="text">Nom</label>
                        <label htmlFor="email">Email</label>
                        <label htmlFor='phone'>Téléphone</label>
                    </div>
                    <div className="profile-container-info">
                        <label htmlFor="text">{localStorage.getItem('firstName')}</label>
                        <label htmlFor="text">{localStorage.getItem('lastName')}</label>
                        <label htmlFor="text">{localStorage.getItem('email')}</label>
                        <label htmlFor="text">{localStorage.getItem('phone')}</label>
                    </div>
                </div>
            </div>
            <div className='profile-container'>
                <h3>Adresse de livraison</h3>
            </div>
            <button onClick={logout} className='profile-button'>Se déconnecter</button>
        </div>
    );
}

export default Profile;
