import React from 'react';

import './eventsAdmin.css';
import { requester } from '../../../components/requester';

function EventsAdmin() {
    const [selectedEvent, setSelectedEvent] = React.useState('Aucun évènement');

    React.useEffect(() => {
        requester('/current-event', 'GET')
            .then((res: any) => {
                setSelectedEvent(res[0].name);
            });
    }, []);

    function selectEvent(value: string) {
        setSelectedEvent(value);

        requester('/current-event/create', 'POST', { name: value })
            .then((res: any) => {
                if (res._id !== '') {
                    console.log('Évènement actuel modifié avec succès');
                } else {
                    console.error('Erreur lors de la modification de l\'évènement actuel');
                }
                window.location.reload();
            });
    }

    return (
        <div id="admin-events" className='admin-page page'>
            <h1>Admin - Évènements</h1>

            <div id="admin-events-select-area">
                <p>Évènement à afficher :</p>
                <select value={selectedEvent} onChange={e => selectEvent(e.target.value)} id="admin-events-select">
                    <option value="">Aucun évènement</option>
                    <option value="Noël">Noël</option>
                    <option value="Saint-Valentin">Saint-Valentin</option>
                    <option value="Pâques">Pâques</option>
                    <option value="Toussaint">Toussaint</option>
                    <option value="Fête des mères">Fête des mères</option>
                    <option value="Fête des pères">Fête des pères</option>
                    <option value="Fête des grand-mères">Fête des grand-mères</option>
                </select>
            </div>

            <h2>Catalogues</h2>
            <div id="admin-events-catalogs">
                <a className='admin-button' href="/admin/evenements/Saint-Valentin">Saint-Valentin</a>
                <a className='admin-button' href="/admin/evenements/Pâques">Pâques</a>
                <a className='admin-button' href="/admin/evenements/Fête_des_grand-mères">Fête des grand-mères</a>
                <a className='admin-button' href="/admin/evenements/Fête_des_mères">Fête des mères</a>
                <a className='admin-button' href="/admin/evenements/Fête_des_pères">Fête des pères</a>
                <a className='admin-button' href="/admin/evenements/Toussaint">Toussaint</a>
                <a className='admin-button' href="/admin/evenements/Noël">Noël</a>
            </div>
        </div>
    );
}

export default EventsAdmin;
