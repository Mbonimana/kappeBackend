  import nodemailer from 'nodemailer';
  import {Transporter, SendMailOptions } from 'nodemailer';
  import dotenv from 'dotenv';
  dotenv.config();


  const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD, // your 16-char app password
  },
});
  //function to send mail

  const mailsender = async (
    to: string,
    subject: string,
    htmlContent: string,
    ): Promise<boolean>=>{
      try {
        const SendMailOptions = {
          from: process.env.EMAIL_NAME,
          to,
          subject,
          html: htmlContent,
        };

        await transporter.sendMail(SendMailOptions);
        console.log("Email Successfully");
        return true;
      } catch(error:any){
        console.error("Sending Mail Error", error);
        return false;
      }
    
    };

    
  export default mailsender;
    
  

