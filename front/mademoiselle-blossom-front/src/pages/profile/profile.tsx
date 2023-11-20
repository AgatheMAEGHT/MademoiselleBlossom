import React from 'react';

import { useNavigate } from 'react-router-dom';

import { requester } from '../../components/requester';

import './profile.css';

function Profile() {
    let navigate = useNavigate();

    function logout() {
        localStorage.setItem('logged', "none");
        localStorage.setItem('access_token', "");
        localStorage.setItem('expire_date', "");
        localStorage.setItem('refresh_token', "");
        localStorage.setItem('email', "");
        localStorage.setItem('phone', "");
        localStorage.setItem('firstName', "");
        localStorage.setItem('lastName', "");
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
