import Breadcrumb from "../components/common/Breadcrumb";
import BreadcrumbBanner from "../components/common/BreadcrumbBanner";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";

const ContactPage = () => {

	return (
		<>
			<HeadMeta metaTitle="Politica de Confidențialitate" metaDesc={"Politica de confidențialitate pentru site-ul eteleorman.ro"} />
			<HeaderOne />
			<Breadcrumb aPage="Politica de Confidențialitate" />
			<BreadcrumbBanner pageTitle="Politica de Confidențialitate" />
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="axil-content">
							<h1>Politica de Confidențialitate</h1>

							<h2>1. Operatorul datelor</h2>
							<p>
								Operatorul datelor cu caracter personal este <strong>Weboratory Capital SRL</strong>, Otopeni, România, e-mail: <a href="mailto:contact@weboratory.ro.ro">contact@weboratory.ro.ro</a>. Prelucrăm datele dvs. în conformitate cu Regulamentul (UE) 2016/679 (GDPR).
							</p>

							<h2>2. Ce date colectăm</h2>
							<ul>
								<li>date oferite voluntar (formular contact, abonare newsletter);</li>
								<li>date tehnice anonime (adresa IP, tipul de browser, pagini vizitate);</li>
								<li>date colectate prin servicii terțe (Google Analytics, Google AdSense, Meta Pixel).</li>
							</ul>

							<h2>3. Scopul prelucrării</h2>
							<p>Datele sunt folosite pentru:</p>
							<ul>
								<li>îmbunătățirea experienței de navigare;</li>
								<li>analiza traficului și a performanței site-ului;</li>
								<li>afișare de publicitate relevantă (unde este cazul);</li>
								<li>răspuns la solicitări transmise de utilizatori.</li>
							</ul>

							<h2>4. Baza legală</h2>
							<p>Prelucrarea se face în baza:</p>
							<ul>
								<li>consimțământului dvs. (pentru cookie-uri, newsletter);</li>
								<li>interesului legitim al operatorului (statistici, securitate, prevenirea abuzului).</li>
							</ul>

							<h2>5. Durata stocării</h2>
							<p>
								Datele sunt stocate doar pe perioada necesară îndeplinirii scopului pentru care au fost colectate, după care sunt șterse sau anonimizate.
							</p>

							<h2>6. Drepturile dvs.</h2>
							<p>Conform GDPR aveți următoarele drepturi:</p>
							<ul>
								<li>dreptul de acces la date;</li>
								<li>dreptul la rectificare;</li>
								<li>dreptul la ștergere („dreptul de a fi uitat”);</li>
								<li>dreptul la restricționarea prelucrării;</li>
								<li>dreptul la portabilitatea datelor;</li>
								<li>dreptul la opoziție;</li>
								<li>dreptul de a formula plângere la ANSPDCP.</li>
							</ul>
							<p>
								Pentru exercitarea drepturilor, ne puteți scrie la <a href="mailto:contact@weboratory.ro.ro">contact@weboratory.ro.ro</a>.
							</p>

							<h2>7. Securitatea datelor</h2>
							<p>
								Datele sunt protejate prin măsuri tehnice și organizatorice adecvate. Transmitem date către terți doar când este necesar pentru funcționarea site-ului (ex. Google) și doar către parteneri compatibili GDPR.
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





