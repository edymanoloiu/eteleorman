import Breadcrumb from "../components/common/Breadcrumb";
import BreadcrumbBanner from "../components/common/BreadcrumbBanner";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";

const ContactPage = () => {

	return (
		<>
			<HeadMeta metaTitle="Termeni și Condiții" metaDesc={"Termenii și condițiile de utilizare pentru site-ul eteleorman.ro"} />
			<HeaderOne />
			<Breadcrumb aPage="Termeni și Condiții" />
			<BreadcrumbBanner pageTitle="Termeni și Condiții" />
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="axil-content">
							<h1>Termeni și Condiții</h1>
							<h2>Date de identificare editor</h2>
							<p>
								Acest site este operat de <strong>Weboratory Capital SRL</strong>, cu sediul în Otopeni, România. CUI: 43276159. E-mail: <a href="mailto:contact@weboratory.ro.ro">contact@weboratory.ro.ro</a>Publicația face parte din rețeaua media <strong>Weboratory Capital</strong>.
							</p>
							<h2>1. Scopul site-ului</h2>
							<p>
								Site-ul <strong>eteleorman.ro</strong> este o publicație online destinată informării publicului prin știri, articole și materiale editoriale. Toate informațiile sunt furnizate în scop informativ.
							</p>

							<h2>2. Drepturi de autor</h2>
							<p>
								Conținutul publicat este original sau rescris integral pe baza informațiilor de interes public, cu menționarea sursei. Imaginile utilizate sunt proprii, din surse libere de drepturi, sau generate AI.
							</p>
							<p>
								Dacă apreciați că un material publicat vă încalcă drepturile de autor,
								vă rugăm să ne contactați la <a href="mailto:contact@weboratory.ro.ro">contact@weboratory.ro.ro</a>
								iar conținutul va fi eliminat de îndată.
							</p>

							<h2>3. Utilizarea conținutului</h2>
							<p>
								Copierea integrală a materialelor fără acordul editorului este interzisă.
								Preluarea de fragmente este permisă doar cu menționarea sursei și
								includerea unui link activ către articolul original.
							</p>

							<h2>4. Răspundere</h2>
							<p>
								Deși informațiile publicate sunt verificate din surse multiple, pot apărea
								erori sau omisiuni. Editorul nu poate fi făcut răspunzător pentru deciziile
								luate de utilizatori pe baza conținutului publicat.
							</p>

							<h2>5. Limitarea răspunderii tehnice</h2>
							<p>
								Editorul nu răspunde pentru eventuale disfuncționalități tehnice, întreruperi de funcționare sau pierderi de date rezultate din utilizarea site-ului.
							</p>

							<h2>6. Modificarea termenilor</h2>
							<p>
								Ne rezervăm dreptul de a modifica oricând acești termeni. Versiunea actualizată va fi disponibilă permanent pe site.
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





