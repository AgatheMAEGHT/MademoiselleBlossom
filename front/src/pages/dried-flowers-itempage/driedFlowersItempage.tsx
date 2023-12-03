import React from 'react';

import { useParams } from 'react-router-dom';

import './driedFlowersItempage.css';
import { articleDB } from '../../components/types';

function DriedFlowersItempage() {

    let params = useParams();

    let item: articleDB = {
        _id: "",
        type: {
            _id: "",
            name: "",
        },
        name: "Aurore",
        description: "Couronne de fleurs séchées",
        price: 30,
        stock: 1,
        size: 0,
        shape: {
            _id: "",
            name: "",
        },
        colors: [],
        tones: [],
        files: [],
    };

    return (
        <div id="item-page">
            <h2>{params.itemName}</h2>
            <div>
            </div>
            <div>
                <p>{item.description}</p>
            </div>
        </div>
    );
}

export default DriedFlowersItempage;
