import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/header/header';
import Footer from './components/footer/footer';
import Homepage from './homepage/homepage';

import '../App.css';

function AppClient() {
    return (
        <div id="app">
            <Header />
            <Routes >
                <Route path='/' element={<Homepage />} />
                <Route path='/contact' element={<Homepage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default AppClient;
