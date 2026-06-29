/* -------------------------------------------------------------
 * Valaura Audits Financiers - Simulation Logic & Interactions
 * ------------------------------------------------------------- */

// -------------------------------------------------------------
// Core Calculation & Business Logic Functions
// -------------------------------------------------------------

export function calculateThresholds(baseAmount) {
  const signification = Math.round(baseAmount * 0.015); // CA 1.5%
  const planification = Math.round(signification * 0.75); // 75%
  const remontee = Math.round(signification * 0.05); // 5%
  return { signification, planification, remontee };
}

export function checkRBACPermission(role, action) {
  const permissions = {
    admin: ['manage_users', 'manage_methods', 'connect_sharepoint', 'edit_settings'],
    associe: ['view_anomalies', 'validate_mission', 'approve_thresholds'],
    manager: ['create_mission', 'assign_team', 'review_work', 'open_review_note', 'validate_cycle', 'edit_thresholds'],
    senior: ['prepare_controls', 'answer_review_note', 'manage_docs'],
    collaborateur: ['view_tasks', 'perform_controls', 'link_evidence', 'submit_review', 'answer_review_note']
  };

  if (role === 'admin') return true;
  if (role === 'associe') {
    return permissions.associe.includes(action) || permissions.manager.includes(action) || permissions.senior.includes(action) || permissions.collaborateur.includes(action);
  }
  if (role === 'manager') {
    return permissions.manager.includes(action) || permissions.senior.includes(action) || permissions.collaborateur.includes(action);
  }
  if (role === 'senior') {
    return permissions.senior.includes(action) || permissions.collaborateur.includes(action);
  }
  if (role === 'collaborateur') {
    return permissions.collaborateur.includes(action);
  }
  return false;
}

export function checkCashReconciliation(soldeComptable, soldeBancaire, operations) {
  const rawDiff = soldeComptable - soldeBancaire;
  const totalDiff = Math.abs(rawDiff);
  
  // Credits in transit are justified items
  const credits = operations.filter(op => op.amount > 0).reduce((sum, op) => sum + op.amount, 0);
  // Debits represent unrecorded items / unjustified difference in this step
  const debits = operations.filter(op => op.amount < 0).reduce((sum, op) => sum + Math.abs(op.amount), 0);
  
  const unjustifiedDiff = Math.abs(totalDiff - credits);
  
  return {
    rawDifference: rawDiff,
    creditsTransit: credits,
    debitsTransit: debits,
    unjustifiedDifference: unjustifiedDiff,
    isReconciled: unjustifiedDiff === 0
  };
}

export function computeCycleMetrics(controls) {
  if (!controls || controls.length === 0) return { progress: 0, evidence: 0, autoChecks: 0, review: 0, resolvedPoints: 0 };
  
  const totalWeight = controls.reduce((sum, c) => sum + c.weight, 0);
  
  // 1. Declared progress
  const completedWeight = controls.filter(c => ['Ready for review', 'Validé', 'Modifications demandées', 'Réouvert'].includes(c.status)).reduce((sum, c) => sum + c.weight, 0);
  const progress = Math.round((completedWeight / totalWeight) * 100);
  
  // 2. Evidence coverage
  const controlsWithEvidence = controls.filter(c => c.evidence && c.evidence.length > 0).length;
  const evidence = Math.round((controlsWithEvidence / controls.length) * 100);
  
  // 3. Automated checks
  const runAutoChecks = controls.filter(c => c.autoChecks && c.autoChecks.run);
  const passedAutoChecks = runAutoChecks.filter(c => c.autoChecks.result === 'success').length;
  const autoChecks = runAutoChecks.length > 0 ? Math.round((passedAutoChecks / runAutoChecks.length) * 100) : 100;
  
  // 4. Review rate
  const reviewedControls = controls.filter(c => c.status === 'Validé').length;
  const review = Math.round((reviewedControls / controls.length) * 100);
  
  // 5. Resolved points
  const openedPoints = controls.reduce((sum, c) => sum + c.reviewNotes.filter(n => !n.closed).length, 0);
  const totalPoints = controls.reduce((sum, c) => sum + c.reviewNotes.length, 0);
  const resolvedPoints = totalPoints > 0 ? Math.round(((totalPoints - openedPoints) / totalPoints) * 100) : 100;
  
  return { progress, evidence, autoChecks, review, resolvedPoints };
}

export const auditState = {
  activeView: 'portfolio', // 'portfolio', 'create-mission', 'dashboard', 'cycles', 'cycle-detail', 'control-fiche', 'review', 'findings', 'documents', 'methodology', 'config'
  activeRole: 'collaborateur', // 'admin', 'associe', 'manager', 'senior', 'collaborateur'
  selectedClientId: 'abc', // 'abc' (Société ABC)
  selectedMissionId: 'legal2026',
  selectedCycleKey: 'tresorerie',
  selectedControlRef: 'TRE-014',
  
  // Simulated database
  audit_clients: [
    { id: 'abc', name: "Société ABC", legalEntity: "SAS", industry: "Distribution", activeMissions: 1 },
    { id: 'xyz', name: "Groupe XYZ", legalEntity: "SA", industry: "Services", activeMissions: 1 }
  ],
  
  audit_missions: [
    {
      id: 'legal2026',
      clientId: 'abc',
      name: "Audit légal 2026",
      exercice: "2026",
      clotureDate: "31/12/2026",
      type: "Certification des comptes",
      startDate: "15/02/2027",
      endDate: "22/02/2027",
      manager: "Marie Dupont",
      associate: "Jean-Pierre Lefebvre",
      team: ["Paul Martin (Senior)", "Antoine Roche (Stagiaire)"],
      devise: "EUR",
      standards: "Normes ISA / NEP",
      status: "Planification",
      sharepointFolder: "SharePoint/ABC_Audit_2026",
      connectedSite: "ABC Group Portal",
      applicabilityAnswers: {
        banks: true,
        foreignCurrencies: true,
        cashOffice: true,
        stocks: false,
        industrialProduction: false,
        payrollInternalized: true,
        fixedAssets: true,
        consolidation: false,
        debts: true,
        datasnipper: true
      }
    }
  ],

  audit_thresholds: {
    signification: { amount: 50000, base: "Chiffre d'affaires", percentage: 0.015, justification: "Risque modéré sur la structure de coûts", author: "Marie Dupont", date: "15/02/2027", approvedBy: "Jean-Pierre Lefebvre", status: "locked" },
    planification: { amount: 37500, base: "Signification", percentage: 0.75, justification: "75% du seuil global pour couverture de risques", author: "Marie Dupont", date: "15/02/2027", approvedBy: "Jean-Pierre Lefebvre", status: "locked" },
    remontee: { amount: 2500, base: "Signification", percentage: 0.05, justification: "5% du seuil global", author: "Marie Dupont", date: "15/02/2027", approvedBy: "Jean-Pierre Lefebvre", status: "locked" }
  },

  audit_findings: [
    { ref: "ANOM-01", missionId: "legal2026", cycle: "Trésorerie", controlSource: "TRE-014", desc: "Honoraire d'avocat débité sur relevé BNP non comptabilisé en 2026 (facture manquante)", amount: 4800, nature: "Erreur", type: "Non corrigée", significance: "Inférieur au seuil de planification mais supérieure au seuil de remontée", author: "Antoine Roche", status: "Confirmée" }
  ],

  audit_sync_connections: {
    connected: true,
    site: "ABC Portal - Corporate",
    library: "Documents Financiers",
    folder: "Clôture 2026",
    lastSync: "Il y a 3 minutes",
    status: "success"
  },

  audit_evidence_documents: [
    { id: "doc-01", name: "Relevé BNP Décembre 2026.pdf", type: "PDF", size: "1.2 Mo", hash: "sha256-abc89...", trust: 98, date: "16/02/2027", bank: "BNP Paribas", account: "...7890", period: "Décembre 2026", category: "Relevé Bancaire" },
    { id: "doc-02", name: "Grand livre banque 512100.xlsx", type: "Excel", size: "2.4 Mo", hash: "sha256-xyz45...", trust: 100, date: "16/02/2027", category: "Grand Livre" },
    { id: "doc-03", name: "Rapprochement bancaire ABC.xlsx", type: "Excel", size: "850 Ko", hash: "sha256-rep12...", trust: 90, date: "16/02/2027", category: "Feuille de travail Rapprochement" }
  ],

  audit_mission_cycles: [
    { key: "tresorerie", name: "Trésorerie & Équivalents", risk: "Faible", weight: 2, lead: "Antoine Roche", progress: 92, evidence: 68, autoChecks: 61, review: 35, findings: 1, status: "Ready for review", alert: true },
    { key: "financier", name: "Résultats & Charges Financières", risk: "Moyen", weight: 2, lead: "Paul Martin", progress: 85, evidence: 80, autoChecks: 100, review: 50, findings: 0, status: "En cours", alert: false },
    { key: "ventes", name: "Ventes & Créances Clients", risk: "Moyen", weight: 3, lead: "Paul Martin", progress: 40, evidence: 50, autoChecks: 70, review: 0, findings: 0, status: "En cours", alert: false },
    { key: "achats", name: "Achats & Dettes Fournisseurs", risk: "Moyen", weight: 3, lead: "Paul Martin", progress: 10, evidence: 10, autoChecks: 100, review: 0, findings: 0, status: "En cours", alert: false },
    { key: "immobilisations", name: "Immobilisations corporelles", risk: "Faible", weight: 1, lead: "Antoine Roche", progress: 100, evidence: 100, autoChecks: 100, review: 100, findings: 0, status: "Validé", alert: false }
  ],

  audit_mission_controls: [
    {
      ref: "TRE-011",
      cycle: "tresorerie",
      subCategory: "Exhaustivité des comptes",
      title: "Référentiel des comptes bancaires ouverts",
      objective: "Vérifier l'exhaustivité des comptes bancaires de l'entité",
      risk: "Faible",
      assertions: ["Exhaustivité", "Droits"],
      weight: 1,
      lead: "Antoine Roche",
      reviewer: "Marie Dupont",
      status: "Validé",
      evidence: ["Lettre de confirmation circularisation signée"],
      procedure: "Rapprochement de la liste des banques avec les réponses directes reçues des établissements financiers.",
      conclusion: "Toutes les banques ont répondu. Liste conforme à la balance comptable.",
      autoChecks: { run: true, result: "success", detail: "circularisation 3/3 reçue" },
      reviewNotes: []
    },
    {
      ref: "TRE-014",
      cycle: "tresorerie",
      subCategory: "Rapprochements bancaires",
      title: "Rapprochement Relevé et Comptabilité (BNP)",
      objective: "Vérifier la concordance arithmétique entre le solde comptable (compte 51202000) et le relevé bancaire BNP Paribas au 31/12/2026.",
      risk: "Moyen",
      assertions: ["Réalité", "Exhaustivité", "Évaluation"],
      weight: 3,
      lead: "Antoine Roche",
      reviewer: "Marie Dupont",
      status: "Ready for review",
      evidence: ["Relevé BNP Décembre 2026.pdf", "Grand livre banque 512100.xlsx", "Rapprochement bancaire ABC.xlsx"],
      procedure: "1. Extraire le solde de fin d'année du relevé bancaire.\n2. Recouper avec le solde du grand livre.\n3. Analyser les opérations en rapprochement (cut-off, virements interbancaires en transit, etc.).",
      conclusion: "RAS, contrôle OK. Aucun écart significatif à déplorer.",
      autoChecks: { run: true, result: "fail", detail: "Écart de rapprochement non justifié de 4 800 € détecté !" },
      reviewNotes: [
        { author: "Marie Dupont", date: "16/02/2027", text: "Merci de justifier l'écart restant de 4 800 € et d'identifier si une facture d'honoraire est en attente d'enregistrement.", closed: false }
      ]
    },
    {
      ref: "FIN-001",
      cycle: "financier",
      subCategory: "Charges d'intérêts",
      title: "Recoupement des emprunts et charges financières",
      objective: "Vérifier la cohérence globale des charges financières enregistrées par rapport aux contrats d'emprunts et taux applicables.",
      risk: "Moyen",
      assertions: ["Réalité", "Évaluation"],
      weight: 2,
      lead: "Paul Martin",
      reviewer: "Marie Dupont",
      status: "En cours",
      evidence: ["Tableaux d'amortissement emprunts.xlsx", "Contrats de prêts structurés"],
      procedure: "1. Obtenir les contrats de prêts et PGE.\n2. Recouper les charges d'intérêts comptabilisées en classe 661x avec les tableaux d'amortissement réels.",
      conclusion: "Travaux en cours de finalisation. Le recoupement global montre une variation de 5% conforme à la baisse générale des encours.",
      autoChecks: { run: true, result: "success", detail: "Charges recoupées à 98% avec les amortissements." },
      reviewNotes: []
    }
  ],

  audit_activity_logs: [
    { date: "16/02/2027 15:18", user: "Antoine Roche", action: "Modification", resource: "TRE-014", detail: "Mise à jour de la conclusion et soumission pour revue." },
    { date: "16/02/2027 14:10", user: "Antoine Roche", action: "Import", resource: "Relevé BNP Décembre.pdf", detail: "Classification automatique par IA (Confiance 98%)." },
    { date: "15/02/2027 10:30", user: "Marie Dupont", action: "Configuration", resource: "Seuils financiers", detail: "Seuil de signification défini à 50 000 EUR." }
  ],

  // Methodology Template Library
  audit_methodology_profiles: {
    standard: {
      name: "Standard Valaura",
      description: "Modèle standard d'audit financier conforme aux normes ISA.",
      cycles: [
        { key: "tresorerie", title: "Trésorerie", controlsCount: 12 },
        { key: "ventes", title: "Ventes & Clients", controlsCount: 15 },
        { key: "achats", title: "Achats & Fournisseurs", controlsCount: 14 }
      ]
    },
    cabinet: {
      name: "Méthode Cabinet Audit-Plus",
      description: "Adaptation interne du cabinet intégrant des seuils de qualité renforcés.",
      cycles: [
        { key: "tresorerie", title: "Trésorerie (Audit-Plus)", controlsCount: 14 },
        { key: "ventes", title: "Ventes & Clients", controlsCount: 15 }
      ]
    }
  }
};

// -------------------------------------------------------------
// Interactive Scenario Steps - Audit Simulation
// -------------------------------------------------------------
export const auditScenarioSteps = [
  {
    step: 1,
    name: "1. Initialisation de la mission",
    desc: "Marie Dupont (Manager) crée la mission 'Audit légal 2026' pour la Société ABC, renseigne les seuils et active le cycle Trésorerie.",
    role: "manager",
    view: "dashboard",
    action: (state) => {
      state.audit_thresholds.signification.amount = 50000;
      state.audit_thresholds.planification.amount = 37500;
      state.audit_thresholds.remontee.amount = 2500;
      const control = state.audit_mission_controls.find(c => c.ref === 'TRE-014');
      if (control) {
        control.status = "En cours";
        control.conclusion = "";
        control.autoChecks.run = false;
        control.reviewNotes = [];
      }
      state.audit_findings = [];
    }
  },
  {
    step: 2,
    name: "2. Lecture automatique du Relevé PDF",
    desc: "Antoine (Stagiaire) charge le relevé bancaire PDF. Le connecteur extrait automatiquement le solde bancaire de clôture : 549 800 € (Confiance 98%).",
    role: "collaborateur",
    view: "documents",
    action: (state) => {
      // Simulates document upload and OCR confirmation
    }
  },
  {
    step: 3,
    name: "3. Recoupement avec la Comptabilité",
    desc: "Le solde comptable extrait de la balance générale (compte 512100) est de 542 300 €. L'écart brut constaté est de 7 500 €.",
    role: "collaborateur",
    view: "cycle-detail",
    action: (state) => {
      // Highlights the comparative table in the Treasury cycle view
    }
  },
  {
    step: 4,
    name: "4. Saisie de la conclusion simplifiée",
    desc: "Antoine coche le rapprochement comme correct dans sa feuille Excel et saisit 'RAS, contrôle OK' dans Valaura, sans justificatifs supplémentaires.",
    role: "collaborateur",
    view: "control-fiche",
    action: (state) => {
      const control = state.audit_mission_controls.find(c => c.ref === 'TRE-014');
      if (control) {
        control.status = "Ready for review";
        control.conclusion = "RAS, contrôle OK. Aucun écart significatif à déplorer.";
        control.autoChecks.run = true;
        // The check will fail because there is an un-reconciled difference of 4,800 EUR
        control.autoChecks.result = "fail";
      }
    }
  },
  {
    step: 5,
    name: "5. Alerte Anti-Fausse Progression",
    desc: "Valaura Audit détecte que l'écart réel de rapprochement non justifié est de 4 800 € (7 500 € d'écart total - 2 700 € d'apurements légitimes). Le statut passe en rouge.",
    role: "collaborateur",
    view: "control-fiche",
    action: (state) => {
      // Highlight the auto check error in control fiche
    }
  },
  {
    step: 6,
    name: "6. Revue du Manager & Point de Revue",
    desc: "Marie Dupont (Manager) refuse la validation, ouvre un point de revue exigeant des explications sur les 4 800 € non documentés.",
    role: "manager",
    view: "review",
    action: (state) => {
      const control = state.audit_mission_controls.find(c => c.ref === 'TRE-014');
      if (control) {
        control.status = "Modifications demandées";
        control.reviewNotes = [
          { author: "Marie Dupont", date: "16/02/2027", text: "Merci de justifier l'écart restant de 4 800 € et d'identifier si une facture d'honoraire est en attente d'enregistrement.", closed: false }
        ];
      }
    }
  },
  {
    step: 7,
    name: "7. Résolution & Enregistrement de l'Anomalie",
    desc: "Antoine identifie une facture d'avocat non comptabilisée de 4 800 €. Il l'enregistre dans le registre des anomalies de Valaura Audit.",
    role: "collaborateur",
    view: "findings",
    action: (state) => {
      state.audit_findings = [
        { ref: "ANOM-01", missionId: "legal2026", cycle: "Trésorerie", controlSource: "TRE-014", desc: "Honoraire d'avocat débité sur relevé BNP non comptabilisé en 2026 (facture manquante)", amount: 4800, nature: "Erreur", type: "Non corrigée", significance: "Significative par nature", author: "Antoine Roche", status: "Confirmée" }
      ];
    }
  },
  {
    step: 8,
    name: "8. Validation finale du cycle par le Manager",
    desc: "L'écart est résolu et tracé. Marie Dupont ferme le point de revue et déclare le contrôle validé. Le cycle Trésorerie passe au vert.",
    role: "manager",
    view: "dashboard",
    action: (state) => {
      const control = state.audit_mission_controls.find(c => c.ref === 'TRE-014');
      if (control) {
        control.status = "Validé";
        control.reviewNotes.forEach(n => n.closed = true);
        control.autoChecks.result = "success";
      }
      const cycle = state.audit_mission_cycles.find(cy => cy.key === 'tresorerie');
      if (cycle) {
        cycle.status = "Validé";
        cycle.progress = 100;
        cycle.evidence = 100;
        cycle.autoChecks = 100;
        cycle.review = 100;
      }
    }
  },
  {
    step: 9,
    name: "9. Réouverture Automatique par Alerte Source",
    desc: "Une nouvelle version du Grand Livre est synchronisée sur OneDrive, modifiant le solde comptable de trésorerie. Le contrôle validé est automatiquement réouvert.",
    role: "manager",
    view: "dashboard",
    action: (state) => {
      const control = state.audit_mission_controls.find(c => c.ref === 'TRE-014');
      if (control) {
        control.status = "Réouvert";
        control.autoChecks.result = "fail";
        control.autoChecks.detail = "Données sources modifiées le 17/02/2027 après validation !";
      }
      const cycle = state.audit_mission_cycles.find(cy => cy.key === 'tresorerie');
      if (cycle) {
        cycle.status = "Modifications demandées";
        cycle.progress = 92;
        cycle.evidence = 68;
        cycle.autoChecks = 50;
        cycle.review = 0;
      }
      // Add log
      state.audit_activity_logs.unshift({
        date: "17/02/2027 09:00",
        user: "Système (OneDrive)",
        action: "Réouverture",
        resource: "TRE-014",
        detail: "Source Grand Livre modifiée. Retrait du statut Validé."
      });
    }
  }
];

// -------------------------------------------------------------
// UI Renderer Functions for Audit Views
// -------------------------------------------------------------
export function initAuditRouting(mainRouterCallback) {
  // Bind popstate/hashchange
  window.addEventListener('hashchange', () => {
    handleHashRouting(mainRouterCallback);
  });
  handleHashRouting(mainRouterCallback);
}

function handleHashRouting(mainRouterCallback) {
  const hash = window.location.hash || '#/';
  
  if (hash.startsWith('#/prevoyance')) {
    mainRouterCallback('prevoyance');
  } else if (hash.startsWith('#/audit')) {
    mainRouterCallback('audit');
    // Extract subview if present
    const pathParts = hash.split('/');
    if (pathParts.length > 2) {
      auditState.activeView = pathParts[2];
    }
    renderAuditUI();
  } else {
    mainRouterCallback('selection');
  }
}

export function renderAuditUI() {
  const container = document.getElementById('auditDashboardWrapper');
  if (!container || container.style.display === 'none') return;
  
  // Render sidebar active navigation class
  const sidebarItems = document.querySelectorAll('#auditSidebarNav [data-audit-view]');
  sidebarItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-audit-view') === auditState.activeView) {
      item.classList.add('active');
    }
  });
  
  // Hide all audit subviews
  const views = document.querySelectorAll('.audit-view-panel');
  views.forEach(v => v.style.display = 'none');
  
  // Show selected subview
  const targetViewEl = document.getElementById(`auditView-${auditState.activeView}`);
  if (targetViewEl) {
    targetViewEl.style.display = 'block';
  }
  
  // Update view titles
  updateAuditTopbar();

  // Render view-specific data
  switch(auditState.activeView) {
    case 'portfolio':
      renderAuditPortfolio();
      break;
    case 'create-mission':
      // Static form with interactive applicability checkbox
      break;
    case 'dashboard':
      renderAuditDashboard();
      break;
    case 'cycles':
      renderAuditCycles();
      break;
    case 'cycle-detail':
      renderAuditCycleDetail();
      break;
    case 'control-fiche':
      renderAuditControlFiche();
      break;
    case 'review':
      renderAuditReview();
      break;
    case 'findings':
      renderAuditFindings();
      break;
    case 'documents':
      renderAuditDocuments();
      break;
    case 'methodology':
      renderAuditMethodology();
      break;
    case 'config':
      renderAuditConfig();
      break;
  }
}

function updateAuditTopbar() {
  const titleEl = document.getElementById('auditTopbarTitle');
  const subtitleEl = document.getElementById('auditTopbarSubtitle');
  if (!titleEl) return;
  
  const roleLabels = {
    admin: "Admin Cabinet",
    associe: "Associé Signataire",
    manager: "Manager Mission",
    senior: "Senior In-Charge",
    collaborateur: "Collaborateur"
  };
  
  const currentRoleLabel = roleLabels[auditState.activeRole] || "Audit Staff";
  
  switch(auditState.activeView) {
    case 'portfolio':
      titleEl.innerHTML = `Portefeuille d'Audits <span style="font-size:0.75rem; vertical-align:middle; background:rgba(255,255,255,0.05); padding: 0.25rem 0.5rem; border-radius:10px;">Rôle : ${currentRoleLabel}</span>`;
      subtitleEl.textContent = "Sélectionnez une mission pour piloter l'avancement.";
      break;
    case 'create-mission':
      titleEl.innerHTML = "Créer un Client & Une Mission";
      subtitleEl.textContent = "Initialisez la méthodologie et le questionnaire d'applicabilité.";
      break;
    case 'dashboard':
      titleEl.innerHTML = `Société ABC — Dashboard Mission <span style="font-size:0.75rem; vertical-align:middle; background:rgba(255,255,255,0.05); padding: 0.25rem 0.5rem; border-radius:10px;">Rôle : ${currentRoleLabel}</span>`;
      subtitleEl.textContent = "Suivi de la couverture de risques et des 5 métriques clés.";
      break;
    case 'cycles':
      titleEl.innerHTML = "Cycles Comptables & Rapprochements";
      subtitleEl.textContent = "Supervisez les programmes de travail par zone financière.";
      break;
    case 'cycle-detail':
      titleEl.innerHTML = "Détail du Cycle : Trésorerie & Équivalents";
      subtitleEl.textContent = "Rapprochement des soldes bancaires avec la comptabilité.";
      break;
    case 'control-fiche':
      titleEl.innerHTML = `Fiche de Contrôle : ${auditState.selectedControlRef}`;
      subtitleEl.textContent = "Exécution de la procédure, analyse automatique des preuves et conclusion.";
      break;
    case 'review':
      titleEl.innerHTML = "Espace Revue Manager & Circularisations";
      subtitleEl.textContent = "Validez les conclusions et ouvrez des points de revue prioritaires.";
      break;
    case 'findings':
      titleEl.innerHTML = "Registre des Anomalies Détectées";
      subtitleEl.textContent = "Suivi des anomalies corrigées ou non corrigées et impact sur les seuils.";
      break;
    case 'documents':
      titleEl.innerHTML = "Dossier Documentaire & Lecture PDF (OCR)";
      subtitleEl.textContent = "Visualisez les pièces justificatives et lancez des analyses automatisées.";
      break;
    case 'methodology':
      titleEl.innerHTML = "Bibliothèque Méthodologique & Programmes de travail";
      subtitleEl.textContent = "Configurez la méthodologie standard du cabinet et les adaptations.";
      break;
    case 'config':
      titleEl.innerHTML = "Paramètres de Sécurité, MFA et Connecteurs Microsoft";
      subtitleEl.textContent = "Configurez les accès OneDrive, politiques d'IA et journaux techniques.";
      break;
  }
}

// Render subviews functions
function renderAuditPortfolio() {
  const container = document.getElementById('auditPortfolioGrid');
  if (!container) return;
  
  container.innerHTML = `
    <div class="db-table-card" style="margin-top:0;">
      <div class="audit-card-header">
        <h4 class="audit-card-title">Missions en cours d'audit</h4>
        <button class="btn btn-primary cursor-hover" style="font-size:0.8rem; padding: 0.5rem 1rem;" onclick="window.location.hash='#/audit/create-mission'">+ Nouvelle Mission</button>
      </div>
      <div class="db-table-wrapper">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Mission</th>
              <th>Exercice</th>
              <th>Avancement Réel</th>
              <th>Seuil Signif.</th>
              <th>Manager</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="cursor-hover" onclick="window.location.hash='#/audit/dashboard'">
              <td><strong>Société ABC</strong></td>
              <td>Audit légal 2026</td>
              <td>2026</td>
              <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-weight:700;">72%</span>
                  <div style="width:80px; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                    <div style="width:72%; height:100%; background:var(--color-audit-primary); border-radius:3px;"></div>
                  </div>
                </div>
              </td>
              <td><strong>50 000 €</strong></td>
              <td>Marie Dupont</td>
              <td><span class="audit-tag tag-info">En cours d'audit</span></td>
              <td><button class="audit-tag tag-success" style="border:none; cursor:pointer;">Ouvrir</button></td>
            </tr>
            <tr class="cursor-hover" style="opacity: 0.65;">
              <td><strong>Groupe XYZ</strong></td>
              <td>Audit légal 2026</td>
              <td>2026</td>
              <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span>0%</span>
                  <div style="width:80px; height:6px; background:rgba(255,255,255,0.05); border-radius:3px;"></div>
                </div>
              </td>
              <td><strong>120 000 €</strong></td>
              <td>Paul Martin</td>
              <td><span class="audit-tag tag-neutral">Planification</span></td>
              <td><button class="audit-tag tag-neutral" style="border:none;">Planifier</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAuditDashboard() {
  // Thresholds render
  const sAm = document.getElementById('thSignVal');
  const pAm = document.getElementById('thPlanVal');
  const rAm = document.getElementById('thRemVal');
  if (sAm) sAm.textContent = `${auditState.audit_thresholds.signification.amount.toLocaleString('fr-FR')} €`;
  if (pAm) pAm.textContent = `${auditState.audit_thresholds.planification.amount.toLocaleString('fr-FR')} €`;
  if (rAm) rAm.textContent = `${auditState.audit_thresholds.remontee.amount.toLocaleString('fr-FR')} €`;

  // Anomaly stats in dashboard
  const anomaliesCumulated = auditState.audit_findings.reduce((sum, f) => sum + f.amount, 0);
  const percentConsumed = Math.round((anomaliesCumulated / auditState.audit_thresholds.signification.amount) * 100);
  
  const ab = document.getElementById('dashboardAnomalyBar');
  const al = document.getElementById('dashboardAnomalyLabel');
  if (ab && al) {
    ab.style.width = `${Math.min(percentConsumed, 100)}%`;
    ab.className = 'audit-mini-fill ' + (percentConsumed > 75 ? 'fill-danger' : percentConsumed > 25 ? 'fill-warning' : 'fill-success');
    al.innerHTML = `<strong>${anomaliesCumulated.toLocaleString('fr-FR')} €</strong> détectés (${percentConsumed}% du seuil de signif.)`;
  }

  // Render 5 mini cards progress metrics
  // Compute global values from cycle datasets
  const activeCycle = auditState.audit_mission_cycles.find(cy => cy.key === 'tresorerie');
  
  const m1 = document.getElementById('metricAvancementVal');
  const m2 = document.getElementById('metricPreuvesVal');
  const m3 = document.getElementById('metricAutoVal');
  const m4 = document.getElementById('metricRevueVal');
  const m5 = document.getElementById('metricPointsVal');

  if (m1 && activeCycle) {
    m1.textContent = `${activeCycle.progress}%`;
    document.getElementById('metricAvancementBar').style.width = `${activeCycle.progress}%`;
    
    m2.textContent = `${activeCycle.evidence}%`;
    document.getElementById('metricPreuvesBar').style.width = `${activeCycle.evidence}%`;
    
    m3.textContent = `${activeCycle.autoChecks}%`;
    document.getElementById('metricAutoBar').style.width = `${activeCycle.autoChecks}%`;
    
    m4.textContent = `${activeCycle.review}%`;
    document.getElementById('metricRevueBar').style.width = `${activeCycle.review}%`;
    
    // Resolution points
    const openedPoints = auditState.audit_mission_controls.reduce((sum, c) => sum + c.reviewNotes.filter(n => !n.closed).length, 0);
    const totalPoints = auditState.audit_mission_controls.reduce((sum, c) => sum + c.reviewNotes.length, 0);
    const resolvedPercent = totalPoints > 0 ? Math.round(((totalPoints - openedPoints) / totalPoints) * 100) : 100;
    
    m5.textContent = `${resolvedPercent}%`;
    document.getElementById('metricPointsBar').style.width = `${resolvedPercent}%`;
  }

  // Render attention banner
  const attentionContainer = document.getElementById('auditAttentionList');
  if (attentionContainer) {
    attentionContainer.innerHTML = '';
    
    // Generate warnings dynamically from audit state
    const warnings = [];
    const control014 = auditState.audit_mission_controls.find(c => c.ref === 'TRE-014');
    
    if (control014) {
      if (control014.status === 'Ready for review' && control014.autoChecks.result === 'fail') {
        warnings.push({
          msg: "CONTRADICTION : Conclusion positive 'RAS' enregistrée mais écart arithmétique de 4 800 € détecté sur le compte BNP.",
          action: "Ouvrir TRE-014",
          hash: "#/audit/control-fiche"
        });
      }
      if (control014.status === 'Modifications demandées') {
        warnings.push({
          msg: `POINT DE REVUE OUVERT : Modifications demandées par le manager sur TRE-014.`,
          action: "Répondre",
          hash: "#/audit/control-fiche"
        });
      }
      if (control014.status === 'Réouvert') {
        warnings.push({
          msg: "RÉOUVERTURE AUTOMATIQUE : La feuille de travail 'Grand Livre banque 512100' a été modifiée après revue par le manager.",
          action: "Revoir le contrôle",
          hash: "#/audit/control-fiche"
        });
      }
    }

    if (warnings.length === 0) {
      document.getElementById('auditAttentionBanner').style.display = 'none';
    } else {
      document.getElementById('auditAttentionBanner').style.display = 'block';
      warnings.forEach(w => {
        attentionContainer.innerHTML += `
          <div class="audit-att-item">
            <span>${w.msg}</span>
            <button class="audit-att-action" onclick="window.location.hash='${w.hash}'">${w.action}</button>
          </div>
        `;
      });
    }
  }

  // Render cycles table
  const cyclesTableBody = document.getElementById('auditCyclesTableBody');
  if (cyclesTableBody) {
    cyclesTableBody.innerHTML = '';
    auditState.audit_mission_cycles.forEach(cy => {
      let statusClass = 'tag-neutral';
      if (cy.status === 'Validé') statusClass = 'tag-success';
      else if (cy.status === 'En cours') statusClass = 'tag-info';
      else if (cy.status === 'Ready for review') statusClass = 'tag-warning';
      else if (cy.status === 'Modifications demandées') statusClass = 'tag-danger';

      cyclesTableBody.innerHTML += `
        <tr class="cursor-hover" onclick="auditState.selectedCycleKey='${cy.key}'; window.location.hash='#/audit/cycle-detail';">
          <td><strong>${cy.name}</strong></td>
          <td>${cy.lead}</td>
          <td><span style="color: ${cy.risk === 'Moyen' ? '#FBBF24' : '#34D399'}; font-weight:600;">${cy.risk}</span></td>
          <td>${cy.progress}%</td>
          <td>${cy.evidence}%</td>
          <td>${cy.autoChecks}%</td>
          <td>${cy.review}%</td>
          <td>
            <span class="audit-tag ${statusClass}">${cy.status}</span>
            ${cy.alert ? `<span class="audit-tag tag-danger" style="padding:0.1rem 0.3rem; margin-left:0.25rem;">!</span>` : ''}
          </td>
        </tr>
      `;
    });
  }

  // Recent activity logs render
  const activityList = document.getElementById('auditRecentActivityList');
  if (activityList) {
    activityList.innerHTML = '';
    auditState.audit_activity_logs.slice(0, 5).forEach(log => {
      activityList.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.75rem; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.04); border-radius:8px; font-size:0.8rem; margin-bottom:0.5rem;">
          <div>
            <span style="color:#94A3B8;">[${log.date}]</span>
            <strong style="color:var(--color-audit-primary); margin-left:0.5rem;">${log.user}</strong>
            <span style="color:#CBD5E1; margin-left:0.5rem;">${log.detail}</span>
          </div>
          <span class="audit-tag tag-info" style="font-size:0.6rem; padding:0.1rem 0.4rem;">${log.action}</span>
        </div>
      `;
    });
  }
}

function renderAuditCycles() {
  const grid = document.getElementById('auditCyclesGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  auditState.audit_mission_cycles.forEach(cy => {
    let statusClass = 'tag-neutral';
    if (cy.status === 'Validé') statusClass = 'tag-success';
    else if (cy.status === 'En cours') statusClass = 'tag-info';
    else if (cy.status === 'Ready for review') statusClass = 'tag-warning';
    else if (cy.status === 'Modifications demandées') statusClass = 'tag-danger';

    grid.innerHTML += `
      <div class="db-table-card cursor-hover" style="margin-top:0;" onclick="auditState.selectedCycleKey='${cy.key}'; window.location.hash='#/audit/cycle-detail';">
        <div class="audit-card-header">
          <h4 class="audit-card-title">${cy.name}</h4>
          <span class="audit-tag ${statusClass}">${cy.status}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem; font-size:0.8rem; color:#94A3B8;">
          <div style="display:flex; justify-content:space-between;">
            <span>Responsable :</span>
            <strong style="color:#fff;">${cy.lead}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Risque inhérent :</span>
            <strong style="color:${cy.risk === 'Moyen' ? '#FBBF24' : '#34D399'}">${cy.risk}</strong>
          </div>
          <div style="margin-top:0.5rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.25rem;">
              <span>Avancement travaux</span>
              <strong>${cy.progress}%</strong>
            </div>
            <div style="width:100%; height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden;">
              <div style="width:${cy.progress}%; height:100%; background:var(--color-audit-primary);" class="audit-mini-fill"></div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:0.5rem; font-size:0.75rem; color:#64748B;">
            <span>Preuves : ${cy.evidence}%</span>
            <span>Contrôles auto. : ${cy.autoChecks}%</span>
          </div>
        </div>
      </div>
    `;
  });
}

function renderAuditCycleDetail() {
  const container = document.getElementById('auditCycleDetailContainer');
  if (!container) return;
  
  const cycle = auditState.audit_mission_cycles.find(cy => cy.key === auditState.selectedCycleKey);
  const controls = auditState.audit_mission_controls.filter(c => c.cycle === auditState.selectedCycleKey);
  
  if (!cycle) return;
  
  let accountsHTML = '';
  if (cycle.key === 'tresorerie') {
    accountsHTML = `
      <div class="db-table-card" style="margin-top:0;">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Comptes du grand livre associés (Rapprochement)</h4>
        <div class="db-table-wrapper">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Compte</th>
                <th>Intitulé du Compte</th>
                <th>Solde Livre Comptable (A)</th>
                <th>Solde Extrait Relevé (B)</th>
                <th>Écart (A - B)</th>
                <th>Apurements Rapprochés (C)</th>
                <th>Écart Non Justifié</th>
                <th>Contrôle Auto.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>51202000</strong></td>
                <td>BNP Paribas (Simulation)</td>
                <td>5 257,80 €</td>
                <td>12 757,80 €</td>
                <td style="color:#F87171; font-weight:600;">- 7 500,00 €</td>
                <td>2 700,00 €</td>
                <td style="color:#EF4444; font-weight:700;">- 4 800,00 €</td>
                <td><span class="audit-tag tag-danger">Échec</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td><strong>51201900</strong></td>
                <td>CIC GROUPE</td>
                <td>6 248 593,76 €</td>
                <td>6 248 593,76 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td><strong>51203000</strong></td>
                <td>CAISSE D EPARGNE</td>
                <td>-437 978,79 €</td>
                <td>-437 978,79 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td><strong>51212300</strong></td>
                <td>BP EX GRPE DISTRI</td>
                <td>68 977,38 €</td>
                <td>68 977,38 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>51212000</td>
                <td>BANQUE POPULAIRE</td>
                <td>10 805,36 €</td>
                <td>10 805,36 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>51208000</td>
                <td>SG SMC</td>
                <td>2 774,16 €</td>
                <td>2 774,16 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>51209004</td>
                <td>CREDIT AGRICOLE AP</td>
                <td>628,23 €</td>
                <td>628,23 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>51204000</td>
                <td>ARKEA BANQUE</td>
                <td>569,87 €</td>
                <td>569,87 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>53110000</td>
                <td>CAISSE</td>
                <td>161,16 €</td>
                <td>161,16 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>51201000</td>
                <td>CIC</td>
                <td>-31,03 €</td>
                <td>-31,03 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>51203010</td>
                <td>CE EX GRPE DISTRI</td>
                <td>-44 422,47 €</td>
                <td>-44 422,47 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>50810005</td>
                <td>CIC CAT</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>50810007</td>
                <td>CAISSE D'EPARGNE CAT</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (cycle.key === 'financier') {
    accountsHTML = `
      <div class="db-table-card" style="margin-top:0;">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Comptes de charges et produits financiers (Classe 66 & 76)</h4>
        <div class="db-table-wrapper">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Compte</th>
                <th>Intitulé du Compte</th>
                <th>Solde Balance N (Livre)</th>
                <th>Justificatif Requis / Tableaux</th>
                <th>Écart Inexpliqué</th>
                <th>Contrôle Auto.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>66800000</strong></td>
                <td>AUTRES CHARGES FINANCIERES</td>
                <td>1 373 736,00 €</td>
                <td>Contrat de cession de créances</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr>
                <td><strong>66100003</strong></td>
                <td>INT EMPRUNT STRUCTURE</td>
                <td>360 881,04 €</td>
                <td>Tableau amortissement BPCE</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr>
                <td><strong>66810000</strong></td>
                <td>INTERET ET FINANCEMENT AFFACTURAGE</td>
                <td>243 146,61 €</td>
                <td>Grand livre et bordereaux factor</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr>
                <td>66100063</td>
                <td>INT AUTRE EMPRUNTS INTERET COURUS</td>
                <td>232 500,00 €</td>
                <td>Tableau d'amortissement CIC</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr>
                <td>66100029</td>
                <td>INT EMPRUNT STRUCTURE</td>
                <td>210 361,52 €</td>
                <td>Contrat Crédit Agricole</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td>66100000</td>
                <td>CHARGES D'INTÉRÊTS</td>
                <td>163 996,56 €</td>
                <td>Vérification analytique globale</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td>66100064</td>
                <td>INT AUTRES EMPRUNTS INTERET COURUS</td>
                <td>116 250,00 €</td>
                <td>Tableau d'amortissement SG</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td>66100032</td>
                <td>INT AUTRES EMPRUNTS ET INTERETCOURU</td>
                <td>106 666,67 €</td>
                <td>Vérification des taux d'intérêts</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.85;">
                <td>66100028</td>
                <td>INT EMPRUNT STRUCTURE</td>
                <td>106 227,31 €</td>
                <td>Tableau amortissement Arkea</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>66160000</td>
                <td>INTERETS BANCAIRES</td>
                <td>103 757,16 €</td>
                <td>Frais de découvert BNP/CIC</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
              <tr style="opacity:0.6;">
                <td>76150080</td>
                <td>INTERET CC</td>
                <td>-423 379,60 €</td>
                <td>Produits sur comptes courants associés</td>
                <td>0,00 €</td>
                <td><span class="audit-tag tag-success">Conforme</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  let controlsRows = '';
  controls.forEach(c => {
    let statusClass = 'tag-neutral';
    if (c.status === 'Validé') statusClass = 'tag-success';
    else if (c.status === 'En cours') statusClass = 'tag-info';
    else if (c.status === 'Ready for review') statusClass = 'tag-warning';
    else if (c.status === 'Modifications demandées') statusClass = 'tag-danger';

    controlsRows += `
      <tr class="cursor-hover" onclick="auditState.selectedControlRef='${c.ref}'; window.location.hash='#/audit/control-fiche';">
        <td><strong>${c.ref}</strong></td>
        <td>${c.subCategory}</td>
        <td><strong>${c.title}</strong></td>
        <td>${c.lead}</td>
        <td>
          <span class="audit-tag ${statusClass}">${c.status}</span>
        </td>
        <td>
          ${c.autoChecks.result === 'success' ? '<span style="color:#34D399;">✓ Réussi</span>' : c.autoChecks.result === 'fail' ? '<span style="color:#F87171; font-weight:600;">✕ Échec</span>' : '<span style="color:#64748B;">Non exécuté</span>'}
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1.5rem;">
      ${accountsHTML}
      
      <div class="db-table-card">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Programme de travail - Liste des Contrôles</h4>
        <div class="db-table-wrapper">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Réf</th>
                <th>Sous-catégorie</th>
                <th>Objectif du contrôle</th>
                <th>Collaborateur</th>
                <th>Statut</th>
                <th>Contrôle Auto.</th>
              </tr>
            </thead>
            <tbody>
              ${controlsRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAuditControlFiche() {
  const container = document.getElementById('auditControlFicheContainer');
  if (!container) return;
  
  const c = auditState.audit_mission_controls.find(ctrl => ctrl.ref === auditState.selectedControlRef);
  if (!c) return;
  
  let statusClass = 'tag-neutral';
  if (c.status === 'Validé') statusClass = 'tag-success';
  else if (c.status === 'En cours') statusClass = 'tag-info';
  else if (c.status === 'Ready for review') statusClass = 'tag-warning';
  else if (c.status === 'Modifications demandées') statusClass = 'tag-danger';
  else if (c.status === 'Réouvert') statusClass = 'tag-danger';

  // Role based quick actions
  let quickActionsHTML = '';
  if (auditState.activeRole === 'manager' || auditState.activeRole === 'associe') {
    if (c.status !== 'Validé') {
      quickActionsHTML = `
        <div class="control-detail-block" style="border:1px solid rgba(141, 164, 196, 0.3);">
          <span class="control-block-title">⚡ Actions de Supervision (Manager)</span>
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
            <button class="btn btn-primary cursor-hover" style="font-size:0.8rem; padding:0.4rem 0.8rem;" id="btnActionValidateControl">Valider le contrôle</button>
            <button class="btn btn-secondary cursor-hover" style="font-size:0.8rem; padding:0.4rem 0.8rem;" id="btnActionDemandModif">Demander modifications</button>
          </div>
        </div>
      `;
    } else {
      quickActionsHTML = `
        <div class="control-detail-block" style="border:1px solid rgba(16, 185, 129, 0.3);">
          <span class="control-block-title" style="color:#34D399;">✓ Contrôle validé par Marie Dupont</span>
          <p style="font-size:0.8rem; color:#94A3B8; margin-top:0.5rem;">Ce dossier est verrouillé. Toute modification ultérieure des documents comptables réouvrira automatiquement ce contrôle.</p>
        </div>
      `;
    }
  } else {
    // Collaborator quick actions
    if (c.status !== 'Validé') {
      quickActionsHTML = `
        <div class="control-detail-block">
          <span class="control-block-title">⚡ Actions du Collaborateur</span>
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
            <button class="btn btn-primary cursor-hover" style="font-size:0.8rem; padding:0.4rem 0.8rem;" id="btnActionSubmitForReview" ${c.status === 'Ready for review' ? 'disabled' : ''}>Soumettre pour revue</button>
          </div>
        </div>
      `;
    }
  }

  // Preuves documents links
  let evidenceHTML = '';
  c.evidence.forEach(docName => {
    let matchingDoc = auditState.audit_evidence_documents.find(d => d.name === docName);
    let size = matchingDoc ? matchingDoc.size : "850 Ko";
    let type = matchingDoc ? matchingDoc.type : "PDF";
    evidenceHTML += `
      <div class="evidence-link-item">
        <div class="evidence-meta">
          <span class="evidence-name">${docName} (${type})</span>
          <span class="evidence-source">OneDrive / SharePoint • Taille : ${size}</span>
        </div>
        <button class="evidence-btn-view" onclick="auditState.activeView='documents'; renderAuditUI();">Visualiser</button>
      </div>
    `;
  });

  // Automated checks block
  let autoChecksHTML = '';
  if (c.autoChecks.run) {
    if (c.autoChecks.result === 'success') {
      autoChecksHTML = `
        <div class="control-detail-block ai-checker-block success">
          <span class="control-block-title" style="color:#34D399;">🤖 Contrôle arithmétique réussi</span>
          <p style="font-size:0.8rem; color:#CBD5E1; margin-top:0.5rem;">${c.autoChecks.detail}</p>
        </div>
      `;
    } else {
      autoChecksHTML = `
        <div class="control-detail-block ai-checker-block fail">
          <span class="control-block-title" style="color:#F87171;">🤖 ÉCHEC DE CONTRÔLE AUTOMATIQUE (Anti-fausse progression)</span>
          <p style="font-size:0.8rem; color:#CBD5E1; margin-top:0.5rem;">${c.autoChecks.detail}</p>
          <p style="font-size:0.75rem; color:#FCA5A5; font-style:italic; margin-top:0.25rem;">La conclusion positive "RAS" est bloquée car un écart non justifié subsiste dans la feuille de rapprochement.</p>
        </div>
      `;
    }
  } else {
    autoChecksHTML = `
      <div class="control-detail-block">
        <span class="control-block-title" style="color:#64748B;">🤖 Contrôles automatiques non lancés</span>
        <p style="font-size:0.8rem; color:#94A3B8;">En attente de soumission des pièces ou de conclusion rédigée.</p>
      </div>
    `;
  }

  // Review notes listing
  let reviewNotesHTML = '';
  c.reviewNotes.forEach(note => {
    reviewNotesHTML += `
      <div style="padding:0.75rem; background:rgba(239, 68, 68, 0.03); border:1px solid rgba(239, 68, 68, 0.1); border-radius:8px; margin-bottom:0.5rem; font-size:0.8rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <strong style="color:#fff;">${note.author} (Manager)</strong>
          <span style="color:#64748B;">${note.date}</span>
        </div>
        <p style="color:#E2E8F0; line-height:1.4;">${note.text}</p>
        <div style="margin-top:0.5rem; display:flex; justify-content:space-between; align-items:center;">
          <span class="audit-tag ${note.closed ? 'tag-success' : 'tag-danger'}" style="font-size:0.6rem;">${note.closed ? 'Fermé' : 'Ouvert'}</span>
          ${!note.closed && auditState.activeRole === 'manager' ? `<button class="audit-tag tag-success" style="border:none; cursor:pointer;" id="btnCloseReviewNote">Fermer le point</button>` : ''}
        </div>
      </div>
    `;
  });

  if (reviewNotesHTML === '') {
    reviewNotesHTML = `<p style="font-style:italic; color:#64748B; font-size:0.8rem;">Aucun point de revue sur ce contrôle.</p>`;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.3); padding:1rem; border:1px solid rgba(255,255,255,0.05); border-radius:12px;">
      <div>
        <span style="font-size:0.75rem; color:#94A3B8; text-transform:uppercase;">Sous-catégorie : ${c.subCategory}</span>
        <h3 style="color:#fff; font-size:1.25rem; font-weight:600; margin-top:0.25rem;">${c.title}</h3>
      </div>
      <span class="audit-tag ${statusClass}" style="font-size:0.85rem; padding: 0.4rem 1rem;">${c.status}</span>
    </div>
    
    <div class="control-fiche-grid">
      <!-- Left side: documentation & procedure -->
      <div class="control-fiche-left">
        <div class="control-detail-block">
          <span class="control-block-title">🎯 Objectif du contrôle</span>
          <p class="control-block-content">${c.objective}</p>
        </div>
        
        <div class="control-detail-block">
          <span class="control-block-title">⚙️ Procédure recommandée</span>
          <p class="control-block-content" style="white-space:pre-wrap;">${c.procedure}</p>
        </div>
        
        <div class="control-detail-block">
          <span class="control-block-title">✍️ Conclusion du collaborateur</span>
          <textarea class="form-input cursor-hover" id="controlConclusionText" rows="4" style="width:100%; resize:none; font-family:inherit; margin-top:0.5rem; background:rgba(255,255,255,0.01);" ${c.status === 'Validé' ? 'readonly' : ''}>${c.conclusion}</textarea>
          ${c.status !== 'Validé' ? `<button class="btn btn-secondary cursor-hover" style="font-size:0.75rem; padding:0.4rem 0.8rem; margin-top:0.75rem; align-self:flex-end;" id="btnSaveControlConclusion">Enregistrer la conclusion</button>` : ''}
        </div>
      </div>
      
      <!-- Right side: check tools, evidence, review notes -->
      <div class="control-fiche-right">
        ${quickActionsHTML}
        
        ${autoChecksHTML}
        
        <div class="control-detail-block">
          <span class="control-block-title">📎 Pièces justificatives rattachées</span>
          <div style="margin-top:0.75rem;">
            ${evidenceHTML}
          </div>
        </div>
        
        <div class="control-detail-block">
          <span class="control-block-title">💬 Points de revue du relecteur</span>
          <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem;">
            ${reviewNotesHTML}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Bind actions
  bindControlFicheEvents(c);
}

function bindControlFicheEvents(c) {
  const btnValidate = document.getElementById('btnActionValidateControl');
  if (btnValidate) {
    btnValidate.addEventListener('click', () => {
      // Validate control
      c.status = 'Validé';
      c.reviewNotes.forEach(n => n.closed = true);
      c.autoChecks.result = 'success';
      
      // Update global cycle stats
      const cycle = auditState.audit_mission_cycles.find(cy => cy.key === c.cycle);
      if (cycle) {
        cycle.progress = 100;
        cycle.evidence = 100;
        cycle.autoChecks = 100;
        cycle.review = 100;
        cycle.status = 'Validé';
      }
      
      // Log
      auditState.audit_activity_logs.unshift({
        date: "À l'instant",
        user: "Marie Dupont",
        action: "Validation",
        resource: c.ref,
        detail: "Contrôle validé et signé électroniquement."
      });
      
      renderAuditControlFiche();
      alert("Contrôle validé avec succès ! Le statut est verrouillé.");
    });
  }
  
  const btnDemandModif = document.getElementById('btnActionDemandModif');
  if (btnDemandModif) {
    btnDemandModif.addEventListener('click', () => {
      const text = prompt("Rédiger le point de revue pour le collaborateur :");
      if (!text || !text.trim()) return;
      
      c.status = 'Modifications demandées';
      c.reviewNotes.push({
        author: "Marie Dupont",
        date: "À l'instant",
        text: text.trim(),
        closed: false
      });
      
      // Log
      auditState.audit_activity_logs.unshift({
        date: "À l'instant",
        user: "Marie Dupont",
        action: "Supervision",
        resource: c.ref,
        detail: "Point de revue ouvert : " + text.substring(0, 30) + "..."
      });
      
      renderAuditControlFiche();
    });
  }

  const btnSubmit = document.getElementById('btnActionSubmitForReview');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      c.status = 'Ready for review';
      c.autoChecks.run = true;
      
      // Log
      auditState.audit_activity_logs.unshift({
        date: "À l'instant",
        user: "Antoine Roche",
        action: "Modification",
        resource: c.ref,
        detail: "Soumission du contrôle pour revue."
      });
      
      renderAuditControlFiche();
      alert("Le contrôle a été soumis au manager pour revue.");
    });
  }
  
  const btnSaveConclusion = document.getElementById('btnSaveControlConclusion');
  if (btnSaveConclusion) {
    btnSaveConclusion.addEventListener('click', () => {
      const text = document.getElementById('controlConclusionText').value.trim();
      c.conclusion = text;
      alert("Conclusion enregistrée.");
    });
  }

  const btnCloseNote = document.getElementById('btnCloseReviewNote');
  if (btnCloseNote) {
    btnCloseNote.addEventListener('click', () => {
      c.reviewNotes.forEach(n => n.closed = true);
      alert("Point de revue fermé.");
      renderAuditControlFiche();
    });
  }
}

function renderAuditReview() {
  const container = document.getElementById('auditReviewContainer');
  if (!container) return;
  
  // Lister tous les points de revue ouverts sur la mission
  const controlsWithNotes = auditState.audit_mission_controls.filter(c => c.reviewNotes.length > 0);
  
  let notesRows = '';
  controlsWithNotes.forEach(c => {
    c.reviewNotes.forEach(note => {
      notesRows += `
        <tr>
          <td><strong>${c.ref}</strong></td>
          <td>${c.title}</td>
          <td>${note.author}</td>
          <td>${note.text}</td>
          <td><span class="audit-tag ${note.closed ? 'tag-success' : 'tag-danger'}">${note.closed ? 'Résolu' : 'En attente'}</span></td>
          <td>
            <button class="audit-tag tag-info" style="border:none; cursor:pointer;" onclick="auditState.selectedControlRef='${c.ref}'; window.location.hash='#/audit/control-fiche';">Ouvrir</button>
          </td>
        </tr>
      `;
    });
  });

  if (notesRows === '') {
    notesRows = `
      <tr>
        <td colspan="6" style="text-align:center; color:#64748B; padding:2rem; font-style:italic;">
          Aucun point de revue actif. Les travaux sont fluides !
        </td>
      </tr>
    `;
  }

  container.innerHTML = `
    <div class="db-table-card" style="margin-top:0;">
      <h4 class="audit-card-title" style="margin-bottom:1rem;">Historique des points de revue de la mission</h4>
      <div class="db-table-wrapper">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Réf Contrôle</th>
              <th>Objectif</th>
              <th>Auteur</th>
              <th>Point soulevé</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${notesRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAuditFindings() {
  const tableBody = document.getElementById('auditFindingsTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  const significationLimit = auditState.audit_thresholds.signification.amount;
  
  auditState.audit_findings.forEach(find => {
    tableBody.innerHTML += `
      <tr>
        <td><strong>${find.ref}</strong></td>
        <td>${find.cycle} (${find.controlSource})</td>
        <td>${find.desc}</td>
        <td style="color:#F87171; font-weight:600;">${find.amount.toLocaleString('fr-FR')} €</td>
        <td>${find.type}</td>
        <td><span class="audit-tag tag-danger">${find.status}</span></td>
      </tr>
    `;
  });

  if (auditState.audit_findings.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:#64748B; padding:2rem; font-style:italic;">
          Aucune anomalie détectée sur l'exercice.
        </td>
      </tr>
    `;
  }

  // Cumulated calculations
  const totalAnomalies = auditState.audit_findings.reduce((sum, f) => sum + f.amount, 0);
  const percentConsumed = Math.round((totalAnomalies / significationLimit) * 100);
  
  const cEl = document.getElementById('findingsCumulatedText');
  if (cEl) {
    cEl.innerHTML = `
      Impact cumulé des anomalies non corrigées : <strong style="color:${totalAnomalies > significationLimit ? '#EF4444' : '#F59E0B'}; font-size: 1.25rem;">${totalAnomalies.toLocaleString('fr-FR')} €</strong>
      <p style="font-size:0.8rem; color:#94A3B8; margin-top:0.25rem;">Soit ${percentConsumed}% du Seuil de Signification (${significationLimit.toLocaleString('fr-FR')} €).</p>
    `;
  }
}

function renderAuditDocuments() {
  const tableBody = document.getElementById('auditDocsTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  auditState.audit_evidence_documents.forEach(doc => {
    tableBody.innerHTML += `
      <tr class="cursor-hover" onclick="showPDFViewer('${doc.name}')">
        <td><strong>${doc.name}</strong></td>
        <td>${doc.category}</td>
        <td>${doc.type}</td>
        <td>${doc.size}</td>
        <td><span class="audit-tag tag-success">${doc.trust}% Confiance</span></td>
        <td>${doc.date}</td>
        <td>
          <button class="audit-tag tag-info" style="border:none; cursor:pointer;">Examiner</button>
        </td>
      </tr>
    `;
  });
}

function showPDFViewer(docName) {
  const viewer = document.getElementById('auditPDFViewerModal');
  if (!viewer) return;
  
  viewer.style.display = 'block';
  
  const title = document.getElementById('pdfViewerTitle');
  if (title) title.textContent = docName;
  
  // Custom interactive highlight if it's the BNP statement
  const ocrHighlight = document.getElementById('pdfOcrHighlight');
  if (ocrHighlight) {
    if (docName.includes('BNP')) {
      ocrHighlight.style.display = 'block';
      ocrHighlight.style.top = '140px';
      ocrHighlight.style.left = '320px';
      ocrHighlight.style.width = '120px';
      ocrHighlight.style.height = '30px';
    } else {
      ocrHighlight.style.display = 'none';
    }
  }
}

// Global scope export for close PDF
window.closePDFViewer = function() {
  const viewer = document.getElementById('auditPDFViewerModal');
  if (viewer) viewer.style.display = 'none';
};

function renderAuditMethodology() {
  const container = document.getElementById('auditMethodologyContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:2rem;">
      <div class="db-table-card" style="margin-top:0;">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Niveau 1 : Bibliothèque Standard Valaura (ISA)</h4>
        <p style="font-size:0.8rem; color:#94A3B8; margin-bottom:1.5rem;">Modèles prédéfinis de cycles et de contrôles arithmétiques ou narratives.</p>
        
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="padding:1rem; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); border-radius:8px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <strong>TRE-014 : Rapprochement Bancaire standard</strong>
              <span class="audit-tag tag-success">Active</span>
            </div>
            <p style="font-size:0.75rem; color:#94A3B8;">Assertion visée : Réalité & Évaluation. Population : 100% des comptes 512.</p>
          </div>
          <div style="padding:1rem; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); border-radius:8px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <strong>ACH-022 : Test de cut-off des charges fournisseurs</strong>
              <span class="audit-tag tag-success">Active</span>
            </div>
            <p style="font-size:0.75rem; color:#94A3B8;">Assertion visée : Rattachement. Population : Factures d'achats +/- 15j clôture.</p>
          </div>
        </div>
      </div>
      
      <div class="db-table-card" style="margin-top:0;">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Niveau 2 : Méthodologie Propre au Cabinet</h4>
        <p style="font-size:0.8rem; color:#94A3B8; margin-bottom:1rem;">Adaptez les règles d'échantillonnage et les seuils de qualité du cabinet.</p>
        
        <form style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <label style="font-size:0.75rem; color:#94A3B8;">Seuil de tolérance d'écart de rapprochement :</label>
            <input type="text" value="0 EUR (Équilibre strict)" class="form-input cursor-hover" readonly>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <label style="font-size:0.75rem; color:#94A3B8;">Exigence de double signature (Manager + Associé) :</label>
            <select class="form-input cursor-hover" style="color:#fff;">
              <option>Sur tous les cycles sensibles (Recommandé)</option>
              <option>Uniquement si anomalies supérieures au seuil planification</option>
            </select>
          </div>
          <button class="btn btn-primary cursor-hover" type="button" style="font-size:0.8rem; align-self:flex-end;">Sauvegarder la méthode</button>
        </form>
      </div>
    </div>
  `;
}

function renderAuditConfig() {
  const container = document.getElementById('auditConfigContainer');
  if (!container) return;
  
  // Render logs
  let logsHTML = '';
  auditState.audit_activity_logs.forEach(log => {
    logsHTML += `
      <div class="audit-log-line">
        <span class="log-date">${log.date}</span>
        <span class="log-user">${log.user}</span>
        <span class="log-action">${log.action}</span>
        <span class="log-details">${log.detail}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem;">
      <div class="db-table-card" style="margin-top:0;">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Connecteurs Office 365 OneDrive & SharePoint</h4>
        <p style="font-size:0.8rem; color:#94A3B8; margin-bottom:1.5rem;">Autorisez l'accès en lecture seule aux dossiers de travail du client.</p>
        
        <div style="padding:1rem; background:rgba(16,185,129,0.03); border:1px solid rgba(16,185,129,0.15); border-radius:12px; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#fff; font-size:0.9rem;">Microsoft Entra ID Actif</strong>
              <span style="display:block; font-size:0.75rem; color:#94A3B8; margin-top:0.25rem;">Dossier connecté : ABC_Audit_2026</span>
            </div>
            <span class="audit-tag tag-success">Connecté ✓</span>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:1rem;">
          <span style="font-size:0.8rem; color:#94A3B8;">Politique IA de classification automatique :</span>
          <label class="switch cursor-hover">
            <input type="checkbox" id="auditSwitchAI" checked>
            <span class="slider-round"></span>
          </label>
        </div>
      </div>
      
      <div class="db-table-card" style="margin-top:0;">
        <h4 class="audit-card-title" style="margin-bottom:1rem;">Journal Technique d'Audit (Piste de vérification)</h4>
        <div class="audit-logs-container">
          ${logsHTML}
        </div>
      </div>
    </div>
  `;
}

// Initialization of Audit Scenario and Events
export function initAuditScenario() {
  let currentAuditStepIndex = 0;
  const nextBtn = document.getElementById('auditScNextBtn');
  const resetBtn = document.getElementById('auditScResetBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentAuditStepIndex === auditScenarioSteps.length - 1) {
        currentAuditStepIndex = 0;
        nextBtn.querySelector('span').textContent = 'Étape Suivante';
      } else {
        currentAuditStepIndex++;
        if (currentAuditStepIndex === auditScenarioSteps.length - 1) {
          nextBtn.querySelector('span').textContent = 'Recommencer la démo';
        }
      }
      renderAuditScenarioStep(currentAuditStepIndex);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentAuditStepIndex = 0;
      if (nextBtn) nextBtn.querySelector('span').textContent = 'Étape Suivante';
      renderAuditScenarioStep(0);
    });
  }

  // Bind sidebar nav links
  const navItems = document.querySelectorAll('#auditSidebarNav [data-audit-view]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-audit-view');
      auditState.activeView = view;
      window.location.hash = `#/audit/${view}`;
    });
  });

  // Bind role selector buttons
  const roleBtns = document.querySelectorAll('#auditRoleSelector [data-audit-role]');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-audit-role');
      auditState.activeRole = role;
      
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      renderAuditUI();
    });
  });
}

function renderAuditScenarioStep(stepIndex) {
  const stepData = auditScenarioSteps[stepIndex];
  if (!stepData) return;

  const progressFill = document.getElementById('auditScProgressFill');
  const stepsCount = document.getElementById('auditScStepsCount');
  const stepName = document.getElementById('auditScStepName');
  const stepDesc = document.getElementById('auditScStepDesc');

  if (progressFill) progressFill.style.width = `${((stepIndex + 1) / auditScenarioSteps.length) * 100}%`;
  if (stepsCount) stepsCount.textContent = `Étape ${stepIndex + 1} sur ${auditScenarioSteps.length}`;
  if (stepName) stepName.textContent = stepData.name;
  if (stepDesc) stepDesc.textContent = stepData.desc;

  // Run step action
  stepData.action(auditState);

  // Switch role and view dynamically
  auditState.activeRole = stepData.role;
  auditState.activeView = stepData.view;
  
  // Highlight active role button in topbar
  const roleBtns = document.querySelectorAll('#auditRoleSelector [data-audit-role]');
  roleBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-audit-role') === stepData.role) {
      btn.classList.add('active');
    }
  });

  window.location.hash = `#/audit/${stepData.view}`;
  
  // Custom toast alert for scenario step
  const toastContainer = document.getElementById('toastContainer');
  if (toastContainer) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg cursor-hover';
    toast.innerHTML = `<span class="toast-icon">⚡</span><span>Étape scénario d'audit chargée : ${stepData.name}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}
