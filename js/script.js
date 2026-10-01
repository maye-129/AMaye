/**
 * ANGELL PORTFOLIO - INTERACTIVE JAVASCRIPT
 * Handles modal embedding, scroll reveals, active navigation, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Google Drive Config
  const DRIVE_FOLDER_ID = '1lHvphZJsTvEF-g6FkZyYKyuXcfyXnMCj';
  const DRIVE_EMBED_URL = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`;
  const DRIVE_SHARE_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}?usp=sharing`;

  // DOM Elements
  const header = document.querySelector('.header');
  const certificationCards = document.getElementById('certificationCards');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  // Modal Elements
  const driveModal = document.getElementById('driveModal');
  const modalIframe = document.getElementById('modalDriveIframe');
  const modalTitle = document.getElementById('modalActivityTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOpenDriveLink = document.getElementById('modalOpenDriveLink');
  
  // --- Header Scroll Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      scrollTopBtn.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      scrollTopBtn.classList.remove('visible');
    }
  });

  // --- Mobile Navigation Toggle ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function renderCertificationCards(items) {
    if (!certificationCards) return;

    certificationCards.innerHTML = items.map((item) => `
      <div class="activity-card certification-card reveal">
        <div class="activity-media cert-image-wrap">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" class="cert-image-only">
          <span class="activity-category cert-label">${escapeHTML(item.category)}</span>
        </div>
        <div class="activity-body certificate-card-body">
          <h3 class="activity-title">${escapeHTML(item.title)}</h3>
        </div>
      </div>
    `).join('');

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  async function loadCertificationCards() {
    try {
      const response = await fetch('assets/data/certificates.json');
      if (!response.ok) throw new Error('Certificate list could not be loaded.');
      const items = await response.json();
      if (!Array.isArray(items)) throw new Error('Certificate list must be an array.');
      renderCertificationCards(items);
    } catch (error) {
      console.error('Unable to load certificates.', error);
    }
  }

  // --- Google Drive Embedded Modal Functions ---
  window.openDriveModal = function(activityTitle = 'Drive Submissions') {
    if (!driveModal || !modalIframe) return;

    // Set modal title
    if (modalTitle) {
      modalTitle.textContent = activityTitle;
    }

    // Set iframe source to Google Drive embedded folder
    if (modalIframe.src !== DRIVE_EMBED_URL) {
      modalIframe.src = DRIVE_EMBED_URL;
    }

    // Update direct share link
    if (modalOpenDriveLink) {
      modalOpenDriveLink.href = DRIVE_SHARE_URL;
    }

    // Show modal with animation
    driveModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeDriveModal() {
    if (!driveModal) return;
    driveModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDriveModal);
  }

  if (driveModal) {
    driveModal.addEventListener('click', (e) => {
      if (e.target === driveModal) {
        closeDriveModal();
      }
    });
  }

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && driveModal && driveModal.classList.contains('active')) {
      closeDriveModal();
    }
  });

  // Attach event listeners to all open-drive-btn buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-drive-btn');
    if (btn) {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Google Drive Folder';
      window.openDriveModal(title);
    }
  });

  loadCertificationCards();

  // --- Scroll To Top Button ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
