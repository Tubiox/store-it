from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

import os

from dotenv import load_dotenv
load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)
async def send_share_email(email: EmailStr, link: str):
    message = MessageSchema(
        subject="File Shared with You",
        recipients=[email],
        body=f"Download your file here:\n{link}",
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

async def send_otp_email(email: EmailStr, otp: str):
    message = MessageSchema(
        subject="Your SecureIt Verification OTP",
        recipients=[email],
        body=f"Welcome to SecureIt!\n\nYour One-Time Password (OTP) for account verification is:\n\n{otp}\n\nThis OTP is valid for 5 minutes. If you did not sign up for this account, please ignore this email.",
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)