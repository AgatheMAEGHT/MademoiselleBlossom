import React from 'react';

import MetaData from '../../components/metaData';

import './inspirations.css';

function Inspirations() {

    return (
        <div className="page catalog">
            <MetaData title="Inspirations" url="/inspirations" />
            <h2 className="page-title">Inspirations</h2>
            <div id="inspirations-menu">
                <a className='inspirations-tile' href='/inspirations/mariage'>
                    <div className='inspirations-tileback'>
                        <h1 className='inspirations-tilename'>Mariage</h1>
                    </div>
                    <img src='/inspirations/mariage/bouquet-sophistique.jpg' alt="bouquet-sophistique" className='inspiration-tileimage' />
                </a>
                <a className='inspirations-tile' href='/inspirations/deuil'>
                    <div className='inspirations-tileback'>
                        <h1 className='inspirations-tilename'>Deuil</h1>
                    </div>
                    <img src='/inspirations/deuil/couronne-rouge-blanc-nom.jpg' alt="couronne-rouge-blanc-nom" className='inspiration-tileimage'></img>
                </a>
            </div>
        </div>
    );
}

export default Inspirations;
