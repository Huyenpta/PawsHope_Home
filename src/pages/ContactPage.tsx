import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! Our team will get back to you shortly.");
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5]">
      {/* Dynamic Header Section */}
      <section className="relative py-24 bg-[#2c5f51] overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
            alt="Contact Background"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Get in <span className="text-[#f6931d]">Touch</span>
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-medium">
            Whether you want to adopt, volunteer, or report a rescue, we are here to listen and help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl -mt-16 pb-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-none shadow-xl bg-[#f6931d] text-white p-8">
              <h4 className="text-xl font-black uppercase tracking-tighter mb-6">Direct Contact</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Call Us</p>
                    <p className="font-bold text-lg">(+84) 988 015 445</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Email Us</p>
                    <p className="font-bold text-lg">contact@pawshope.net</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-lg bg-white p-8">
              <h4 className="text-xl font-black uppercase tracking-tighter text-[#2c5f51] mb-6">Office Hours</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500 border-b border-gray-50 pb-2">
                  <span>Mon — Fri</span>
                  <span className="text-[#2c5f51]">08:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Sat — Sun</span>
                  <span className="text-[#f6931d]">10:00 - 17:00</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-10 md:p-14">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-[#2c5f51] uppercase tracking-tighter">Send a Message</h3>
                <p className="text-gray-400 font-medium mt-2">We typically respond within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-1">Full Name</label>
                    <Input placeholder="Your Name" className="h-14 rounded-2xl border-gray-100 bg-gray-50 px-6 focus:ring-[#2c5f51]" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-1">Email Address</label>
                    <Input type="email" placeholder="email@example.com" className="h-14 rounded-2xl border-gray-100 bg-gray-50 px-6 focus:ring-[#2c5f51]" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-1">Subject</label>
                  <Input placeholder="Adoption Inquiry, Volunteering, etc." className="h-14 rounded-2xl border-gray-100 bg-gray-50 px-6 focus:ring-[#2c5f51]" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-1">Message</label>
                  <Textarea placeholder="How can we help you today?" className="min-h-[150px] rounded-3xl border-gray-100 bg-gray-50 p-6 focus:ring-[#2c5f51]" required />
                </div>

                <Button className="w-full md:w-auto bg-[#2c5f51] hover:bg-[#1a3a32] text-white rounded-full font-black uppercase tracking-widest px-12 py-7 shadow-lg transition-all active:scale-95 flex items-center gap-2">
                  Send Message <Send size={18} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="mt-16 rounded-[3rem] overflow-hidden h-96 shadow-xl border-8 border-white relative group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863855881424!2d105.844444!3d21.028511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzQyLjYiTiAxMDXCsDUwJzQwLjAiRQ!5e0!3m2!1sen!2svn!4v1715600000000!5m2!1sen!2svn" 
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
          ></iframe>
          <div className="absolute bottom-6 left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-100">
            <div className="w-10 h-10 bg-[#2c5f51] rounded-full flex items-center justify-center text-white">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#f6931d]">Visit Us</p>
              <p className="font-bold text-[#2c5f51]">Hanoi City, Vietnam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};