import pkg from 'nodemailer';
const { createTransport } = pkg;

// Create transporter
const createTransporter = () => {
    console.log('Creating email transporter with:', {
        user: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_APP_PASSWORD,
        passwordLength: process.env.EMAIL_APP_PASSWORD?.length
    });
    
    return createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = createTransporter();
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    console.log('Attempting to send email to:', email);
    console.log('Reset link:', resetLink);

    const mailOptions = {
        from: `"BizConnect Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Password Reset Request - BizConnect',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 32px;
                        font-weight: bold;
                        margin-bottom: 8px;
                        letter-spacing: -0.5px;
                    }
                    .header p {
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #1f2937;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }
                    .message {
                        color: #4b5563;
                        font-size: 15px;
                        line-height: 1.8;
                        margin-bottom: 30px;
                    }
                    .button-container {
                        text-align: center;
                        margin: 35px 0;
                    }
                    .reset-button {
                        display: inline-block;
                        padding: 16px 40px;
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                        transition: transform 0.2s;
                    }
                    .reset-button:hover {
                        transform: translateY(-2px);
                    }
                    .alternative-link {
                        background-color: #f9fafb;
                        border: 2px dashed #d1d5db;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 25px 0;
                    }
                    .alternative-link p {
                        color: #6b7280;
                        font-size: 13px;
                        margin-bottom: 10px;
                        font-weight: 500;
                    }
                    .link-text {
                        color: #3b82f6;
                        word-break: break-all;
                        font-size: 12px;
                        font-family: monospace;
                        background-color: #fff;
                        padding: 12px;
                        border-radius: 6px;
                        border: 1px solid #e5e7eb;
                    }
                    .warning-box {
                        background-color: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 16px;
                        border-radius: 6px;
                        margin: 25px 0;
                    }
                    .warning-box p {
                        color: #92400e;
                        font-size: 14px;
                        margin: 0;
                    }
                    .warning-box strong {
                        color: #78350f;
                    }
                    .info-box {
                        background-color: #dbeafe;
                        border-left: 4px solid #3b82f6;
                        padding: 16px;
                        border-radius: 6px;
                        margin: 25px 0;
                    }
                    .info-box p {
                        color: #1e40af;
                        font-size: 14px;
                        margin: 0;
                    }
                    .footer {
                        background-color: #f9fafb;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 13px;
                        margin-bottom: 8px;
                    }
                    .footer-links {
                        margin-top: 15px;
                    }
                    .footer-link {
                        color: #f59e0b;
                        text-decoration: none;
                        font-weight: 500;
                        margin: 0 10px;
                        font-size: 13px;
                    }
                    .divider {
                        height: 1px;
                        background-color: #e5e7eb;
                        margin: 25px 0;
                    }
                    @media only screen and (max-width: 600px) {
                        body {
                            padding: 10px;
                        }
                        .header {
                            padding: 30px 20px;
                        }
                        .header h1 {
                            font-size: 24px;
                        }
                        .content {
                            padding: 30px 20px;
                        }
                        .reset-button {
                            padding: 14px 30px;
                            font-size: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <!-- Header -->
                    <div class="header">
                        <h1>🔒 BizConnect</h1>
                        <p>Your Business Connection Platform</p>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="content">
                        <p class="greeting">Hello!</p>
                        
                        <p class="message">
                            We received a request to reset the password for your BizConnect account. 
                            If you made this request, click the button below to create a new password.
                        </p>
                        
                        <!-- Reset Button -->
                        <div class="button-container">
                            <a href="${resetLink}" class="reset-button">
                                Reset My Password
                            </a>
                        </div>
                        
                        <!-- Info Box -->
                        <div class="info-box">
                            <p>
                                <strong>⏰ This link will expire in 24 hours</strong> for security reasons. 
                                If you need a new link, you can request another password reset.
                            </p>
                        </div>
                        
                        <!-- Alternative Link -->
                        <div class="alternative-link">
                            <p>If the button doesn't work, copy and paste this link into your browser:</p>
                            <div class="link-text">${resetLink}</div>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <!-- Warning Box -->
                        <div class="warning-box">
                            <p>
                                <strong>⚠️ Didn't request this?</strong><br>
                                If you didn't request a password reset, please ignore this email. 
                                Your password will remain unchanged and your account is secure.
                            </p>
                        </div>
                        
                        <p class="message" style="margin-top: 25px; color: #6b7280; font-size: 14px;">
                            For security reasons, we never ask for your password via email. 
                            If you have any questions or concerns, please contact our support team.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer">
                        <p style="font-weight: 600; color: #374151; margin-bottom: 12px;">
                            BizConnect Support Team
                        </p>
                        <p>© 2025 BizConnect. All rights reserved.</p>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                            This is an automated message, please do not reply to this email.
                        </p>
                        <div class="footer-links">
                            <a href="#" class="footer-link">Help Center</a>
                            <span style="color: #d1d5db;">|</span>
                            <a href="#" class="footer-link">Privacy Policy</a>
                            <span style="color: #d1d5db;">|</span>
                            <a href="#" class="footer-link">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        // Plain text version for email clients that don't support HTML
        text: `
BizConnect - Password Reset Request

Hello!

We received a request to reset the password for your BizConnect account.

To reset your password, please click the link below or copy and paste it into your browser:
${resetLink}

This link will expire in 24 hours for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

For security reasons, we never ask for your password via email.

© 2025 BizConnect. All rights reserved.
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        throw error;
    }
};
