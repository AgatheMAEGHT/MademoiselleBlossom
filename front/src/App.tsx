import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/header/header';
import HeaderButtons from './components/header/headerButtons';
import Footer from './components/footer/footer';
import Homepage from './pages/homepage/homepage';
import DriedFlowers from './pages/dried-flowers/driedFlowers';
import DriedFlowersItempage from './pages/dried-flowers-itempage/driedFlowersItempage';
import Week from './pages/week/week';
import Inspirations from './pages/inspirations/inspirations';
import Mariage from './pages/inspirations/mariage/mariage';
import Deuil from './pages/inspirations/deuil/deuil';
import Contact from './pages/contact/contact';
import Login from './pages/login/login';
import CreateAccount from './pages/login/createAccount';
import Profile from './pages/profile/profile';
import Favorites from './pages/favorites/favorites';

import HomepageAdmin from './pages/admin/homepage/homepageAdmin';
import CatalogAdmin from './pages/admin/dried/dried';
import NewDriedAdmin from './pages/admin/dried/dried-new/driedNew';
import EditDriedAdmin from './pages/admin/dried/dried-edit/driedEdit';
import WeekAdmin from './pages/admin/week/week';
import EventsAdmin from './pages/admin/events/eventsAdmin';

import FeteDesPeres from './pages/events/feteDesPeres/feteDesPeres';

import "./App.css";
import "./pages/admin/_components/styleAdmin.css";
import "./components/style.css";
import FeteDesMeres from './pages/events/feteDesMeres/feteDesMeres';
import FeteDesGrandsMeres from './pages/events/feteDesGrandsMeres/feteDesGrandsMeres';
import Toussaint from './pages/events/toussaint/toussaint';
import Paques from './pages/events/paques/paques';
import SaintValentin from './pages/events/saint-valentin/saint-valentin';
import Noel from './pages/events/neol/noel';

function App() {
    let logged: string | null = localStorage.getItem("logged");

    return (
        <div id='app'>
            <Header />
            <HeaderButtons />
            <Routes >
                {/* Admin */}
                {logged === "admin" && <>
                    <Route path='/admin' element={<HomepageAdmin />} />
                    <Route path='/admin/fleurs-sechees' element={<CatalogAdmin />} />
                    <Route path='/admin/fleurs-sechees/nouveau' element={<NewDriedAdmin />} />
                    <Route path='/admin/fleurs-sechees/:itemName' element={<EditDriedAdmin />} />
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
                <Route path='/fleurs-sechees/:itemName' element={<DriedFlowersItempage />} />
                <Route path='/fleurs-de-la-semaine' element={<Week />} />
                <Route path='/inspirations' element={<Inspirations />} />
                <Route path='/inspirations/mariage' element={<Mariage />} />
                <Route path='/inspirations/deuil' element={<Deuil />} />
                <Route path='/inspirations/anniversaire' element={<Homepage />} />
                <Route path='/inspirations/naissance' element={<Homepage />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/a-propos' element={<Homepage />} />
                <Route path='/livraisons' element={<Homepage />} />
                <Route path='/cgv' element={<Homepage />} />
                <Route path='/mentions-legales' element={<Homepage />} />
                <Route path='/se-connecter' element={<Login />} />
                <Route path='/creer-un-compte' element={<CreateAccount />} />
                <Route path='/mon-compte' element={<Profile />} />
                <Route path='/favoris' element={<Favorites />} />
                <Route path='/favoris' element={<Favorites />} />

                <Route path='/Noël' element={<Noel />} />
                <Route path='/Saint-Valentin' element={<SaintValentin />} />
                <Route path='/Pâques' element={<Paques />} />
                <Route path='/Toussaint' element={<Toussaint />} />
                <Route path='/Fête_des_mères' element={<FeteDesMeres />} />
                <Route path='/Fête_des_pères' element={<FeteDesPeres />} />
                <Route path='/Fête_des_grand-mères' element={<FeteDesGrandsMeres />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
