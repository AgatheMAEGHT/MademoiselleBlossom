import React from 'react';

import './homepageAdmin.css';
import HeaderAdmin from '../_components/header/headerAdmin';

function HomepageAdmin() {

    return (
        <div id="admin">
            <HeaderAdmin />
            <h1>Bienvenue sur la page admin</h1>
            <p>C'est la page sur laquelle tu peux modifier ton site</p>
        </div>
    );
}

export default HomepageAdmin;
