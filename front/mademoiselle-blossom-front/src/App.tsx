import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HeaderTop from './components/header/header-top';

import Header from './components/header/header';
import HeaderButtons from './components/header/headerButtons';
import Footer from './components/footer/footer';
import Homepage from './pages/homepage/homepage';

import HeaderAdmin from './pages/admin/_components/header/headerAdmin';
import HomepageAdmin from './pages/admin/homepage/homepageAdmin';
import CatalogAdmin from './pages/admin/catalog/catalog';
import WeekAdmin from './pages/admin/catalog/week/week';
import EventsAdmin from './pages/admin/events/eventsAdmin';

import Homepage from './pages/homepage/homepage';
import DriedFlowers from './pages/dried-flowers/driedFlowers';
import Contact from './pages/contact/contact';

import "./App.css"
import "./pages/admin/_components/styleAdmin.css"
import "./components/style.css";

function App() {
    localStorage.setItem("admin", "admin")
    let isAdmin: string | null = localStorage.getItem("admin");

    return (
        <div id='app'>
            <HeaderTop />
            <Header />
            <HeaderButtons />
            <Routes >
                {/* Admin */}
                {isAdmin && <>
                    <Route path='/admin' element={<HomepageAdmin />} />
                    <Route path='/admin/fleurs-sechees' element={<CatalogAdmin />} />
                    <Route path='/admin/fleurs-de-la-semaine' element={<WeekAdmin />} />
                    <Route path='/admin/evenements' element={<EventsAdmin />} />
                    <Route path='/admin/inspirations' element={<EventsAdmin />} />
                    <Route path='/admin/inspirations/mariage' element={<EventsAdmin />} />
                    <Route path='/admin/inspirations/deuil' element={<EventsAdmin />} />
                    <Route path='/admin/inspirations/anniversaire' element={<EventsAdmin />} />
                    <Route path='/admin/inspirations/naissance' element={<EventsAdmin />} />
                </>}

                {/* Client */}
                <Route path='/' element={<Homepage />} />
                <Route path='/catalogue' element={<Homepage />} />
                <Route path='/fleurs-sechees' element={<DriedFlowers />} />
                <Route path='/fleurs-sechees/:name' element={<DriedFlowers />} />
                <Route path='/fleurs-de-la-semaine' element={<Homepage />} />
                <Route path='/inspirations' element={<Homepage />} />
                <Route path='/inspirations/mariage' element={<Homepage />} />
                <Route path='/inspirations/deuil' element={<Homepage />} />
                <Route path='/inspirations/anniversaire' element={<Homepage />} />
                <Route path='/inspirations/naissance' element={<Homepage />} />
                <Route path='/contact' element={<Contact />} />
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
