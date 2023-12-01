import React from 'react';

import { useNavigate } from 'react-router-dom';

import './login.css';
import { requester } from '../../components/requester';

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
        if (profile.password !== profile.passwordRepeat) {
            alert('Les mots de passe ne sont pas identiques');
            return;
        }

        if (profile.firstName === '' || profile.lastName === '' || profile.email === '' || profile.password === '') {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        console.log(process.env.REACT_APP_API_URL);
        requester('/register', 'POST', profile).then((res: any) => {
            if (res.success) {
                console.log(res);
                localStorage.setItem('token', res.token);
                navigate('/');
            } else {
                if (res.message === 'Email already exists') {
                    alert('Cet email est déjà utilisé');
                    return;
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
        </div>
    );
}

export default CreateAccount;
