import Breadcrumb from "../components/common/Breadcrumb";
import BreadcrumbBanner from "../components/common/BreadcrumbBanner";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";

const ContactPage = () => {

	return (
		<>
			<HeadMeta metaTitle="Politica de Cookies" metaDesc={"Politica de Cookies pentru site-ul eteleorman.ro"} />
			<HeaderOne />
			<Breadcrumb aPage="Politica de Cookies" />
			<BreadcrumbBanner pageTitle="Politica de Cookies" />
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="axil-content">
							<h1>Termeni și Condiții de utilizare</h1>

							<h2>Date de identificare editor</h2>
							<p>
								Acest site face parte din rețeaua media <strong>Weboratory Capital</strong> și este operat de <strong>Weboratory Capital SRL</strong>, cu sediul în București, România.<br /> CUI: 43276159<br /> E-mail: <a href="mailto:contact@weboratory.ro">contact@weboratory.ro</a><br />
							</p>

							<h2>1. Drepturi de autor</h2>
							<p>
								Toate materialele publicate sunt create sau rescrise integral de echipa editorială, bazate pe informații de interes public. Informațiile publice nu sunt protejate de drepturi de autor, însă forma redactată este. Reproducerea integrală fără acord scris este interzisă. Preluarea parțială este permisă doar cu menționarea sursei și link activ.
							</p>
							<p>
								Imaginile provin din surse libere (Pexels, Unsplash, Pixabay), materiale proprii sau sunt generate AI. Dacă un material încalcă drepturile de autor ale unei terțe părți, vă rugăm să ne contactați la <a href="mailto:contact@weboratory.ro">contact@weboratory.ro</a> pentru remediere imediată.
							</p>

							<h2>2. Utilizarea conținutului</h2>
							<p>
								Utilizatorii pot distribui articolele publicate cu condiția menționării sursei. Este interzisă copierea, redistribuirea automată sau republicarea integrală fără acordul scris al editorului.
							</p>

							<h2>4. Responsabilitate editorială</h2>
							<p>
								Echipa Weboratory Capital depune eforturi pentru verificarea informațiilor, dar nu garantează acuratețea absolută. Conținutul are scop informativ și nu constituie recomandare juridică, medicală, financiară sau profesională.
							</p>

							<h2>5. Publicitate și advertoriale</h2>
							<p>
								Publicitatea afișată este realizată prin Google AdSense, parteneri afiliați sau colaborări directe. Articolele sponsorizate sunt marcate clar ca <strong>„P”</strong>, <strong>„Advertorial”</strong> sau <strong>„Articol sponsorizat”</strong>.
							</p>

							<h2>6. Protecția datelor personale</h2>
							<p>
								Site-urile respectă Regulamentul (UE) 2016/679 (GDPR). Datele colectate sunt tratate conform <a href="/confidentialitate">Politicii de Confidențialitate</a>.
							</p>

							<h2>7. Cookie-uri și tehnologii similare</h2>
							<p>
								Cookie-urile sunt folosite pentru funcționare, analiză și publicitate personalizată. Utilizatorii pot alege ce cookie-uri acceptă la prima vizită.
							</p>

							<h2>8. Limitarea răspunderii tehnice</h2>
							<p>
								Weboratory Capital nu răspunde pentru erori de funcționare, întreruperi ale serviciilor sau pierderi de date cauzate de factori externi.
							</p>

							<h2>9. Modificarea termenilor</h2>
							<p>
								Ne rezervăm dreptul de a modifica prezenta pagină oricând, fără notificare prealabilă. Versiunea actualizată va fi disponibilă permanent pe site.
							</p>

							<h2>10. Contact</h2>
							<p>
								Pentru orice nelămuriri, sesizări sau colaborări media:<br /> <strong>E-mail:</strong> <a href="mailto:contact@weboratory.ro">contact@weboratory.ro</a><br /> <strong>Website:</strong> <a href="https://www.weboratory.ro">www.weboratory.ro</a>
							</p>
						</div>
					</div>
				</div>
			</div>
			<FooterOne />
		</>
	);
}

export default ContactPage;





