import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

/* ================= LAYOUT ================= */
function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">

      <aside className="w-60 bg-[#1A3B8B] text-white p-4 hidden md:block">

        <h1 className="font-bold text-xl mb-6">DENT AI</h1>

        <Link to="/" className="block p-2 rounded hover:bg-white/20 mb-2">
          📊 Dashboard
        </Link>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="block p-2 rounded hover:bg-white/20"
        >
          🏠 Home
        </a>

        <a
          href="/booking"
          target="_blank"
          rel="noreferrer"
          className="block p-2 rounded hover:bg-white/20 mt-2"
        >
          📅 Booking
        </a>

      </aside>

      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}

/* ================= BOOKING ================= */
function Booking() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: ""
  });

  const [bookings, setBookings] = useState([]);

  const isFull = (date) =>
    bookings.filter(b => b.date === date).length >= 10;

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.date) {
      alert("Invalid data ❌");
      return;
    }

    if (isFull(form.date)) {
      alert("Day FULL ❌");
      return;
    }

    setBookings([...bookings, form]);
    alert("Booked ✅");

    setForm({ name: "", email: "", phone: "", date: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow w-96 space-y-3">

        <h2 className="font-bold text-center">Booking</h2>

        <input className="border p-2 w-full" placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input className="border p-2 w-full" placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input className="border p-2 w-full" placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input type="date" className="border p-2 w-full"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button className="bg-[#1A3B8B] text-white w-full p-2 rounded">
          Submit
        </button>

      </form>

    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard() {

  /* ================= PROFILE (رجعناه زي ما طلبت) ================= */
  const [profile, setProfile] = useState({
    name: "Dr. Ahmed",
    specialty: "Orthodontist Specialist",
    bio: "Experienced dentist in cosmetic & orthodontic treatments.",
    image: null
  });

  const [edit, setEdit] = useState(false);

  const [patients, setPatients] = useState([
    { name: "John Doe", date: "2026-04-20", time: "10:30" }
  ]);

  const [newPatient, setNewPatient] = useState("");

  const addPatient = () => {
    if (!newPatient.trim()) return;

    setPatients([
      ...patients,
      { name: newPatient, date: "", time: "" }
    ]);

    setNewPatient("");
  };

  const updateDate = (i, date) => {
    const copy = [...patients];
    copy[i].date = date;
    setPatients(copy);
  };

  const updateTime = (i, time) => {
    const copy = [...patients];
    copy[i].time = time;
    setPatients(copy);
  };

  const deletePatient = (i) => {
    setPatients(patients.filter((_, idx) => idx !== i));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        image: URL.createObjectURL(file)
      });
    }
  };

  return (
    <Layout>

      {/* ================= PROFILE SECTION ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-6 items-center">

        <div className="text-center">
          <img
            src={profile.image || "https://via.placeholder.com/120"}
            className="w-28 h-28 rounded-full object-cover bg-gray-200"
          />

          <input type="file" onChange={handleImage} className="mt-2 text-xs" />
        </div>

        <div className="flex-1">

          {edit ? (
            <>
              <input
                className="border p-2 w-full mb-2"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />

              <input
                className="border p-2 w-full mb-2"
                value={profile.specialty}
                onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
              />

              <textarea
                className="border p-2 w-full"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </>
          ) : (
            <>
              <h2 className="font-bold text-lg">{profile.name}</h2>
              <p className="text-blue-600 font-semibold">{profile.specialty}</p>
              <p className="text-gray-500">{profile.bio}</p>
            </>
          )}

          <button
            onClick={() => setEdit(!edit)}
            className="mt-2 bg-[#1A3B8B] text-white px-3 py-1 rounded"
          >
            {edit ? "Save" : "Edit"}
          </button>

        </div>
      </div>

      {/* ================= PATIENTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="font-bold mb-4">Patients</h3>

        <div className="flex gap-2 mb-4">

          <input
            className="border p-2 flex-1"
            value={newPatient}
            onChange={(e) => setNewPatient(e.target.value)}
            placeholder="Add patient"
          />

          <button
            onClick={addPatient}
            className="bg-green-500 text-white px-3 rounded"
          >
            Add
          </button>

        </div>

        <table className="w-full text-sm">

          <thead className="text-gray-500">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p, i) => (
              <tr key={i} className="border-t">

                <td className="font-bold">{i + 1}</td>
                <td>{p.name}</td>

                <td>
                  <input
                    type="date"
                    value={p.date}
                    onChange={(e) => updateDate(i, e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="time"
                    value={p.time}
                    onChange={(e) => updateTime(i, e.target.value)}
                  />
                </td>

                <td>
                  <button
                    onClick={() => deletePatient(i)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </Layout>
  );
}

/* ================= APP ================= */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}