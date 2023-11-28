import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { article, articleDB, select } from '../../../components/types';
import { requester } from '../../../components/requester';

import './driedNew.css';

function NewDriedAdmin() {
    let navigate = useNavigate();

    const [nameAlreadyTaken, setNameAlreadyTaken] = React.useState(false);
    const [article, setArticle] = React.useState<article>({
        _id: "",
        name: "",
        files: [],
        price: "",
        stock: 1,
        description: "",
        colors: [],
        tones: [],
        size: 0,
        type: "",
        shape: "",
    });

    const [options, setOptions] = React.useState<{
        colors: select[],
        tones: select[],
        shapes: select[],
        names: string[],
    }>({
        colors: [],
        tones: [],
        shapes: [],
        names: ["Oui"],
    });

    /* Options */
    React.useEffect(() => {
        let newOptions = {
            colors: [],
            tones: [],
            shapes: [],
            names: [],
        }
        let promises: Promise<any>[] = [];

        promises.push(requester('/color', 'GET'));
        promises.push(requester('/tone', 'GET'));
        promises.push(requester('/color', 'GET')); // TO DO
        promises.push(requester('/article', 'GET'));

        Promise.all(promises).then((res) => {
            newOptions.colors = res[0]?.data?.map((elt: string) => ({ value: elt, label: elt }));
            newOptions.tones = res[1]?.data?.map((elt: string) => ({ value: elt, label: elt }));
            newOptions.shapes = res[2]?.data?.map((elt: string) => ({ value: elt, label: elt }));
            newOptions.names = res[3]?.data?.map((elt: string) => elt);
            setOptions(newOptions);
        });

        // eslint-disable-next-line
    }, []);

    function checkName(e: string) {
        if (options.names?.includes(e)) {
            setNameAlreadyTaken(true);
        } else {
            setNameAlreadyTaken(false);
        }
    }

    /* Submit */
    function submit() {
        let tmp = article.colors.map((elt: string) => ({ name: elt, value: "123456" }));
        let tmpPrice = parseFloat(article.price.replace(",", "."));
        let tmpArticle: articleDB = {
            _id: "",
            name: article.name ?? "",
            files: article.files ?? [],
            price: tmpPrice ?? 0,
            stock: article.stock ?? 0,
            description: article.description ?? "",
            colors: tmp ?? [],
            tones: article.tones ?? [],
            size: article.size ?? 0,
            type: "65666f4156be5a3d35eaeb01",
            shape: article.shape ?? "",
        }

        requester('/article/create', 'POST', tmpArticle).then((res: any) => {
            if (res._id) {
                navigate('/admin/fleurs-sechees');
            }
        });
    }

    return (
        <div className='admin-page page'>
            <h1 className='admin-page-title'>Admin - Ajouter un article - Fleurs séchées</h1>
            <div className='admin-form'>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Nom</div>
                    <div className='admin-form-element-right'>
                        {nameAlreadyTaken && <div id="admin-form-element-alreadytaken">Ce nom est déjà pris par une autre création</div>}
                        <input
                            value={article.name}
                            onChange={e => { setArticle({ ...article, name: e.target.value }); checkName(e.target.value) }}
                            className='admin-form-input'
                            id="admin-form-input-name"
                            type="text"
                            name="name"
                        />
                    </div>
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Prix (en €)</div>
                    <input
                        value={article.price}
                        onChange={e => setArticle({ ...article, price: e.target.value })}
                        className='admin-form-input'
                        type="text"
                        name="price"
                    />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Stock</div>
                    <input
                        min="0"
                        value={article.stock}
                        onChange={e => setArticle({ ...article, stock: parseInt(e.target.value) })}
                        className='admin-form-input'
                        type="number"
                        name="stock"
                    />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Description</div>
                    <input
                        value={article.description}
                        onChange={e => setArticle({ ...article, description: e.target.value })}
                        className='admin-form-input'
                        id="admin-form-input-description"
                        type="text"
                        name="description"
                    />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Couleurs</div>
                    <div className='admin-form-input-select'>
                        <CreatableSelect
                            name="colors"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? 'blue' : 'var(--color-3)',
                                }),
                            }}
                            isMulti
                            isSearchable
                            isClearable
                            options={options.colors}
                            onChange={(e) => setArticle({ ...article, colors: (e ? e.map((elt: select) => elt.value) : []) })}
                        />
                    </div>
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Tons</div>
                    <div className='admin-form-input-select'>
                        <CreatableSelect
                            name="tones"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-3)',
                                }),
                            }}
                            isMulti
                            isSearchable
                            isClearable
                            options={options.tones}
                            onChange={(e) => setArticle({ ...article, tones: (e ? e.map((elt: select) => elt.value) : []) })}
                        />
                    </div>
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Taille (en cm)</div>
                    <input
                        step={0.01}
                        min="0"
                        value={article.size}
                        onChange={e => setArticle({ ...article, size: parseFloat(e.target.value) })}
                        className='admin-form-input'
                        type="number"
                        name="size"
                    />
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Forme</div>
                    <div className='admin-form-input-select'>
                        <CreatableSelect
                            name="tones"
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: 'var(--color-3)',
                                }),
                            }}
                            isMulti
                            isSearchable
                            isClearable
                            options={options.tones}
                            onChange={(e) => setArticle({ ...article, tones: (e ? e.map((elt: select) => elt.value) : []) })}
                        />
                    </div>
                </div>
                <div className='admin-form-element'>
                    <div className='admin-form-title'>Images</div>
                    <input
                        value={article.files}
                        onChange={e => setArticle({ ...article, files: [e.target.value] })}
                        className='admin-form-input'
                        type="text"
                        name="images"
                    />
                </div>
                <button className='admin-button' type="submit" onClick={() => submit()}>Ajouter</button>
            </div>
        </div>
    );
}

export default NewDriedAdmin;
