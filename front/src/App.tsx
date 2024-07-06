import { Route, Routes } from 'react-router-dom';

import { articleType } from './components/types';

import Header from './components/header/header';
import HeaderButtons from './components/header/headerButtons';
import Footer from './components/footer/footer';
import Homepage from './pages/homepage/homepage';
import Catalog from './pages/catalog/catalog';
import CatalogDriedItempage from './pages/catalog-itempage/catalogDriedItempage';
import CouronnePersonnalisable from './pages/catalog-itempage/couronnePersonnalisable';
import CatalogCustom from './pages/catalog-custom/catalogCustom';
import CatalogFreshItempage from './pages/catalog-itempage/catalogFreshItempage';
import Week from './pages/week/week';
import Inspirations from './pages/inspirations/inspirations';
import Mariage from './pages/inspirations/mariage/mariage';
import Deuil from './pages/inspirations/deuil/deuil';
import Contact from './pages/contact/contact';
import Login from './pages/login/login';
import CreateAccount from './pages/login/createAccount';
import Profile from './pages/profile/profile';
import Favorites from './pages/favorites/favorites';
import Legal from './pages/legal/legal';

import CatalogAdmin from './pages/admin/catalog/catalog';
import NewCatalogAdmin from './pages/admin/catalog-new/catalogNew';
import EditCatalogAdmin from './pages/admin/catalog-edit/catalogEdit';
import HomepageAdmin from './pages/admin/homepage/homepageAdmin';
import WeekAdmin from './pages/admin/week/week';
import WeekNewAdmin from './pages/admin/week/week-new/weekNew';
import WeekEditAdmin from './pages/admin/week/week-edit/weekEdit';
import EventsAdmin from './pages/admin/events/eventsAdmin';
import EditComponentsAdmin from './pages/admin/edit-components/edit-components';

import "./App.css";
import "./pages/admin/_components/styleAdmin.css";
import "./components/style.css";

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
                    <Route path='/admin/fleurs-sechees' element={<CatalogAdmin articleType={articleType.dried} event={false} />} />
                    <Route path='/admin/fleurs-sechees/nouveau' element={<NewCatalogAdmin articleType={articleType.dried} />} />
                    <Route path='/admin/fleurs-sechees/:itemName' element={<EditCatalogAdmin articleType={articleType.dried} />} />
                    <Route path='/admin/fleurs-de-la-semaine' element={<WeekAdmin />} />
                    <Route path='/admin/fleurs-de-la-semaine/nouveau' element={<WeekNewAdmin />} />
                    <Route path='/admin/fleurs-de-la-semaine/:itemName' element={<WeekEditAdmin />} />
                    <Route path='/admin/evenements' element={<EventsAdmin />} />
                    <Route path='/admin/evenements/Noël' element={<CatalogAdmin articleType={articleType.christmas} event={true} />} />
                    <Route path='/admin/evenements/Noël/nouveau' element={<NewCatalogAdmin articleType={articleType.christmas} />} />
                    <Route path='/admin/evenements/Noël/:itemName' element={<EditCatalogAdmin articleType={articleType.christmas} />} />
                    <Route path='/admin/evenements/Pâques' element={<CatalogAdmin articleType={articleType.paschal} event={true} />} />
                    <Route path='/admin/evenements/Pâques/nouveau' element={<NewCatalogAdmin articleType={articleType.paschal} />} />
                    <Route path='/admin/evenements/Pâques/:itemName' element={<EditCatalogAdmin articleType={articleType.paschal} />} />
                    <Route path='/admin/evenements/Saint-Valentin' element={<CatalogAdmin articleType={articleType.valentine} event={true} />} />
                    <Route path='/admin/evenements/Saint-Valentin/nouveau' element={<NewCatalogAdmin articleType={articleType.valentine} />} />
                    <Route path='/admin/evenements/Saint-Valentin/:itemName' element={<EditCatalogAdmin articleType={articleType.valentine} />} />
                    <Route path='/admin/evenements/Toussaint' element={<CatalogAdmin articleType={articleType.toussaint} event={true} />} />
                    <Route path='/admin/evenements/Toussaint/nouveau' element={<NewCatalogAdmin articleType={articleType.toussaint} />} />
                    <Route path='/admin/evenements/Toussaint/:itemName' element={<EditCatalogAdmin articleType={articleType.toussaint} />} />
                    <Route path='/admin/evenements/Fête_des_mères' element={<CatalogAdmin articleType={articleType.mother} event={true} />} />
                    <Route path='/admin/evenements/Fête_des_mères/nouveau' element={<NewCatalogAdmin articleType={articleType.mother} />} />
                    <Route path='/admin/evenements/Fête_des_mères/:itemName' element={<EditCatalogAdmin articleType={articleType.mother} />} />
                    <Route path='/admin/evenements/Fête_des_grand-mères' element={<CatalogAdmin articleType={articleType.grandMother} event={true} />} />
                    <Route path='/admin/evenements/Fête_des_grand-mères/nouveau' element={<NewCatalogAdmin articleType={articleType.grandMother} />} />
                    <Route path='/admin/evenements/Fête_des_grand-mères/:itemName' element={<EditCatalogAdmin articleType={articleType.grandMother} />} />
                    <Route path='/admin/evenements/Fête_des_pères' element={<CatalogAdmin articleType={articleType.father} event={true} />} />
                    <Route path='/admin/evenements/Fête_des_pères/nouveau' element={<NewCatalogAdmin articleType={articleType.father} />} />
                    <Route path='/admin/evenements/Fête_des_pères/:itemName' element={<EditCatalogAdmin articleType={articleType.father} />} />
                    <Route path='/admin/components' element={<EditComponentsAdmin />} />
                </>}

                {/* Client */}
                <Route path='/' element={<Homepage />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/se-connecter' element={<Login />} />
                <Route path='/creer-un-compte' element={<CreateAccount />} />
                <Route path='/mon-compte' element={<Profile />} />
                <Route path='/favoris' element={<Favorites />} />
                <Route path='/mentions-legales' element={<Legal />} />

                {/* Inspirations */}
                <Route path='/inspirations' element={<Inspirations />} />
                <Route path='/inspirations/mariage' element={<Mariage />} />
                <Route path='/inspirations/deuil' element={<Deuil />} />
                {/*<Route path='/inspirations/anniversaire' element={<Homepage />} />*/}
                {/*<Route path='/inspirations/naissance' element={<Homepage />} />*/}

                {/* Catalogs */}
                <Route path='/fleurs-de-la-semaine' element={<Week />} />

                <Route path='/fleurs-sechees' element={<Catalog articleType={articleType.dried} />} />
                <Route path='/fleurs-sechees/couronne-personnalisable' element={<CouronnePersonnalisable />} />
                <Route path='/fleurs-sechees/:itemName' element={<CatalogDriedItempage />} />

                <Route path='/sur-mesure' element={<CatalogCustom articleType={articleType.weekCompo} />} />
                <Route path='/sur-mesure/:itemName' element={<CatalogFreshItempage />} />

                <Route path='/Noël' element={<Catalog articleType={articleType.christmas} />} />
                <Route path='/Noël/:itemName' element={<CatalogDriedItempage />} />
                <Route path='/Saint-Valentin' element={<Catalog articleType={articleType.valentine} />} />
                <Route path='/Saint-Valentin/:itemName' element={<CatalogDriedItempage />} />
                <Route path='/Pâques' element={<Catalog articleType={articleType.paschal} />} />
                <Route path='/Pâques/:itemName' element={<CatalogDriedItempage />} />
                <Route path='/Toussaint' element={<Catalog articleType={articleType.toussaint} />} />
                <Route path='/Toussaint/:itemName' element={<CatalogDriedItempage />} />
                <Route path='/Fête_des_mères' element={<Catalog articleType={articleType.mother} />} />
                <Route path='/Fête_des_mères/:itemName' element={<CatalogDriedItempage />} />
                <Route path='/Fête_des_grand-mères' element={<Catalog articleType={articleType.grandMother} />} />
                <Route path='/Fête_des_grand-mères/:itemName' element={<CatalogDriedItempage />} />
                <Route path='/Fête_des_pères' element={<Catalog articleType={articleType.father} />} />
                <Route path='/Fête_des_pères/:itemName' element={<CatalogDriedItempage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
