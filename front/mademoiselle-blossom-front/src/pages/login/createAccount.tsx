import React from 'react';

import { useNavigate } from 'react-router-dom';

import './login.css';

function CreateAccount() {
    let navigate = useNavigate();

    function createAccount() { }

    return (
        <div id="login">
            <div className="login-container">
                <h1 id="login-container-title">Créer un compte</h1>
                <div id="login-container-inputs">
                    <div className="login-container-input">
                        <label htmlFor="email">Email</label>
                        <label htmlFor="password">Mot de passe</label>
                        <label htmlFor="password">Confirmer le mot de passe</label>
                    </div>
                    <div className="login-container-input">
                        <input type="text" name="email" id="email" />
                        <input type="password" name="password" id="password" />
                        <input type="password" name="passwordRepeat" id="passwordRepeat" />
                    </div>
                </div>
                <button onClick={() => createAccount()} className='login-container-button'>Créer un compte</button>
            </div>
            <div className="login-container">
                <p>Vous avez déjà un compte ?</p>
                <button onClick={() => navigate("/se-connecter")} className='login-container-button'>Se connecter</button>
            </div>
        </div>
    );
}

export default CreateAccount;
