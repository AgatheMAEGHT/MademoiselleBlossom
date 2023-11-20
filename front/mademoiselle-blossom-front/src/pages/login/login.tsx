import React from 'react';

import { useNavigate } from 'react-router-dom';

import './login.css';

function Login() {
    let navigate = useNavigate();

    function login() { }


    return (
        <div id="login">
            <div className="login-container">
                <h1 id="login-container-title">Se connecter</h1>
                <div id="login-container-inputs">
                    <div className="login-container-input">
                        <label htmlFor="email">Email</label>
                        <label htmlFor="password">Mot de passe</label>
                    </div>
                    <div className="login-container-input">
                        <input type="text" name="email" id="email" />
                        <input type="password" name="password" id="password" />
                    </div>
                </div>
                <p onClick={() => login()} className='login-container-button-text'>Mot de passe oublié</p>
                <button onClick={() => login()} className='login-container-button'>Se connecter</button>
            </div>
            <div className="login-container">
                <p>Vous n'avez pas de compte ?</p>
                <button onClick={() => navigate("/creer-un-compte")} className='login-container-button'>Créer un compte</button>
            </div>
        </div>
    );
}

export default Login;
