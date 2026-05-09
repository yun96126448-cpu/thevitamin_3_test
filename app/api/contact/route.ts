import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, phone, topics, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">📋 새 문의가 접수되었습니다</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; background: #f9f9f9; font-weight: bold; width: 120px;">이름</td>
          <td style="padding: 10px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">이메일</td>
          <td style="padding: 10px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">전화번호</td>
          <td style="padding: 10px;">${phone || "미입력"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">문의 유형</td>
          <td style="padding: 10px;">${topics.join(", ")}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">문의 내용</td>
          <td style="padding: 10px; white-space: pre-wrap;">${message}</td>
        </tr>
      </table>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"더비타민 문의" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `[더비타민] ${name}님이 문의를 남겼습니다 (${topics.join(", ")})`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("메일 발송 오류:", err);
    return NextResponse.json({ ok: false, error: "메일 발송 실패" }, { status: 500 });
  }
}
