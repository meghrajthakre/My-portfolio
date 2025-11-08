import axios from "axios";
import React, { useState } from "react";
import ContactHeader from "./ContactHeader";
import ContactForm from "./ContactForm";

const Contact = () => {

  return (
    <div className="relative max-w-3xl m-auto px-4 md:px-8">
      <ContactHeader />
      <ContactForm />
    </div>
  );
};

export default Contact;
