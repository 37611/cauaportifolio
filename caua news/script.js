/**
 * PORTFÓLIO PROFISSIONAL — CAUÃ NASCIMENTO SANCHES
 * JavaScript Puro (Vanilla ES6+), sem dependências externas.
 *
 * Funcionalidades:
 * 1. Rede tecnológica de partículas interativas (Canvas 2D)
 * 2. Cabeçalho dinâmico com efeito glassmorphism ao rolar
 * 3. Menu mobile responsivo com drawer e bloqueio de scroll
 * 4. Navegação suave e destaque automático da seção ativa
 * 5. Filtros dinâmicos nos cards de projetos
 * 6. Animações de entrada (Scroll Reveal com Intersection Observer)
 * 7. Formulário de contato inteligente (Validação, Cópia formatada para Clipboard e Mailto)
 * 8. Notificações flutuantes (Toast feedback)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. REDE DE PARTÍCULAS TECNOLÓGICAS NO CANVAS
     ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;
    const maxDistance = window.innerWidth < 768 ? 90 : 130;

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 0.8;
        this.baseColor = Math.random() > 0.4 ? 'rgba(96, 165, 250,' : 'rgba(167, 139, 250,';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Efeito sutil ao aproximar o mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.2;
            this.y -= Math.sin(angle) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.baseColor}${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Conexões entre partículas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Atualiza e desenha cada partícula
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  /* ==========================================================================
     2. CABEÇALHO DINÂMICO & INDICADOR DE SEÇÃO ATIVA
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-item');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .mobile-nav-item');

  function handleScroll() {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Observador para marcar link ativo na navegação
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ==========================================================================
     3. MENU MOBILE RESPONSIVO (DRAWER)
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function toggleMobileMenu(isOpen) {
    const shouldOpen = isOpen !== undefined ? isOpen : !mobileDrawer?.classList.contains('open');
    if (shouldOpen) {
      mobileDrawer?.classList.add('open');
      mobileToggleBtn?.classList.add('active');
      mobileToggleBtn?.setAttribute('aria-expanded', 'true');
      mobileDrawer?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer?.classList.remove('open');
      mobileToggleBtn?.classList.remove('active');
      mobileToggleBtn?.setAttribute('aria-expanded', 'false');
      mobileDrawer?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  mobileToggleBtn?.addEventListener('click', () => toggleMobileMenu());

  // Fecha menu mobile ao clicar em qualquer link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Fecha no ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  /* ==========================================================================
     4. FILTRO DE PROJETOS POR CATEGORIA
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza botões
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     5. SCROLL REVEAL (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. FORMULÁRIO DE CONTATO (Validação + Cópia Formata + Mailto)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userSubjectInput = document.getElementById('userSubject');
  const userMessageInput = document.getElementById('userMessage');

  const formFeedbackCard = document.getElementById('formFeedbackCard');
  const btnResetForm = document.getElementById('btnResetForm');
  const btnOpenMail = document.getElementById('btnOpenMail');
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message) {
    if (toastNotification && toastMsg) {
      toastMsg.textContent = message;
      toastNotification.classList.add('show');
      setTimeout(() => {
        toastNotification.classList.remove('show');
      }, 4000);
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(input, condition) {
    const parent = input.closest('.form-group');
    if (!condition) {
      parent?.classList.add('has-error');
      return false;
    } else {
      parent?.classList.remove('has-error');
      return true;
    }
  }

  // Validação em tempo real ao digitar
  userNameInput?.addEventListener('input', () => {
    validateField(userNameInput, userNameInput.value.trim().length >= 2);
  });

  userEmailInput?.addEventListener('input', () => {
    validateField(userEmailInput, validateEmail(userEmailInput.value.trim()));
  });

  userSubjectInput?.addEventListener('input', () => {
    validateField(userSubjectInput, userSubjectInput.value.trim().length >= 3);
  });

  userMessageInput?.addEventListener('input', () => {
    validateField(userMessageInput, userMessageInput.value.trim().length >= 5);
  });

  function getFormattedMessage() {
    const name = userNameInput?.value.trim() || '';
    const email = userEmailInput?.value.trim() || '';
    const subject = userSubjectInput?.value.trim() || '';
    const message = userMessageInput?.value.trim() || '';
    const date = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    return `--- CONTATO VIA PORTFÓLIO ---
Data: ${date}
De: ${name}
E-mail de Contato: ${email}
Assunto: ${subject}

Mensagem:
${message}
----------------------------------`;
  }

  // Submissão do Formulário: Copia para área de transferência com feedback
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(userNameInput, userNameInput.value.trim().length >= 2);
    const isEmailValid = validateField(userEmailInput, validateEmail(userEmailInput.value.trim()));
    const isSubjectValid = validateField(userSubjectInput, userSubjectInput.value.trim().length >= 3);
    const isMessageValid = validateField(userMessageInput, userMessageInput.value.trim().length >= 5);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      showToast('Por favor, verifique os campos obrigatórios.');
      return;
    }

    const textToCopy = getFormattedMessage();

    // Copia para área de transferência
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          showFeedbackSuccess();
          showToast('Mensagem copiada para a área de transferência!');
        })
        .catch(() => {
          fallbackCopyText(textToCopy);
        });
    } else {
      fallbackCopyText(textToCopy);
    }
  });

  function fallbackCopyText(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    try {
      document.execCommand('copy');
      showFeedbackSuccess();
      showToast('Mensagem copiada com sucesso!');
    } catch (err) {
      showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(tempTextArea);
  }

  function showFeedbackSuccess() {
    if (contactForm && formFeedbackCard) {
      contactForm.style.display = 'none';
      formFeedbackCard.style.display = 'flex';
    }
  }

  btnResetForm?.addEventListener('click', () => {
    if (contactForm && formFeedbackCard) {
      contactForm.reset();
      document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));
      formFeedbackCard.style.display = 'none';
      contactForm.style.display = 'flex';
    }
  });

  // Botão Abrir no E-mail
  btnOpenMail?.addEventListener('click', () => {
    const subject = encodeURIComponent(userSubjectInput?.value.trim() || 'Contato via Portfólio');
    const body = encodeURIComponent(getFormattedMessage());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  /* ==========================================================================
     7. VOLTAR AO TOPO (Smooth Scroll)
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});

