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
    console.log(
      `Отправляю сообщение для подтверждения аккаунта пользователю: ${user.login}`
    );
    const htmlEmail = `
      <h2 style="font-family: Arial, sans-serif;">STUDE-LIST. Подтверждение</h2>
      <hr>
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

  /**
   * Отослать письмо с ссылкой для сброса пароля
   */
  static async sendResetPasswordMessage(user: TUser) {
    console.log(
      `Отправляю сообщение для сброса пароля пользователю: ${user.login}`
    );

    const htmlEmail = `
      <h2 style="font-family: Arial, sans-serif;">STUDE-LIST. Сброс пароля</h2>
      <hr>
      Вы запросили сброс пароля в приложении <b>STUDE-LIST</b>. Перейдите по ссылке:
      <a href="${process.env.CLIENT}/password_restore/${user.id}">Ссылка для сброса пароля</a>
    `;
    const mailOptions = {
      from: '<noreply@stude-list.ru>',
      to: user.login,
      subject: 'Сброс пароля',
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
