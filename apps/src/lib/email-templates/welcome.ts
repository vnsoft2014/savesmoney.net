import { SITE } from '@/config/site';

type WelcomeEmailParams = {
    name: string;
    email: string;
};

export function getWelcomeEmailHtml({ name, email }: WelcomeEmailParams): string {
    const siteUrl = SITE.url || 'https://savesmoney.net';
    const siteName = SITE.name;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${siteName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 40px 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                ${siteName}
                            </h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                                Saving money with Big Discounts
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 8px; color: #1e293b; font-size: 22px; font-weight: 600;">
                                Welcome, ${name}!
                            </h2>
                            <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.6;">
                                Your account has been successfully created. We're thrilled to have you join the ${siteName} community!
                            </p>

                            <!-- Info Card -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 4px; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                            Account Details
                                        </p>
                                        <p style="margin: 0 0 2px; color: #334155; font-size: 14px;">
                                            <strong>Name:</strong> ${name}
                                        </p>
                                        <p style="margin: 0; color: #334155; font-size: 14px;">
                                            <strong>Email:</strong> ${email}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Features -->
                            <p style="margin: 0 0 16px; color: #334155; font-size: 15px; font-weight: 600;">
                                What you can do with ${siteName}:
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                                        ✅&nbsp;&nbsp;Discover verified deals & coupons from trusted stores
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                                        ✅&nbsp;&nbsp;Save your favorite deals for quick access
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                                        ✅&nbsp;&nbsp;Get notified about the best discounts
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                                        ✅&nbsp;&nbsp;Save money every day!
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <a href="${siteUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
                                            Start Exploring Deals →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 1px solid #e2e8f0;"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px 32px; text-align: center;">
                            <p style="margin: 0 0 4px; color: #94a3b8; font-size: 13px;">
                                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                                <a href="${siteUrl}" style="color: #6366f1; text-decoration: none;">savesmoney.net</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
