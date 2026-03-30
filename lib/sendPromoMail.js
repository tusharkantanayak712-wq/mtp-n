import { getTransporters } from "./mailTransporters";

/**
 * Sends promotional emails using multiple Gmail accounts to distribute load and improve speed.
 * Uses GMAIL_USER/GMAIL_APP_PASSWORD and GMAIL_USER2/GMAIL_APP_PASSWORD2 from environment variables.
 */
export async function sendPromoMail({ emails, subject, content, imageUrl, promoTitle }) {
  // Create transporters for all available accounts
  const transportersInfo = getTransporters();

  if (transportersInfo.length === 0) {
    throw new Error("No Gmail accounts configured for sending promotional emails.");
  }

  const results = {
    total: emails.length,
    success: 0,
    failed: 0,
    errors: []
  };

  // Send emails using a round-robin approach across available accounts
  // We process them in parallel in small batches to balance speed and stability
  const BATCH_SIZE = transportersInfo.length * 2; // Process a few at a time to utilize all accounts
  
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const chunk = emails.slice(i, i + BATCH_SIZE);
    
    await Promise.all(chunk.map(async (email, indexInChunk) => {
      const globalIndex = i + indexInChunk;
      const tInfo = transportersInfo[globalIndex % transportersInfo.length];
      const { transporter, account } = tInfo;

      try {
        await transporter.sendMail({
          from: `"mlbbtopup.in crew" <${account.user}>`,
          to: email,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #ffffff; }
                .container { max-width: 480px; margin: 0 auto; padding: 20px; }
                .logo { display: block; width: 40px; margin: 0 auto 30px; }
                .banner { width: 100%; border-radius: 8px; margin-bottom: 24px; display: block; }
                .promo-title { font-size: 20px; font-weight: 700; color: #111111; margin-bottom: 12px; line-height: 1.3; }
                .content { font-size: 15px; color: #444444; white-space: pre-wrap; margin-bottom: 30px; }
                .cta { display: block; width: fit-content; margin: 0 auto; background-color: #000000; color: #ffffff !important; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; }
                .footer { border-top: 1px solid #eeeeee; margin-top: 50px; padding-top: 20px; text-align: center; }
                .footer-text { font-size: 11px; color: #888888; margin: 4px 0; }
                .footer-link { color: #555555; text-decoration: none; font-weight: 500; }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="https://mlbbtopup.in/logoBB.png" alt="Logo" class="logo">
                
                ${imageUrl ? `<img src="${imageUrl}" alt="Banner" class="banner">` : ''}
                
                <div style="text-align: left;">
                  ${promoTitle ? `<h1 class="promo-title">${promoTitle}</h1>` : ''}
                  <div class="content">${content}</div>
                </div>

                <a href="https://mlbbtopup.in" class="cta">Visit Store</a>

                <div class="footer">
                  <p class="footer-text"><strong>mlbbtopup.in</strong></p>
                  <p class="footer-text">
                    <a href="https://mlbbtopup.in" class="footer-link">Home</a> • 
                    <a href="https://mlbbtopup.in" class="footer-link">Support</a>
                  </p>
                  <p class="footer-text" style="font-size: 9px; margin-top: 15px; opacity: 0.6;">
                    © 2026 mlbbtopup.in. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ email, error: error.message });
        console.error(`Failed to send email to ${email} using ${account.user}:`, error);
      }
    }));
  }

  return results;
}

