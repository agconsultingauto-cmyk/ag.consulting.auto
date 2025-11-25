// Scroll reveal des sections pour une intégration fluide des blocs
  (function(){
    const sections = Array.from(document.querySelectorAll('.section'));
    if(!('IntersectionObserver' in window) || !sections.length) return;

    sections.forEach((sec, index) => {
      sec.dataset.animate = 'fade-up';

      const revealEls = [];
      const head = sec.querySelector('.section-head');
      if(head) revealEls.push(head);

      revealEls.push(...sec.querySelectorAll(
        '.cards .card, .process-grid .step, .gallery figure, .price-card, .contact-form .grid > *, .signature-main, .signature-side, .invest-grid > *'
      ));

      if(!revealEls.length){
        revealEls.push(...sec.children);
      }

      revealEls.forEach((el, idx) => {
        el.setAttribute('data-reveal', 'item');
        el.style.transitionDelay = (0.09 * idx).toFixed(2) + 's';
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const sec = entry.target;
          sec.classList.add('is-visible');
          io.unobserve(sec);
        }
      });
    }, {threshold:0.18});

    sections.forEach(sec => io.observe(sec));
  })();



// FAQ toggle
  (function(){
    const root = document.querySelector('[data-faq]');
    if(!root) return;
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-question');
      if(!btn) return;
      const item = btn.closest('.faq-item');
      if(!item) return;
      const open = item.classList.contains('is-open');
      root.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      if(!open){
        item.classList.add('is-open');
      }
    });
  })();

// Année
  const yearSpan = document.querySelector('[data-year]');
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Formulaire contact : mailto + objet dynamique
  (function(){
    const form = document.querySelector('.contact-form');
    if(!form) return;
    const output = form.querySelector('.form-output');
    const nameInput = form.elements['name'];
    const serviceInput = form.elements['service'];
    const emailTo = 'ag.consulting.auto@gmail.com';

    function buildSubject(){
      const nom = (nameInput && nameInput.value || '').trim();
      const service = (serviceInput && serviceInput.value || '').trim();
      let subject = '';
      if(nom){
        subject = 'Demande de M. ' + nom;
      }else{
        subject = 'Demande de contact';
      }
      if(service){
        subject += ' — ' + service;
      }
      return subject;
    }

    function buildBody(){
      const data = new FormData(form);
      const lines = [];
      data.forEach((value, key) => {
        lines.push(key + ' : ' + value);
      });
      return lines.join('\n');
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();

      const subject = encodeURIComponent(buildSubject());
      const body = encodeURIComponent(buildBody());
      const mailto = 'mailto:' + encodeURIComponent(emailTo) + '?subject=' + subject + '&body=' + body;

      if(output){
        output.textContent = 'Votre logiciel de messagerie va s\'ouvrir avec votre demande pré-remplie.';
        setTimeout(() => { output.textContent = ''; }, 8000);
      }

      window.location.href = mailto;
    });
  })();

  // Nav burger
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('#nav-menu');
  if(navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded','false');
    }));
  }

  // Transition visuelle hero->sections
  (function(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const body = document.body;
    function computeThreshold(){
      return hero.offsetHeight * 0.45;
    }
    let threshold = 0;
    function onResize(){
      threshold = computeThreshold();
      onScroll();
    }
    function onScroll(){
      const y = window.scrollY || window.pageYOffset || 0;
      if(y > threshold){
        body.classList.add('hero-scrolled');
      }else{
        body.classList.remove('hero-scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
  })();

  // Barre de progression de scroll
  (function(){
    const bar = document.querySelector('[data-scroll-progress]');
    if(!bar) return;
    function onScroll(){
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      const ratio = (window.scrollY || window.pageYOffset || 0) / max;
      bar.style.transform = 'scaleX(' + ratio + ')';
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('load', onScroll);
  })();

  // Transition luxe entre sections + animer le chargement
  (function(){
    const overlay = document.querySelector('[data-page-transition]');
    if(!overlay) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced) return;

    function showOverlay(){
      overlay.classList.add('is-active');
    }
    function hideOverlay(){
      overlay.classList.remove('is-active');
    }

    function scrollToSection(id){
      const target = document.getElementById(id);
      if(!target) return;
      const header = document.querySelector('.site-header');
      const offset = header ? header.offsetHeight + 12 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top, behavior:'smooth'});
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      if(!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if(!target) return;
      link.addEventListener('click', e => {
        e.preventDefault();
        showOverlay();
        setTimeout(() => {
          scrollToSection(id);
          setTimeout(hideOverlay, 500);
        }, 220);
      });
    });

    window.addEventListener('load', () => {
      showOverlay();
      setTimeout(hideOverlay, 650);
    });
  })();

  // Animations d’apparition
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const revealables = document.querySelectorAll('.card,.step,.gallery figure,.price-card,.aside-card,.signature-side');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.animate(
            [{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],
            {duration:520,easing:'ease-out',fill:'forwards'}
          );
          io.unobserve(entry.target);
        }
      });
    },{threshold:.15});
    revealables.forEach(el => io.observe(el));
  }

  // Chat latéral
  (function(){
    const side = document.querySelector('[data-chat-side]');
    if(!side) return;
    const tab = side.querySelector('[data-chat-tab]');
    const panel = side.querySelector('#chat-panel');
    const closeBtn = side.querySelector('[data-chat-close]');
    const form = side.querySelector('[data-chat-form]');
    const input = side.querySelector('#chat-message');
    const log = side.querySelector('[data-chat-log]');
    const OPEN_KEY = 'agca_chat_open_v1';

    function setOpen(open, focus=true){
      side.classList.toggle('open', open);
      panel.hidden = !open;
      tab.setAttribute('aria-expanded', String(open));
      if(open && focus) input?.focus();
      try{ localStorage.setItem(OPEN_KEY, open ? '1':'0'); }catch(e){}
    }
    function toggle(){ setOpen(!side.classList.contains('open')); }

    tab.addEventListener('click', toggle);
    closeBtn.addEventListener('click', () => setOpen(false,false));
    if(localStorage.getItem(OPEN_KEY)==='1'){ setOpen(true,false); }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const t = (input.value || '').trim();
      if(!t) return;
      addMsg(t,'user');
      input.value = '';
      setTimeout(()=> botReply(t), 250);
    });

    function addMsg(text, who='bot'){
      const el = document.createElement('div');
      el.className = 'msg ' + who;
      el.innerHTML = '<p>'+escapeHTML(text)+'</p>';
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }
    function botReply(text){
      const t = text.toLowerCase();
      if(/essentiel/.test(t)) return addMsg('Le Pack Essentiel est idéal pour cadrer votre projet et éviter les mauvais choix dès le départ.');
      if(/signature/.test(t)) return addMsg('Le Pack Signature vous permet de déléguer la recherche et le tri des annonces.');
      if(/collection/.test(t)) return addMsg('Le Pack Collection est l’accompagnement le plus complet, jusqu’au choix final.');
      if(/sur[- ]?mesure/.test(t)) return addMsg('Le Pack Sur-mesure est construit uniquement autour de votre cas, sur devis.');
      if(/tarif|prix|honorair/.test(t)) return addMsg('Les honoraires sont affichés dans la section « Investissement & honoraires » en bas de page.');
      addMsg('Merci. Nous prenons note et reviendrons vers vous après étude de votre demande.');
    }
    function escapeHTML(str){
      const p = document.createElement('p'); p.textContent = str; return p.innerHTML;
    }
  })();

// Bandeau de consentement aux cookies
  (function(){
    const banner = document.querySelector('[data-cookie-banner]');
    if(!banner) return;

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const declineBtn = banner.querySelector('[data-cookie-decline]');

    function hideBanner(){
      banner.setAttribute('hidden', 'hidden');
    }
    function showBanner(){
      banner.removeAttribute('hidden');
    }

    try{
      const stored = window.localStorage.getItem('agca_cookies_consent');
      if(stored === 'accepted' || stored === 'declined'){
        hideBanner();
        return;
      }
    }catch(e){}

    showBanner();

    if(acceptBtn){
      acceptBtn.addEventListener('click', function(){
        try{
          window.localStorage.setItem('agca_cookies_consent', 'accepted');
        }catch(e){}
        hideBanner();
      });
    }

    if(declineBtn){
      declineBtn.addEventListener('click', function(){
        try{
          window.localStorage.setItem('agca_cookies_consent', 'declined');
        }catch(e){}
        hideBanner();
      });
    }
  })();


// Loader luxe page d'accueil
(function(){
  const loader = document.querySelector('.luxury-loader');
  const body = document.body;
  if(!loader) return;

  const skipBtn = loader.querySelector('.luxury-skip');

  function hideLoader(){
    if(loader.classList.contains('is-hidden')) return;
    body.classList.remove('is-loading');
    body.classList.add('has-loaded');
    loader.classList.add('is-hidden');
    setTimeout(function(){
      if(loader && loader.parentNode){
        loader.parentNode.removeChild(loader);
      }
    }, 900);
  }

  window.addEventListener('load', function(){
    setTimeout(hideLoader, 4300);
  });

  if(skipBtn){
    skipBtn.addEventListener('click', function(){
      hideLoader();
    });
  }

  setTimeout(hideLoader, 9000);
})();

