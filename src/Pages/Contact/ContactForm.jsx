// src/Pages/Contact/ContactForm.jsx
import React, { useState } from "react";
import { sendEmail } from "./contactServiceData";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus("");

    const result = await sendEmail(formData);
    setStatus(result.message);
    setIsSending(false);

    if (result.success) {
      setFormData({ name: "", phone: "", email: "", message: "" });
    }
  };

  return (
    <div className="mt-6 mb-16 px-4 md:px-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name & Phone */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 w-full">
          <div className="flex flex-col gap-2 w-full sm:w-1/2">
            <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter Your Full Name"
              className="px-4 py-2 text-sm rounded-md border border-dashed outline-none 
              border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)]
              hover:border-[var(--color-text)] focus:border-[var(--color-text)]
              transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-1/2">
            <label htmlFor="phone" className="text-sm font-medium text-[var(--color-text)]">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (123) xxxx-xxxx"
              className="px-4 py-2 text-sm rounded-md border border-dashed outline-none 
              border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)]
              hover:border-[var(--color-text)] focus:border-[var(--color-text)]
              transition-colors duration-300"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="px-4 py-2 text-sm rounded-md border border-dashed outline-none 
            border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)]
            hover:border-[var(--color-text)] focus:border-[var(--color-text)]
            transition-colors duration-300"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-medium text-[var(--color-text)]">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Tell me about your project or just say hi..."
            rows="5"
            className="px-4 py-2 text-sm rounded-md border border-dashed outline-none 
            border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] resize-none
            hover:border-[var(--color-text)] focus:border-[var(--color-text)]
            transition-colors duration-300"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSending}
          className="mt-4 px-5 py-2 rounded-md font-semibold text-sm 
          bg-[var(--color-accent)] text-[var(--color-bg)]
          hover:brightness-110 shadow-md hover:shadow-lg 
          transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]
          cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>

        {status && (
          <p className="text-center text-sm mt-3 text-[var(--color-secondary-text)]">
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
