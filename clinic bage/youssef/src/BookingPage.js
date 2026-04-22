// توليد رقم حجز عشوائي
function generateBookingID() {
    return 'BOOK-' + Math.floor(Math.random() * 1000000);
}

// تنفيذ عملية الحجز
function submitBooking(e) {
    e.preventDefault();

    // جلب البيانات من الفورم
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const notes = document.getElementById('notes').value;
    const bookingDate = document.getElementById('bookingDate').value;

    // التحقق من البيانات الأساسية
    if (!fullName || !phone || !bookingDate) {
        alert("Please fill required fields");
        return;
    }

    // إنشاء رقم الحجز
    const bookingID = generateBookingID();

    // عرض البيانات بعد الحجز
    document.getElementById('bookingDetails').innerHTML = `
        <p><strong>Booking ID:</strong> ${bookingID}</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Day:</strong> ${bookingDate}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        ${age ? `<p><strong>Age:</strong> ${age}</p>` : ''}
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
    `;

    // إخفاء الفورم وإظهار رسالة النجاح
    document.getElementById('bookingForm').style.display = "none";
    document.getElementById('successMessage').classList.add('show');
}