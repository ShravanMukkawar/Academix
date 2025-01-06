// emailTemplates.js

// Function to generate the password reset email HTML content
const passwordResetEmail = (user, resetURL) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <tr>
                <td align="center" bgcolor="#2596be" style="padding: 20px 0;">
                    <h1 style="color: #ffffff; margin: 0;">Reset Your Password</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <p style="font-size: 16px; color: #333333;">Hi ${user.name},</p>
                    <p style="font-size: 16px; color: #333333;">We received a request to reset your password for your account. Click the button below to reset it:</p>
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                        <tr>
                            <td align="center" bgcolor="#2596be" style="border-radius: 5px;">
                                <a href="${resetURL}" target="_blank" style="font-size: 16px; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 5px;">Reset Password</a>
                            </td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; color: #333333;">If you didn't request this, please ignore this email or contact support if you have questions.</p>
                    <p style="font-size: 16px; color: #333333;">Thanks,<br>The Academix Team</p>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#f4f4f4" style="padding: 20px;">
                    <p style="font-size: 12px; color: #777777;">If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
                    <p style="font-size: 12px; color: #2596be;"><a href="${resetURL}" style="color: #2596be;">${resetURL}</a></p>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#2596be" style="padding: 10px;">
                    <p style="font-size: 12px; color: #ffffff;">&copy; 2024 Academix. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Function to generate the OTP verification email HTML content
const otpVerificationEmail = (name, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <tr>
                <td align="center" bgcolor="#2596be" style="padding: 20px 0;">
                    <h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <p style="font-size: 16px; color: #333333;">Hi ${name},</p>
                    <p style="font-size: 16px; color: #333333;">Welcome to Academix! Please use the following OTP to verify your email address:</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <div style="display: inline-block; background-color: #f8f8f8; border: 2px dashed #2596be; padding: 20px 40px; border-radius: 10px;">
                            <span style="font-size: 32px; font-weight: bold; color: #2596be; letter-spacing: 5px;">${otp}</span>
                        </div>
                    </div>
                    <p style="font-size: 16px; color: #333333;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
                    <p style="font-size: 14px; color: #666666;">For security reasons, if you didn't request this verification, please ignore this email.</p>
                    <p style="font-size: 16px; color: #333333;">Thanks,<br>The Academix Team</p>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#f4f4f4" style="padding: 20px;">
                    <p style="font-size: 12px; color: #777777;">This is an automated email. Please do not reply to this message.</p>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#2596be" style="padding: 10px;">
                    <p style="font-size: 12px; color: #ffffff;">&copy; 2024 Academix. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Export the functions to use them in other files
module.exports = { passwordResetEmail, otpVerificationEmail };