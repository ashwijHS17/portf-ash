// ===========================
// PARTICLES BACKGROUND
// ===========================
const canvas = document.createElement('canvas');
canvas.id = 'particles-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 70;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '0,188,212' : '124,58,237';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,188,212,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===========================
// CUSTOM CURSOR
// ===========================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .btn, .skill-tag, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    follower.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    follower.classList.remove('cursor-hover');
  });
});

// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const [s1,,s3] = hamburger.querySelectorAll('span');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===========================
// TYPED TEXT
// ===========================
const typedEl = document.getElementById('typed-text');
const phrases = ['Software Engineer', 'ML Enthusiast', 'Cloud Developer', 'Data Scientist', 'Automation Builder'];
let phraseIdx = 0, charIdx = 0, isDeleting = false, speed = 90;

function type() {
  const current = phrases[phraseIdx];
  typedEl.textContent = isDeleting
    ? current.slice(0, charIdx - 1)
    : current.slice(0, charIdx + 1);

  if (!isDeleting) {
    charIdx++;
    speed = charIdx === current.length ? 2200 : 90;
    if (charIdx === current.length) isDeleting = true;
  } else {
    charIdx--;
    speed = 45;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 350;
    }
  }
  setTimeout(type, speed);
}
type();

// ===========================
// SCROLL REVEAL (staggered)
// ===========================
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===========================
// ACTIVE NAV HIGHLIGHT
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) a.style.color = 'var(--teal)';
  });
});

// ===========================
// CONTACT FORM
// ===========================
const FORMSPREE_ID = 'mkjgglgg';

const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      successMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      successMsg.style.color = '#4ade80';
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    } else {
      const data = await response.json();
      const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
      successMsg.textContent = '✗ ' + errMsg;
      successMsg.style.color = '#f87171';
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
  } catch (err) {
    successMsg.textContent = '✗ Network error. Please check your connection and try again.';
    successMsg.style.color = '#f87171';
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
});

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===========================
// COUNTER ANIMATION
// ===========================
function animateCounter(el, target) {
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur + '+';
    if (cur >= target) clearInterval(timer);
  }, 35);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.textContent));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===========================
// 3D TILT ON CARDS
// ===========================
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ===========================
// MAGNETIC BUTTONS
// ===========================
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'all 0.4s ease';
  });
});

// ===========================
// SKILL TAG RIPPLE
// ===========================
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:6px; height:6px;
      background: rgba(0,188,212,0.6);
      transform:translate(-50%,-50%) scale(0);
      animation: rippleOut 0.5s ease forwards;
      left:${e.offsetX}px; top:${e.offsetY}px;
      pointer-events:none; z-index:10;
    `;
    tag.style.position = 'relative'; tag.style.overflow = 'hidden';
    tag.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes rippleOut { to { transform:translate(-50%,-50%) scale(20); opacity:0; } }`;
document.head.appendChild(style);

// ===========================
// SECTION BACKGROUND PARALLAX
// ===========================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((blob, i) => {
    const speed = i % 2 === 0 ? 0.04 : 0.06;
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ===========================
// GLOWING SECTION TAGS ON SCROLL
// ===========================
const sectionTagObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.boxShadow = '0 0 20px rgba(0,188,212,0.2)';
      setTimeout(() => entry.target.style.boxShadow = '', 1500);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.section-tag').forEach(t => sectionTagObserver.observe(t));

// ===========================
// IMAGE PREVIEW MODAL
// ===========================
function openPreview() {
  document.getElementById('imgModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  document.getElementById('imgModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePreview();
});
