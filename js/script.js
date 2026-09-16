// Portfolio Data
const portfolioData = [
  {
    id: 1,
    name: "Warung Bu Sari",
    category: "Standar",
    emoji: "🍛",
    description: "Website profil usaha lengkap dengan menu andalan, cerita singkat usaha, dan lokasi — dibuat agar pelanggan lama maupun baru bisa langsung memesan lewat WhatsApp."
  },
  {
    id: 2,
    name: "Toko Kelontong Maju",
    category: "Basic",
    emoji: "🏪",
    description: "Toko kebutuhan sehari-hari dengan display produk yang menarik dan informasi lokasi yang jelas untuk memudahkan pelanggan menemukan toko."
  },
  {
    id: 3,
    name: "Kafe Espresso Mini",
    category: "Premium",
    emoji: "☕",
    description: "Kafe dengan website premium yang menampilkan menu spesial, galeri interior, dan sistem reservasi online untuk pengalaman pelanggan yang lebih baik."
  }
];

// Google Apps Script URL - GANTI DENGAN URL DEPLOYMENT KAMU
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD31_WawvpqAfivVdmJSpLf4N8BKSXQ1-5wtkRm137FCG7MVd4VhopayaOrWGYW6pLfA/exec";

// Render Portfolio
function renderPortfolio() {
  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  if (!portfolioGrid) return;
  
  portfolioGrid.innerHTML = portfolioData.map(project => `
    <div class="portfolio-card">
      <div class="portfolio-visual">
        <div class="plate">${project.emoji}</div>
      </div>
      <div class="portfolio-text">
        <span class="tag">${project.category}</span>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
      </div>
    </div>
  `).join('');
}

// Form Handling
function initForm() {
  const form = document.querySelector('.consultation-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      business: form.querySelector('[name="business"]').value,
      package: form.querySelector('[name="package"]').value,
      message: form.querySelector('[name="message"]').value || ""
    };
    
    try {
      // Kirim ke Google Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        showMessage('success', 'Terima kasih! Kami akan segera menghubungi Anda. Redirecting ke WhatsApp...');
        form.reset();
        
        // Redirect ke WhatsApp setelah 2 detik
        setTimeout(() => {
          const waMessage = `Halo Digitama, saya ${formData.name} dari ${formData.business}. Saya tertarik dengan paket ${formData.package}. ${formData.message}`;
          const waLink = `https://wa.me/6285711467985?text=${encodeURIComponent(waMessage)}`;
          window.open(waLink, '_blank');
        }, 2000);
      } else {
        showMessage('error', 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      showMessage('error', 'Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error:', error);
    }
  });
}

// Show Form Message
function showMessage(type, text) {
  let messageEl = document.querySelector('.form-message');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'form-message';
    const form = document.querySelector('.consultation-form');
    form.parentNode.insertBefore(messageEl, form);
  }
  
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = text;
  messageEl.style.display = 'block';
  
  if (type === 'success') {
    messageEl.style.backgroundColor = '#10b981';
    messageEl.style.color = 'white';
  } else {
    messageEl.style.backgroundColor = '#ef4444';
    messageEl.style.color = 'white';
  }
  messageEl.style.padding = '12px 16px';
  messageEl.style.borderRadius = '8px';
  messageEl.style.marginBottom = '16px';
  messageEl.style.fontWeight = '500';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Add Animation on Scroll
function initScrollAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('section, .portfolio-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initForm();
  initSmoothScroll();
  initScrollAnimation();
  
  console.log('✅ Digitama website initialized');
});

// Export helper
window.DigitamaApp = {
  portfolioData
};
