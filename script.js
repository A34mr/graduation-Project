document.addEventListener("DOMContentLoaded", function () {

    const notifySound = document.getElementById("notifySound");

    if ("Notification" in window) {
        Notification.requestPermission();
    }

    let appointments = [
        { name: "John", time: "10:00 AM", price: 200, status: "done" },
        { name: "Ahmed", time: "11:30 AM", price: 250, status: "done" },
        { name: "Sara", time: "1:00 PM", price: 150, status: "pending" }
    ];

    const container = document.getElementById("appointments");

    function renderAppointments() {
        container.innerHTML = "";

        appointments.forEach((app, index) => {

            const card = document.createElement("div");
            card.className = "appointment-card";

            card.innerHTML = `
                <h3>${app.name}</h3>
                <p><strong>Time:</strong> ${app.time}</p>
                <p><strong>Price:</strong> $${app.price}</p>
                <p><strong>Status:</strong> ${app.status}</p>
                <button class="done-btn">Toggle Status</button>
            `;

            const btn = card.querySelector(".done-btn");

            btn.addEventListener("click", function () {
                if (app.status === "done") {
                    app.status = "pending";
                } else {
                    app.status = "done";
                }
                updateDashboard();
                renderAppointments();
            });

            container.appendChild(card);
        });

        updateDashboard();
    }

    function updateDashboard() {

        let total = appointments.length;
        let completed = 0;
        let pending = 0;
        let revenue = 0;

        appointments.forEach(app => {
            if (app.status === "done") {
                completed++;
                revenue += app.price;
            } else {
                pending++;
            }
        });

        document.getElementById("totalAppointments").textContent = total;
        document.getElementById("completedCount").textContent = completed;
        document.getElementById("pendingCount").textContent = pending;
        document.getElementById("totalRevenue").textContent = "$" + revenue;

        createChart();
    }

    let chart;

    function createChart() {

        const ctx = document.getElementById("revenueChart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: appointments.map(a => a.name),
                datasets: [{
                    label: "Revenue",
                    data: appointments.map(a => a.price),
                    backgroundColor: "#38ada9"
                }]
            }
        });
    }

    function sendNotification(name, time) {

        notifySound.play();

        if (Notification.permission === "granted") {
            new Notification("Dent AI - New Booking", {
                body: `${name} booked at ${time}`
            });
        }
    }

    // محاكاة حجز جديد بعد 6 ثواني
    setTimeout(() => {
        appointments.push({
            name: "Mona",
            time: "3:00 PM",
            price: 300,
            status: "pending"
        });

        sendNotification("Mona", "3:00 PM");
        renderAppointments();

    }, 6000);

    renderAppointments();

});