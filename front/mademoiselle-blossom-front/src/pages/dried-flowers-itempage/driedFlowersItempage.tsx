import React from 'react';

import { useParams } from 'react-router-dom';

import './driedFlowersItempage.css';
import { article } from '../../components/types';

function DriedFlowersItempage() {

    let params = useParams();
    console.log(params.itemName);

    let item: article = {
        _id: "1",
        name: "",
        files: ["", ""],
        price: "30",
        stock: 1,
        description: "Couronne de fleurs séchées",
        colors: ["rose", "blanc"],
        tones: ["pastel"],
        size: 30,
        type: "dried",
        shape: "rond"
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
