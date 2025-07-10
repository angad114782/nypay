const axios = require("axios");

exports.sendOtpWhatsApp = async (mobile, otp) => {
  try {
    const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: mobile,
      type: "template",
      template: {
        name: "otp_message2",
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otp, // Placeholder {{1}} in body
              },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [
              {
                type: "text",
                text: otp, // Placeholder {{1}} in button url (e.g., /verify/{{1}})
              },
            ],
          },
        ],
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });
    // console.log("✅ WhatsApp OTP sent:", response.data);
  } catch (err) {
    console.error("❌ WhatsApp OTP Error:", err.response?.data || err.message);
    throw new Error("Failed to send WhatsApp message");
  }
};
