import React from 'react';

import { useNavigate } from 'react-router-dom';

import './profile.css';
import { requester } from '../../components/requester';

function Profile() {
    let navigate = useNavigate();
    let [passwordChange, setPasswordChange] = React.useState<any>({
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
    });

    function changePassword() {
        if (passwordChange.oldPassword === '' || passwordChange.newPassword === '' || passwordChange.newPasswordRepeat === '') {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (passwordChange.newPassword !== passwordChange.newPasswordRepeat) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        // Change password
        requester('/user/password', 'PUT', passwordChange).then((res: any) => {
            console.log(res);
            if (res.msg !== undefined && res.msg === 'User password changed') {
                alert('Mot de passe changé');
            } else {
                alert('Erreur lors du changement de mot de passe');
            }
        });
    }

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
                <h3>Changer de mot de passe</h3>
                <div id="profile-container-infos">
                    <div className="login-container-input">
                        <div className='login-container-input-element'>
                            <label htmlFor="password">Ancien mot de passe</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="password">Nouveau mot de passe</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="password">Confirmer le nouveau mot de passe</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                    </div>

                    <div className="login-container-input">
                        <input value={passwordChange.oldPassword} onChange={e => setPasswordChange({ ...passwordChange, oldPassword: e.target.value })} type="password" name="password" id="password" />
                        <input value={passwordChange.newPassword} onChange={e => setPasswordChange({ ...passwordChange, newPassword: e.target.value })} type="password" name="passwordRepeat" id="password" />
                        <input value={passwordChange.newPasswordRepeat} onChange={e => setPasswordChange({ ...passwordChange, newPasswordRepeat: e.target.value })} type="password" name="passwordRepeat" id="passwordRepeat" />
                    </div>
                </div>
                <button onClick={changePassword} className='login-container-button'>Changer le mot de passe</button>
            </div>
            {/*<div className='profile-container'>
                <h3>Adresse de livraison</h3>
    </div>*/}
            <button onClick={logout} className='profile-button'>Se déconnecter</button>
        </div>
    );
}

export default Profile;
