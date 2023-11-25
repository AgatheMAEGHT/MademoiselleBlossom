import React from 'react';
import { useNavigate } from 'react-router-dom';

import { article } from '../../../components/types';

import './driedNew.css';

function NewDriedAdmin() {
    let navigate = useNavigate();
    let [colors, setColors] = React.useState<string[]>([]);
    let [article, setArticle] = React.useState<article>({
        _id: "",
        name: "",
        files: [""],
        price: 0,
        stock: 1,
        description: "",
        color: [],
        tone: [],
        size: 0,
        shape: "",
    });

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - Ajouter un article - Fleurs séchées</h1>
            <form className='admin-form'>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Nom</div>
                    <input value={article.name} onChange={e => setArticle({ ...article, name: e.target.value })} className='admin-form-input' type="text" name="name" id="name" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Prix (en €)</div>
                    <input min="0" value={article.price} onChange={e => setArticle({ ...article, price: parseFloat(e.target.value) })} className='admin-form-input' type="number" name="price" id="price" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Stock</div>
                    <input min="0" value={article.stock} onChange={e => setArticle({ ...article, stock: parseInt(e.target.value) })} className='admin-form-input' type="number" name="stock" id="stock" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Description</div>
                    <input value={article.description} onChange={e => setArticle({ ...article, description: e.target.value })} className='admin-form-input' type="text" name="description" id="description" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Couleurs</div>
                    <input value={article.color} onChange={e => setArticle({ ...article, color: [e.target.value] })} className='admin-form-input' type="text" name="color" id="color" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Tons</div>
                    <input value={article.tone} onChange={e => setArticle({ ...article, tone: [e.target.value] })} className='admin-form-input' type="text" name="tone" id="tone" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Taille (en cm)</div>
                    <input min="0" value={article.size} onChange={e => setArticle({ ...article, size: parseFloat(e.target.value) })} className='admin-form-input' type="number" name="size" id="size" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Forme</div>
                    <input value={article.shape} onChange={e => setArticle({ ...article, shape: e.target.value })} className='admin-form-input' type="text" name="shape" id="shape" />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Images</div>
                    <input value={article.files} onChange={e => setArticle({ ...article, files: [e.target.value] })} className='admin-form-input' type="text" name="images" id="images" />
                </div>
                <button className='admin-button' type="submit">Ajouter</button>
            </form>
        </div>
    );
}

export default NewDriedAdmin;
