const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const readHTMLFile = ( path, callback ) => {
	fs.readFile( path, { encoding: 'utf-8' }, (err, html) => {
		if ( err ) { callback(err); }
		else { callback(null, html); }
	});
};

const sendMail = async ( email, subject, template, replacements, attachments ) => {
	return new Promise(async (resolve, reject) => {
		try {
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.GMAIL_USER,
					pass: process.env.GMAIL_PASSWORD,
				}
			});
			readHTMLFile( path.join(__dirname, `/../../public/templates/${ template }.mail.html`), async ( err, html ) => {
				let template = handlebars.compile( html );
				let htmlToSend = template( replacements );
				const mailOptions = {
					from: process.env.GMAIL_USER,
					to: email,
					subject: subject,
					html: htmlToSend,
					attachments: attachments
				};

				await transporter.sendMail(mailOptions, (error, info) => {
					if ( error ) { reject( error ) }
					else { resolve({ email, subject, info }) }
				});	
			});
		} catch( error ) { reject( error ) }
	});
}

module.exports = {
		
	sendConfirmationMail : async ( email, data ) => {
		const replacements = {
			'firstname': data.firstname,
			'lastname': data.lastname,
			'link_to': `${ process.env.URL_CLIENT }/verify?token=${ data.token }`
		};
		const attachments = [
			{
				filename: 'mail.png',
				path: path.join(__dirname, `/../../public/mail-images/mail.png`),
				cid: 'unique@account.confirmation'
			}
		];
		const subject = '[Hypertube] Verify your email address';
		return await sendMail( email, subject, 'confirmation', replacements, attachments );
	},
	sendSuccessConfirmationMail : async ( email, data ) => {
		const replacements = {
			firstname: data.firstname,
			lastname: data.lastname,
			email: email
		};
		const attachments = [
			{
				filename: 'verified.png',
				path: path.join(__dirname, `/../../public/mail-images/verified.png`),
				cid: 'unique@account.verified'
			}
		];
		const subject = '[Hypertube] Account verified successfully';
		return await sendMail( email, subject, 'accountverified', replacements, attachments );
	},
	sendRecoveryMail : async ( email, data ) => {
		const replacements = {
			firstname: data.firstname,
			lastname: data.lastname,
			link_to: `${ process.env.URL_CLIENT }/newpassword?token=${ data.token }`
		};
		const attachments = [
			{
				filename: 'resetpass.png',
				path: path.join(__dirname, `/../../public/mail-images/resetpass.png`),
				cid: 'unique@reset-password'
			}
		];
		const subject = '[Hypertube] Reset password';
		return await sendMail( email, subject, 'resetpassword', replacements, attachments );
	}
}