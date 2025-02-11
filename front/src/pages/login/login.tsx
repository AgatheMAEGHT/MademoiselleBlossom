import React from 'react';

import { useNavigate } from 'react-router-dom';

import { requester } from '../../components/requester';

import './login.css';
import Alert, { displayAlert } from '../../components/alert/alert';
import { alertStatus } from '../../components/types';
import MetaData from '../../components/metaData';

function Login() {
    let navigate = useNavigate();
    const [profile, setProfile] = React.useState<any>({
        email: '',
        password: '',
    });

    function login() {
        if (profile.email === '' || profile.password === '') {
            displayAlert('login-alert-mandatory');
            return;
        }

        requester('/login', 'POST', profile).then((res: any) => {
            if (res.access_token) {
                let d = new Date().setSeconds(new Date().getSeconds() + parseInt(res.expires_in) ?? 0);
                localStorage.setItem('logged', "client");
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('expire_date', d.toString());
                localStorage.setItem('refresh_token', res.refresh_token);

                // Get user infos
                requester('/who-am-i', 'GET').then((res2: any) => {
                    if (res2) {
                        localStorage.setItem('logged', res2.isAdmin ? "admin" : "client");
                        localStorage.setItem('firstName', res2.firstName);
                        localStorage.setItem('lastName', res2.lastName);
                        localStorage.setItem('email', res2.email);
                        localStorage.setItem('phone', res2.phone);
                        localStorage.setItem('user_id', res2._id);
                    } else {
                        displayAlert('login-alert-error');
                    }
                    navigate('/');
                    window.location.reload();
                });
            } else {
                if (res.err === 'Wrong email or password') {
                    displayAlert('login-wrong-credentials');
                    return;
                }
                else {
                    displayAlert('login-alert-error');
                }
            }
        });
    }

    return (
        <div id="login">
            <MetaData title="Se connecter" url="/se-connecter" />
            <div className="login-container">
                <h1 id="login-container-title">Se connecter</h1>
                <div id="login-container-inputs">
                    <div className="login-container-input">
                        <label htmlFor="email">Email</label>
                        <label htmlFor="password">Mot de passe</label>
                    </div>
                    <div className="login-container-input">
                        <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} type="text" name="email" id="email" />
                        <input value={profile.password} onChange={e => setProfile({ ...profile, password: e.target.value })} type="password" name="password" id="password" />
                    </div>
                </div>
                <p onClick={() => login()} className='login-container-button-text'>Mot de passe oublié</p>
                <button onClick={() => login()} className='login-container-button'>Se connecter</button>
            </div>
            <div className="login-container">
                <p>Vous n'avez pas de compte ?</p>
                <button onClick={() => navigate("/creer-un-compte")} className='login-container-button'>Créer un compte</button>
            </div>
            <Alert message="Veuillez remplir tous les champs obligatoires" id="login-alert-mandatory" status={alertStatus.error} />
            <Alert message="Une erreur est survenue, merci de réessayer ultérieurement" id="login-alert-error" status={alertStatus.error} />
            <Alert message="Email ou mot de passe incorrect" id="login-wrong-credentials" status={alertStatus.error} />
        </div>
    );
}

export default Login;
