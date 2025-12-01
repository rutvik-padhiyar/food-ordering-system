// utils/sendOrderEmail.js
const nodemailer = require("nodemailer");

const sendOrderEmail = async(userEmail, restaurantEmail, orderDetails) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 🏪 Restaurant Email (Professional + Delivery Time)
        const restaurantHtml = `
    <h2>New Order Received!</h2>
    <p><strong>Customer:</strong> ${orderDetails.customerName}</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetails.items
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price * item.quantity}</td>
          </tr>
        `
          )
          .join("")}
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total</strong></td>
          <td><strong>₹${orderDetails.totalAmount}</strong></td>
        </tr>
      </tbody>
    </table>
    <p><strong>Estimated Delivery Time:</strong> ${orderDetails.deliveryTime} minutes</p>
    <p>🔔 Please prepare this order within <strong>${orderDetails.deliveryTime} minutes</strong>.</p>
    <p>Thank you!</p>
  `;

  // 👤 Customer Email (Professional)
  const customerHtml = `
    <h2>Thank you for your order, ${orderDetails.customerName}!</h2>
    <p>Your order has been successfully placed. Here is your order summary:</p>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetails.items
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price * item.quantity}</td>
          </tr>
        `
          )
          .join("")}
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total</strong></td>
          <td><strong>₹${orderDetails.totalAmount}</strong></td>
        </tr>
      </tbody>
    </table>
    <p><strong>Estimated Delivery Time:</strong> ${orderDetails.deliveryTime} minutes</p>
    <p>We hope you enjoy your meal! 🍽️</p>
    <p>– Team Food Ordering System</p>
  `;

  // ✅ Send both emails
  await transporter.sendMail({
    from: `"Food Ordering System" <${process.env.EMAIL_USER}>`,
    to: restaurantEmail,
    subject: `New Order Received: ${orderDetails.orderId}`,
    html: restaurantHtml,
  });

  await transporter.sendMail({
    from: `"Food Ordering System" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmation: ${orderDetails.orderId}`,
    html: customerHtml,
  });
};

module.exports = sendOrderEmail;