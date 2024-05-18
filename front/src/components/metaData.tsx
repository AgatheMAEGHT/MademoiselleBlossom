import { metaHead } from "./types";

export default function MetaData(props: metaHead) {
    return (
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="author" content="Mademoiselle Blossom" />
            <title>{props.title}</title>
            <meta property="og:title" content={props.title} />
            <meta property="twitter:title" content={props.title} />
            <meta name="description" content="Découvrez les créations uniques de Mademoiselle Blossom, votre artisan fleuriste dans l'Hérault : bouquets sur mesure, compositions florales pour toutes occasions et livraison locale." />
            <meta property="og:description" content="Découvrez les créations uniques de Mademoiselle Blossom, votre artisan fleuriste dans l'Hérault : bouquets sur mesure, compositions florales pour toutes occasions et livraison locale." />
            <meta property="twitter:description" content="Découvrez les créations uniques de Mademoiselle Blossom, votre artisan fleuriste dans l'Hérault : bouquets sur mesure, compositions florales pour toutes occasions et livraison locale." />
            <link rel="canonical" href={process.env.REACT_APP_URL + props.url} />
            <meta property="og:url" content={process.env.REACT_APP_URL + props.url} />
            <meta property="twitter:url" content={process.env.REACT_APP_URL + props.url} />
            <meta name="keywords" content="Fleurs, Fleurs séchées, Composition, Mademoiselle Blossom, Blossom, Artisan, Artisan fleuriste, Fleuriste, Mariage, Fleuriste Canet, Fleuriste 34, Plantes, Fleuriste Hérault, Séchées, Livraison, Devis, Bouquet, Couronne florale, Fête des mères, St Valentin, Rose éternelle" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
            <meta property="og:image" content="" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="twitter:image" content="" />
            <meta name="twitter:image:src" content="" />
        </head>
    );
}