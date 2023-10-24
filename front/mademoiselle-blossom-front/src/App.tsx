import React from 'react';

import './App.css';
import Header from './client/header/header';
import Footer from './client/footer/footer';
import Homepage from './client/homepage/homepage';

function App() {
  return (
    <div id="app">
      <Header />
      <Homepage />
      <Footer />
    </div>
  );
}

export default App;
