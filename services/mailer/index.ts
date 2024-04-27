import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

import { TUser } from '../../models/user/types';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class Mailer {
  /**
   * Отослать письмо с ссылкой для подтверждения
   */
  static async sendAllowMessage(user: TUser) {
    console.log(`Отправляю сообщение пользователю: ${user.login}`);
    const htmlEmail = `
      Подтвердите свой аккаунт в сервисе <b>STUDE-LIST</b> перейдя по ссылке:
      <a href="${process.env.CLIENT}/allow/${user.id}">Ссылка для подтверждения</a>
    `;
    const mailOptions = {
      from: '<noreply@stude-list.ru>',
      to: user.login,
      subject: 'Подтверждение аккаунта',
      html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }
}

export default Mailer;
