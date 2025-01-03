import nodemailer from 'nodemailer';

const sendNotificationEmail = async (recipientEmail, updatedData) => {
    console.log('BREVO_EMAIL_USER:', process.env.BREVO_EMAIL_USER);
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY);
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_EMAIL_USER,
                pass: process.env.BREVO_API_KEY,
            },
            logger: true,
            debug: true,
        });

        const mailOptions = {
            from: '"Kemensos" <mujahidramdhani150@gmail.com>',
            to: "mujahidramdhani@gmail.com", 
            subject: 'Pembaruan Status Verifikasi',
            text: `Status data Anda telah diperbarui dengan status: ${JSON.stringify(updatedData, null, 2)}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email berhasil dikirim.');
    } catch (error) {
        console.error('Gagal mengirim email:', error);
    }
};

export default sendNotificationEmail;
