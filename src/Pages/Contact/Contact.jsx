import axios from "axios";
import React, { useState } from "react";
import ContactForm from "./ContactForm";
import ContactHeader from "./ContactHeader";




const Contact = () => {

  return (
    <div className="relative max-w-3xl m-auto px-4 md:px-8">
      <ContactHeader/>
     <ContactForm/>
    </div>
  );
};

export default Contact;
