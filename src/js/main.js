import { initAuditRouting, initAuditScenario, renderAuditUI } from './audit.js';

/* -------------------------------------------------------------
 * Valaura B2B SaaS Premium Interactions, ROI Calculator & Live Demo
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initSplitText();
  initScrollReveal();
  initRoleTabsShowcase();
  initROICalculator();
  initPilotForm();
  initDemoDashboard();
  initMagneticButtons();
  initBackgroundUmbrellaScroll();
  initProblemCards();
  initCategoryExplorer();
  initMomentsToggle();

  // Initialize Audit bindings
  initAuditScenario();
  initAuditRouting(handleMainRoute);

  // Bind universe selector buttons
  const btnPrevoyance = document.getElementById('btnSelectPrevoyance');
  const btnAudit = document.getElementById('btnSelectAudit');
  const btnBack = document.getElementById('btnBackToSelection');
  const btnBackPrev = document.getElementById('btnBackToSelectionPrevoyance');

  if (btnPrevoyance) btnPrevoyance.addEventListener('click', () => { window.location.hash = '#/prevoyance'; });
  if (btnAudit) btnAudit.addEventListener('click', () => { window.location.hash = '#/audit/portfolio'; });

  const goBack = () => { window.location.hash = '#/selection'; };
  if (btnBack) btnBack.addEventListener('click', goBack);
  if (btnBackPrev) btnBackPrev.addEventListener('click', goBack);

  // Bind Hero section CTAs
  const heroPrev = document.getElementById('btnHeroPrevoyance');
  const heroAud = document.getElementById('btnHeroAudit');
  const demoModal = document.getElementById('demoDashboardModal');

  if (heroPrev && demoModal) {
    heroPrev.addEventListener('click', () => {
      demoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      window.location.hash = '#/prevoyance';
    });
  }

  if (heroAud && demoModal) {
    heroAud.addEventListener('click', () => {
      demoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      window.location.hash = '#/audit/portfolio';
    });
  }

  // Auto-open modal if hash is present on load
  const currentHash = window.location.hash;
  if (currentHash.startsWith('#/prevoyance') || currentHash.startsWith('#/audit') || currentHash.startsWith('#/selection')) {
    if (demoModal) {
      demoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
});

// Routing Resolver
function handleMainRoute(universe) {
  const selectPanel = document.getElementById('universeSelectorPanel');
  const prevoyanceWrapper = document.getElementById('prevoyanceDashboardWrapper');
  const auditWrapper = document.getElementById('auditDashboardWrapper');
  const landingWrapper = document.getElementById('landingPageWrapper');
  const modal = document.getElementById('demoDashboardModal');
  const closeBtn = document.getElementById('demoModalClose');
  const modalOverlay = document.getElementById('demoModalOverlay');

  if (selectPanel && prevoyanceWrapper && auditWrapper && landingWrapper && modal) {
    if (universe === 'prevoyance') {
      landingWrapper.style.display = 'none';
      modal.classList.add('open');
      modal.style.position = 'relative';
      modal.style.height = '100vh';
      modal.style.background = '#0F172A';
      if (modalOverlay) modalOverlay.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'none';
      
      selectPanel.style.display = 'none';
      auditWrapper.style.display = 'none';
      prevoyanceWrapper.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else if (universe === 'audit') {
      landingWrapper.style.display = 'none';
      modal.classList.add('open');
      modal.style.position = 'relative';
      modal.style.height = '100vh';
      modal.style.background = '#070B12';
      if (modalOverlay) modalOverlay.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'none';
      
      selectPanel.style.display = 'none';
      prevoyanceWrapper.style.display = 'none';
      auditWrapper.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      renderAuditUI();
    } else if (universe === 'selection') {
      landingWrapper.style.display = 'none';
      modal.classList.add('open');
      modal.style.position = 'relative';
      modal.style.height = '100vh';
      modal.style.background = '#0F172A';
      if (modalOverlay) modalOverlay.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'none';
      
      prevoyanceWrapper.style.display = 'none';
      auditWrapper.style.display = 'none';
      selectPanel.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else {
      // Return to landing page (universe === 'landing' or default hash '#/')
      landingWrapper.style.display = 'block';
      modal.classList.remove('open');
      modal.style.position = '';
      modal.style.height = '';
      modal.style.background = '';
      if (modalOverlay) modalOverlay.style.display = '';
      if (closeBtn) closeBtn.style.display = '';
      
      prevoyanceWrapper.style.display = 'none';
      auditWrapper.style.display = 'none';
      selectPanel.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
}

/* 1. Custom Interactive Cursor */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('customCursorDot');
  
  if (!cursor || !dot) return;

  // Skip custom cursor initialization on touch devices or small screens
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;
  if (isTouchDevice) {
    cursor.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot instantly follows mouse
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp animation for the outer cursor ring
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover state listeners for premium elements
  const updateHovers = () => {
    const hoverElements = document.querySelectorAll('.cursor-hover, button, a, input, select, textarea, [role="button"]');
    hoverElements.forEach(el => {
      if (el.classList.contains('cursor-bound')) return;
      el.classList.add('cursor-bound');
      
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
      });
    });
  };
  
  updateHovers();
  const observer = new MutationObserver(updateHovers);
  observer.observe(document.body, { childList: true, subtree: true });
}

/* 2. Scroll Reveal Animations (IntersectionObserver) */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-fade, .reveal-text, .reveal-fade-delay, .reveal-fade-delay-2, .reveal-split');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  revealItems.forEach(item => {
    observer.observe(item);
  });
}

/* 3. Category Explorer Details Drawer (Restored) */
const categoryData = {
  health: {
    tag: "Module de Prévoyance Collective & Individuelle",
    title: "Santé & Soins",
    img: "/src/assets/category_health.png",
    features: [
      "Télétransmission Noémie temps réel et règlements instantanés.",
      "Module d'auto-analyse IA des devis dentaires, optiques et hospitalisation.",
      "Portail de gestion des réseaux de soins partenaires (Santéclair, Carte Blanche).",
      "Édition automatique de cartes de Tiers-Payant dématérialisées."
    ],
    benefits: "Optimisez vos temps de gestion opérationnelle de 45% grâce à l'automatisation des flux Noémie. Offrez à vos adhérents une transparence totale de leurs restes à charge avant soins grâce à notre simulateur instantané."
  },
  family: {
    tag: "Module de Garanties Familiales",
    title: "Famille & Prévoyance",
    img: "/src/assets/category_family.png",
    features: [
      "Gestion dynamique des rentes éducation et rentes conjoint survivant.",
      "Calculateurs automatisés des barèmes d'invalidité professionnelle.",
      "Module de versement accéléré de capitaux décès d'urgence.",
      "Suivi et versement simplifié des prestations de congés maternité et parentalité."
    ],
    benefits: "Soutenez les familles de vos assurés dans les moments les plus délicats. Notre workflow d'urgence permet de débloquer les capitaux de première nécessité sous 24 heures sans formalité superflue."
  },
  income: {
    tag: "Module de Protection des Actifs & TNS",
    title: "Activité & Revenus",
    img: "/src/assets/category_income.png",
    features: [
      "Calcul automatisé des indemnités journalières complémentaires (IJC).",
      "Interface d'analyse des déclarations sociales nominatives DSN.",
      "Rapprochement bancaire intelligent avec les flux bancaires entreprises.",
      "Gestion et pré-évaluation des dossiers de reprise de travail (temps partiel)."
    ],
    benefits: "Protégez le tissu économique de vos entreprises adhérentes. Valaura automatise le calcul complexe du maintien de salaire et sécurise les flux financiers des cotisations et prestations de prévoyance."
  },
  retirement: {
    tag: "Module d'Épargne & Capitalisation",
    title: "Retraite & Épargne",
    img: "/src/assets/category_retirement.png",
    features: [
      "Épargne retraite collective et individuelle (PER Obligatoire, PER Unique).",
      "Simulateurs d'évolution de capital basés sur des profils de gestion pilotée.",
      "Rapports réglementaires de solvabilité II générés automatiquement.",
      "Calcul des droits et versements de réversion de retraite complémentaire."
    ],
    benefits: "Simplifiez la complexité de l'épargne à long terme. Donnez à vos conseillers des outils de projection financière interactifs pour valoriser l'épargne retraite collective et individuelle."
  },
  support: {
    tag: "Module d'Assistance Successorale & Décès",
    title: "Accompagnement",
    img: "/src/assets/category_support.png",
    features: [
      "Mise en relation directe avec les services de pompes funèbres agréés.",
      "Plateforme de télé-assistance psychologique 24h/7j pour les familles.",
      "Assistance juridique complète pour les démarches successorales.",
      "Rapatriement de corps et prise en charge logistique d'urgence."
    ],
    benefits: "Apportez une vraie valeur humaine au-delà du simple soutien financier. Valaura intègre des connecteurs natifs avec les plus grands réseaux d'assistance pour une prise en charge logistique et morale bienveillante."
  },
  moving: {
    tag: "Déclencheur d'Événement Client",
    title: "Déménagement client",
    img: "/src/assets/trigger_moving.png",
    features: [
      "Mise à jour d'adresse automatisée en un clic auprès de tous vos contrats.",
      "Ajustement automatique de vos garanties santé selon votre nouvelle région.",
      "Prise en charge des frais administratifs de réinstallation.",
      "Option d'assurance transition immobilière simplifiée."
    ],
    benefits: "Le déménagement est souvent source de stress. Valaura automatise le transfert d'adresse pour vos assurés et recalcule leurs cotisations locales instantanément, évitant toute rupture de couverture."
  },
  baby: {
    tag: "Déclencheur d'Événement Client",
    title: "Naissance / Famille s'agrandit",
    img: "/src/assets/trigger_baby.png",
    features: [
      "Ajout immédiat du nouveau-né comme ayant-droit sans délai de carence.",
      "Déblocage automatique de la prime de naissance sous 12h.",
      "Simulation et souscription simplifiée d'une garantie capital décès.",
      "Accès gratuit à la plateforme d'assistance pédiatrique en ligne 24h/7j."
    ],
    benefits: "Accueillez la vie en toute sérénité. La plateforme Valaura accélère les formalités d'inscription et débloque les prestations familiales instantanément dès la déclaration de naissance."
  },
  trigger_retirement: {
    tag: "Déclencheur d'Événement Client",
    title: "Liquidation / Retraite",
    img: "/src/assets/trigger_retirement.png",
    features: [
      "Liquidation automatisée de vos droits auprès des caisses complémentaires.",
      "Simulation de conversion de votre capital épargne en rente garantie.",
      "Conseil patrimonial et fiscal personnalisé pour vos placements.",
      "Maintien de votre couverture santé collective en tarif individuel négocié."
    ],
    benefits: "Préparez votre avenir en toute sérénité. Valaura compile vos données de carrière et simule les meilleures stratégies de sortie (rente ou capital) pour assurer votre niveau de vie."
  },
  sale: {
    tag: "Déclencheur d'Événement Entreprise",
    title: "Cession de l'entreprise",
    img: "/src/assets/trigger_sale.png",
    features: [
      "Audit technique de conformité de vos contrats de prévoyance collective.",
      "Valorisation comptable de vos engagements sociaux (Indemnités IFC).",
      "Processus simplifié de transfert de gouvernance de vos régimes de santé.",
      "Accompagnement fiscal des dirigeants lors de la cession des actifs."
    ],
    benefits: "Facilitez la transmission de votre actif professionnel. Valaura évalue précisément vos passifs sociaux et optimise la conformité de vos régimes de prévoyance collective pour rassurer le repreneur."
  },
  expansion: {
    tag: "Déclencheur d'Événement Entreprise",
    title: "Croissance / Recrutement",
    img: "/src/assets/trigger_expansion.png",
    features: [
      "Onboarding digital massif pour les nouveaux collaborateurs en moins de 3 minutes.",
      "Génération automatique d'avenants contractuels collectifs et tarifs dégressifs.",
      "Module de self-service RH pour le pilotage des effectifs et des régimes souscrits.",
      "Mise en conformité instantanée avec les conventions collectives de branche (CCN)."
    ],
    benefits: "Accompagnez votre croissance sans surcharger vos équipes RH. Valaura automatise l'affiliation de vos nouveaux salariés et offre une console de gestion simple pour suivre vos budgets prévoyance globale."
  },
  risks: {
    tag: "Déclencheur d'Événement Entreprise",
    title: "Risques Homme Clé & RCMS",
    img: "/src/assets/trigger_risks.png",
    features: [
      "Souscription de garanties Homme Clé pour protéger vos compétences critiques.",
      "Couverture perte d'exploitation après sinistre avec calcul d'indemnisation dynamique.",
      "Prise en charge de la responsabilité civile des mandataires sociaux (RCMS).",
      "Alerte préventive automatisée sur la sinistralité de vos contrats de groupe."
    ],
    benefits: "Sécurisez la pérennité de votre activité économique face aux imprévus. Notre tableau de bord intelligent identifie vos risques opérationnels majeurs et configure les garanties adéquates en temps réel."
  }
};

function initCategoryExplorer() {
  const cards = document.querySelectorAll('.category-card, .moment-card');
  const drawer = document.getElementById('categoryDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const drawerCTA = document.getElementById('drawerCTA');
  
  if (!drawer || !overlay || !closeBtn) return;

  const drawerTag = document.getElementById('drawerTag');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerImg = document.getElementById('drawerImg');
  const drawerFeatures = document.getElementById('drawerFeatures');
  const drawerBenefits = document.getElementById('drawerBenefits');

  let activeDrawerCategory = '';

  function openDrawer(categoryKey) {
    activeDrawerCategory = categoryKey;
    const data = categoryData[categoryKey];
    if (!data) return;

    drawerTag.textContent = data.tag;
    drawerTitle.textContent = data.title;
    drawerImg.src = data.img;
    drawerImg.alt = data.title;
    drawerBenefits.textContent = data.benefits;

    drawerFeatures.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="#8FAEA6" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${feat}</span>
      `;
      drawerFeatures.appendChild(li);
    });

    drawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scroll
    drawer.setAttribute('aria-hidden', 'true');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const categoryKey = card.getAttribute('data-category') || card.getAttribute('data-trigger');
      const key = categoryKey === 'retirement' ? 'trigger_retirement' : categoryKey;
      openDrawer(key);
    });
  });

  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Drawer CTA closes drawer and launches full interactive B2B dashboard demo
  if (drawerCTA) {
    drawerCTA.addEventListener('click', () => {
      closeDrawer();
      setTimeout(() => {
        const demoModal = document.getElementById('demoDashboardModal');
        if (demoModal) {
          demoModal.classList.add('open');
          document.body.style.overflow = 'hidden';
          
          if (activeDrawerCategory === 'category_income' || activeDrawerCategory === 'category_health' || activeDrawerCategory === 'category_family' || activeDrawerCategory === 'trigger_retirement') {
            window.location.hash = '#/prevoyance/clients';
          } else if (activeDrawerCategory === 'category_support') {
            window.location.hash = '#/prevoyance/config';
          } else {
            window.location.hash = '#/prevoyance/dashboard';
          }
          renderScenarioStep(0); // Load step 1
        }
      }, 350); // Small fluid delay for overlapping modals transition
    });
  }
}

/* 4. Trigger Moments Section Toggles (Landing Page Section 2b) */
function initMomentsToggle() {
  const toggles = document.querySelectorAll('.moment-toggle-btn');
  const grids = document.querySelectorAll('.moments-grid');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');

      const targetGroup = toggle.getAttribute('data-group');
      grids.forEach(grid => {
        grid.classList.remove('active');
        if (grid.getAttribute('id') === `group-${targetGroup}`) {
          grid.classList.add('active');
        }
      });
    });
  });
}

/* 5. Role Tabs Showcase (Landing Page Section 3) */
function initRoleTabsShowcase() {
  const tabs = document.querySelectorAll('#roleTabs [data-role-tab]');
  const titleEl = document.getElementById('roleTitle');
  const badge1Val = document.getElementById('roleBadge1Val');
  const badge2Val = document.getElementById('roleBadge2Val');

  if (tabs.length === 0) return;

  const roleDetails = {
    dirigeant: {
      title: "Pour les Dirigeants",
      badge1: "48 Leads",
      badge2: "82.4% Signature",
      panelId: "panel-dirigeant"
    },
    conseiller: {
      title: "Pour les Conseillers",
      badge1: "8 Tâches",
      badge2: "3 Relances",
      panelId: "panel-conseiller"
    },
    assistante: {
      title: "Pour les Assistantes RH/Admin",
      badge1: "2 Dossiers Bloqués",
      badge2: "15 Pièces à valider",
      panelId: "panel-assistante"
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const roleKey = tab.getAttribute('data-role-tab');
      const details = roleDetails[roleKey];

      if (!details) return;

      titleEl.textContent = details.title;
      badge1Val.textContent = details.badge1;
      badge2Val.textContent = details.badge2;

      const panels = document.querySelectorAll('#roles .tab-panel');
      panels.forEach(p => p.classList.remove('active'));

      const targetPanel = document.getElementById(details.panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* 6. ROI Calculator (Landing Page Section 5) */
function initROICalculator() {
  const sliderAdvisors = document.getElementById('roiSliderAdvisors');
  const sliderHours = document.getElementById('roiSliderHours');
  const sliderCommission = document.getElementById('roiSliderCommission');
  const sliderContracts = document.getElementById('roiSliderContracts');

  const valAdvisors = document.getElementById('roiValAdvisors');
  const valHours = document.getElementById('roiValHours');
  const valCommission = document.getElementById('roiValCommission');
  const valContracts = document.getElementById('roiValContracts');

  const resHours = document.getElementById('roiResHours');
  const resCommissions = document.getElementById('roiResCommissions');
  const resTotal = document.getElementById('roiResTotal');

  if (!sliderAdvisors) return;

  function calculateROI() {
    const advisors = parseInt(sliderAdvisors.value);
    const hours = parseInt(sliderHours.value);
    const commission = parseInt(sliderCommission.value);
    const extraContracts = parseInt(sliderContracts.value);

    valAdvisors.textContent = advisors;
    valHours.textContent = `${hours} h`;
    valCommission.textContent = `${commission.toLocaleString('fr-FR')} €`;
    valContracts.textContent = extraContracts;

    const weeksPerYear = 47;
    const hoursSavedYear = advisors * hours * weeksPerYear;
    const extraContractsYear = advisors * extraContracts * 12;
    const commissionGain = extraContractsYear * commission;
    
    const hourlyCounselingValue = 40;
    const timeValueGain = hoursSavedYear * hourlyCounselingValue;
    const totalGain = commissionGain + timeValueGain;

    resHours.textContent = `${hoursSavedYear.toLocaleString('fr-FR')} heures`;
    resCommissions.textContent = `${commissionGain.toLocaleString('fr-FR')} €`;
    resTotal.textContent = `${totalGain.toLocaleString('fr-FR')} € / an`;
  }

  [sliderAdvisors, sliderHours, sliderCommission, sliderContracts].forEach(slider => {
    slider.addEventListener('input', calculateROI);
  });

  calculateROI();
}

/* 7. Pilot application form submission */
function initPilotForm() {
  const pilotForm = document.getElementById('pilotForm');
  if (!pilotForm) return;

  pilotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('pilotName').value;
    const cabinet = document.getElementById('pilotCabinet').value;
    
    pilotForm.innerHTML = `
      <div class="success-message" style="text-align: center; padding: 2rem; color: #8FAEA6; animation: fadeIn 0.6s var(--ease-premium)">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">✓</div>
        <h4 style="font-size: 1.25rem; font-weight:600; margin-bottom: 0.5rem; color:#fff;">Candidature Enregistrée</h4>
        <p style="font-size: 0.9rem; color:#A0AEC0; line-height: 1.5;">
          Merci <strong>${name}</strong>. Votre candidature pour le cabinet <strong>${cabinet}</strong> a été enregistrée avec succès. Notre équipe va analyser vos besoins et vous recontactera sous 24h pour configurer votre accès pilote.
        </p>
      </div>
    `;
  });
}

/* 8. Problem Cards highlights (Landing Page Section 1) */
function initProblemCards() {
  const problemCards = document.querySelectorAll('#problems .moment-card');
  problemCards.forEach(card => {
    card.addEventListener('click', () => {
      problemCards.forEach(c => {
        c.style.borderColor = '';
        c.style.background = '';
      });
      card.style.borderColor = 'var(--color-accent)';
      card.style.background = 'rgba(216, 180, 143, 0.03)';
    });
  });
}



/* 9. Live Demo Dashboard System (Modal & Simulation Steps & Unified State) */

const dashboardState = {
  activeCategory: 'dashboard',
  activeRole: 'dirigeant',
  selectedClientId: 1, // Jean Dupont
  selectedConfigProduct: 'prevoyance',
  clients: [
    { id: 1, name: "Jean Dupont", solution: "Prévoyance TNS Indépendants", advisor: "Pierre", ca: 1200, status: "Prospect", docs: { id: "Manquant", health: "Manquant", rib: "Manquant" }, notes: ["Demande de prévoyance TNS reçue (Formulaire Web)"], phone: "06 12 34 56 78", email: "jean.dupont@gmail.com", appointments: [{ time: "Demain 10:00", name: "Appel découverte Jean Dupont (Pierre)" }] },
    { id: 2, name: "Antoine Martin", solution: "Garantie Homme Clé", advisor: "Pierre", ca: 800, status: "Bloqué", docs: { id: "Reçu", health: "Manquant", rib: "Reçu" }, notes: ["Entretien découverte réalisé", "Alerte : Facture manquante"], phone: "06 98 76 54 32", email: "antoine.martin@outlook.com", appointments: [] },
    { id: 3, name: "Sophie Bertrand", solution: "Mutuelle Collective PME", advisor: "Marie", ca: 1500, status: "Proposition faite", docs: { id: "Reçu", health: "Reçu", rib: "Reçu" }, notes: ["Proposition commerciale envoyée", "Sans relance depuis 8 jours"], phone: "07 11 22 33 44", email: "s.bertrand@entreprise.fr", appointments: [] },
    { id: 4, name: "Cabinet Leblanc", solution: "Prévoyance TNS Indépendants", advisor: "Marie", ca: 4500, status: "Signé", docs: { id: "Reçu", health: "Reçu", rib: "Reçu" }, notes: ["Contrat signé électroniquement"], phone: "01 44 55 66 77", email: "contact@leblanc-associes.fr", appointments: [] },
    { id: 5, name: "Sarah Moreau", solution: "Garantie Homme Clé", advisor: "Pierre", ca: 2200, status: "Prospect", docs: { id: "Manquant", health: "Manquant", rib: "Manquant" }, notes: ["Création de la fiche prospect"], phone: "06 55 66 77 88", email: "sarah.moreau@gmail.com", appointments: [] },
    { id: 6, name: "Thomas Dubois", solution: "Mutuelle Collective PME", advisor: "Marie", ca: 3100, status: "Actif", docs: { id: "Reçu", health: "Reçu", rib: "Reçu" }, notes: ["Bilan de prévoyance annuel planifié"], phone: "06 12 99 88 77", email: "t.dubois@dubois-btp.fr", appointments: [{ time: "24 Juin 2027", name: "Bilan de prévoyance annuel (Pierre)" }] }
  ],
  campaigns: {
    "prospect-j3": true,
    "docs-j2": true,
    "bilan-j365": true,
    "sms-j1": false
  },
  emailTemplates: {
    devis: {
      subject: "Votre proposition de prévoyance Valaura",
      body: "Bonjour {{client.name}},\n\nJ'espère que vous allez bien.\n\nJe reviens vers vous concernant notre entretien et la proposition de prévoyance TNS.\n\nVous trouverez ci-joint le récapitulatif détaillé de vos garanties.\n\nN'hésitez pas si vous avez des questions.\n\nCordialement,\n{{conseiller.name}}\nCabinet Valaura"
    },
    docs: {
      subject: "Pièces justificatives manquantes pour votre dossier",
      body: "Bonjour {{client.name}},\n\nPour finaliser la mise en place de votre couverture, il nous manque encore certaines pièces (notamment le questionnaire médical).\n\nVous pouvez les déposer directement sur votre espace sécurisé en un clic.\n\nMerci par avance,\n{{conseiller.name}}"
    },
    welcome: {
      subject: "Bienvenue chez Valaura !",
      body: "Bonjour {{client.name}},\n\nNous sommes ravis de vous compter parmi nos clients.\n\nVotre contrat de prévoyance est désormais actif et validé.\n\nNotre équipe reste à votre entière disposition.\n\nBien cordialement,\nL'équipe Valaura"
    }
  },
  reminderLogs: [
    { date: "Aujourd'hui 17:20", client: "Jean Dupont", channel: "Email", type: "Bilan Planifié", status: "Planifié" },
    { date: "Aujourd'hui 16:40", client: "Jean Dupont", channel: "Email", type: "Proposition", status: "Envoyé" },
    { date: "Aujourd'hui 14:05", client: "Jean Dupont", channel: "SMS", type: "Dépôt CNI/RIB", status: "Délivré" },
    { date: "Aujourd'hui 09:15", client: "Jean Dupont", channel: "Email", type: "Confirmation RDV", status: "Envoyé" },
    { date: "Hier 11:30", client: "Sophie Bertrand", channel: "Email", type: "Relance Devis", status: "Envoyé" }
  ],
  team: [
    { name: "Pierre", email: "pierre@valaura.io", role: "conseiller", status: "Actif" },
    { name: "Marie", email: "marie@valaura.io", role: "conseiller", status: "Actif" },
    { name: "Julie", email: "julie@valaura.io", role: "assistante", status: "Actif" },
    { name: "Robin Masini", email: "robin@valaura.io", role: "dirigeant", status: "Propriétaire" }
  ],
  integrations: {
    "google-calendar": false,
    "outlook": false,
    "salesforce": false
  },
  mandatoryDocs: {
    prevoyance: [
      { name: "Copie d'identité (CNI / Passeport)", required: true },
      { name: "Questionnaire médical de santé", required: true },
      { name: "Relevé d'identité bancaire (RIB)", required: true },
      { name: "Justificatif de statut TNS", required: false }
    ],
    mutuelle: [
      { name: "Copie d'identité du représentant", required: true },
      { name: "Kbis de l'entreprise", required: true },
      { name: "Fiche DSN d'effectifs", required: true },
      { name: "RIB de l'entreprise", required: true }
    ]
  }
};

const scenarioSteps = [
  {
    step: 1,
    name: "1. Demande de prévoyance",
    desc: "Jean Dupont soumet un formulaire en ligne pour obtenir un devis de prévoyance TNS. Sa fiche prospect est générée dans Valaura.",
    role: "conseiller",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Prospect";
        client.docs = { id: "Manquant", health: "Manquant", rib: "Manquant" };
        client.notes = ["Demande de prévoyance TNS reçue (Formulaire Web)"];
        client.appointments = [{ time: "Demain 10:00", name: "Appel découverte Jean Dupont (Pierre)" }];
      }
      state.confetti = false;
    }
  },
  {
    step: 2,
    name: "2. Qualification & Tâche créée",
    desc: "Pierre, le conseiller prévoyance, reçoit une tâche automatique de rappel prioritaire sous 2 heures. L'appel de découverte est effectué.",
    role: "conseiller",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Qualification en cours";
        if (!client.notes.includes("Appel de découverte réalisé : besoins qualifiés")) {
          client.notes.unshift("Appel de découverte réalisé : besoins qualifiés");
        }
      }
      state.confetti = false;
    }
  },
  {
    step: 3,
    name: "3. Entretien enregistré",
    desc: "Le premier entretien d'analyse de risques est enregistré. Les pièces justificatives sont demandées. L'assistante prend le relais.",
    role: "assistante",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Pièces demandées";
        client.docs = { id: "En attente", health: "En attente", rib: "En attente" };
        if (!client.notes.includes("Rendez-vous d'analyse réalisé. Liste de pièces demandée")) {
          client.notes.unshift("Rendez-vous d'analyse réalisé. Liste de pièces demandée");
        }
        client.appointments = [{ time: "Aujourd'hui 11:00", name: "Analyse prévoyance Jean Dupont (Pierre)" }];
      }
      state.confetti = false;
    }
  },
  {
    step: 4,
    name: "4. Centralisation des pièces",
    desc: "Jean Dupont dépose sa Carte d'identité et son RIB sur son espace sécurisé Valaura. Le questionnaire de santé est toujours manquant.",
    role: "assistante",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Dossier incomplet";
        client.docs = { id: "Reçu", health: "Manquant", rib: "Reçu" };
        if (!client.notes.includes("Pièces validées : CNI & RIB reçus")) {
          client.notes.unshift("Pièces validées : CNI & RIB reçus");
        }
        client.appointments = [];
      }
      state.confetti = false;
    }
  },
  {
    step: 5,
    name: "5. Alerte Dossier Bloqué",
    desc: "Le dossier est bloqué car le questionnaire médical manque depuis 24h. Le dirigeant reçoit une alerte immédiate sur son dashboard.",
    role: "dirigeant",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Bloqué";
        client.docs = { id: "Reçu", health: "Manquant", rib: "Reçu" };
        if (!client.notes.includes("Alerte : Dossier bloqué (Questionnaire de santé)")) {
          client.notes.unshift("Alerte : Dossier bloqué (Questionnaire de santé)");
        }
      }
      state.confetti = false;
    }
  },
  {
    step: 6,
    name: "6. Déblocage du dossier",
    desc: "Le questionnaire médical est finalement téléversé. Le dossier passe au vert, l'alerte dirigeant est levée. Pierre peut préparer la proposition.",
    role: "conseiller",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Proposition à préparer";
        client.docs = { id: "Reçu", health: "Reçu", rib: "Reçu" };
        if (!client.notes.includes("Questionnaire médical reçu. Dossier débloqué")) {
          client.notes.unshift("Questionnaire médical reçu. Dossier débloqué");
        }
      }
      state.confetti = false;
    }
  },
  {
    step: 7,
    name: "7. Proposition & Relance Automatique",
    desc: "La proposition is envoyée par e-mail. Valaura planifie automatiquement une relance personnalisée à J+3 sans action requise de Pierre.",
    role: "conseiller",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Proposition envoyée";
        if (!client.notes.includes("Proposition commerciale envoyée par e-mail")) {
          client.notes.unshift("Proposition commerciale envoyée par e-mail");
          client.notes.unshift("Relance automatique programmée à J+3");
        }
      }
      state.confetti = false;
    }
  },
  {
    step: 8,
    name: "8. Signature du contrat !",
    desc: "Jean Dupont signe électroniquement son contrat de prévoyance. La commission de 1 200 € est acquise pour le cabinet. Confettis !",
    role: "dirigeant",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Signé";
        if (!client.notes.includes("Contrat signé électroniquement (Signature certifiée)")) {
          client.notes.unshift("Contrat signé électroniquement (Signature certifiée)");
          client.notes.unshift("Commission souscription prévoyance acquise : +1 200€");
        }
      }
      state.confetti = true;
    }
  },
  {
    step: 9,
    name: "9. Fidélisation & Bilan Annuel",
    desc: "Le contrat est actif. Valaura génère une alerte automatique dans 365 jours pour le bilan de prévoyance annuel obligatoire.",
    role: "assistante",
    action: (state) => {
      const client = dashboardState.clients.find(c => c.id === 1);
      if (client) {
        client.status = "Actif";
        if (!client.notes.includes("Alerte Bilan Annuel planifiée à 1 an (24 Juin 2027)")) {
          client.notes.unshift("Alerte Bilan Annuel planifiée à 1 an (24 Juin 2027)");
        }
        client.appointments = [{ time: "24 Juin 2027", name: "Bilan de prévoyance annuel Jean Dupont (Pierre)" }];
      }
      state.confetti = false;
    }
  }
];

// Show Toast Notification Helper
function showToast(message, isError = false) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg cursor-hover ${isError ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <span class="toast-icon">${isError ? '✕' : '✓'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after animation completes
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Helper to replace email templates variables
function replaceTemplateVariables(text, client) {
  if (!text) return "";
  let result = text;
  result = result.replace(/\{\{client\.name\}\}/g, client.name);
  result = result.replace(/\{\{client\.email\}\}/g, client.email || `${client.name.toLowerCase().replace(' ', '.')}@gmail.com`);
  result = result.replace(/\{\{client\.phone\}\}/g, client.phone || "06 00 00 00 00");
  result = result.replace(/\{\{client\.solution\}\}/g, client.solution);
  result = result.replace(/\{\{conseiller\.name\}\}/g, client.advisor || "Pierre");
  return result;
}

function initDemoDashboard() {
  const modal = document.getElementById('demoDashboardModal');
  const overlay = document.getElementById('demoModalOverlay');
  const closeBtn = document.getElementById('demoModalClose');

  const openBtns = [
    document.getElementById('openDemoBtnHeader'),
    document.getElementById('openDemoBtnHero'),
    document.getElementById('openDemoBtnPromo'),
    document.getElementById('footerDemoLink')
  ];

  if (!modal || !closeBtn) return;

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Reset state on open
        window.location.hash = '#/selection';
        dashboardState.activeCategory = 'dashboard';
        dashboardState.activeRole = 'dirigeant';
        adjustScenarioPanelForMobile();
        switchDashboardCategory('dashboard');
        switchDashboardRole('dirigeant');
        renderScenarioStep(0); // Load step 1
      });
    }
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    window.location.hash = '#/';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Role toggler buttons
  const dbRoleBtns = document.querySelectorAll('.db-role-btn');
  dbRoleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.getAttribute('data-db-role');
      switchDashboardRole(targetRole);
    });
  });

  // Sidebar Category Links
  const dbCategoryItems = document.querySelectorAll('.db-nav-item[data-db-category]');
  dbCategoryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const categoryKey = item.getAttribute('data-db-category');
      window.location.hash = '#/prevoyance/' + categoryKey;
    });
  });

  let currentStepIndex = 0;
  const nextBtn = document.getElementById('scNextBtn');
  const resetBtn = document.getElementById('scResetBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStepIndex === scenarioSteps.length - 1) {
        currentStepIndex = 0;
        nextBtn.querySelector('span').textContent = 'Étape Suivante';
      } else {
        currentStepIndex++;
        if (currentStepIndex === scenarioSteps.length - 1) {
          nextBtn.querySelector('span').textContent = 'Recommencer la démo';
        }
      }
      renderScenarioStep(currentStepIndex);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentStepIndex = 0;
      if (nextBtn) nextBtn.querySelector('span').textContent = 'Étape Suivante';
      renderScenarioStep(0);
    });
  }

  // Adjust scenario panel layout on load and resize
  adjustScenarioPanelForMobile();
  window.addEventListener('resize', adjustScenarioPanelForMobile);

  // Setup sub-view action event listeners
  setupSubViewListeners();
}

function adjustScenarioPanelForMobile() {
  const scenarioPanel = document.querySelector('.scenario-panel');
  if (!scenarioPanel) return;

  const isMobile = window.innerWidth <= 768;
  const currentParent = scenarioPanel.parentElement;

  if (isMobile) {
    // If it's in the sidebar, move it to the main content area (top of dashboard-main)
    if (currentParent && currentParent.classList.contains('dashboard-sidebar')) {
      const mainDashboard = document.querySelector('.dashboard-main');
      if (mainDashboard) {
        // Insert it right after the topbar header
        const topbar = document.querySelector('.db-topbar');
        if (topbar && topbar.nextSibling) {
          mainDashboard.insertBefore(scenarioPanel, topbar.nextSibling);
        } else {
          mainDashboard.appendChild(scenarioPanel);
        }
        scenarioPanel.classList.add('mobile-layout');
      }
    }
  } else {
    // If it's in the main content area, move it back to the sidebar
    if (currentParent && currentParent.classList.contains('dashboard-main')) {
      const sidebar = document.querySelector('.dashboard-sidebar');
      if (sidebar) {
        sidebar.appendChild(scenarioPanel);
        scenarioPanel.classList.remove('mobile-layout');
      }
    }
  }
}

window.switchDashboardCategory = function(categoryKey) {
  dashboardState.activeCategory = categoryKey;
  
  // Toggle sidebar items active state
  const navItems = document.querySelectorAll('.db-nav-item[data-db-category]');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-db-category') === categoryKey) {
      item.classList.add('active');
    }
  });

  // Toggle category panels visibility
  const panels = document.querySelectorAll('.db-category-panel');
  panels.forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(`dbCategoryPanel-${categoryKey}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // Update views for active role within new category
  renderActiveViews();
}

function switchDashboardRole(roleKey) {
  dashboardState.activeRole = roleKey;

  // Toggle role button active states
  const btns = document.querySelectorAll('.db-role-btn');
  btns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-db-role') === roleKey) {
      btn.classList.add('active');
    }
  });

  // Render the current category view for this role
  renderActiveViews();
}

function renderActiveViews() {
  const role = dashboardState.activeRole;
  const category = dashboardState.activeCategory;

  // 1. Update Title and Subtitle at topbar based on category and role
  const titleEl = document.getElementById('dbViewTitle');
  const subtitleEl = document.getElementById('dbViewSubtitle');
  
  if (category === 'dashboard') {
    if (role === 'dirigeant') {
      titleEl.textContent = "Vue Dirigeant — Cabinet Valaura";
      subtitleEl.textContent = "Visualisez l'état commercial global et les dossiers bloqués.";
    } else if (role === 'conseiller') {
      titleEl.textContent = "Vue Conseiller — Portefeuille Pierre";
      subtitleEl.textContent = "Consultez vos tâches du jour et le suivi de vos assurés.";
    } else if (role === 'assistante') {
      titleEl.textContent = "Vue Assistante — Back-Office";
      subtitleEl.textContent = "Gérez la conformité réglementaire et l'agenda.";
    }
  } else if (category === 'clients') {
    if (role === 'dirigeant') {
      titleEl.textContent = "Portefeuille Global — Dirigeant";
      subtitleEl.textContent = "Supervisez tous les assurés et prospects de votre cabinet.";
    } else if (role === 'conseiller') {
      titleEl.textContent = "Mes Clients & Prospects — Pierre";
      subtitleEl.textContent = "Gérez vos opportunités commerciales et vos notes de dossiers.";
    } else if (role === 'assistante') {
      titleEl.textContent = "Conformité & Pièces — Assistante";
      subtitleEl.textContent = "Validez les justificatifs et débloquez les contrats d'assurance.";
    }
  } else if (category === 'reminders') {
    if (role === 'dirigeant') {
      titleEl.textContent = "Relances Automatiques — Dirigeant";
      subtitleEl.textContent = "Suivez les performances des relances automatiques et gérez les campagnes.";
    } else if (role === 'conseiller') {
      titleEl.textContent = "Modèles d'Emails & Aperçus — Conseiller";
      subtitleEl.textContent = "Rédigez vos templates d'emails de relance personnalisés.";
    } else if (role === 'assistante') {
      titleEl.textContent = "Historique & Dépôts Directs — Assistante";
      subtitleEl.textContent = "Envoyez des liens de dépôt sécurisés et suivez les logs.";
    }
  } else if (category === 'config') {
    if (role === 'dirigeant') {
      titleEl.textContent = "Configuration Cabinet — Dirigeant";
      subtitleEl.textContent = "Gérez l'équipe de collaborateurs et les options d'abonnement.";
    } else if (role === 'conseiller') {
      titleEl.textContent = "Mon Profil & Intégrations — Conseiller";
      subtitleEl.textContent = "Éditez votre signature et synchronisez vos outils.";
    } else if (role === 'assistante') {
      titleEl.textContent = "Paramètres de Conformité — Assistante";
      subtitleEl.textContent = "Configurez les exigences de pièces justificatives par produit.";
    }
  }

  // 2. Toggle active views for category dashboard
  const subviewsMap = {
    dashboard: ['dbView-dirigeant', 'dbView-conseiller', 'dbView-assistante'],
    clients: ['dbClients-dirigeant', 'dbClients-conseiller', 'dbClients-assistante'],
    reminders: ['dbReminders-dirigeant', 'dbReminders-conseiller', 'dbReminders-assistante'],
    config: ['dbConfig-dirigeant', 'dbConfig-conseiller', 'dbConfig-assistante']
  };

  Object.keys(subviewsMap).forEach(cat => {
    const list = subviewsMap[cat];
    list.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
  });

  // Show only the one matching the current category and role
  let targetId = '';
  if (category === 'dashboard') {
    targetId = `dbView-${role}`;
  } else if (category === 'clients') {
    targetId = `dbClients-${role}`;
  } else if (category === 'reminders') {
    targetId = `dbReminders-${role}`;
  } else if (category === 'config') {
    targetId = `dbConfig-${role}`;
  }

  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.classList.add('active');
  }

  // 3. Render specific UI data depending on the category and role
  renderCategorySpecificData();
}

function renderScenarioStep(stepIndex) {
  const stepData = scenarioSteps[stepIndex];
  if (!stepData) return;

  const progressFill = document.getElementById('scProgressFill');
  const stepsCount = document.getElementById('scStepsCount');
  const stepName = document.getElementById('scStepName');
  const stepDesc = document.getElementById('scStepDesc');

  if (progressFill) progressFill.style.width = `${((stepIndex + 1) / scenarioSteps.length) * 100}%`;
  if (stepsCount) stepsCount.textContent = `Étape ${stepIndex + 1} sur ${scenarioSteps.length}`;
  if (stepName) stepName.textContent = stepData.name;
  if (stepDesc) stepDesc.textContent = stepData.desc;

  const state = {
    role: stepData.role,
    confetti: false
  };

  stepData.action(state);
  
  // Render step on correct role and category dashboard
  switchDashboardRole(state.role || stepData.role);
  switchDashboardCategory('dashboard');

  if (state.confetti) {
    fireConfetti();
  }
}

// -------------------------------------------------------------
// Category specific rendering logic
// -------------------------------------------------------------

function renderCategorySpecificData() {
  const role = dashboardState.activeRole;
  const category = dashboardState.activeCategory;

  // Sync Global Dashboard components with state
  syncDashboardViews();

  if (category === 'clients') {
    if (role === 'dirigeant') {
      renderClientsDirigeant();
    } else if (role === 'conseiller') {
      renderClientsConseiller();
    } else if (role === 'assistante') {
      renderClientsAssistante();
    }
  } else if (category === 'reminders') {
    if (role === 'dirigeant') {
      renderRemindersDirigeant();
    } else if (role === 'conseiller') {
      renderRemindersConseiller();
    } else if (role === 'assistante') {
      renderRemindersAssistante();
    }
  } else if (category === 'config') {
    if (role === 'dirigeant') {
      renderConfigDirigeant();
    } else if (role === 'conseiller') {
      renderConfigConseiller();
    } else if (role === 'assistante') {
      renderConfigAssistante();
    }
  }
}

// Helper to synchronise the original dashboard views with new state changes
function syncDashboardViews() {
  // CA Metric
  const dirCAVal = document.getElementById('dirMetricCA');
  if (dirCAVal) {
    // Sum CA of all signed / active clients
    const totalCA = dashboardState.clients
      .filter(c => c.status === 'Signé' || c.status === 'Actif')
      .reduce((sum, c) => sum + c.ca, 20000); // 20k base CA + dynamic clients CA
    dirCAVal.textContent = `${totalCA.toLocaleString('fr-FR')} €`;
  }

  // Blocked table (Dirigeant Dashboard)
  const blockedTableBody = document.getElementById('dirBlockedTableBody');
  if (blockedTableBody) {
    blockedTableBody.innerHTML = '';
    const blockedClients = dashboardState.clients.filter(c => c.status === 'Bloqué' || c.status === 'Dossier incomplet');
    if (blockedClients.length === 0) {
      blockedTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-gray-dark); font-style: italic; padding: 2rem 0;">
            Aucun dossier bloqué actuellement. Tout est fluide !
          </td>
        </tr>
      `;
    } else {
      blockedClients.forEach(c => {
        let alertMsg = "Pièces manquantes";
        if (c.docs.health === 'Manquant') alertMsg = "Questionnaire de santé manquant";
        else if (c.docs.id === 'Manquant') alertMsg = "Identité manquante";
        else if (c.docs.rib === 'Manquant') alertMsg = "RIB manquant";

        blockedTableBody.innerHTML += `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.advisor}</td>
            <td><span class="db-tag bg-orange">${c.status}</span></td>
            <td>Aujourd'hui</td>
            <td class="red" style="font-weight: 500;">${alertMsg}</td>
          </tr>
        `;
      });
    }
  }

  // Selected client context (Conseiller Dashboard)
  const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId) || dashboardState.clients[0];
  const clientSolutionVal = document.getElementById('clientSolutionVal');
  if (clientSolutionVal && activeClient) {
    clientSolutionVal.textContent = activeClient.solution;
  }
  
  const clientStatusBadge = document.getElementById('clientStatusBadge');
  if (clientStatusBadge && activeClient) {
    clientStatusBadge.textContent = activeClient.status;
    clientStatusBadge.className = 'db-tag';
    if (activeClient.status === 'Prospect' || activeClient.status === 'Qualification en cours') {
      clientStatusBadge.classList.add('bg-cyan');
    } else if (activeClient.status === 'Pièces demandées' || activeClient.status === 'Dossier incomplet') {
      clientStatusBadge.classList.add('bg-yellow');
    } else if (activeClient.status === 'Bloqué') {
      clientStatusBadge.classList.add('bg-orange');
    } else if (activeClient.status === 'Proposition à préparer' || activeClient.status === 'Proposition envoyée') {
      clientStatusBadge.classList.add('bg-cyan');
    } else {
      clientStatusBadge.classList.add('bg-green');
    }
  }

  // Timeline (Conseiller Dashboard)
  const clientTimeline = document.getElementById('clientTimeline');
  if (clientTimeline && activeClient) {
    clientTimeline.innerHTML = '';
    activeClient.notes.forEach((note, idx) => {
      clientTimeline.innerHTML += `
        <div class="timeline-step">
          <span class="tl-dot ${idx === 0 ? 'active' : 'completed'}"></span>
          <div class="tl-content">
            <strong>${note}</strong>
            <span class="tl-date">Aujourd'hui</span>
          </div>
        </div>
      `;
    });
  }

  // Todo tasks (Conseiller Dashboard)
  const todoListContainer = document.getElementById('todoListContainer');
  const counselorTasksCount = document.getElementById('counselorTasksCount');
  if (todoListContainer && activeClient) {
    todoListContainer.innerHTML = '';
    
    // Generate tasks list dynamically from status
    const tasks = [];
    if (activeClient.status === 'Prospect') {
      tasks.push({ text: "Rappeler " + activeClient.name + " pour entretien découverte", checked: false });
      tasks.push({ text: "Lancer la qualification commerciale", checked: false });
    } else if (activeClient.status === 'Qualification en cours') {
      tasks.push({ text: "Rappeler " + activeClient.name + " pour entretien découverte", checked: true });
      tasks.push({ text: "Planifier l'entretien d'analyse de risques", checked: false });
    } else if (activeClient.status === 'Pièces demandées') {
      tasks.push({ text: "Entretien d'analyse terminé", checked: true });
      tasks.push({ text: "Relancer le client pour les pièces (Identity, RIB, Santé)", checked: false });
    } else if (activeClient.status === 'Dossier incomplet' || activeClient.status === 'Bloqué') {
      tasks.push({ text: "Relancer le client pour dossier de pièces", checked: false });
      if (activeClient.docs.id === 'Manquant') tasks.push({ text: "Vérifier pièce d'identité", checked: false });
      if (activeClient.docs.health === 'Manquant') tasks.push({ text: "Vérifier questionnaire médical", checked: false });
    } else if (activeClient.status === 'Proposition à préparer') {
      tasks.push({ text: "Calculer les tarifs prévoyance", checked: false });
      tasks.push({ text: "Rédiger et envoyer la proposition commerciale", checked: false });
    } else if (activeClient.status === 'Proposition envoyée') {
      tasks.push({ text: "Proposition commerciale envoyée", checked: true });
      tasks.push({ text: "Suivre la signature électronique du contrat", checked: false });
    } else if (activeClient.status === 'Signé') {
      tasks.push({ text: "Contrat signé par le client", checked: true });
      tasks.push({ text: "Activer la couverture et paramétrer les prélèvements", checked: false });
    } else {
      tasks.push({ text: "Contrat actif et validé", checked: true });
      tasks.push({ text: "Bilan annuel d'assurance planifié", checked: true });
    }

    tasks.forEach(t => {
      todoListContainer.innerHTML += `
        <label class="todo-item cursor-hover">
          <input type="checkbox" ${t.checked ? 'checked' : ''} disabled>
          <span class="todo-box"></span>
          <span class="todo-text ${t.checked ? 'strike' : ''}">${t.text}</span>
        </label>
      `;
    });

    const unchecked = tasks.filter(t => !t.checked).length;
    if (counselorTasksCount) {
      counselorTasksCount.textContent = `${unchecked} tâche${unchecked > 1 ? 's' : ''}`;
    }
  }

  // Documents check list (Assistante Dashboard)
  const documentProgressBadge = document.getElementById('documentProgressBadge');
  const docStatus1 = document.getElementById('docStatus1');
  const docStatus2 = document.getElementById('docStatus2');
  const docStatus3 = document.getElementById('docStatus3');

  if (activeClient) {
    const setStatusClass = (el, val) => {
      if (!el) return;
      el.textContent = val;
      el.className = 'db-tag';
      if (val === 'Reçu') el.classList.add('bg-green');
      else if (val === 'Manquant') el.classList.add('bg-red');
      else el.classList.add('bg-yellow');
    };

    setStatusClass(docStatus1, activeClient.docs.id);
    setStatusClass(docStatus2, activeClient.docs.health);
    setStatusClass(docStatus3, activeClient.docs.rib);

    let count = 0;
    if (activeClient.docs.id === 'Reçu') count++;
    if (activeClient.docs.health === 'Reçu') count++;
    if (activeClient.docs.rib === 'Reçu') count++;

    if (documentProgressBadge) {
      documentProgressBadge.textContent = `${count}/3 Reçus`;
      documentProgressBadge.className = 'db-card-badge';
      if (count === 3) {
        documentProgressBadge.classList.add('bg-green');
        documentProgressBadge.style.color = '#38A169';
      } else {
        documentProgressBadge.classList.add('red');
      }
    }
  }
}

// 2.1 Render Clients Dirigeant Tab
function renderClientsDirigeant() {
  const table = document.getElementById('tableClientsDirigeant');
  if (!table) return;

  const searchQuery = document.getElementById('searchClientDirigeant').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatusDirigeant').value;

  table.innerHTML = '';
  
  const filtered = dashboardState.clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery) || c.advisor.toLowerCase().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-gray-dark); padding: 2rem;">
          Aucun client trouvé.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(c => {
    let statusClass = 'bg-cyan';
    if (c.status === 'Bloqué') statusClass = 'bg-red';
    else if (c.status === 'Dossier incomplet' || c.status === 'Pièces demandées') statusClass = 'bg-yellow';
    else if (c.status === 'Signé' || c.status === 'Actif') statusClass = 'bg-green';

    table.innerHTML += `
      <tr class="cursor-hover">
        <td><strong>${c.name}</strong></td>
        <td>${c.solution}</td>
        <td>${c.advisor}</td>
        <td><strong>${c.ca.toLocaleString('fr-FR')} €</strong></td>
        <td><span class="db-tag ${statusClass}">${c.status}</span></td>
        <td>
          <button class="db-tag bg-cyan cursor-hover btn-dir-details" data-client-id="${c.id}" style="border: none; cursor: none;">Ouvrir</button>
        </td>
      </tr>
    `;
  });

  // Action listeners for "Ouvrir" details
  const detailBtns = table.querySelectorAll('.btn-dir-details');
  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const clientId = parseInt(btn.getAttribute('data-client-id'));
      dashboardState.selectedClientId = clientId;
      switchDashboardRole('conseiller');
      switchDashboardCategory('dashboard');
      showToast(`Fiche de ${dashboardState.clients.find(c => c.id === clientId).name} ouverte.`);
    });
  });
}

// 2.2 Render Clients Conseiller Tab
function renderClientsConseiller() {
  const table = document.getElementById('tableClientsConseiller');
  if (!table) return;

  const searchQuery = document.getElementById('searchClientConseiller').value.toLowerCase();
  
  table.innerHTML = '';
  
  // Show all clients but user can select
  const filtered = dashboardState.clients.filter(c => {
    return c.name.toLowerCase().includes(searchQuery);
  });

  filtered.forEach(c => {
    const isSelected = c.id === dashboardState.selectedClientId;
    let statusClass = 'bg-cyan';
    if (c.status === 'Bloqué') statusClass = 'bg-red';
    else if (c.status === 'Dossier incomplet') statusClass = 'bg-yellow';
    else if (c.status === 'Signé' || c.status === 'Actif') statusClass = 'bg-green';

    table.innerHTML += `
      <tr style="${isSelected ? 'background: rgba(143,174,166,0.06); border-left: 2px solid var(--color-primary);' : ''}">
        <td><strong>${c.name}</strong></td>
        <td style="font-size: 0.75rem; color: var(--text-gray-light);">${c.solution}</td>
        <td><span class="db-tag ${statusClass}">${c.status}</span></td>
        <td>
          <button class="db-tag ${isSelected ? 'bg-green' : 'bg-cyan'} cursor-hover btn-select-client" data-client-id="${c.id}" style="border: none; cursor: none;">
            ${isSelected ? 'Actif' : 'Sélectionner'}
          </button>
        </td>
      </tr>
    `;
  });

  // Active client details
  const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId) || dashboardState.clients[0];
  const notesCardTitle = document.getElementById('notesCardTitle');
  if (notesCardTitle) notesCardTitle.textContent = `Notes & Activité : ${activeClient.name}`;

  const notesContainer = document.getElementById('notesContainer');
  if (notesContainer) {
    notesContainer.innerHTML = '';
    activeClient.notes.forEach(note => {
      notesContainer.innerHTML += `
        <div style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 8px;">
          <p style="font-size: 0.8rem; color: #fff; margin: 0; line-height: 1.4;">${note}</p>
          <span style="font-size: 0.65rem; color: var(--text-gray-dark); margin-top: 0.25rem; display: block;">Rédigé aujourd'hui par Pierre</span>
        </div>
      `;
    });
  }

  // Bind Select buttons
  const selectBtns = table.querySelectorAll('.btn-select-client');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const clientId = parseInt(btn.getAttribute('data-client-id'));
      dashboardState.selectedClientId = clientId;
      renderClientsConseiller();
    });
  });
}

// 2.3 Render Clients Assistante Tab
function renderClientsAssistante() {
  const table = document.getElementById('tableClientsAssistante');
  if (!table) return;

  table.innerHTML = '';
  
  dashboardState.clients.forEach(c => {
    const isSelected = c.id === dashboardState.selectedClientId;
    
    const getBadgeHTML = (val) => {
      let cl = 'bg-red';
      if (val === 'Reçu') cl = 'bg-green';
      else if (val === 'En attente') cl = 'bg-yellow';
      return `<span class="db-tag ${cl}">${val}</span>`;
    };

    table.innerHTML += `
      <tr style="${isSelected ? 'background: rgba(143,174,166,0.06); border-left: 2px solid var(--color-primary);' : ''}">
        <td><strong>${c.name}</strong></td>
        <td>${getBadgeHTML(c.docs.id)}</td>
        <td>${getBadgeHTML(c.docs.rib)}</td>
        <td>${getBadgeHTML(c.docs.health)}</td>
        <td>
          <button class="db-tag bg-cyan cursor-hover btn-select-assist-client" data-client-id="${c.id}" style="border: none; cursor: none;">
            Gérer
          </button>
        </td>
      </tr>
    `;
  });

  // Active client doc configuration panel
  const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId) || dashboardState.clients[0];
  const docManageTitle = document.getElementById('docManageTitle');
  if (docManageTitle) docManageTitle.textContent = `Gestion des pièces : ${activeClient.name}`;

  const setBtnState = (btnId, status) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.textContent = status === 'Reçu' ? 'Reçu ✓' : 'Charger';
    btn.className = 'db-tag cursor-hover';
    if (status === 'Reçu') {
      btn.classList.add('bg-green');
    } else {
      btn.classList.add('bg-yellow');
    }
  };

  setBtnState('btnToggleDoc1', activeClient.docs.id);
  setBtnState('btnToggleDoc2', activeClient.docs.health);
  setBtnState('btnToggleDoc3', activeClient.docs.rib);

  // Bind manage selection
  const selectBtns = table.querySelectorAll('.btn-select-assist-client');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const clientId = parseInt(btn.getAttribute('data-client-id'));
      dashboardState.selectedClientId = clientId;
      renderClientsAssistante();
    });
  });
}

// 3.1 Render Reminders Dirigeant Tab
function renderRemindersDirigeant() {
  // Setup campaigns checkboxes correctly matching state
  Object.keys(dashboardState.campaigns).forEach(campaignKey => {
    const checkbox = document.querySelector(`.toggle-campaign[data-campaign="${campaignKey}"]`);
    if (checkbox) {
      checkbox.checked = dashboardState.campaigns[campaignKey];
    }
  });
}

// 3.2 Render Reminders Conseiller Tab
function renderRemindersConseiller() {
  const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId) || dashboardState.clients[0];
  const selectTemplate = document.getElementById('selectEmailTemplate');
  
  if (!selectTemplate) return;

  const currentTemplateKey = selectTemplate.value;
  const template = dashboardState.emailTemplates[currentTemplateKey];

  const subjectInput = document.getElementById('inputEmailSubject');
  const bodyTextarea = document.getElementById('inputEmailBody');

  if (subjectInput && bodyTextarea) {
    subjectInput.value = template.subject;
    bodyTextarea.value = template.body;
  }

  // Render Aperçu Dynamique
  renderEmailPreview(activeClient);
}

function renderEmailPreview(client) {
  const subjectInput = document.getElementById('inputEmailSubject');
  const bodyTextarea = document.getElementById('inputEmailBody');
  const previewSubject = document.getElementById('previewSubject');
  const previewBody = document.getElementById('previewBody');
  const previewTo = document.getElementById('previewTo');

  if (!subjectInput || !previewSubject) return;

  previewTo.textContent = client.email;
  previewSubject.textContent = replaceTemplateVariables(subjectInput.value, client);
  previewBody.textContent = replaceTemplateVariables(bodyTextarea.value, client);
}

// 3.3 Render Reminders Assistante Tab
function renderRemindersAssistante() {
  const table = document.getElementById('tableReminderLogs');
  if (!table) return;

  table.innerHTML = '';
  dashboardState.reminderLogs.forEach(log => {
    table.innerHTML += `
      <tr>
        <td style="font-size: 0.75rem; color: var(--text-gray-light);">${log.date}</td>
        <td><strong>${log.client}</strong></td>
        <td>${log.channel}</td>
        <td>${log.type}</td>
        <td><span class="db-tag bg-green">${log.status}</span></td>
      </tr>
    `;
  });

  // Populate link destination select dropdown
  const select = document.getElementById('selectLinkDest');
  if (select) {
    select.innerHTML = '';
    dashboardState.clients.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name} (${c.status})</option>`;
    });
  }
}

// 4.1 Render Config Dirigeant Tab
function renderConfigDirigeant() {
  const table = document.getElementById('tableCabinetTeam');
  if (!table) return;

  table.innerHTML = '';
  dashboardState.team.forEach(t => {
    let roleName = "Dirigeant";
    if (t.role === 'conseiller') roleName = "Conseiller";
    else if (t.role === 'assistante') roleName = "Assistante Admin";

    table.innerHTML += `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.email}</td>
        <td>${roleName}</td>
        <td><span class="db-tag bg-cyan">${t.status}</span></td>
      </tr>
    `;
  });
}

// 4.2 Render Config Conseiller Tab
function renderConfigConseiller() {
  // Integrations buttons styling
  Object.keys(dashboardState.integrations).forEach(tool => {
    const isConnected = dashboardState.integrations[tool];
    const btn = document.querySelector(`.btn-sync[data-tool="${tool}"]`);
    if (btn) {
      if (isConnected) {
        btn.textContent = 'Connecté ✓';
        btn.className = 'db-tag bg-green connected';
      } else {
        btn.textContent = 'Connecter';
        btn.className = 'db-tag bg-cyan cursor-hover btn-sync';
      }
    }
  });
}

// 4.3 Render Config Assistante Tab
function renderConfigConfig() {
  // Not used but defined to avoid exceptions
}

function renderConfigAssistante() {
  const container = document.getElementById('docRequirementsChecklist');
  if (!container) return;

  const product = document.getElementById('configProductSelect').value;
  const docs = dashboardState.mandatoryDocs[product];

  container.innerHTML = '';
  docs.forEach((doc, idx) => {
    container.innerHTML += `
      <label class="config-req-item cursor-hover">
        <input type="checkbox" class="chk-doc-req" data-product="${product}" data-index="${idx}" ${doc.required ? 'checked' : ''}>
        <span>${doc.name} (Obligatoire)</span>
      </label>
    `;
  });

  // Bind checkbox changes
  const checkboxes = container.querySelectorAll('.chk-doc-req');
  checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      const prod = chk.getAttribute('data-product');
      const index = parseInt(chk.getAttribute('data-index'));
      dashboardState.mandatoryDocs[prod][index].required = chk.checked;
      showToast(`Exigence mise à jour pour le produit.`);
    });
  });
}

// -------------------------------------------------------------
// Bind Action Event Listeners across sub-views
// -------------------------------------------------------------
function setupSubViewListeners() {
  // 1. Live clients search inputs
  const searchDir = document.getElementById('searchClientDirigeant');
  if (searchDir) {
    searchDir.addEventListener('input', () => renderClientsDirigeant());
  }

  const filterStatusDir = document.getElementById('filterStatusDirigeant');
  if (filterStatusDir) {
    filterStatusDir.addEventListener('change', () => renderClientsDirigeant());
  }

  const searchCons = document.getElementById('searchClientConseiller');
  if (searchCons) {
    searchCons.addEventListener('input', () => renderClientsConseiller());
  }

  // 2. Form add client modal triggers
  const openAddBtn = document.getElementById('btnOpenAddClientModal');
  const addModal = document.getElementById('addClientModal');
  const addClose = document.getElementById('addClientClose');
  const addOverlay = document.getElementById('addClientOverlay');

  if (openAddBtn && addModal) {
    openAddBtn.addEventListener('click', () => {
      addModal.classList.add('open');
    });

    const closeAddModal = () => addModal.classList.remove('open');
    if (addClose) addClose.addEventListener('click', closeAddModal);
    if (addOverlay) addOverlay.addEventListener('click', closeAddModal);
  }

  // Submit client form
  const formAddClient = document.getElementById('formAddClient');
  if (formAddClient) {
    formAddClient.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('newClientName').value;
      const solution = document.getElementById('newClientSolution').value;
      const phone = document.getElementById('newClientPhone').value;
      const email = document.getElementById('newClientEmail').value;

      const newId = dashboardState.clients.length + 1;
      const newClientObj = {
        id: newId,
        name: name,
        solution: solution,
        advisor: "Pierre",
        ca: 1500,
        status: "Prospect",
        docs: { id: "Manquant", health: "Manquant", rib: "Manquant" },
        notes: ["Prospect créé manuellement par formulaire de saisie."],
        phone: phone,
        email: email,
        appointments: []
      };

      dashboardState.clients.push(newClientObj);
      dashboardState.selectedClientId = newId;

      if (addModal) addModal.classList.remove('open');
      formAddClient.reset();

      renderClientsConseiller();
      showToast(`Prospect ${name} ajouté avec succès !`);
    });
  }

  // 3. Notes adding trigger
  const btnSaveNote = document.getElementById('btnSaveNote');
  if (btnSaveNote) {
    btnSaveNote.addEventListener('click', () => {
      const input = document.getElementById('inputNewNote');
      if (!input || !input.value.trim()) return;

      const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId);
      if (activeClient) {
        activeClient.notes.unshift(input.value.trim());
        input.value = '';
        renderClientsConseiller();
        showToast("Note ajoutée au dossier.");
      }
    });
  }

  // 4. Document uploader toggles
  const docBtns = ['btnToggleDoc1', 'btnToggleDoc2', 'btnToggleDoc3'];
  docBtns.forEach((btnId, idx) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId);
        if (!activeClient) return;

        const docKey = idx === 0 ? 'id' : idx === 1 ? 'health' : 'rib';
        const currentStatus = activeClient.docs[docKey];
        const nextStatus = currentStatus === 'Reçu' ? 'Manquant' : 'Reçu';
        
        activeClient.docs[docKey] = nextStatus;
        
        // Auto alert/status resolution
        if (activeClient.docs.id === 'Reçu' && activeClient.docs.health === 'Reçu' && activeClient.docs.rib === 'Reçu') {
          activeClient.status = "Proposition à préparer";
          activeClient.notes.unshift("Toutes les pièces de conformité ont été validées.");
        } else if (activeClient.status === 'Proposition à préparer') {
          activeClient.status = "Dossier incomplet";
        }

        renderClientsAssistante();
        showToast(`Statut du document mis à jour : ${nextStatus}`);
      });
    }
  });

  // 5. Validate client file directly
  const btnValDossier = document.getElementById('btnValidateDossier');
  if (btnValDossier) {
    btnValDossier.addEventListener('click', () => {
      const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId);
      if (activeClient) {
        activeClient.docs.id = 'Reçu';
        activeClient.docs.health = 'Reçu';
        activeClient.docs.rib = 'Reçu';
        activeClient.status = "Proposition à préparer";
        activeClient.notes.unshift("Dossier de conformité validé manuellement par Julie.");
        
        renderClientsAssistante();
        showToast(`Le dossier de ${activeClient.name} a été validé commercialement !`);
      }
    });
  }

  // 6. Campaign switch checkboxes listeners
  const chkCampaigns = document.querySelectorAll('.toggle-campaign');
  chkCampaigns.forEach(chk => {
    chk.addEventListener('change', () => {
      const campaignKey = chk.getAttribute('data-campaign');
      dashboardState.campaigns[campaignKey] = chk.checked;
      showToast(`Campagne ${campaignKey} ${chk.checked ? 'activée' : 'désactivée'}.`);
    });
  });

  // 7. Email templates selections & inputs
  const selectTemplate = document.getElementById('selectEmailTemplate');
  if (selectTemplate) {
    selectTemplate.addEventListener('change', () => {
      renderRemindersConseiller();
    });
  }

  const emailSubject = document.getElementById('inputEmailSubject');
  if (emailSubject) {
    emailSubject.addEventListener('input', () => {
      const select = document.getElementById('selectEmailTemplate');
      dashboardState.emailTemplates[select.value].subject = emailSubject.value;
      const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId);
      renderEmailPreview(activeClient);
    });
  }

  const emailBody = document.getElementById('inputEmailBody');
  if (emailBody) {
    emailBody.addEventListener('input', () => {
      const select = document.getElementById('selectEmailTemplate');
      dashboardState.emailTemplates[select.value].body = emailBody.value;
      const activeClient = dashboardState.clients.find(c => c.id === dashboardState.selectedClientId);
      renderEmailPreview(activeClient);
    });
  }

  const btnTestEmail = document.getElementById('btnTestEmail');
  if (btnTestEmail) {
    btnTestEmail.addEventListener('click', () => {
      showToast("Email de test envoyé à l'adresse conseiller !");
    });
  }

  const btnSaveTemplate = document.getElementById('btnSaveTemplate');
  if (btnSaveTemplate) {
    btnSaveTemplate.addEventListener('click', () => {
      showToast("Modèle d'email sauvegardé avec succès.");
    });
  }

  // 8. Direct deposits links sending Form
  const formSendLink = document.getElementById('formSendDirectLink');
  if (formSendLink) {
    formSendLink.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientId = parseInt(document.getElementById('selectLinkDest').value);
      const channel = formSendLink.elements['linkChannel'].value;
      const client = dashboardState.clients.find(c => c.id === clientId);

      if (client) {
        // Add log entry
        dashboardState.reminderLogs.unshift({
          date: "À l'instant",
          client: client.name,
          channel: channel === 'sms' ? 'SMS' : 'Email',
          type: "Lien Dépôt Pièces",
          status: "Envoyé"
        });

        renderRemindersAssistante();
        showToast(`Lien de dépôt envoyé à ${client.name} par ${channel.toUpperCase()} !`);
      }
    });
  }

  // 9. Add collaborator form submission
  const formAddTeam = document.getElementById('formAddTeamMember');
  if (formAddTeam) {
    formAddTeam.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('teamName').value;
      const email = document.getElementById('teamEmail').value;
      const role = document.getElementById('teamRole').value;

      dashboardState.team.push({
        name: name,
        email: email,
        role: role,
        status: "Actif"
      });

      formAddTeam.reset();
      renderConfigDirigeant();
      showToast(`Collaborateur ${name} invité !`);
    });
  }

  // 10. Sync connections buttons
  const btnSyncs = document.querySelectorAll('.btn-sync');
  btnSyncs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.getAttribute('data-tool');
      if (dashboardState.integrations[tool]) return; // Already connected

      btn.innerHTML = `<span style="display:inline-block; animation: rotateRing 1s linear infinite; margin-right: 5px;">⏳</span> Connexion...`;
      
      setTimeout(() => {
        dashboardState.integrations[tool] = true;
        renderConfigConseiller();
        showToast(`Intégration ${tool.replace('-', ' ')} connectée !`);
      }, 1000);
    });
  });

  // 11. Configuration product change for assistante checklist requirements
  const productSelect = document.getElementById('configProductSelect');
  if (productSelect) {
    productSelect.addEventListener('change', () => {
      renderConfigAssistante();
    });
  }
}


/* 10. Confetti Celebration System (Native HTML5 Canvas Particle System) */
function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const colors = ['#8FAEA6', '#D8B48F', '#C0D6D1', '#EEDCC8', '#6C8B83', '#5D7C75'];
  const particles = [];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }
  
  let animationFrameId;
  let framesRun = 0;
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, idx) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;
      
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });
    
    update();
  }
  
  function update() {
    framesRun++;
    let remaining = 0;
    particles.forEach(p => {
      if (p.y < canvas.height) {
        remaining++;
      }
    });
    
    if (remaining > 0 && framesRun < 240) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      canvas.style.display = 'none';
      cancelAnimationFrame(animationFrameId);
    }
  }
  
  draw();
}

/* 11. Magnetic Hover effect for primary buttons */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* 12. Split text into characters for staggered entrance */
function initSplitText() {
  const splitTexts = document.querySelectorAll('.reveal-split');
  splitTexts.forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    
    const words = text.split(' ');
    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.whiteSpace = 'nowrap';
      wordSpan.style.display = 'inline-block';
      
      const letters = word.split('');
      letters.forEach((char, cIdx) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        const delay = (wIdx * 3 + cIdx) * 0.015;
        charSpan.style.setProperty('--delay', `${delay}s`);
        wordSpan.appendChild(charSpan);
      });
      
      wordSpan.className = 'word';
      el.appendChild(wordSpan);
      if (wIdx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  });
}

/* 13. Scroll-Animated Background Umbrella Deployment */
function initBackgroundUmbrellaScroll() {
  const scrollUmbrella = document.getElementById('scrollUmbrella');
  const scrollUmbrellaImg = document.getElementById('scrollUmbrellaImg');
  
  if (!scrollUmbrella || !scrollUmbrellaImg) return;

  const initialScroll = window.scrollY;
  updateUmbrella(initialScroll);

  window.addEventListener('scroll', () => {
    updateUmbrella(window.scrollY);
  }, { passive: true });

  function updateUmbrella(scrollTop) {
    const maxScroll = 1800; 
    const fraction = Math.min(scrollTop / maxScroll, 1);
    
    const scaleX = 0.15 + (1.0 - 0.15) * fraction;
    const scaleY = 0.85 + (1.0 - 0.85) * fraction;
    const rotate = -15 + 360 * fraction;

    scrollUmbrellaImg.style.transform = `scale(${scaleX}, ${scaleY})`;
    scrollUmbrella.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const totalFraction = scrollTop / docHeight;
      if (totalFraction > 0.75) {
        scrollUmbrella.style.opacity = Math.max(0, 0.85 * (1 - (totalFraction - 0.75) / 0.25));
      } else {
        scrollUmbrella.style.opacity = 0.85;
      }
    }
  }
}
