import React from 'react';

import { useNavigate } from 'react-router-dom';

import './login.css';
import { requester } from '../../components/requester';
import Alert, { displayAlert } from '../../components/alert/alert';
import { alertStatus } from '../../components/types';

function CreateAccount() {
    let navigate = useNavigate();
    let [profile, setProfile] = React.useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        passwordRepeat: ''
    });

    function createAccount() {
        if (profile.firstName === '' || profile.lastName === '' || profile.email === '' || profile.password === '') {
            displayAlert('create-account-mandatory');
            return;
        }

        if (profile.password !== profile.passwordRepeat) {
            displayAlert('create-account-identical-passwords');
            return;
        }

        requester('/register', 'POST', profile).then((res: any) => {
            if (res.access_token) {
                let d = new Date().setSeconds(new Date().getSeconds() + parseInt(res.expires_in) ?? 0);
                localStorage.setItem('logged', "client");
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('expire_date', d.toString());
                localStorage.setItem('refresh_token', res.refresh_token);

                // Get user infos
                requester('/who-am-i', 'GET').then((res2: any) => {
                    console.log(res2.isAdmin);
                    if (res2.isAdmin !== undefined) {
                        localStorage.setItem('logged', res2.isAdmin ? "admin" : "client");
                        localStorage.setItem('email', res2.email);
                        localStorage.setItem('phone', res2.phone);
                        localStorage.setItem('firstName', res2.firstName);
                        localStorage.setItem('lastName', res2.lastName);
                    } else {
                        console.log(res2);
                        displayAlert('create-account-error');
                    }
                    navigate('/');
                    window.location.reload();
                });
            } else {
                if (res.message === 'Wrong email or password') {
                    displayAlert('create-account-wrong-credentials');
                    return;
                }
                else {
                    console.log(res);
                    displayAlert('create-account-error');
                }
            }
        });
    }

    return (
        <div id="login">
            <div className="login-container">
                <h1 id="login-container-title">Créer un compte</h1>
                <div id="login-container-inputs">
                    <div className="login-container-input">
                        <div className='login-container-input-element'>
                            <label htmlFor="text">Prénom</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="text">Nom</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="email">Email</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="phone">Téléphone</label>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="password">Mot de passe</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                        <div className='login-container-input-element'>
                            <label htmlFor="password">Confirmer le mot de passe</label>
                            <p className='form-mandatory'>*</p>
                        </div>
                    </div>
                    <div className="login-container-input">
                        <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} type="text" name='firstname' id="firstname" />
                        <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} type="text" name='lastname' id="lastname" />
                        <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} type="email" name="email" id="email" />
                        <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} type="phone" name="phone" id="phone" />
                        <input value={profile.password} onChange={e => setProfile({ ...profile, password: e.target.value })} type="password" name="password" id="password" />
                        <input value={profile.passwordRepeat} onChange={e => setProfile({ ...profile, passwordRepeat: e.target.value })} type="password" name="passwordRepeat" id="passwordRepeat" />
                    </div>
                </div>
                <button onClick={() => createAccount()} className='login-container-button'>Créer un compte</button>
                <div className='login-container-input-element' id="login-container-element-mandatory">
                    <p className='form-mandatory'>*</p>
                    <p id="form-mandatory-text">Champs obligatoires</p>
                </div>
            </div>
            <div className="login-container">
                <p>Vous avez déjà un compte ?</p>
                <button onClick={() => navigate("/se-connecter")} className='login-container-button'>Se connecter</button>
            </div>
            <Alert id='create-account-identical-passwords' message='Les mots de passe ne sont pas identiques' status={alertStatus.error} />
            <Alert id='create-account-mandatory' message='Les champs prénom, nom, email et mot de passe sont obligatoires' status={alertStatus.error} />
            <Alert id='create-account-error' message='Une erreur est survenue, merci de réessayer ultérieurement' status={alertStatus.error} />
            <Alert id='create-account-wrong-credentials' message='Email ou mot de passe incorrect' status={alertStatus.error} />
        </div>
    );
}

export default CreateAccount;
