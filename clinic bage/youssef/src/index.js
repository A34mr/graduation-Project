import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Calendar,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Target
} from 'lucide-react';

import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 min-h-screen pb-10 text-gray-800 font-sans">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </div>
        <span className="font-medium text-gray-700">Clinic Information</span>
      </div>

      {/* Hero Section */}
      <div className="m-4 rounded-2xl overflow-hidden relative h-56 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"
          alt="Clinic Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
          <h1 className="text-2xl font-bold mb-1">Dent AI Dental Clinic</h1>
          <p className="text-sm text-gray-200 mb-3 leading-snug max-w-md">
            We provide the best dental care services using the latest technology and medical equipment in a comfortable and safe environment
          </p>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="text-white">4.8 (523 reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={16} />
              <span>Established in 2010</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Card */}
      <div className="m-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-500 mt-0.5 shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Address</p>
            <p className="text-sm font-medium">King Fahd Street, Al Nakheel District, Riyadh 12345, Saudi Arabia</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-green-50 p-2 rounded-lg text-green-500 mt-0.5 shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Phone</p>
            <p className="text-sm font-medium">+966 11 234 5678</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-purple-50 p-2 rounded-lg text-purple-500 mt-0.5 shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Email</p>
            <p className="text-sm font-medium">info@dentai.sa</p>
          </div>
        </div>
      </div>

      {/* Working Hours Card */}
      <div className="m-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5 shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Working Hours</p>
          <p className="text-sm text-gray-600">Saturday - Thursday: 9:00 AM - 9:00 PM</p>
          <p className="text-sm text-gray-600">Friday: Closed</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="m-4 grid grid-cols-2 gap-3">
        {/* Total Patients */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col relative">
          <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
            <Users size={20} />
          </div>
          <div className="absolute top-4 right-4 text-green-500 text-xs font-bold flex items-center">
            ↗ +15%
          </div>
          <h3 className="text-xl font-bold mb-1">12,547</h3>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Patients</p>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col relative">
          <div className="bg-green-50 w-10 h-10 rounded-xl flex items-center justify-center text-green-500 mb-4">
            <Calendar size={20} />
          </div>
          <div className="absolute top-4 right-4 text-green-500 text-xs font-bold flex items-center">
            ↗ +8%
          </div>
          <h3 className="text-xl font-bold mb-1">342</h3>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Appointments This Month</p>
        </div>

        {/* Satisfaction */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col relative">
          <div className="bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center text-purple-500 mb-4">
            <Activity size={20} />
          </div>
          <div className="absolute top-4 right-4 text-green-500 text-xs font-bold flex items-center">
            ↗ +2%
          </div>
          <h3 className="text-xl font-bold mb-1">98%</h3>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Satisfaction Rate</p>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col relative">
          <div className="bg-yellow-50 w-10 h-10 rounded-xl flex items-center justify-center text-yellow-600 mb-4">
            <Award size={20} />
          </div>
          <div className="absolute top-4 right-4 text-gray-400 text-xs font-medium">
            Excellence
          </div>
          <h3 className="text-xl font-bold mb-1">15+</h3>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Years of Experience</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mx-4 mt-6 bg-white rounded-t-2xl shadow-sm border-b border-gray-100 flex overflow-hidden">
        {['Overview', 'Services', 'Medical Team'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            {tab === 'Overview' && <div className="w-4 h-4 border-2 rounded-sm border-current" />}
            {tab === 'Services' && <Activity size={16} />}
            {tab === 'Medical Team' && <Users size={16} />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white mx-4 rounded-b-2xl shadow-sm p-6">
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">About the Clinic</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Dent AI Clinic is one of the finest dental clinics in Saudi Arabia. Since its establishment in 2010, we have been providing the highest levels of oral and dental healthcare using the latest technology and advanced medical equipment.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                We take pride in our specialized medical team, which includes the best dentists in the region, providing a comfortable and safe treatment environment that combines extensive medical experience with modern technology.
              </p>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2">
                <ShieldCheck size={18} />
                Our Vision
              </div>
              <p className="text-sm text-blue-900/80 leading-relaxed">
                To be the first and best choice in dentistry in the region, providing a healthy and beautiful smile for every patient.
              </p>
            </div>

            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                <Target size={18} />
                Our Mission
              </div>
              <p className="text-sm text-green-900/80 leading-relaxed">
                To provide distinguished medical services with the highest quality and safety standards, with attention to patient comfort and complete satisfaction.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Highly Experienced Doctors',
                    desc: 'Specialized medical team with over 10 years of experience'
                  },
                  {
                    title: 'Latest Technology',
                    desc: 'Modern and advanced medical equipment'
                  },
                  {
                    title: 'Competitive Prices',
                    desc: 'Affordable prices with regular offers and discounts'
                  },
                  {
                    title: 'Strong Warranties',
                    desc: 'Long-term warranties on all our services'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-md p-1 mt-0.5 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Services' && (
          <div className="py-8 text-center text-gray-500 text-sm animate-in fade-in">
            Services content will go here...
          </div>
        )}

        {activeTab === 'Medical Team' && (
          <div className="py-8 text-center text-gray-500 text-sm animate-in fade-in">
            Medical Team content will go here...
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);