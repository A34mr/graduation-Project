import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Calendar, CheckCircle,
  Users, Clock, Star, Edit
} from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const stats = [
    { title: 'Today', count: '4 Appointments', sub: 'Scheduled for today', icon: <Calendar size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Completed', count: '1 Appointment', sub: 'Completed today', icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Patients', count: '127 Patients', sub: 'Total patients', icon: <Users size={18} className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Upcoming', count: '3 Appointments', sub: 'Next few days', icon: <Clock size={18} className="text-yellow-500" />, bg: 'bg-yellow-50' },
  ];

  const upcomingAppointments = [
    { name: 'Abdullah Youssef', type: 'Routine Checkup', phone: '+20 10 234 5678', date: 'Feb 6, 2026', time: '09:00 AM', initial: 'A', color: 'bg-purple-600' },
    { name: 'Noura Khaled', type: 'Orthodontics', phone: '+20 11 345 6789', date: 'Feb 6, 2026', time: '11:00 AM', initial: 'N', color: 'bg-fuchsia-600' },
    { name: 'Majed Abdulrahman', type: 'Dental Implant', phone: '+20 12 456 7890', date: 'Feb 7, 2026', time: '10:00 AM', initial: 'M', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 font-sans text-slate-600">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto bg-[#1E56E3] rounded-2xl p-6 text-white relative shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"
              alt="Doctor"
              className="w-20 h-20 rounded-full border-2 border-white/30 object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-lg font-semibold">Dr. Ahmed Mahmoud</h1>
            <p className="text-xs opacity-90 font-light">Dental Implants & Cosmetic Dentistry Consultant</p>
            <div className="flex justify-center md:justify-start gap-4 mt-2 text-[10px]">
              <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.9 (247 reviews)</span>
              <span className="opacity-80 flex items-center gap-1"><Clock size={12} /> 15 Years Experience</span>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition text-xs">
            <Edit size={14} /> Edit Profile
          </button>
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6 bg-white rounded-xl p-3 text-slate-500 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-xs"><div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Mail size={14} /></div> dr.ahmed@dentalclinic.com</div>
          <div className="flex items-center gap-2 text-xs"><div className="p-1.5 bg-green-50 rounded-lg text-green-500"><Phone size={14} /></div> +20 10 123 4567</div>
          <div className="flex items-center gap-2 text-xs"><div className="p-1.5 bg-purple-50 rounded-lg text-purple-500"><MapPin size={14} /></div> Main Clinic - Cairo</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-slate-50">
            <div>
              <p className="text-blue-400 text-[11px] font-medium uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-sm font-bold text-slate-700 mt-0.5">{stat.count}</h3>
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            </div>
            <div className={`${stat.bg} p-2.5 rounded-lg`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[
            { id: 'today', label: "Today's Appointments", icon: <Calendar size={14} /> },
            { id: 'upcoming', label: "Upcoming Appointments", icon: <Clock size={14} /> },
            { id: 'patients', label: "Patients List", icon: <Users size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-xs font-medium transition-all ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                  : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Appointment List Content */}
        <div className="p-2">
          {activeTab === 'upcoming' && (
            <div className="divide-y divide-slate-50">
              {upcomingAppointments.map((app, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition group">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 ${app.color} text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm`}>
                      {app.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700">{app.name}</h4>
                      <p className="text-[11px] text-slate-400 font-light">{app.type}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                        <Phone size={10} /> {app.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-slate-500">{app.date}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{app.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'today' && <div className="p-10 text-center text-xs text-slate-400 font-light">No appointments left for today.</div>}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;