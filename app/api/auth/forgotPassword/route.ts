import { sendEmail } from "@/libs/nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Please provide email" });
    }
    sendEmail({ email, mailType: "RESET" });
    return NextResponse.json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Error sending password reset email" });
  }
}
