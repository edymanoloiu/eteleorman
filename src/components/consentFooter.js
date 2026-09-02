import CookieConsent from "react-cookie-consent";

export default function ConsentFooter() {
	return (
		<>
			<CookieConsent
				acceptOnOverlayClick={true}
				acceptOnScroll={true}
				location="bottom"
				buttonText="Accept"
				cookieName="alexandriaConsent"
				style={{ background: "#000", zIndex: 200000 }}
				buttonStyle={{ color: "#fff", fontSize: "16px", background: 'transparent', border: '1px white solid', 'border-radius': '0.5rem', padding: '0.5rem' }}
				expires={365}
				overlay={true}>
				Acest website foloseşte cookie-uri pentru o experienţă mult mai bună de navigare. Pentru continuarea navigării, vă rugam sa va exprimaţi acordul pentru folosirea acestora.
			</CookieConsent>
		</>
	);
}