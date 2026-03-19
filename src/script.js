// 1. تفعيل القائمة في الموبايل
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// 2. إغلاق القائمة لما نضغط على أي لينك (في الموبايل)
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// 3. تأثير التمرير الناعم (Smooth Scroll)
// لما تضغط على لينك في النافبار، الصفحة تنزل بنعومة للقسم المطلوب
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log("Clinic Website Loaded Successfully");