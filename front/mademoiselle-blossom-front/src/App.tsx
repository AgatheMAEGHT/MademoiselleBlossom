import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppAdmin from './admin/App-admin';
import AppClient from './clients/App-client';

function App() {
    return (
        <div>
            <Routes >
                {/* Admin */}
                <Route path='/admin' element={<AppAdmin />} />

                {/* Client */}
                <Route path='/' element={<AppClient />} />
            </Routes>
        </div>
    );
}

export default App;
