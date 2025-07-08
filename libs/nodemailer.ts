import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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
    var transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "c20a730263dfdfac5cec3c6df59c3e02",
      },
    });
    const verifyEmailHtml = `<p>Click <a href="${process.env.DOMAIN}/verifyEmail?token=${token}" >here</a> to "verify your email" 
       or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/verifyEmail?token=${token}</p>`;
    const resetPasswordEmailHtml = `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${token}" >here</a> to  "reset your password"
       or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/resetpassword?token=${token}</p>`;
    const mailOptions = {
      from: "info@demomailtrap.co",
      to: email,
      subject:
        mailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: mailType === "VERIFY" ? verifyEmailHtml : resetPasswordEmailHtml,
    };
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("error sending email: ", error);
  }
};
