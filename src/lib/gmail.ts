import { getAccessToken } from './auth';

export const sendOrderConfirmationEmail = async (orderDetails: any) => {
  const token = await getAccessToken();
  if (!token) throw new Error("No available access token");

  const emailRaw = [
    `To: me`,
    `Subject: Order Confirmation - ${orderDetails.id}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    `<h2>Thank you for your order!</h2>`,
    `<p>Your order <strong>#${orderDetails.id}</strong> has been successfully placed.</p>`,
    `<p>Total: ₹${orderDetails.total.toFixed(2)}</p>`,
    `<ul>`,
    ...orderDetails.items.map((item: any) => `<li>${item.name} - ₹${item.price} (x${item.quantity})</li>`),
    `</ul>`,
    `<p>We will notify you once it ships.</p>`
  ].join('\n');

  const encodedEmail = btoa(emailRaw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Failed to send email");
  }

  return await response.json();
};
