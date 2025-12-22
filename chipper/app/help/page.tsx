'use client';

import { Clock, Mail, MessageCircle, Phone, Shield, Truck } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get instant support via WhatsApp, phone, or browse our frequently asked questions
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* WhatsApp - Primary */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-emerald-200">
            <div className="w-20 h-20 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Chat on WhatsApp</h3>
            <p className="text-gray-600 mb-8">
              Fastest response — our team replies within minutes during business hours
            </p>
            <a
              href="https://wa.me/254768378046"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 btn btn-success btn-lg w-full"
            >
              <MessageCircle className="w-6 h-6" />
              Start Chat Now
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
            <p className="text-gray-600 mb-8">
              Speak directly with our support team
            </p>
            <a href="tel:+254768378046" className="text-3xl font-bold text-emerald-600">
              +254 768 378 046
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Support</h3>
            <p className="text-gray-600 mb-8">
              We&apos;ll respond within 24 hours
            </p>
            <a href="mailto:support@chipper.ke" className="text-xl font-medium text-blue-600 hover:underline">
              support@chipper.ke
            </a>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {/* Delivery & Shipping */}
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <Truck className="w-12 h-12 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Delivery & Shipping</h2>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">How long does delivery take?</h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Nairobi & major towns:</strong> 24–48 hours<br />
                  <strong>Other areas in Kenya:</strong> 2–5 business days
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Is delivery free?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes! <strong>Free delivery nationwide</strong> on all orders.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I track my order?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Absolutely! You&apos;ll receive a tracking link via SMS and email once your order is dispatched.
                </p>
              </div>
            </div>
          </div>

          {/* Payments & Security */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">Ksh</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What payment methods do you accept?</h3>
                  <p className="text-gray-700">Cash on Delivery • M-Pesa (coming soon)</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Is it safe to shop on Chipper?</h3>
                  <p className="text-gray-700">
                    Yes! Pay on delivery means you only pay when you receive and verify your items.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <Shield className="w-12 h-12 text-emerald-600" />
                <h2 className="text-3xl font-bold text-gray-900">Returns & Security</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What is your return policy?</h3>
                  <p className="text-gray-700">
                    7-day return policy for unused items in original packaging.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">How is my data protected?</h3>
                  <p className="text-gray-700">
                    We use bank-level encryption and never store payment details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-10 text-center text-white shadow-2xl">
            <Clock className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl font-bold mb-4">Support Hours</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-xl">
              <div>
                <p className="font-semibold">Monday – Saturday</p>
                <p className="text-2xl mt-2">8:00 AM – 8:00 PM</p>
              </div>
              <div>
                <p className="font-semibold">Sunday</p>
                <p className="text-2xl mt-2">9:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <p className="text-2xl text-gray-800 mb-8">
            Still need help? We&apos;re always here for you!
          </p>
          <a
            href="https://wa.me/254768378046"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 btn btn-success btn-lg text-xl px-12 py-6"
          >
            <MessageCircle className="w-8 h-8" />
            Chat with Support Now
          </a>
        </div>
      </div>
    </div>
  );
}