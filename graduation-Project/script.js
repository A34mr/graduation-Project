/* ========================================
   DENT AI - Shared JavaScript
   Egyptian E-Learning University Graduation Project
   ======================================== */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Check login state (for demo purposes)
    checkLoginState();
});

// Login State Management
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    
    if (isLoggedIn === 'true') {
        updateNavForLoggedInUser(userType);
    }
}

function updateNavForLoggedInUser(userType) {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    let dashboardLink = '';
    if (userType === 'patient') {
        dashboardLink = '<li><a href="patient-dashboard.html" class="btn-nav">Dashboard</a></li>';
    } else if (userType === 'doctor' || userType === 'clinic') {
        dashboardLink = '<li><a href="clinic-dashboard.html" class="btn-nav">Dashboard</a></li>';
    }

    // Add dashboard link before login/signup
    const loginSignupLinks = navMenu.querySelectorAll('a[href="login.html"], a[href="signup.html"]');
    loginSignupLinks.forEach(link => link.parentElement.remove());
    
    if (dashboardLink) {
        navMenu.insertAdjacentHTML('beforeend', dashboardLink);
        navMenu.insertAdjacentHTML('beforeend', '<li><a href="#" onclick="logout(); return false;" class="btn-nav" style="background:#ef4444;">Logout</a></li>');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
}

// Form Validation Helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });

    return isValid;
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Booking Form Handler
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());
    
    // Generate booking ID
    const bookingID = 'BOOK-' + Math.floor(Math.random() * 1000000);
    
    // Store in localStorage (for demo)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({ ...bookingData, id: bookingID, status: 'Pending', date: new Date().toISOString() });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    showBookingSuccess(bookingID, bookingData);
}

function showBookingSuccess(bookingID, data) {
    const formContainer = document.getElementById('bookingForm');
    const successContainer = document.getElementById('successMessage');
    
    if (formContainer) formContainer.style.display = 'none';
    if (successContainer) {
        successContainer.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px; color: white;">✓</div>
                <h2 style="color: #047857; font-size: 28px; margin-bottom: 15px;">Booking Successful!</h2>
                <p style="color: #666; margin-bottom: 25px;">Your appointment has been booked successfully</p>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 15px; text-align: left; margin-bottom: 25px;">
                    <p><strong>Booking ID:</strong> ${bookingID}</p>
                    <p><strong>Name:</strong> ${data.fullName || data.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                    <p><strong>Date:</strong> ${data.bookingDate || data.date || 'N/A'}</p>
                </div>
                <a href="index.html" style="display: inline-block; padding: 14px 30px; background: #1e40af; color: white; border-radius: 25px; text-decoration: none; font-weight: 600;">Back to Home</a>
            </div>
        `;
        successContainer.style.display = 'block';
    }
}

// Search and Filter Functionality
function filterClinics() {
    const searchInput = document.getElementById('searchInput');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const locationFilter = document.getElementById('locationFilter');
    const clinicCards = document.querySelectorAll('.clinic-card');
    
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const specialtyValue = specialtyFilter?.value || '';
    const locationValue = locationFilter?.value || '';
    
    clinicCards.forEach(card => {
        const name = card.querySelector('.clinic-name')?.textContent.toLowerCase() || '';
        const specialty = card.dataset.specialty || '';
        const location = card.dataset.location || '';
        
        const matchesSearch = name.includes(searchTerm);
        const matchesSpecialty = !specialtyValue || specialty === specialtyValue;
        const matchesLocation = !locationValue || location === locationValue;
        
        if (matchesSearch && matchesSpecialty && matchesLocation) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize search listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const locationFilter = document.getElementById('locationFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterClinics);
    if (specialtyFilter) specialtyFilter.addEventListener('change', filterClinics);
    if (locationFilter) locationFilter.addEventListener('change', filterClinics);
});
