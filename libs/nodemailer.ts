import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
import { Resend } from "resend";

export const sendEmail = async ({
  email,
  mailType,
}: {
  email: string;
  mailType: string;
}) => {
  try {
    const currUser = await userModel.findOne({ email });
    if (!currUser) {
      console.error(
        "Cannot send email since email does not belong to an account!"
      );
    }
    const token = await bcrypt.hash(currUser._id.toString(), 10);
    if (mailType === "VERIFY") {
      const userToVerify = await userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            verifyToken: token,
            verifyTokenExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000),
          },
        }
      );
    } else if (mailType === "RESET") {
      const userToChange = await userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: new Date(
              Date.now() + 2 * 60 * 60 * 1000
            ),
          },
        }
      );
    }
    // this is the nodemailer code to send email using mailtrap
    // var transporter = nodemailer.createTransport({
    //   host: process.env.MAILER_HOST,
    //   port: Number(process.env.MAILER_PORT),
    //   auth: {
    //     user: process.env.MAILER_USER,
    //     pass: process.env.MAILER_PASS,
    //   },
    // });
    // const mailResponse = await transporter.sendMail(mailOptions);
    // return mailResponse;

    // const verifyEmailHtml = `<p>Click <a href="${process.env.DOMAIN}/verifyEmail?token=${token}" >here</a> to "verify your email"
    //    or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/verifyEmail?token=${token}</p>`;
    const verifyEmailHtml = `
   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #4f46e5; margin-bottom: 10px;">Welcome to Notesify 👋</h2>
      <p style="color: #444; font-size: 16px;">
        Thank you for signing up! You're one step away from taking beautiful, organized notes.
      </p>
      <p style="margin-top: 20px; font-size: 16px;">Click the button below to verify your email:</p>

      <table cellspacing="0" cellpadding="0" style="margin: 25px 0;">
        <tr>
          <td align="center" bgcolor="#4f46e5" style="border-radius: 8px;">
            <a href="${process.env.DOMAIN}/verify?token=${token}"
              target="_blank"
              style="display: inline-block; padding: 12px 24px; font-size: 15px; color: #ffffff; text-decoration: none; font-weight: 500; font-family: sans-serif;">
              ✅ Verify Email
            </a>
          </td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        If the button doesn't work, copy and paste the following link into your browser:<br />
        <a href="${process.env.DOMAIN}/verify?token=${token}" style="color: #4f46e5;">${process.env.DOMAIN}/verify?token=${token}</a>
      </p>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        If you didn't sign up for Notesify, you can safely ignore this email.
      </p>

      <p style="margin-top: 20px; font-size: 14px; color: #999;">— The Notesify Team</p>
    </div>
  </div>
  `;

    const resetPasswordEmailHtml = `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${token}" >here</a> to  "reset your password"
       or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/resetpassword?token=${token}</p>`;

    // this is code to send email using Resend

    const mailOptions = {
      from: "Notesify <no-reply@notesify.nishchayag.live>",
      to: email,
      subject:
        mailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: mailType === "VERIFY" ? verifyEmailHtml : resetPasswordEmailHtml,
    };

    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send(mailOptions);
    console.log("Email sent successfully: ", response);
  } catch (error) {
    console.error("error sending email: ", error);
  }
};
