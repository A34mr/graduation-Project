import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Calendar, MessageCircle, Send, 
  X, FileText, PlusCircle, Clock, ChevronRight
} from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Ziad El-Sayed", time: "05:00 PM", type: "Root Canal" },
    { id: 2, name: "Mariam Hassan", time: "06:30 PM", type: "Scaling" }
  ]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'أهلاً دكتور أحمد! كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setMessages([...messages, { role: 'user', text: userText }]);
    setChatInput("");
    setTimeout(() => {
      let botResponse = "أنا معك يا دكتور، هل تريد مراجعة المواعيد؟";
      if (userText.includes("موعد") || userText.includes("مين")) {
        const names = appointments.map(a => a.name).join(", ");
        botResponse = `لديك ${appointments.length} مواعيد اليوم: ${names}.`;
      }
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const name = e.target.pname.value;
    const time = e.target.ptime.value;
    setAppointments([...appointments, { id: Date.now(), name, time, type: "Checkup" }]);
    setShowBook(false);
  };

  const handleRx = (e) => {
    e.preventDefault();
    const newRx = { id: Date.now(), p: e.target.p.value, m: e.target.m.value };
    setPrescriptions([newRx, ...prescriptions]);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#1f2937] pb-20 font-sans" dir="ltr">
      
      {/* Navbar - تم إصلاح الخطأ هنا */}
      <nav className="bg-white border-b border-[#e5e7eb] px-6 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl text-[#1863ff]">
          <div className="bg-[#eef5ff] p-2 rounded-xl"><Activity size={22}/></div>
          <span className="tracking-tight italic font-black">DENT AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-[12px] font-bold text-[#6b7280]">
          <button onClick={() => setTab('dashboard')} className={tab === 'dashboard' ? 'text-[#1863ff]' : 'hover:text-[#1863ff]'}>Dashboard</button>
          <button onClick={() => setTab('rx')} className={tab === 'rx' ? 'text-[#1863ff]' : 'hover:text-[#1863ff]'}>Prescriptions</button>
          <button onClick={() => setTab('ai')} className={tab === 'ai' ? 'text-[#1863ff]' : 'hover:text-[#1863ff]'}>AI Vision</button>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#f2f7ff] border border-[#e5e7eb] flex items-center justify-center font-bold text-[#1863ff]">AM</div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6 border-b border-[#e5e7eb] pb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1f2937]">Dr. Ahmed Mahmoud</h1>
            <p className="text-[#6b7280] font-medium text-sm mt-1">Smart Dental Management System</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowBook(true)} className="bg-white border border-[#e5e7eb] text-[#1f2937] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#f2f7ff] flex items-center gap-2 shadow-sm transition-all">
              <Calendar size={18} className="text-[#1863ff]" /> Book Visit
            </button>
            <button onClick={() => setTab('rx')} className="bg-[#1863ff] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1853d8] flex items-center gap-2 shadow-lg transition-all">
              <PlusCircle size={18} /> New RX
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {tab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1863ff] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden h-80 flex flex-col justify-end">
              <h2 className="text-4xl font-black italic uppercase relative z-10">Clinic Status</h2>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#e5e7eb] h-80 overflow-y-auto">
              <h3 className="font-black text-xs uppercase mb-6 flex items-center gap-2 text-[#1f2937] border-b pb-2 italic"><Clock size={18} className="text-[#1863ff]"/> Upcoming Visits</h3>
              <div className="space-y-3">
                {appointments.map(app => (
                  <div key={app.id} className="p-4 bg-[#f6f8fc] rounded-2xl border-l-4 border-[#1863ff] flex justify-between items-center shadow-sm">
                    <span className="font-black text-xs uppercase text-[#1f2937]">{app.name}</span>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full text-[#1863ff] border border-[#e5e7eb]">{app.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prescription Pad */}
        {tab === 'rx' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-[#e5e7eb]">
            <h3 className="font-black text-2xl mb-8 uppercase text-[#1f2937] italic">Digital Prescription Pad</h3>
            <form onSubmit={handleRx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <input name="p" required placeholder="Patient Name" className="p-4 bg-[#f6f8fc] rounded-2xl border outline-none font-bold text-xs focus:border-[#1863ff]" />
              <input name="m" required placeholder="Medicine" className="p-4 bg-[#f6f8fc] rounded-2xl border outline-none font-bold text-xs focus:border-[#1863ff]" />
              <button type="submit" className="bg-[#1863ff] text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-[#1853d8]">Save RX</button>
            </form>
          </div>
        )}
      </main>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {showChat && (
          <div className="bg-white w-80 h-[450px] rounded-[2.5rem] shadow-2xl border border-[#e5e7eb] flex flex-col overflow-hidden mb-4">
            <div className="bg-[#1863ff] p-5 text-white flex justify-between items-center shadow-lg">
              <span className="font-black text-[10px] uppercase tracking-widest italic">Clinic Assistant</span>
              <X className="cursor-pointer" size={18} onClick={() => setShowChat(false)} />
            </div>
            <div className="flex-1 p-5 bg-[#f6f8fc] overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-bold ${m.role === 'user' ? 'bg-[#1863ff] text-white' : 'bg-white border'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type here..." className="flex-1 bg-[#f6f8fc] p-3 rounded-2xl text-[10px] outline-none" />
              <button type="submit" className="bg-[#1863ff] text-white p-3 rounded-2xl"><Send size={14} /></button>
            </form>
          </div>
        )}
        <button onClick={() => setShowChat(!showChat)} className="bg-[#1863ff] text-white p-5 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform">
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Booking Modal */}
      {showBook && (
        <div className="fixed inset-0 bg-[#1f2937]/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <form onSubmit={handleBooking} className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl space-y-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black uppercase text-[#1f2937] italic">New Visit</h2>
              <X className="cursor-pointer" onClick={() => setShowBook(false)} />
            </div>
            <input name="pname" required placeholder="Patient Name" className="w-full p-4 bg-[#f6f8fc] rounded-2xl border outline-none font-bold text-xs focus:border-[#1863ff]" />
            <input name="ptime" type="time" required className="w-full p-4 bg-[#f6f8fc] rounded-2xl border outline-none font-bold text-xs focus:border-[#1863ff]" />
            <button type="submit" className="w-full bg-[#1863ff] text-white py-5 rounded-[1.5rem] font-black uppercase shadow-xl text-[10px]">Confirm</button>
          </form>
        </div>
      )}
    </div>
  );
}