import axios from "axios";

export const sendEmail = async (formData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const data = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      phone: formData.phone,
      time: new Date().toLocaleString(),
    },
  };

  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", data);
    return { success: true, message: "✅ Message sent successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "❌ Failed to send message. Try again later." };
  }
};
