import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HeaderAdmin from './components/header/headerAdmin';
import FooterAdmin from './components/footer/footerAdmin';
import HomepageAdmin from './homepage/homepageAdmin';

import '../App.css';
import CatalogAdmin from './catalog/catalog';

function AppAdmin() {
    return (
        <div id="app">
            <HeaderAdmin />
            <Routes >
                <Route path='/' element={<HomepageAdmin />} />
                <Route path='/catalogue' element={<CatalogAdmin />} />
            </Routes>
            <FooterAdmin />
        </div>
    );
}

export default AppAdmin;
