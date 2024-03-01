import './contact.css';

function Contact() {
    return (
        <div id="contact">
            <div id="contact-emma">
                <img id="contact-emma-img" src='/emma.png' />
                <p id='contact-emma-text'>Je suis Emma, une fleuriste passionnée détenant un CAP et un BP en fleuristerie résidant dans le sud de la France (Hérault). En tant qu'artisan fleuriste, j'ai à cœur de créer des compositions florales pour vos événements, apportant une touche personnalisée pour toutes les occasions.<br/><br/> Ma sensibilité ainsi que mon amour pour les fleurs se manifestent dans chacune de mes créations, offrant ainsi une touche spéciale à chaque arrangement floral.</p>
            </div>
            <div>
                <p><b>Contactez Mademoiselle Blossom</b></p>
                <p>Par téléphone au <i className='contact-info-separation'>numéro </i>06 <i className='contact-info-separation'>puis</i>16 <i className='contact-info-separation'>puis</i>28 <i className='contact-info-separation'>puis</i>28 <i className='contact-info-separation'>puis</i>83<br />
                    Par e-mail à l'adresse ma<i className='contact-info-separation'>puis</i>demoiselle<i className='contact-info-separation'>puis</i>.<i className='contact-info-separation'>puis</i>blossom<i className='contact-info-separation'>puis</i>34<i className='contact-info-separation'>puis</i>@<i className='contact-info-separation'>puis</i>g<i className='contact-info-separation'>puis</i>mail<i className='contact-info-separation'>puis</i>.<i className='contact-info-separation'>puis</i>com</p>
            </div>
            <div>
                <p><b>Retrouvez moi sur les marchés</b></p>
                <p style={{ textAlign: "left" }}>- Clermont-l'Hérault le mercredi<br />
                    - Gignac le jeudi</p>
            </div>
            <p>Je vous invite à me contacter pour un devis personnalisé gratuit.</p>
        </div>
    );
}

export default Contact;
