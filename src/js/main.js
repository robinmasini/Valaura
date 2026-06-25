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
});

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

  function openDrawer(categoryKey) {
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

/* 9. Live Demo Dashboard System (Modal & Simulation Steps) */

const scenarioSteps = [
  {
    step: 1,
    name: "1. Demande de prévoyance",
    desc: "Jean Dupont soumet un formulaire en ligne pour obtenir un devis de prévoyance TNS. Sa fiche prospect est générée dans Valaura.",
    role: "conseiller",
    action: (state) => {
      state.status = "Prospect";
      state.todo = [
        { text: "Rappeler Jean Dupont pour entretien de découverte", checked: false },
        { text: "Lui envoyer le questionnaire médical initial", checked: false }
      ];
      state.history = [
        { text: "Demande de prévoyance TNS reçue (Formulaire Web)", date: "Aujourd'hui 09:12" }
      ];
      state.docs = { id: "Manquant", health: "Manquant", rib: "Manquant" };
      state.appointments = [
        { time: "Demain 10:00", name: "Appel découverte Jean Dupont (Pierre)" }
      ];
      state.ca = 24500;
      state.blocked = [];
    }
  },
  {
    step: 2,
    name: "2. Qualification & Tâche créée",
    desc: "Pierre, le conseiller prévoyance, reçoit une tâche automatique de rappel prioritaire sous 2 heures. L'appel de découverte est effectué.",
    role: "conseiller",
    action: (state) => {
      state.status = "Qualification en cours";
      state.todo = [
        { text: "Rappeler Jean Dupont pour entretien de découverte", checked: true },
        { text: "Lui envoyer le questionnaire médical initial", checked: true },
        { text: "Planifier l'entretien d'analyse de risques", checked: false }
      ];
      state.history = [
        { text: "Appel de découverte réalisé : besoins qualifiés", date: "Aujourd'hui 10:30" },
        { text: "Demande de prévoyance TNS reçue (Formulaire Web)", date: "Aujourd'hui 09:12" }
      ];
      state.docs = { id: "Manquant", health: "Manquant", rib: "Manquant" };
      state.appointments = [
        { time: "Demain 10:00", name: "Appel découverte Jean Dupont (Pierre)" }
      ];
      state.ca = 24500;
      state.blocked = [];
    }
  },
  {
    step: 3,
    name: "3. Entretien enregistré",
    desc: "Le premier entretien d'analyse de risques est enregistré. Les pièces justificatives sont demandées. L'assistante prend le relais.",
    role: "assistante",
    action: (state) => {
      state.status = "Pièces demandées";
      state.todo = [
        { text: "Planifier l'entretien d'analyse de risques", checked: true }
      ];
      state.history = [
        { text: "Rendez-vous d'analyse réalisé. Liste de pièces demandée", date: "Aujourd'hui 11:30" },
        { text: "Appel de découverte réalisé : besoins qualifiés", date: "Aujourd'hui 10:30" },
        { text: "Demande de prévoyance TNS reçue (Formulaire Web)", date: "Aujourd'hui 09:12" }
      ];
      state.docs = { id: "En attente", health: "En attente", rib: "En attente" };
      state.appointments = [
        { time: "Aujourd'hui 11:00", name: "Analyse prévoyance Jean Dupont (Pierre)" }
      ];
      state.ca = 24500;
      state.blocked = [];
    }
  },
  {
    step: 4,
    name: "4. Centralisation des pièces",
    desc: "Jean Dupont dépose sa Carte d'identité et son RIB sur son espace sécurisé Valaura. Le questionnaire de santé est toujours manquant.",
    role: "assistante",
    action: (state) => {
      state.status = "Dossier incomplet";
      state.todo = [
        { text: "Vérifier la validité de la CNI et du RIB", checked: true },
        { text: "Relancer le client pour le questionnaire de santé", checked: false }
      ];
      state.history = [
        { text: "Pièces validées : CNI & RIB reçus", date: "Aujourd'hui 14:05" },
        { text: "Rendez-vous d'analyse réalisé. Liste de pièces demandée", date: "Aujourd'hui 11:30" }
      ];
      state.docs = { id: "Reçu", health: "Manquant", rib: "Reçu" };
      state.appointments = [];
      state.ca = 24500;
      state.blocked = [];
    }
  },
  {
    step: 5,
    name: "5. Alerte Dossier Bloqué",
    desc: "Le dossier est bloqué car le questionnaire médical manque depuis 24h. Le dirigeant reçoit une alerte immédiate sur son dashboard.",
    role: "dirigeant",
    action: (state) => {
      state.status = "Bloqué";
      state.todo = [
        { text: "Relancer le client pour le questionnaire de santé", checked: false }
      ];
      state.history = [
        { text: "Alerte : Dossier bloqué (Questionnaire de santé)", date: "Aujourd'hui 15:00" },
        { text: "Pièces validées : CNI & RIB reçus", date: "Aujourd'hui 14:05" }
      ];
      state.docs = { id: "Reçu", health: "Manquant", rib: "Reçu" };
      state.appointments = [];
      state.ca = 24500;
      state.blocked = [
        { name: "Jean Dupont", advisor: "Pierre", status: "Bloqué", lastAction: "Il y a 24h", alert: "Questionnaire de santé manquant" }
      ];
    }
  },
  {
    step: 6,
    name: "6. Déblocage du dossier",
    desc: "Le questionnaire médical est finalement téléversé. Le dossier passe au vert, l'alerte dirigeant est levée. Pierre peut préparer la proposition.",
    role: "conseiller",
    action: (state) => {
      state.status = "Proposition à préparer";
      state.todo = [
        { text: "Établir la proposition de tarification prévoyance", checked: false },
        { text: "Faire valider les conditions tarifaires", checked: false }
      ];
      state.history = [
        { text: "Questionnaire médical reçu. Dossier débloqué", date: "Aujourd'hui 16:10" },
        { text: "Pièces validées : CNI & RIB reçus", date: "Aujourd'hui 14:05" }
      ];
      state.docs = { id: "Reçu", health: "Reçu", rib: "Reçu" };
      state.appointments = [];
      state.ca = 24500;
      state.blocked = [];
    }
  },
  {
    step: 7,
    name: "7. Proposition & Relance Automatique",
    desc: "La proposition est envoyée par e-mail. Valaura planifie automatiquement une relance personnalisée à J+3 sans action requise de Pierre.",
    role: "conseiller",
    action: (state) => {
      state.status = "Proposition envoyée";
      state.todo = [
        { text: "Établir la proposition de tarification prévoyance", checked: true },
        { text: "Faire valider les conditions tarifaires", checked: true },
        { text: "Suivre la signature électronique", checked: false }
      ];
      state.history = [
        { text: "Proposition commerciale envoyée par e-mail", date: "Aujourd'hui 16:40" },
        { text: "Relance automatique programmée à J+3", date: "Aujourd'hui 16:40" },
        { text: "Questionnaire médical reçu. Dossier débloqué", date: "Aujourd'hui 16:10" }
      ];
      state.docs = { id: "Reçu", health: "Reçu", rib: "Reçu" };
      state.appointments = [];
      state.ca = 24500;
      state.blocked = [];
      state.showRelance = true;
    }
  },
  {
    step: 8,
    name: "8. Signature du contrat !",
    desc: "Jean Dupont signe électroniquement son contrat de prévoyance. La commission de 1 200 € est acquise pour le cabinet. Confettis !",
    role: "dirigeant",
    action: (state) => {
      state.status = "Signé";
      state.todo = [
        { text: "Suivre la signature électronique", checked: true }
      ];
      state.history = [
        { text: "Contrat signé électroniquement (Signature certifiée)", date: "Aujourd'hui 17:15" },
        { text: "Commission souscription prévoyance acquise : +1 200€", date: "Aujourd'hui 17:15" },
        { text: "Proposition commerciale envoyée par e-mail", date: "Aujourd'hui 16:40" }
      ];
      state.docs = { id: "Reçu", health: "Reçu", rib: "Reçu" };
      state.appointments = [];
      state.ca = 25700;
      state.blocked = [];
      state.showRelance = false;
      state.confetti = true;
    }
  },
  {
    step: 9,
    name: "9. Fidélisation & Bilan Annuel",
    desc: "Le contrat est actif. Valaura génère une alerte automatique dans 365 jours pour le bilan de prévoyance annuel obligatoire.",
    role: "assistante",
    action: (state) => {
      state.status = "Actif";
      state.todo = [
        { text: "Bilan annuel d'assurance planifié", checked: true }
      ];
      state.history = [
        { text: "Alerte Bilan Annuel planifiée à 1 an (24 Juin 2027)", date: "Aujourd'hui 17:20" },
        { text: "Contrat signé électroniquement (Signature certifiée)", date: "Aujourd'hui 17:15" }
      ];
      state.docs = { id: "Reçu", health: "Reçu", rib: "Reçu" };
      state.appointments = [
        { time: "24 Juin 2027", name: "Bilan de prévoyance annuel Jean Dupont (Pierre)" }
      ];
      state.ca = 25700;
      state.blocked = [];
      state.showRelance = false;
    }
  }
];

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
        renderScenarioStep(0); // Load step 1
      });
    }
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  const dbRoleBtns = document.querySelectorAll('.db-role-btn');
  dbRoleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.getAttribute('data-db-role');
      switchDashboardRole(targetRole);
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
}

function switchDashboardRole(roleKey) {
  const btns = document.querySelectorAll('.db-role-btn');
  btns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-db-role') === roleKey) {
      btn.classList.add('active');
    }
  });

  const views = document.querySelectorAll('.db-panel-view');
  views.forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`dbView-${roleKey}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  const titleEl = document.getElementById('dbViewTitle');
  const subtitleEl = document.getElementById('dbViewSubtitle');

  if (roleKey === 'dirigeant') {
    titleEl.textContent = "Vue Dirigeant — Cabinet Valaura";
    subtitleEl.textContent = "Visualisez l'état commercial global et les dossiers bloqués.";
  } else if (roleKey === 'conseiller') {
    titleEl.textContent = "Vue Conseiller — Portefeuille Pierre";
    subtitleEl.textContent = "Consultez vos tâches du jour et le suivi de vos assurés.";
  } else if (roleKey === 'assistante') {
    titleEl.textContent = "Vue Assistante — Back-Office";
    subtitleEl.textContent = "Gérez la conformité réglementaire et l'agenda.";
  }
}

function renderScenarioStep(stepIndex) {
  const stepData = scenarioSteps[stepIndex];
  if (!stepData) return;

  const progressFill = document.getElementById('scProgressFill');
  const stepsCount = document.getElementById('scStepsCount');
  const stepName = document.getElementById('scStepName');
  const stepDesc = document.getElementById('scStepDesc');

  progressFill.style.width = `${((stepIndex + 1) / scenarioSteps.length) * 100}%`;
  stepsCount.textContent = `Étape ${stepIndex + 1} sur ${scenarioSteps.length}`;
  stepName.textContent = stepData.name;
  stepDesc.textContent = stepData.desc;

  const state = {
    status: "Prospect",
    todo: [],
    history: [],
    docs: { id: "Manquant", health: "Manquant", rib: "Manquant" },
    appointments: [],
    ca: 24500,
    blocked: [],
    showRelance: false,
    confetti: false
  };

  stepData.action(state);
  switchDashboardRole(state.role || stepData.role);

  if (state.confetti) {
    fireConfetti();
  }

  const dirCAVal = document.getElementById('dirMetricCA');
  if (dirCAVal) {
    dirCAVal.textContent = `${state.ca.toLocaleString('fr-FR')} €`;
  }

  const blockedTableBody = document.getElementById('dirBlockedTableBody');
  if (blockedTableBody) {
    blockedTableBody.innerHTML = '';
    if (state.blocked.length === 0) {
      blockedTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-gray-dark); font-style: italic; padding: 2rem 0;">
            Aucun dossier bloqué actuellement. Tout est fluide !
          </td>
        </tr>
      `;
    } else {
      state.blocked.forEach(item => {
        blockedTableBody.innerHTML += `
          <tr>
            <td><strong>${item.name}</strong></td>
            <td>${item.advisor}</td>
            <td><span class="db-tag bg-yellow">${item.status}</span></td>
            <td>${item.lastAction}</td>
            <td class="red" style="font-weight: 500;">${item.alert}</td>
          </tr>
        `;
      });
    }
  }

  const tasksContainer = document.getElementById('todoListContainer');
  const tasksCountLabel = document.getElementById('counselorTasksCount');
  
  if (tasksContainer) {
    tasksContainer.innerHTML = '';
    state.todo.forEach(todoItem => {
      tasksContainer.innerHTML += `
        <label class="todo-item cursor-hover">
          <input type="checkbox" ${todoItem.checked ? 'checked' : ''} disabled>
          <span class="todo-box"></span>
          <span class="todo-text ${todoItem.checked ? 'strike' : ''}">${todoItem.text}</span>
        </label>
      `;
    });
    
    const uncheckedCount = state.todo.filter(t => !t.checked).length;
    tasksCountLabel.textContent = `${uncheckedCount} tâche${uncheckedCount > 1 ? 's' : ''}`;
  }

  const statusBadge = document.getElementById('clientStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = state.status;
    statusBadge.className = 'db-tag';
    if (state.status === 'Prospect') {
      statusBadge.classList.add('bg-cyan');
    } else if (state.status === 'Qualification en cours') {
      statusBadge.classList.add('bg-cyan');
    } else if (state.status === 'Pièces demandées' || state.status === 'Dossier incomplet') {
      statusBadge.classList.add('bg-yellow');
    } else if (state.status === 'Bloqué') {
      statusBadge.classList.add('bg-orange');
    } else if (state.status === 'Proposition à préparer' || state.status === 'Proposition envoyée') {
      statusBadge.classList.add('bg-cyan');
    } else if (state.status === 'Signé' || state.status === 'Actif') {
      statusBadge.classList.add('bg-green');
    }
  }

  const timelineContainer = document.getElementById('clientTimeline');
  if (timelineContainer) {
    timelineContainer.innerHTML = '';
    state.history.forEach((hItem, idx) => {
      timelineContainer.innerHTML += `
        <div class="timeline-step">
          <span class="tl-dot ${idx === 0 ? 'active' : 'completed'}"></span>
          <div class="tl-content">
            <strong>${hItem.text}</strong>
            <span class="tl-date">${hItem.date}</span>
          </div>
        </div>
      `;
    });
  }

  const relanceAutoBox = document.getElementById('relanceAutoBox');
  if (relanceAutoBox) {
    relanceAutoBox.style.display = state.showRelance ? 'block' : 'none';
  }

  const docProgressBadge = document.getElementById('documentProgressBadge');
  
  const setDocBadge = (elId, status) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = status;
    el.className = 'db-tag';
    if (status === 'Reçu') {
      el.classList.add('bg-green');
    } else if (status === 'Manquant') {
      el.classList.add('bg-red');
    } else {
      el.classList.add('bg-yellow');
    }
  };

  setDocBadge('docStatus1', state.docs.id);
  setDocBadge('docStatus2', state.docs.health);
  setDocBadge('docStatus3', state.docs.rib);

  if (docProgressBadge) {
    let receivedCount = 0;
    if (state.docs.id === 'Reçu') receivedCount++;
    if (state.docs.health === 'Reçu') receivedCount++;
    if (state.docs.rib === 'Reçu') receivedCount++;
    docProgressBadge.textContent = `${receivedCount}/3 Reçus`;
    docProgressBadge.className = 'db-card-badge';
    if (receivedCount === 3) {
      docProgressBadge.classList.add('bg-green');
      docProgressBadge.style.color = '#38A169';
    } else {
      docProgressBadge.classList.add('red');
    }
  }

  const apptContainer = document.getElementById('appointmentsContainer');
  if (apptContainer) {
    apptContainer.innerHTML = '';
    if (state.appointments.length === 0) {
      apptContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-gray-dark); padding: 2rem 0; font-style: italic; font-size: 0.85rem;">
          Aucun rendez-vous planifié.
        </div>
      `;
    } else {
      state.appointments.forEach(app => {
        apptContainer.innerHTML += `
          <div style="padding: 1rem; background: rgba(255, 255, 255, 0.02); border-left: 3px solid var(--color-primary); border-radius: 4px; margin-bottom: 0.75rem;">
            <span style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600; display: block; margin-bottom: 0.25rem;">${app.time}</span>
            <strong style="color: #fff; font-size: 0.9rem;">${app.name}</strong>
          </div>
        `;
      });
    }
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
