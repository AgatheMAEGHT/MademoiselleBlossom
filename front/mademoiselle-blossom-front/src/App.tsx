import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import HomepageAdmin from './pages/admin/homepage/homepageAdmin';
import CatalogAdmin from './pages/admin/catalog/catalog';
import WeekAdmin from './pages/admin/week/week';
import EventsAdmin from './pages/admin/events/eventsAdmin';

import Homepage from './pages/homepage/homepage';

import "./App.css"
import "./pages/admin/_components/style.css"
import HeaderAdmin from './pages/admin/_components/header/headerAdmin';
import HeaderTop from './components/header/header-top';

function App() {
    let isAdmin: Boolean = true;

    return (
        <div id='app'>
            <HeaderTop />
            {isAdmin ?
                <HeaderAdmin />
                :
                <Header />
            }

            <Routes >
                {/* Admin */}
                {isAdmin && <>
                    <Route path='/admin' element={<HomepageAdmin />} />
                    <Route path='/admin/fleurs-sechees' element={<CatalogAdmin />} />
                    <Route path='/admin/fleurs-de-la-semaine' element={<WeekAdmin />} />
                    <Route path='/admin/evenements' element={<EventsAdmin />} />
                </>}

                {/* Client */}
                <Route path='/' element={<Homepage />} />
                <Route path='/catalogue' element={<Homepage />} />
                <Route path='/fleurs-sechees' element={<Homepage />} />
                <Route path='/fleurs-de-la-semaine' element={<Homepage />} />
                <Route path='/inspirations' element={<Homepage />} />
                <Route path='/inspirations/mariages' element={<Homepage />} />
                <Route path='/inspirations/deuil' element={<Homepage />} />
                <Route path='/inspirations/anniversaire' element={<Homepage />} />
                <Route path='/inspirations/naissance' element={<Homepage />} />
                <Route path='/contact' element={<Homepage />} />
                <Route path='/a-propos' element={<Homepage />} />
                <Route path='/livraisons' element={<Homepage />} />
                <Route path='/cgv' element={<Homepage />} />
                <Route path='/mentions-legales' element={<Homepage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
