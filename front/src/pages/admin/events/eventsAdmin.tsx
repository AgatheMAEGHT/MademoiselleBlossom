import React from 'react';

import './eventsAdmin.css';

function EventsAdmin() {

    return (
        <div id="admin-events" className='admin-page page'>
            <h1>Bienvenue sur la page admin - évènements</h1>
            <p>C'est la page sur laquelle tu peux modifier les évènements annuels</p>

            <div id="admin-events-select-area">
                <p>Évènement à afficher :</p>
                <select id="admin-events-select">
                    <option value="default">Aucun évènement</option>
                    <option value="someOption">Noël</option>
                    <option value="otherOption">Saint-Valentin</option>
                    <option value="otherOption">Pâques</option>
                    <option value="otherOption">Toussaint</option>
                    <option value="otherOption">Fête des mères</option>
                    <option value="otherOption">Fête des pères</option>
                    <option value="otherOption">Fête des grand-mères</option>
                </select>
            </div>
        </div>
    );
}

export default EventsAdmin;
