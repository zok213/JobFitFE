"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Here you would normally send the form data to your backend
      console.log("Form submitted:", formData);
      // Reset form after submission
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact-us" className="px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto">
      <div className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Contact Us
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-lime-300 rounded-3xl p-8 md:p-12">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 text-sm mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Say hi at</span>
            </div>
            
            <Input 
              name="name"
              className="bg-white border-none text-black placeholder:text-gray-500 h-12 px-5" 
              placeholder="Name" 
              value={formData.name}
              onChange={handleInputChange}
            />

            <Input
              name="email"
              className="bg-white border-none text-black placeholder:text-gray-500 h-12 px-5"
              placeholder="Email*"
              required
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <Textarea
              name="message"
              className="bg-white border-none text-black placeholder:text-gray-500 min-h-[150px] p-5"
              placeholder="Message*"
              required
              value={formData.message}
              onChange={handleInputChange}
            />

            <Button 
              type="submit" 
              className="w-full bg-black text-white font-medium py-4 rounded-xl transition-colors hover:bg-zinc-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Send Message'}
            </Button>
          </form>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative w-full h-[300px] md:h-[400px]">
            <Image
              src="/img/Contact_us.png"
              alt="Contact us illustration"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
