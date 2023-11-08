import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './client/header/header';
import Footer from './client/footer/footer';
import Homepage from './pages/homepage/homepage';

import './App.css';
import Admin from './pages/admin/admin';

function App() {
  return (
    <div id="app">
      <Header />
      <Routes >
        <Route path='/emma-administratrice' element={<Admin />} />
      </Routes>
      <Homepage />
      <Footer />
    </div>
  );
}

export default App;
