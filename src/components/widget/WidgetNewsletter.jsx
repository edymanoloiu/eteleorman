import { useState } from 'react';
import FormGroup from '../contact/FormGroup';
import { subscribeNewsletter } from '../../lib/newsletter-api';

const WidgetNewsletter = () => {
	const [status, setStatus] = useState('idle');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const email = String(fd.get('subscription-email-2') || '').trim();

		if (!email) {
			setStatus('error');
			setMessage('Introdu adresa de email.');
			return;
		}

		setStatus('loading');
		setMessage('');

		try {
			const data = await subscribeNewsletter({ email, source: 'widget' });
			setStatus('success');
			setMessage(
				data.already_subscribed
					? 'Ești deja abonat la newsletter.'
					: 'Te-ai abonat cu succes. Verifică inbox-ul.',
			);
			e.currentTarget.reset();
		} catch (err) {
			setStatus('error');
			setMessage(err.message || 'A apărut o eroare. Încearcă din nou.');
		}
	};

	return (
		<div className="newsletter-widget weekly-newsletter bg-grey-light-three m-b-xs-40">
			<div className="newsletter-content">
				<div className="newsletter-icon">
					<i className="feather icon-send" />
				</div>
				<div className="section-title">
					<h3 className="axil-title">Subscribe To Our Weekly Newsletter</h3>
					<p className="mid m-t-xs-10 m-b-xs-20">
						No spam, notifications only about new products, updates.
					</p>
				</div>
				<div className="subscription-form-wrapper">
					<form className="subscription-form" onSubmit={handleSubmit}>
						<FormGroup
							pClass="form-group-small m-b-xs-20"
							type="email"
							name="subscription-email-2"
							label=" Enter Email Address"
						/>
						<div className="m-b-xs-0">
							<button
								type="submit"
								className="btn btn-primary btn-small"
								disabled={status === 'loading'}
							>
								{status === 'loading' ? 'SE TRIMITE...' : 'SUBSCRIBE'}
							</button>
						</div>
						{message ? (
							<p
								className={`subscription-feedback subscription-feedback--${status} m-t-xs-15`}
								role="status"
							>
								{message}
							</p>
						) : null}
					</form>
				</div>
			</div>
		</div>
	);
};

export default WidgetNewsletter;
