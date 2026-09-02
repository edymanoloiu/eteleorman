import Link from "next/link";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";

const ErrorPage = () => {
    return (
        <>
            <HeadMeta metaTitle="Pagina nu a fost găsită" metaDesc="Pagina solicitată nu a putut fi găsită." />
            <HeaderOne />
            <div className="error-404-banner bg-grey-light-three">
                <div className="container">
                    <div className="error-404-content text-center">
                        <div className="txt-404 tilt-this">404</div>
                        <div className="error-inner-content">
                            <h1 className="h1 m-b-xs-20 m-b-md-40">
                                Pagina căutată nu există.
                            </h1>
                            <Link href="/" className="btn btn-primary">
                                ÎNAPOI LA PAGINA PRINCIPALĂ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <FooterOne />
        </>
    );
}

export default ErrorPage;