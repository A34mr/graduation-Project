import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Calendar, MessageCircle, Send, 
  X, FileText, Upload, PlusCircle, Clock, CheckCircle 
} from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // داتا المواعيد والروشتات
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Ziad El-Sayed", time: "05:00 PM", type: "Root Canal" },
    { id: 2, name: "Mariam Hassan", time: "06:30 PM", type: "Scaling" }
  ]);
  const [prescriptions, setPrescriptions] = useState([]);

  // --- منطق الشات الجديد ---
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'أهلاً دكتور أحمد! كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const chatEndRef = useRef(null);

  // سكرول تلقائي لآخر رسالة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setChatInput("");

    // رد البوت الذكي
    setTimeout(() => {
      let botResponse = "أنا معك يا دكتور، هل تقصد الاستعلام عن جدول اليوم؟";
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes("موعد") || lowerText.includes("مين") || lowerText.includes("جدول")) {
        const names = appointments.map(a => a.name).join(", ");
        botResponse = `لديك ${appointments.length} مواعيد اليوم لـ: ${names}.`;
      } else if (lowerText.includes("روشتة") || lowerText.includes("دواء")) {
        botResponse = "يمكنك الانتقال لتبويب Prescriptions لكتابة روشتة جديدة.";
      } else if (lowerText.includes("شكرا")) {
        botResponse = "العفو يا دكتور، بالتوفيق في عملك!";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  // وظيفة إضافة موعد جديد
  const handleBooking = (e) => {
    e.preventDefault();
    const name = e.target.pname.value;
    const time = e.target.ptime.value;
    setAppointments([...appointments, { id: Date.now(), name, time, type: "Checkup" }]);
    setShowBook(false);
  };

  // وظيفة إضافة روشتة
  const handleRx = (e) => {
    e.preventDefault();
    const newRx = { id: Date.now(), p: e.target.p.value, m: e.target.m.value };
    setPrescriptions([newRx, ...prescriptions]);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans" dir="ltr">
      
      {/* --- Navbar --- */}
      <nav className="bg-[#003d80] text-white p-4 shadow-xl sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black text-xl italic"><Activity size={24}/> DENT AI</div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
          <button onClick={() => setTab('dashboard')} className={tab === 'dashboard' ? 'text-blue-300' : ''}>Dashboard</button>
          <button onClick={() => setTab('rx')} className={tab === 'rx' ? 'text-blue-300' : ''}>Prescriptions</button>
          <button onClick={() => setTab('ai')} className={tab === 'ai' ? 'text-blue-300' : ''}>AI Vision</button>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs shadow-inner">DR</div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 text-center md:text-left border-b pb-8">
          <div>
            <h1 className="text-4xl font-black text-[#003d80] uppercase tracking-tighter">Dr. Ahmed Mahmoud</h1>
            <p className="text-slate-400 font-bold text-xs italic tracking-[0.2em]">Smart Dental Management System</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowBook(true)} className="bg-white border-2 border-blue-600 text-blue-800 px-6 py-2 rounded-2xl font-black text-[10px] hover:bg-blue-50 flex items-center gap-2 transition-all active:scale-95 shadow-sm">
              <Calendar size={16} /> BOOK VISIT
            </button>
            <button onClick={() => setTab('rx')} className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-black text-[10px] hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95 shadow-lg">
              <PlusCircle size={16} /> NEW RX
            </button>
          </div>
        </header>

        {/* --- Dashboard Tab --- */}
        {tab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-[#003d80] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden h-80 flex flex-col justify-end">
              <div className="relative z-10">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Clinic<br/>Status</h2>
                <p className="opacity-80 font-bold text-sm mt-2 italic underline">System is active and monitoring.</p>
              </div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 h-80 overflow-y-auto scrollbar-hide">
              <h3 className="font-black text-xs uppercase mb-6 flex items-center gap-2 text-blue-900 border-b pb-2"><Clock size={18}/> Upcoming Visits</h3>
              <div className="space-y-3">
                {appointments.map(app => (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-600 flex justify-between items-center shadow-sm">
                    <span className="font-black text-xs uppercase text-slate-700">{app.name}</span>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full shadow-sm text-blue-600 border">{app.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- Rx Tab --- */}
        {tab === 'rx' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border animate-in slide-in-from-right-10 duration-500">
            <h3 className="font-black text-2xl mb-8 uppercase text-[#003d80] italic">Digital Prescription Pad</h3>
            <form onSubmit={handleRx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <input name="p" required placeholder="Patient Name" className="p-4 bg-slate-50 rounded-2xl outline-none border font-bold text-xs focus:border-blue-600 transition" />
              <input name="m" required placeholder="Medicine & Dose" className="p-4 bg-slate-50 rounded-2xl outline-none border font-bold text-xs focus:border-blue-600 transition" />
              <button type="submit" className="bg-[#003d80] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition">Save RX</button>
            </form>
            <div className="space-y-3">
              {prescriptions.map(r => (
                <div key={r.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="flex flex-col"><span className="font-black text-xs uppercase text-blue-900">{r.p}</span><span className="text-[10px] font-bold text-slate-500 italic">{r.m}</span></div>
                  <FileText className="text-blue-300" size={20} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- AI Vision Tab --- */}
        {tab === 'ai' && (
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border text-center animate-in zoom-in-95 duration-500">
            <div className="h-48 bg-slate-900 rounded-[2.5rem] mb-8 flex items-center justify-center relative overflow-hidden shadow-inner border-4 border-white">
              <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse italic">Ready for Scan...</span>
              {isScanning && <div className="absolute top-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_blue] animate-bounce"></div>}
            </div>
            <h2 className="text-2xl font-black text-[#003d80] uppercase mb-4 italic tracking-tighter">AI Diagnostic Hub</h2>
            <button onClick={() => { setIsScanning(true); setTimeout(() => { setIsScanning(false); alert("Healthy bone structure detected."); }, 2000); }} className="bg-blue-600 text-white py-5 px-12 rounded-[2rem] font-black shadow-2xl transition-all active:scale-95 text-xs uppercase tracking-widest">
              {isScanning ? 'SCANNING...' : 'START AI ANALYSIS'}
            </button>
          </div>
        )}
      </main>

      {/* --- Floating Chatbot (المعدل) --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {showChat && (
          <div className="bg-white w-80 h-[450px] rounded-[2.5rem] shadow-2xl border border-blue-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5">
            <div className="bg-[#003d80] p-5 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="font-black text-[10px] uppercase tracking-widest italic">Clinic Assistant</span>
              </div>
              <X className="cursor-pointer hover:rotate-90 transition-transform" size={18} onClick={() => setShowChat(false)} />
            </div>
            
            <div className="flex-1 p-5 bg-slate-50 overflow-y-auto space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-bold shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-600 border rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about appointments..." 
                className="flex-1 bg-slate-100 p-3 rounded-2xl text-[10px] outline-none font-bold" 
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-2xl shadow-md hover:bg-blue-700 transition-colors">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
        <button 
          onClick={() => setShowChat(!showChat)} 
          className="bg-[#003d80] text-white p-5 rounded-full shadow-2xl border-4 border-white transition-all active:scale-90 hover:scale-110"
        >
          <MessageCircle size={28} />
        </button>
      </div>

      {/* --- Booking Modal --- */}
      {showBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <form onSubmit={handleBooking} className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl space-y-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black uppercase text-blue-900 italic tracking-tighter">New Visit</h2>
              <X className="cursor-pointer text-slate-300" onClick={() => setShowBook(false)} />
            </div>
            <input name="pname" required placeholder="Patient Name" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none font-bold text-xs" />
            <input name="ptime" type="time" required className="w-full p-4 bg-slate-50 rounded-2xl border outline-none font-bold text-xs" />
            <button type="submit" className="w-full bg-[#003d80] text-white py-5 rounded-[1.5rem] font-black uppercase shadow-xl text-[10px] tracking-widest active:scale-95">Confirm</button>
          </form>
        </div>
      )}
    </div>
  );
}