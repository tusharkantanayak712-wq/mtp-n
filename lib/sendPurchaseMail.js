import { getNextTransporter } from "./mailTransporters";

export async function sendPurchaseMail({ to, name, orderId }) {
  const tInfo = getNextTransporter();
  if (!tInfo) {
    throw new Error("No mail transporters available for purchase mail.");
  }
  
  const { transporter, account } = tInfo;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Thank you for your purchase, ${name}! 🎉</h2>
      <p>Your order has been successfully completed.</p>

      <p><strong>Order ID:</strong> ${orderId}</p>

      <p>
        We truly appreciate your trust in us.<br/>
        Enjoy your purchase and feel free to visit us again anytime!
      </p>

      <p style="margin-top: 24px;">
        Regards,<br/>
        <strong>Your Store Team</strong>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Support" <${account.user}>`,
    to,
    subject: "Thank you for your purchase!",
    html,
  });
}
