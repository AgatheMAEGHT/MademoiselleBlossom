import React from 'react';
import { useNavigate } from 'react-router-dom';

import { burgerHeader } from '../burgerHeader';

import './header.css';
import HeaderAdmin from './header-admin/headerAdmin';
import { requester } from '../../components/requester';

function HeaderButtons() {
    let navigate = useNavigate();
    let logged: string | null = localStorage.getItem("logged");

    React.useEffect(() => {
        requester('/current-event', 'GET')
            .then((res: any) => {
                setEvntName(res[0].name);
            });
    }, []);

    const [evntName, setEvntName] = React.useState('');

    return (
        <div id="header-buttons-area">
            <div id="header-buttons-pc">
                <div id="header-buttons">
                    <a className='header-item link' href="/fleurs-de-la-semaine">Fleurs de la semaine</a>
                    <a className='header-item link' href="/fleurs-sechees">Fleurs séchées</a>

                    <div className='header-item' id="inspi">
                        <a className='header-item link' href="/inspirations">Inspirations</a>
                        <div className="header-dropdowm" id="inspi-dropdown">
                            <a className='header-dropdown-item link' href="/inspirations/mariage">Mariage</a>
                            <a className='header-dropdown-item link' href="/inspirations/deuil">Deuil</a>
                            {/*<a className='header-dropdown-item link' href="/inspirations/anniversaire">Anniversaire</a>
                            <a className='header-dropdown-item link' href="/inspirations/naissance">Naissance</a>*/}
                        </div>
                    </div>
                    {(evntName !== '') && <div id="header-item-event">
                        <p className='header-item-bold'>Évènement</p>
                        <a className='header-item link' id='header-item-event-button' href={'/' + evntName.replaceAll(" ", "_")}>{evntName}</a>
                    </div>}
                    <a className='header-item link' href="/contact">Contactez-moi</a>
                </div>
                {logged === "admin" && <HeaderAdmin />}
            </div>
            <div id="header-buttons-mobile">
                <div id="header-buttons-mobile-area">
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/"); }}>Accueil</p>
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/fleurs-sechees"); }}>Fleurs séchées</p>
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/fleurs-de-la-semaine"); }}>Fleurs de la semaine</p>
                    <hr className='header-lines' />
                    {(evntName !== '') && <div id="header-item-event-small">
                        <p className='header-item-small'>{evntName}</p>
                        <p className='header-item-bold'>Évènement</p>
                    </div>}
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/inspirations"); }}>Inspirations</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/mariage"); }}>Mariage</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/deuil"); }}>Deuil</p>
                    {/*<p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/anniversaire") }}>Anniversaire</p>
                    <p className='header-dropdown-item' onClick={() => { burgerHeader(); navigate("/inspirations/naissance") }}>Naissance</p>*/}
                    <hr className='header-lines' />
                    <p className='header-item-small' onClick={() => { burgerHeader(); navigate("/contact"); }}>Contactez-moi</p>

                    <hr id='header-line-client-admin-separator' />

                    {logged === "admin" && <HeaderAdmin />}
                </div>
                <div id="header-hide-page" onClick={() => burgerHeader()}></div>
            </div>
        </div >
    );
}

export default HeaderButtons;
