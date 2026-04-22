import re

filepath = r"e:\graduation project\clinic bage\youssef\public\booking.html"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update html tag and title
content = content.replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">')
content = re.sub(r'<title>.*?</title>', '<title>Dent A</title>', content)

# 2. Update CSS (success details text-align)
content = content.replace('text-align: right;', 'text-align: left;')

# 3. Translate Navbar
content = content.replace('عيادة سمايل إيه آي', 'Dent A')
content = content.replace('<i class="fas fa-tooth"></i> Smile AI', '<i class="fas fa-tooth"></i> Dent A')
content = content.replace('الرئيسية', 'Home')
content = content.replace('من نحن', 'About Us')
content = content.replace('خدماتنا', 'Services')
content = content.replace('الأطباء', 'Doctors')
content = content.replace('احجز موعدك', 'Book Appointment')

# 4. Translate Booking Header
content = content.replace('احجز موعدك الآن', 'Book Your Appointment Now')
content = content.replace('احجز موعدك بسهولة وسرعة، وسنتواصل معك للتأكيد خلال ساعات قليلة', 'Book your appointment easily and quickly, and we will contact you to confirm within a few hours')

# 5. Translate Personal Details
content = content.replace('البيانات الشخصية', 'Personal Details')
content = content.replace('الاسم الكامل', 'Full Name')
content = content.replace('أدخل اسمك بالكامل', 'Enter your full name')
content = content.replace('رقم الهاتف', 'Phone Number')
content = content.replace('البريد الإلكتروني', 'Email')
content = content.replace('العمر', 'Age')

# 6. Translate Services
content = content.replace('الخدمة المطلوبة', 'Required Service')
content = content.replace('ابتسامة هوليود', 'Hollywood Smile')
content = content.replace('زراعة الأسنان', 'Dental Implants')
content = content.replace('تقويم الأسنان', 'Orthodontics')
content = content.replace('تبييض الأسنان', 'Teeth Whitening')
content = content.replace('علاج الجذور', 'Root Canal')
content = content.replace('حشوات تجميلية', 'Cosmetic Fillings')
content = content.replace('خلع الأسنان', 'Tooth Extraction')
content = content.replace('استشارة عامة', 'General Consultation')

# 7. Translate Doctors
content = content.replace('اختر الطبيب', 'Choose Doctor')
content = content.replace('د. أحمد سمير', 'Dr. Ahmed Samir')
content = content.replace('جراحة الفم', 'Oral Surgery')
content = content.replace('د. سارة محمود', 'Dr. Sarah Mahmoud')
content = content.replace('تقويم وتجميل', 'Orthodontics & Cosmetics')
content = content.replace('د. محمد علي', 'Dr. Mohamed Ali')
content = content.replace('أي طبيب متاح', 'Any Available Doctor')
content = content.replace('أقرب موعد', 'Earliest Appointment')

# 8. Date and Time Translation & Modification
content = content.replace('الموعد المناسب', 'Appointment Date')
content = content.replace('<label>التاريخ <span>*</span></label>', '<label>Date <span>*</span></label>')

# Remove Time selection completely
time_section_pattern = re.compile(
    r'<div class="form-group">\s*<label>اختر الوقت</label>.*?</label>\s*</div>\s*</div>\s*</div>\s*</div>',
    re.DOTALL
)
content = time_section_pattern.sub('</div>', content)

# 9. Notes & Submit
content = content.replace('ملاحظات إضافية', 'Additional Notes')
content = content.replace('اكتب أي ملاحظات أو مشاكل تعاني منها...', 'Write any notes or problems you are experiencing...')
content = content.replace('تأكيد الحجز', 'Confirm Booking')

# 10. Success Message
content = content.replace('تم الحجز بنجاح!', 'Booking Successful!')
content = content.replace('شكراً لك، سيتم التواصل معك قريباً للتأكيد', 'Thank you, we will contact you shortly to confirm')
content = content.replace('العودة للرئيسية', 'Back to Home')

# 11. Info Card
content = content.replace('معلومات مهمة', 'Important Information')
content = content.replace('ساعات العمل', 'Working Hours')
content = content.replace('السبت - الخميس', 'Sat - Thu')
content = content.replace('للاستفسارات', 'For Inquiries')
content = content.replace('العنوان', 'Address')
content = content.replace('15 شارع المهندسين، برج الأطباء، الدور الثالث، القاهرة', '15 El Mohandiseen St., Doctors Tower, 3rd Floor, Cairo')
content = content.replace('تقويم شفاف', 'Clear Aligners')
content = content.replace('تبييض ليزر', 'Laser Whitening')
content = content.replace('علاج العصب', 'Root Canal')

content = content.replace('مرحباً، أريد حجز موعد', 'Hello, I would like to book an appointment')
content = content.replace('حجز عبر واتساب', 'Book via WhatsApp')


# 12. Javascript Translation & Modifications
# Replace alert messages
content = content.replace("alert('عذراً، العيادة مغلقة يوم الجمعة');", "alert('Sorry, the clinic is closed on Fridays');")
content = content.replace("alert('يرجى ملء جميع الحقول المطلوبة');", "alert('Please fill all required fields');")
content = content.replace("alert('يرجى اختيار الخدمة المطلوبة');", "alert('Please select a required service');")

# Remove time checks from JS
js_time_check = r"""            // التحقق من اختيار الوقت
            const selectedTime = document.querySelector\('input\[name="time"\]:checked'\);
            const time = selectedTime \? selectedTime\.value : 'لم يتم التحديد';"""
content = re.sub(js_time_check, '', content)

content = content.replace("'لم يتم التحديد'", "'Not Selected'")
content = content.replace("'ar-EG'", "'en-EG'")

# Replace bookingDetails generation with English version, Day, and Booking Number
js_details_old = r"""            // عرض تفاصيل الحجز
            document.getElementById\('bookingDetails'\).innerHTML = `
                <h4><i class="fas fa-calendar-check" style="color: #10b981;"></i> تفاصيل الحجز</h4>
                <p><strong>الاسم:</strong> \$\{fullName\}</p>
                <p><strong>الهاتف:</strong> \$\{phone\}</p>
                \$\{email \? `<p><strong>البريد:</strong> \$\{email\}</p>` : ''\}
                \$\{age \? `<p><strong>العمر:</strong> \$\{age\} سنة</p>` : ''\}
                <p><strong>الخدمة:</strong> \$\{selectedService\.value\}</p>
                <p><strong>الطبيب:</strong> \$\{doctor\}</p>
                <p><strong>التاريخ:</strong> \$\{formattedDate\}</p>
                <p><strong>الوقت:</strong> \$\{time\}</p>
                \$\{notes \? `<p><strong>ملاحظات:</strong> \$\{notes\}</p>` : ''\}
            `;"""

js_details_new = r"""            // Generate Booking ID
            const bookingID = 'BKG-' + Math.floor(Math.random() * 1000000);

            // Display Booking Details
            document.getElementById('bookingDetails').innerHTML = `
                <h4><i class="fas fa-calendar-check" style="color: #10b981;"></i> Booking Details</h4>
                <p><strong>Booking Number:</strong> ${bookingID}</p>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
                ${age ? `<p><strong>Age:</strong> ${age} years</p>` : ''}
                <p><strong>Service:</strong> ${selectedService.value}</p>
                <p><strong>Doctor:</strong> ${doctor}</p>
                <p><strong>Day:</strong> ${formattedDate}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            `;"""

content = re.sub(js_details_old, js_details_new, content)


with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
