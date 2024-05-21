import MetaData from '../../components/metaData';

import './contact.css';

function Contact() {
    return (
        <div id="contact">
            <MetaData title="Contact" url="/contact" />
            <div id="contact-emma">
                <img id="contact-emma-img" src='/emma.png' alt='Emma, Mademoiselle Blossom' />
                <p className='contact-emma-text'>Je suis Emma, une fleuriste passionnée détenant un CAP et un BP en fleuristerie résidant sur Canet dans le sud de la France (Hérault). En tant qu'artisan fleuriste, j'ai à cœur de créer des compositions florales pour vos événements, apportant une touche personnalisée pour toutes les occasions.<br /><br /> Ma sensibilité ainsi que mon amour pour les fleurs se manifestent dans chacune de mes créations, offrant ainsi une touche spéciale à chaque arrangement floral.</p>
            </div>
            <div>
                <p className='contact-emma-text'><b>Contactez Mademoiselle Blossom</b></p>
                <p className='contact-emma-text'>Par téléphone au <b><i><i className='contact-info-separation'>numéro </i>06 <i className='contact-info-separation'>puis</i>16 <i className='contact-info-separation'>puis</i>28 <i className='contact-info-separation'>puis</i>28 <i className='contact-info-separation'>puis</i>83</i></b></p>
                <p className='contact-emma-text'> Par e-mail à l'adresse <b><i>ma<i className='contact-info-separation'>puis</i>demoiselle<i className='contact-info-separation'>puis</i>.<i className='contact-info-separation'>puis</i>blossom<i className='contact-info-separation'>puis</i>34<i className='contact-info-separation'>puis</i>@<i className='contact-info-separation'>puis</i>g<i className='contact-info-separation'>puis</i>mail<i className='contact-info-separation'>puis</i>.<i className='contact-info-separation'>puis</i>com</i></b></p>
                <p className='contact-emma-text'>Sur Facebook <i><a className='contact-url' href='https://www.facebook.com/mademoiselleblossom34' target='_blank' rel='noreferrer'>Mademoiselle Blossom</a></i></p>
                <p className='contact-emma-text'>Sur Instagram <i><a className='contact-url' href='https://www.instagram.com/mademoiselle_blossom_/' target='_blank' rel='noreferrer'>@mademoiselle_blossom_</a></i></p>
            </div>
            <div>
                <p className='contact-emma-text'><b>Vous pouvez également me retrouver sur les marchés</b></p>
                <ul>
                    <li className='contact-emma-marche'> Jeudi : J'alterne une semaine sur deux, entre Paulhan et Pouzols.</li>
                    <li className='contact-emma-marche'> Vendredi : Une fois sur deux, vous me trouverez au marché de Saint-Jean-de-Fos, sinon je serai à Nébian.</li>
                    <li className='contact-emma-marche'> Samedi : Je suis présente au marché de Gignac.</li>
                </ul>
            </div>
            <p className='contact-emma-text'><br />Je vous invite à me contacter pour un devis personnalisé gratuit.</p>
        </div >
    );
}

export default Contact;
