import { link } from "fs";
import nodemailer from "nodemailer";

const MailSender = (email: string, code: number) => {
  console.log(
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_USER,
    process.env.SMTP_PASS
  );
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: "buichemathieu@gmail.com",
    to: email,
    subject: "Verification de l'email",
    text: "Veuillez rentrez le code ci-dessous pour verifier votre email",
    html: code.toString(),
  };

  transporter.verify(function (error, success) {
    if (error) {
      console.log("Erreur de connexion :", error);
    } else {
      console.log("Le serveur est prêt à prendre nos messages");
    }
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur :", error);
    } else {
      console.log("Email envoyé : " + info.response);
    }
  });
};

export default MailSender;
