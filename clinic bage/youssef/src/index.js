import React, { useState } from 'react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // كود التنسيقات (CSS)
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { font-family: 'Cairo', sans-serif; direction: rtl; background-color: #f1f5f9; }
    
    /* الشريط العلوي */
    .navbar { background: white; height: 70px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 1000; }
    .nav-container { width: 100%; max-width: 1100px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; margin: 0 auto; }
    .logo { color: #0891b2; font-size: 1.5rem; font-weight: bold; text-decoration: none; display: flex; align-items: center; gap: 8px; }
    .nav-menu { display: flex; list-style: none; gap: 20px; align-items: center; }
    .nav-menu a { text-decoration: none; color: #334155; font-weight: 600; transition: 0.3s; }
    .nav-menu a:hover { color: #0891b2; }
    .btn-nav { background: #0891b2; color: white !important; padding: 8px 20px; border-radius: 6px; }
    .menu-icon { display: none; font-size: 1.5rem; cursor: pointer; }

    /* قسم البطل (Hero) */
    .hero { background: linear-gradient(135deg, #0891b2, #0e7490); color: white; min-height: 85vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px; }
    .hero h1 { font-size: 3rem; margin-bottom: 15px; }
    .hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto 30px; opacity: 0.9; }
    .hero-btns { display: flex; gap: 15px; justify-content: center; }
    .btn-primary { background: white; color: #0e7490; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; transition: 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); }
    .btn-secondary { border: 2px solid white; color: white; padding: 10px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; background: transparent; }

    /* الأقسام العامة */
    .section { padding: 60px 20px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .section-title { text-align: center; margin-bottom: 40px; }
    .section-title h2 { font-size: 2rem; color: #1e293b; margin-bottom: 10px; }

    /* قسم من نحن */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
    .features-list { list-style: none; margin-top: 20px; }
    .features-list li { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: #475569; }
    .features-list i { color: #10b981; }
    .image-placeholder { background: #e2e8f0; height: 300px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #94a3b8; font-size: 3rem; }

    /* قسم الخدمات */
    .services-section { background: white; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .service-card { background: #f8fafc; padding: 25px; border-radius: 10px; text-align: center; transition: 0.3s; border: 1px solid #e2e8f0; }
    .service-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    .service-icon { width: 60px; height: 60px; background: #cffafe; color: #0891b2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; }
    .service-price { color: #0891b2; font-weight: bold; display: block; margin-top: 10px; }

    /* قسم الأطباء */
    .doctors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .doctor-card { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
    .doctor-img { width: 80px; height: 80px; background: #0891b2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 2rem; }

    /* قسم التواصل */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
    .contact-info ul { list-style: none; }
    .contact-info li { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 1.1rem; }
    .contact-info i { color: #0891b2; width: 20px; }
    .map-placeholder { background: #f1f5f9; min-height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 2rem; }

    /* الفوتر */
    .footer { background: #1e293b; color: white; padding: 20px; text-align: center; margin-top: 40px; }

    /* زر واتساب */
    .whatsapp-btn { position: fixed; bottom: 20px; left: 20px; background: #25d366; color: white; width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.2); text-decoration: none; z-index: 999; }

    /* تجاوب الشاشات الصغيرة */
    @media (max-width: 768px) {
      .nav-menu { display: none; flex-direction: column; position: absolute; top: 70px; background: white; width: 100%; left: 0; padding: 20px; box-shadow: 0 5px 10px rgba(0,0,0,0.1); }
      .nav-menu.active { display: flex; }
      .menu-icon { display: block; }
      .about-grid, .contact-grid { grid-template-columns: 1fr; }
      .hero h1 { font-size: 2rem; }
      .hero-btns { flex-direction: column; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <a href="#home" className="logo">
              <i className="fas fa-tooth"></i> Smile AI
            </a>
            
            <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>

            <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
              <li><a href="#home" onClick={() => setIsMenuOpen(false)}>الرئيسية</a></li>
              <li><a href="#about" onClick={() => setIsMenuOpen(false)}>من نحن</a></li>
              <li><a href="#services" onClick={() => setIsMenuOpen(false)}>خدماتنا</a></li>
              <li><a href="#doctors" onClick={() => setIsMenuOpen(false)}>الأطباء</a></li>
              <li><a href="#contact" className="btn-nav" onClick={() => setIsMenuOpen(false)}>احجز موعدك</a></li>
            </ul>
          </div>
        </nav>

        <header className="hero" id="home">
          <div className="hero-content">
            <h1>ابتسامتك تبدأ هنا <br /> بتقنية الذكاء الاصطناعي</h1>
            <p>نقدم أحدث تقنيات طب الأسنان لتشخيص دقيق وعلاج آمن.</p>
            <div className="hero-btns">
              <a href="#contact" className="btn-primary">احجز موعدك الآن</a>
              <a href="#services" className="btn-secondary">اكتشف خدماتنا</a>
            </div>
          </div>
        </header>

        <section className="section" id="about">
          <div className="container">
            <div className="section-title">
              <h2>لماذا تختار عيادتنا؟</h2>
              <p style={{color: '#64748b'}}>نحن نجمع بين الخبرة الإنسانية والدقة الرقمية</p>
            </div>
            <div className="about-grid">
              <div className="about-content">
                <h3 style={{marginBottom: '10px', fontSize: '1.5rem'}}>رؤيتنا في العلاج</h3>
                <p style={{color: '#475569', lineHeight: '1.8'}}>نستخدم أحدث أجهزة المسح الضوئي ثلاثي الأبعاد وتقنيات الذكاء الاصطناعي لتصميم خطة علاجية دقيقة 100%.</p>
                <ul className="features-list">
                  <li><i className="fas fa-check-circle"></i> تعقيم كامل بدرجة مستشفيات</li>
                  <li><i className="fas fa-check-circle"></i> أطباء استشاريون متخصصون</li>
                  <li><i className="fas fa-check-circle"></i> ضمان مدى الحياة على الزراعة</li>
                </ul>
              </div>
              <div className="about-image">
                <div className="image-placeholder">
                  <i className="fas fa-x-ray"></i>
                  <span style={{fontSize: '1rem', marginTop: '10px'}}>صورة العيادة</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-title">
              <h2>خدماتنا المميزة</h2>
            </div>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon"><i className="fas fa-teeth"></i></div>
                <h3>ابتسامة هوليود</h3>
                <p style={{color: '#64748b', fontSize: '0.95rem'}}>تصميم ابتسامة رقمية باستخدام عدسات فينير خزفية.</p>
                <span className="service-price">يبدأ من 5000 جنيه</span>
              </div>
              <div className="service-card">
                <div className="service-icon"><i className="fas fa-tooth"></i></div>
                <h3>زراعة الأسنان</h3>
                <p style={{color: '#64748b', fontSize: '0.95rem'}}>زراعة تيتانيوم عالية الجودة مع ضمان مدى الحياة.</p>
                <span className="service-price">يبدأ من 8000 جنيه</span>
              </div>
              <div className="service-card">
                <div className="service-icon"><i className="fas fa-smile"></i></div>
                <h3>تقويم الأسنان الشفاف</h3>
                <p style={{color: '#64748b', fontSize: '0.95rem'}}>تقويم بدون أسلاك لتعديل الأسنان بسرية تامة.</p>
                <span className="service-price">استشارة مجانية</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="doctors">
          <div className="container">
            <div className="section-title">
              <h2>فريق أطبائنا</h2>
            </div>
            <div className="doctors-grid">
              <div className="doctor-card">
                <div className="doctor-img"><i className="fas fa-user-md"></i></div>
                <h3>د. أحمد سمير</h3>
                <span style={{color: '#64748b', fontSize: '0.9rem'}}>استشاري جراحة الفم</span>
              </div>
              <div className="doctor-card">
                <div className="doctor-img" style={{background: '#db2777'}}><i className="fas fa-user-md"></i></div>
                <h3>د. سارة محمود</h3>
                <span style={{color: '#64748b', fontSize: '0.9rem'}}>أخصائية تقويم الأسنان</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="contact" style={{background: '#f1f5f9'}}>
          <div className="container">
              <div className="section-title">
                  <h2>تواصل معنا</h2>
              </div>
              <div className="contact-grid">
                  <div className="contact-info">
                      <ul>
                          <li><i className="fas fa-map-marker-alt"></i> 15 شارع المهندين، القاهرة.</li>
                          <li><i className="fas fa-phone-alt"></i> 01123456789</li>
                      </ul>
                  </div>
                  <div className="contact-map">
                      <div className="map-placeholder">
                          <i className="fas fa-map-marked-alt"></i>
                      </div>
                  </div>
              </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
              <h4>Smile AI Clinic</h4>
              <p style={{opacity: 0.7, fontSize: '0.9rem'}}>مشروع تخرج 2026 🎓</p>
              <p style={{opacity: 0.5, fontSize: '0.8rem', marginTop: '10px'}}>© 2026 جميع الحقوق محفوظة</p>
          </div>
        </footer>

        <a href="https://wa.me/20123456789" className="whatsapp-btn" target="_blank" rel="noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </>
  );
}

export default App;