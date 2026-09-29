(() => {
  const routes = ["vitrine", "login", "today", "agenda", "signature", "messages", "numa", "programme", "launch", "urgent", "profile"];
  const routeNames = {
    vitrine: "Strivea Vet",
    login: "Connexion",
    today: "Aujourd’hui",
    agenda: "Calendrier",
    signature: "Suivi Signature",
    messages: "Animaux",
    numa: "Numa",
    programme: "Protocoles",
    launch: "Lancement",
    urgent: "Cadre",
    profile: "Mon profil"
  };
  const legacyRoutes = {
    home: "today",
    whatsapp: "messages",
    assistant: "numa",
    tracking: "today",
    appointment: "numa",
    doctolib: "numa",
    professional: "profile"
  };
  const landing = document.getElementById("view-vitrine");
  const loginView = document.getElementById("view-login");
  const workspace = document.getElementById("workspace");
  const appViews = Array.from(document.querySelectorAll(".app-view"));
  const routeButtons = Array.from(document.querySelectorAll("[data-route]"));
  const landingSectionLinks = Array.from(document.querySelectorAll("[data-landing-section]"));
  const landingSectionIds = ["fonctionnement", "tarifs", "integrations", "securite", "confiance"];
  const mobileRoute = document.getElementById("mobile-route");
  const toast = document.getElementById("toast");
  const assistantWidget = document.getElementById("assistant-assistant");
  const assistantToggle = document.getElementById("assistant-toggle");
  const assistantPanel = document.getElementById("assistant-panel");
  const assistantClose = document.getElementById("assistant-close");
  const assistantThread = document.getElementById("assistant-thread");
  const assistantForm = document.getElementById("assistant-form");
  const assistantInput = document.getElementById("assistant-input");
  const assistantOpenButtons = Array.from(document.querySelectorAll("[data-assistant-open]"));
  const loginForm = document.querySelector("[data-login-form]");
  const enterStriveaButtons = Array.from(document.querySelectorAll("[data-enter-strivea]"));
  const profileTabs = Array.from(document.querySelectorAll("[data-profile-tab]"));
  const profilePanels = Array.from(document.querySelectorAll(".profile-tab-panel"));
  const themeChoices = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const themeQuickButtons = Array.from(document.querySelectorAll("[data-theme-quick]"));
  const signatureLinks = Array.from(document.querySelectorAll("[data-signature-link]"));
  const numaTabButtons = Array.from(document.querySelectorAll("[data-numa-tab]"));
  const numaTabPanels = Array.from(document.querySelectorAll("[data-numa-panel]"));
  const agendaForm = document.getElementById("agenda-form");
  const agendaDayList = document.getElementById("agenda-day-list");
  const todayAgendaList = document.getElementById("today-agenda-list");
  const calendarGrid = document.getElementById("calendar-grid");
  const calendarEventsLayer = document.getElementById("calendar-events-layer");
  const calendarMouseLine = document.getElementById("calendar-mouse-line");
  const calendarMouseTime = document.getElementById("calendar-mouse-time");
  const agendaModal = document.getElementById("agenda-modal");
  const openAgendaModalButton = document.getElementById("open-agenda-modal");
  const closeAgendaModalButton = document.getElementById("close-agenda-modal");
  const agendaExistingPatient = document.getElementById("agenda-existing-patient");
  const agendaExistingClient = document.getElementById("agenda-existing-client");
  const agendaNewClient = document.getElementById("agenda-new-client");
  const agendaClientModeInputs = Array.from(document.querySelectorAll('input[name="agenda-client-mode"]'));
  const agendaImportDropzone = document.getElementById("agenda-import-dropzone");
  const agendaScreenshotInput = document.getElementById("agenda-screenshot-input");
  const agendaImportPreview = document.getElementById("agenda-import-preview");
  const agendaDetectedList = document.getElementById("agenda-detected-list");
  const agendaImportApply = document.getElementById("agenda-import-apply");
  const agendaImportClear = document.getElementById("agenda-import-clear");
  const googleCalendarStatus = document.getElementById("google-calendar-status");
  const googleCalendarEmail = document.getElementById("google-calendar-email");
  const connectGoogleCalendar = document.getElementById("connect-google-calendar");
  const syncGoogleCalendar = document.getElementById("sync-google-calendar");
  const exportGoogleCalendar = document.getElementById("export-google-calendar");
  const googleCalendarNote = document.getElementById("google-calendar-note");
  const themeStatus = document.getElementById("theme-status");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let toastTimer;
  let selectedPatient = "Nala · Claire Martin";
  let selectedPatientKey = "camille";
  let assistantReminderPrepared = false;
  let consultationPriorityActive = true;
  let signatureFollowupGenerated = false;
  let signatureCurrentProtocol = null;
  let signatureProtocolAccepted = false;
  let protocolAiDraft = null;
  let lastHandledHash = null;
  let lastScrollY = window.scrollY;
  let topBarTicking = false;
  let pendingAgendaScreenshotAppointments = [];
  let googleCalendarConnected = false;
  let appointments = [
    {
      id: "rdv-nala-0900",
      day: 5,
      time: "09:00",
      duration: "30 min",
      animal: "Nala",
      owner: "Claire Martin",
      type: "Contrôle post-visite",
      reason: "Contrôle post-stérilisation et point sur la plaie",
      protocol: "Post-stérilisation",
      status: "Signal à évaluer",
      patientKey: "camille",
      note: "Lire la réponse WhatsApp avant l’appel."
    },
    {
      id: "rdv-moka-1030",
      day: 5,
      time: "10:30",
      duration: "30 min",
      animal: "Moka",
      owner: "Julie Petit",
      type: "Suivi chronique",
      reason: "Contrôle diabète félin",
      protocol: "Suivi chronique",
      status: "Synthèse prête",
      patientKey: "amelie",
      note: "Préparer l’évolution appétit/eau avant la consultation."
    },
    {
      id: "rdv-oslo-15",
      day: 5,
      time: "15:00",
      duration: "45 min",
      animal: "Oslo",
      owner: "Karim Benali",
      type: "Post-op orthopédie",
      reason: "Contrôle locomotion J+5",
      protocol: "Post-op orthopédie",
      status: "À surveiller",
      patientKey: "louis",
      note: "Silence au QCM J+5."
    }
  ];
  const patientContext = {
    camille: {
      name: "Nala · Claire Martin",
      animal: "Nala",
      owner: "Claire Martin",
      protocol: "J+1 · Post-stérilisation",
      status: "SIGNAL À ÉVALUER",
      last: "Appétit absent + plaie rouge · 09:16"
    },
    louis: {
      name: "Oslo · Karim Benali",
      animal: "Oslo",
      owner: "Karim Benali",
      protocol: "J+5 · Chirurgie orthopédique",
      status: "À SURVEILLER",
      last: "Silence depuis le QCM J+5"
    },
    amelie: {
      name: "Moka · Julie Petit",
      animal: "Moka",
      owner: "Julie Petit",
      protocol: "Suivi long · Diabète félin",
      status: "NORMAL",
      last: "Synthèse prête avant contrôle"
    },
    nora: {
      name: "Luna · Marc Delmas",
      animal: "Luna",
      owner: "Marc Delmas",
      protocol: "J+14 · Suivi vaccinal",
      status: "SUIVI TERMINÉ",
      last: "Avis possible, sans tri satisfaction"
    }
  };
  const animalHistoryContext = {
    camille: {
      summary: "Chatte européenne · 3 ans · propriétaire Claire Martin · WhatsApp préféré.",
      facts: ["Vaccins à jour", "Aucune allergie déclarée", "Digestion sensible", "Stress en caisse"],
      timeline: [
        ["Aujourd’hui", "Stérilisation, anesthésie OK, retour à domicile, collerette 10 jours."],
        ["16 sept.", "Consultation pré-opératoire, poids stable et consentement intervention validé."],
        ["Juillet", "Dermatite légère résolue après contrôle."],
        ["Mars", "Rappel vaccinal annuel réalisé."]
      ],
      care: "Claire répond vite sur WhatsApp et préfère des consignes courtes. Surveiller appétit, plaie, énergie et léchage."
    },
    louis: {
      summary: "Chien croisé · 7 ans · propriétaire Karim Benali · suivi post-opératoire renforcé.",
      facts: ["Repos strict", "Pansement à surveiller", "Tendance à forcer l’appui", "Contrôle locomotion prévu"],
      timeline: [
        ["J+5", "Silence depuis le QCM de suivi locomotion."],
        ["J0", "Chirurgie orthopédique, retour à domicile avec consignes de repos strict."],
        ["Avant-op", "Boiterie intermittente signalée par le propriétaire."],
        ["Historique", "Aucun antécédent allergique déclaré dans la démo."]
      ],
      care: "Karim préfère être appelé si le message est sensible. Ne proposer un rendez-vous qu’après validation de la clinique."
    },
    amelie: {
      summary: "Chat · 10 ans · propriétaire Julie Petit · suivi chronique au long cours.",
      facts: ["Traitement déclaré", "Poids à suivre", "Appétit variable", "Synthèse avant contrôle"],
      timeline: [
        ["Cette semaine", "Synthèse prête avant contrôle diabète félin."],
        ["J+7", "Bilan propriétaire : appétit, eau, comportement et prise du traitement."],
        ["Mois précédent", "Ajustement de suivi validé par l’équipe."],
        ["Historique", "Suivi régulier, propriétaire attentive aux changements."]
      ],
      care: "Ne jamais modifier un traitement via Numa. Remonter les réponses inhabituelles à l’équipe avant toute suite."
    },
    nora: {
      summary: "Chienne · 4 ans · propriétaire Marc Delmas · prévention et rappel vaccinal.",
      facts: ["Vaccination récente", "Suivi terminé", "Avis possible", "Pas de tri satisfaction"],
      timeline: [
        ["J+14", "Suivi vaccinal terminé, aucun signal déclaré."],
        ["J+1", "Point forme générale sans élément inquiétant."],
        ["J0", "Visite vaccinale et conseils pratiques validés."],
        ["Prochain rappel", "Relance douce prévue avant l’échéance annuelle."]
      ],
      care: "Demande d’avis uniquement si le suivi reste positif, toujours facultative et sans filtrage du propriétaire."
    }
  };
  const signatureProtocolCatalog = [
    {
      id: "post-sterilisation",
      name: "Post-stérilisation",
      badge: "Protocole existant · chirurgie courante",
      keywords: ["steril", "stéril", "collerette", "plaie", "suture", "ovariectomie", "castration", "retour a domicile", "retour à domicile"],
      reason: "La note parle de retour à domicile, collerette, plaie ou surveillance après intervention.",
      steps: [
        "J0 · message retour à domicile avec consignes validées",
        "J+1 · QCM appétit, énergie, plaie et comportement",
        "J+3 · rappel collerette / surveillance simple",
        "J+7 · clôture ou contrôle si l’équipe le valide"
      ]
    },
    {
      id: "post-op-orthopedie",
      name: "Post-op orthopédie",
      badge: "Protocole existant · locomotion",
      keywords: ["boiterie", "orthop", "lca", "ligament", "appui", "locomotion", "chirurgie", "pansement", "repos strict"],
      reason: "La note évoque une chirurgie, un appui, une boiterie ou une surveillance locomotrice.",
      steps: [
        "J0 · consignes repos, sorties courtes et surveillance pansement",
        "J+1 · QCM douleur apparente, appui, appétit, comportement",
        "J+5 · contrôle locomotion et silence propriétaire à surveiller",
        "J+10 · rappel contrôle / retrait points selon validation clinique"
      ]
    },
    {
      id: "rappel-vaccin",
      name: "Rappel vaccin",
      badge: "Protocole existant · prévention",
      keywords: ["vaccin", "vaccination", "rappel", "annuel", "protection", "vermifuge"],
      reason: "La note ressemble à un parcours de prévention ou rappel vaccinal.",
      steps: [
        "J0 · confirmation de visite et conseils pratiques validés",
        "J+1 · point court sur forme générale",
        "J-30 prochain rappel · message propriétaire",
        "J-7 / J-2 · relance douce si le rendez-vous n’est pas pris"
      ]
    },
    {
      id: "suivi-chronique",
      name: "Suivi chronique",
      badge: "Protocole existant · suivi long",
      keywords: ["chronique", "diabete", "diabète", "traitement", "poids", "appetit", "appétit", "eau", "boit", "prise", "cachet"],
      reason: "La note contient un suivi de traitement, d’appétit, d’eau, de poids ou d’évolution longue.",
      steps: [
        "J0 · rappel des consignes de suivi validées",
        "J+3 · QCM appétit, prise du traitement et comportement",
        "J+7 · synthèse équipe avant prochain contrôle",
        "Mensuel · point propriétaire sans conclusion clinique automatique"
      ]
    },
    {
      id: "consultation-simple",
      name: "Consultation simple avec suivi",
      badge: "Protocole existant · général",
      keywords: ["consultation", "controle", "contrôle", "surveiller", "recontacter", "suivi", "evolution", "évolution"],
      reason: "La note demande surtout une surveillance simple et une reprise humaine si l’évolution n’est pas claire.",
      steps: [
        "J0 · résumé simple de la visite et consignes validées",
        "J+2 · question courte sur l’évolution générale",
        "J+5 · relance si aucun retour propriétaire",
        "Suite · tâche clinique ou RDV uniquement après validation"
      ]
    }
  ];

  function normalizeRoute(value) {
    const route = (value || "").replace(/^#/, "").toLowerCase();
    return routes.includes(route) ? route : (legacyRoutes[route] || "vitrine");
  }

  function routeFromHash() {
    const route = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    if (routes.includes(route)) return route;
    return legacyRoutes[route] || null;
  }

  function landingSectionFromHash() {
    const section = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    return landingSectionIds.includes(section) ? section : null;
  }

  function landingScrollBehavior(shouldAnimate) {
    return "auto";
  }

  function setLandingSectionActive(sectionId) {
    landingSectionLinks.forEach((link) => {
      const isActive = link.dataset.landingSection === sectionId;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function revealLandingSection(sectionId, writeHistory, shouldAnimate) {
    const target = document.getElementById(sectionId);
    if (!target) return;
    setRoute("vitrine", false, false);
    setLandingSectionActive(sectionId);
    if (writeHistory && window.location.hash !== "#" + sectionId) {
      window.history.pushState({ route: "vitrine", section: sectionId }, "", "#" + sectionId);
      lastHandledHash = window.location.hash;
    }
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: landingScrollBehavior(shouldAnimate), block: "start" });
      target.focus({ preventScroll: true });
    });
  }

  function syncRouteFromLocation(shouldAnimate) {
    const currentHash = window.location.hash || "#vitrine";
    if (currentHash === lastHandledHash) return;
    lastHandledHash = currentHash;
    const section = landingSectionFromHash();
    if (section) {
      revealLandingSection(section, false, shouldAnimate);
      return;
    }
    setLandingSectionActive(null);
    setRoute(routeFromHash() || "vitrine", false, shouldAnimate);
  }

  function showToast(message) {
    if (!message || !toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3500);
  }

  function setAssistantOpen(isOpen) {
    if (!assistantPanel || !assistantToggle) return;
    assistantPanel.hidden = !isOpen;
    assistantToggle.setAttribute("aria-expanded", String(isOpen));
    assistantOpenButtons.forEach((button) => button.setAttribute("aria-expanded", String(isOpen)));
    if (isOpen) document.body.classList.remove("command-hidden");
    if (isOpen && assistantInput) {
      window.setTimeout(() => assistantInput.focus(), 120);
    }
  }

  function setCommandHidden(hidden) {
    const shouldHide = Boolean(hidden) && document.body.dataset.route !== "vitrine" && window.scrollY > 150 && (!assistantPanel || assistantPanel.hidden);
    document.body.classList.toggle("command-hidden", shouldHide);
  }

  function handleTopBarScroll() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    if (currentY < 140 || delta < -8) {
      setCommandHidden(false);
    } else if (delta > 10) {
      setCommandHidden(true);
    }
    lastScrollY = currentY;
    topBarTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (topBarTicking) return;
    topBarTicking = true;
    window.requestAnimationFrame(handleTopBarScroll);
  }, { passive: true });

  function updatePatientContext(key) {
    selectedPatientKey = patientContext[key] ? key : selectedPatientKey;
    const data = patientContext[selectedPatientKey] || patientContext.camille;
    selectedPatient = data.name;
    const name = document.getElementById("sidebar-patient-name");
    const protocol = document.getElementById("sidebar-patient-protocol");
    const status = document.getElementById("sidebar-patient-status");
    const last = document.getElementById("sidebar-patient-last");
    if (name) name.textContent = data.name;
    if (protocol) protocol.textContent = data.protocol;
    if (status) status.textContent = data.status;
    if (last) last.textContent = data.last;
    refreshSelectedAnimalUI(data);
  }

  function initialsForAnimal(animalName) {
    const clean = (animalName || "Animal").trim();
    return clean.slice(0, 2).toUpperCase();
  }

  function refreshSelectedAnimalUI(data) {
    const current = data || patientContext[selectedPatientKey] || patientContext.camille;
    const animalName = current.animal || "cet animal";
    const ownerName = current.owner || "son propriétaire";
    document.querySelectorAll("[data-selected-animal]").forEach((element) => {
      element.textContent = animalName;
    });
    const signatureTargetName = document.getElementById("signature-target-name");
    const signatureTargetCopy = document.getElementById("signature-target-copy");
    const signatureGenerate = document.getElementById("signature-generate");
    if (signatureTargetName) signatureTargetName.textContent = current.name || animalName + " · " + ownerName;
    if (signatureTargetCopy) signatureTargetCopy.textContent = (current.protocol || "Suivi post-visite") + " · propriétaire : " + ownerName + ".";
    if (signatureGenerate && !signatureGenerate.classList.contains("is-complete")) {
      signatureGenerate.innerHTML = "Préparer le suivi pour " + animalName + " <span aria-hidden=\"true\">✦</span>";
    }
    signatureLinks.forEach((button) => {
      if (button.id === "signature-generate") return;
      const compact = button.querySelector("small");
      if (compact) compact.textContent = "Clôturer la visite de " + animalName;
      if (!button.querySelector("strong")) {
        button.innerHTML = "Lancer Suivi Signature pour " + animalName + (button.classList.contains("button") ? " <span aria-hidden=\"true\">→</span>" : "");
      }
    });
    renderSignatureAnimalHistory(current);
  }

  function renderSignatureAnimalHistory(data) {
    const current = data || patientContext[selectedPatientKey] || patientContext.camille;
    const history = animalHistoryContext[selectedPatientKey] || {
      summary: (current.name || current.animal || "Animal") + " · dossier créé récemment · historique à compléter.",
      facts: ["Profil nouveau", "Antécédents à renseigner", "Consentement propriétaire à vérifier"],
      timeline: [
        ["Aujourd’hui", current.last || "Nouveau suivi créé dans Strivea Vet."],
        ["À compléter", "Ajoutez les consultations, actes, traitements ou documents utiles."]
      ],
      care: "Dossier encore incomplet : Numa doit rester prudente et demander validation humaine avant toute action sensible."
    };
    const animalName = current.animal || "cet animal";
    const title = document.getElementById("signature-history-title");
    const status = document.getElementById("signature-history-status");
    const summary = document.getElementById("signature-history-summary");
    const facts = document.getElementById("signature-history-facts");
    const list = document.getElementById("signature-history-list");
    const care = document.getElementById("signature-history-care");
    const hiddenNote = document.getElementById("signature-note");
    if (title) title.textContent = "Antécédents de " + animalName;
    if (status) {
      status.textContent = current.status || "À relire";
      status.className = "tag " + appointmentStatusClass(current.status || "");
    }
    if (summary) summary.textContent = history.summary;
    if (facts) {
      facts.replaceChildren();
      history.facts.forEach((fact) => {
        const chip = document.createElement("span");
        chip.textContent = fact;
        facts.appendChild(chip);
      });
    }
    if (list) {
      list.replaceChildren();
      history.timeline.forEach(([date, event]) => {
        const item = document.createElement("article");
        const strong = document.createElement("strong");
        const paragraph = document.createElement("p");
        strong.textContent = date;
        paragraph.textContent = event;
        item.append(strong, paragraph);
        list.appendChild(item);
      });
    }
    if (care) {
      care.replaceChildren();
      const strong = document.createElement("strong");
      const paragraph = document.createElement("p");
      strong.textContent = "À garder en tête";
      paragraph.textContent = history.care;
      care.append(strong, paragraph);
    }
    if (hiddenNote && !signatureFollowupGenerated) {
      hiddenNote.value = [
        current.name || animalName,
        current.protocol || "Suivi post-visite",
        current.last || "",
        history.summary,
        "Antécédents : " + history.timeline.map(([date, event]) => date + " — " + event).join(" / "),
        "Points de vigilance : " + history.care
      ].filter(Boolean).join(". ");
    }
  }

  function appointmentStatusClass(status) {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("signal") || normalized.includes("urgence")) return "tag-amber";
    if (normalized.includes("surveiller")) return "tag-sand";
    return "tag-sage";
  }

  function sortedAppointments() {
    return appointments.slice().sort((a, b) => {
      const dayDiff = Number(a.day || 5) - Number(b.day || 5);
      if (dayDiff) return dayDiff;
      return (a.time || "").localeCompare(b.time || "");
    });
  }

  function minutesFromTime(time) {
    const parts = String(time || "10:00").split(":").map(Number);
    return (parts[0] || 10) * 60 + (parts[1] || 0);
  }

  function durationMinutes(duration) {
    const match = String(duration || "30").match(/\d+/);
    return match ? Number(match[0]) : 30;
  }

  function openAppointment(appointment) {
    if (!appointment) return;
    if (appointment.patientKey && patientContext[appointment.patientKey]) {
      updatePatientContext(appointment.patientKey);
    }
    showToast("Rendez-vous ouvert : " + appointment.time + " · " + appointment.animal + ".");
    setRoute("messages", true);
  }

  function createAppointmentRow(appointment, compact) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = compact ? "today-agenda-item" : "agenda-event-card";
    button.addEventListener("click", () => openAppointment(appointment));

    const time = document.createElement("span");
    time.className = "agenda-event-time";
    time.textContent = appointment.time;

    const content = document.createElement("span");
    content.className = "agenda-event-copy";
    const title = document.createElement("strong");
    title.textContent = appointment.animal + " · " + appointment.owner;
    const detail = document.createElement("small");
    detail.textContent = appointment.type + " · " + appointment.reason;
    content.append(title, detail);

    const tag = document.createElement("span");
    tag.className = "tag " + appointmentStatusClass(appointment.status);
    tag.textContent = appointment.status;

    button.append(time, content, tag);
    return button;
  }

  function createCalendarEvent(appointment) {
    const event = document.createElement("button");
    event.type = "button";
    event.className = "calendar-event";
    event.addEventListener("click", () => openAppointment(appointment));

    const day = Math.max(0, Math.min(6, Number(appointment.day ?? 5)));
    const start = 8 * 60;
    const end = 21 * 60;
    const minute = minutesFromTime(appointment.time);
    const top = Math.max(0, Math.min(96, ((minute - start) / (end - start)) * 100));
    const height = Math.max(5.5, (durationMinutes(appointment.duration) / (end - start)) * 100);
    event.style.left = "calc(" + (day * (100 / 7)) + "% + 6px)";
    event.style.top = top + "%";
    event.style.width = "calc(" + (100 / 7) + "% - 12px)";
    event.style.height = height + "%";

    const time = document.createElement("span");
    time.textContent = appointment.time;
    const title = document.createElement("strong");
    title.textContent = appointment.animal;
    const small = document.createElement("small");
    small.textContent = appointment.type + " · " + appointment.owner;
    event.append(time, title, small);
    return event;
  }

  function renderAppointments() {
    const items = sortedAppointments();
    if (agendaDayList) {
      agendaDayList.replaceChildren();
      items.forEach((appointment) => agendaDayList.appendChild(createAppointmentRow(appointment, false)));
    }
    const todayItems = items.filter((appointment) => Number(appointment.day ?? 5) === 5);
    if (todayAgendaList) {
      todayAgendaList.replaceChildren();
      todayItems.slice(0, 5).forEach((appointment) => todayAgendaList.appendChild(createAppointmentRow(appointment, true)));
    }
    if (calendarEventsLayer) {
      calendarEventsLayer.replaceChildren();
      items.forEach((appointment) => calendarEventsLayer.appendChild(createCalendarEvent(appointment)));
    }
    const count = document.getElementById("agenda-count");
    const navCount = document.getElementById("agenda-nav-count");
    const todayCount = document.getElementById("today-agenda-count");
    if (count) count.textContent = String(items.length);
    if (navCount) navCount.textContent = String(items.length);
    if (todayCount) todayCount.textContent = String(todayItems.length);
    const next = todayItems[0] || items[0];
    const nextSlot = document.getElementById("agenda-next-slot");
    const nextCopy = document.getElementById("agenda-next-copy");
    if (nextSlot && next) nextSlot.textContent = next.time + " · " + next.animal;
    if (nextCopy && next) nextCopy.textContent = next.type + " · " + next.protocol + ".";
  }

  function supportedAgendaFile(file) {
    if (!file) return false;
    const name = file.name || "";
    return file.type.startsWith("image/") || file.type === "application/pdf" || /\.(png|jpe?g|webp|gif|bmp|pdf)$/i.test(name);
  }

  function demoDetectedAppointmentsFromScreenshot(file) {
    const source = (file?.name || "capture agenda").replace(/\.[^.]+$/, "");
    const stamp = Date.now();
    return [
      {
        id: "import-luna-" + stamp,
        day: 5,
        time: "08:45",
        duration: "30 min",
        animal: "Luna",
        owner: "Marc Delmas",
        type: "Vaccin",
        reason: "Rappel vaccinal annuel détecté depuis " + source,
        protocol: "Rappel vaccin",
        status: "Import à valider",
        note: "Créé depuis une capture d’écran. À vérifier avant synchronisation réelle."
      },
      {
        id: "import-rio-" + stamp,
        day: 5,
        time: "11:15",
        duration: "30 min",
        animal: "Rio",
        owner: "Manon Petit",
        type: "Consultation",
        reason: "Contrôle boiterie détecté sur le planning importé",
        protocol: "J0 · retour consultation",
        status: "Import à valider",
        note: "Le motif doit être confirmé par l’équipe."
      },
      {
        id: "import-taho-" + stamp,
        day: 5,
        time: "17:30",
        duration: "45 min",
        animal: "Taho",
        owner: "Élise Morel",
        type: "Contrôle post-visite",
        reason: "Contrôle post-opératoire détecté sur la capture",
        protocol: "Post-op orthopédie",
        status: "Import à valider",
        note: "Associer un protocole Numa avant envoi propriétaire."
      }
    ];
  }

  function renderAgendaDetectedAppointments() {
    if (!agendaDetectedList) return;
    agendaDetectedList.replaceChildren();
    agendaDetectedList.hidden = pendingAgendaScreenshotAppointments.length === 0;
    if (agendaImportApply) agendaImportApply.disabled = pendingAgendaScreenshotAppointments.length === 0;
    if (!pendingAgendaScreenshotAppointments.length) return;

    const intro = document.createElement("p");
    intro.className = "agenda-detected-intro";
    intro.innerHTML = "<strong>" + pendingAgendaScreenshotAppointments.length + " rendez-vous détectés en démo.</strong><span>Vérifiez-les puis ajoutez-les au calendrier Strivea Vet.</span>";
    agendaDetectedList.appendChild(intro);

    pendingAgendaScreenshotAppointments.forEach((appointment) => {
      const item = document.createElement("article");
      item.className = "agenda-detected-item";
      const time = document.createElement("span");
      time.className = "agenda-event-time";
      time.textContent = appointment.time;
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = appointment.animal + " · " + appointment.owner;
      const detail = document.createElement("small");
      detail.textContent = appointment.type + " · " + appointment.reason;
      copy.append(title, detail);
      const tag = document.createElement("span");
      tag.className = "tag tag-sand";
      tag.textContent = "À valider";
      item.append(time, copy, tag);
      agendaDetectedList.appendChild(item);
    });
  }

  function clearAgendaImport() {
    pendingAgendaScreenshotAppointments = [];
    if (agendaImportPreview) {
      agendaImportPreview.replaceChildren();
      agendaImportPreview.hidden = true;
    }
    if (agendaScreenshotInput) agendaScreenshotInput.value = "";
    renderAgendaDetectedAppointments();
  }

  function handleAgendaScreenshotFile(file) {
    if (!file) return;
    if (!supportedAgendaFile(file)) {
      showToast("Format non accepté : ajoutez une image ou un PDF.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast("Capture trop lourde : restez sous 12 Mo pour cette démo.");
      return;
    }

    pendingAgendaScreenshotAppointments = demoDetectedAppointmentsFromScreenshot(file);
    if (agendaImportPreview) {
      agendaImportPreview.replaceChildren();
      agendaImportPreview.hidden = false;
      const meta = document.createElement("div");
      meta.className = "agenda-import-meta";
      meta.innerHTML = "<strong></strong><small></small>";
      meta.querySelector("strong").textContent = file.name || "Capture importée";
      meta.querySelector("small").textContent = "Analyse IA simulée · " + Math.max(1, Math.round(file.size / 1024)) + " Ko";
      if (file.type.startsWith("image/")) {
        const image = document.createElement("img");
        image.alt = "Aperçu de la capture d’agenda importée";
        image.src = URL.createObjectURL(file);
        image.addEventListener("load", () => URL.revokeObjectURL(image.src), { once: true });
        agendaImportPreview.append(image, meta);
      } else {
        const icon = document.createElement("span");
        icon.className = "agenda-import-pdf";
        icon.textContent = "PDF";
        agendaImportPreview.append(icon, meta);
      }
    }
    renderAgendaDetectedAppointments();
    showToast("Capture analysée en démo : vérifiez les rendez-vous détectés.");
  }

  function importDetectedAgendaAppointments() {
    if (!pendingAgendaScreenshotAppointments.length) {
      showToast("Ajoutez d’abord une capture d’écran à analyser.");
      return;
    }
    pendingAgendaScreenshotAppointments.forEach((appointment) => {
      const patientKey = ensurePatientFromAppointment(appointment.animal, appointment.owner, appointment.protocol, "RDV PLANIFIÉ");
      appointments.push({
        ...appointment,
        id: appointment.id + "-added",
        status: appointment.type.toLowerCase().includes("urgence") ? "Signal à évaluer" : "RDV importé",
        patientKey
      });
    });
    renderAppointments();
    refreshAgendaPatientOptions();
    const importedCount = pendingAgendaScreenshotAppointments.length;
    clearAgendaImport();
    showToast(importedCount + " rendez-vous ajoutés au calendrier depuis la capture.");
  }

  function addGoogleCalendarDemoAppointments() {
    const googleItems = [
      {
        id: "google-calendar-milo-1200",
        day: 5,
        time: "12:00",
        duration: "30 min",
        animal: "Milo",
        owner: "Sarah Cohen",
        type: "Consultation",
        reason: "Créneau synchronisé depuis Google Calendar",
        protocol: "J0 · retour consultation",
        status: "Google Calendar",
        note: "Événement importé depuis le connecteur Google Calendar en démo."
      },
      {
        id: "google-calendar-nina-1845",
        day: 5,
        time: "18:45",
        duration: "30 min",
        animal: "Nina",
        owner: "Paul Garnier",
        type: "Contrôle post-visite",
        reason: "Contrôle synchronisé depuis l’agenda externe",
        protocol: "Post-stérilisation",
        status: "Google Calendar",
        note: "À relier au protocole Numa si la clinique le valide."
      }
    ];
    let added = 0;
    googleItems.forEach((appointment) => {
      if (appointments.some((item) => item.id === appointment.id)) return;
      const patientKey = ensurePatientFromAppointment(appointment.animal, appointment.owner, appointment.protocol, "RDV GOOGLE");
      appointments.push({...appointment, patientKey});
      added += 1;
    });
    renderAppointments();
    refreshAgendaPatientOptions();
    return added;
  }

  function preferredTheme() {
    try {
      const stored = window.localStorage.getItem("strivea-theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (error) {
      // Fall back to the system preference if browser storage is unavailable.
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  const themeCycle = ["light", "dark"];
  const themeChoiceLabels = {
    light: "Clair",
    dark: "Sombre",
    system: "Système"
  };
  const themeChoiceIcons = {
    light: "☀",
    dark: "☾",
    system: "◌"
  };

  function normalizeThemeChoice(choice) {
    return choice === "dark" ? "dark" : "light";
  }

  function resolvedTheme(choice) {
    return choice === "dark" ? "dark" : "light";
  }

  function resolvedThemeVariant(choice) {
    return "standard";
  }

  function nextThemeChoice() {
    const currentPreference = document.documentElement.dataset.themePreference || preferredTheme();
    const currentChoice = themeCycle.includes(currentPreference)
      ? currentPreference
      : document.documentElement.dataset.theme === "dark"
        ? "dark"
        : "light";
    const currentIndex = themeCycle.indexOf(currentChoice);
    return themeCycle[(currentIndex + 1) % themeCycle.length];
  }

  function applyTheme(choice, persist) {
    const selectedChoice = normalizeThemeChoice(choice);
    const activeTheme = resolvedTheme(selectedChoice);
    const activeVariant = resolvedThemeVariant(selectedChoice);
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.dataset.themePreference = selectedChoice;
    document.documentElement.dataset.themeVariant = activeVariant;
    if (themeColor) {
      const colors = {
        light: "#F6F5F0",
        dark: "#0B0D0E"
      };
      themeColor.setAttribute("content", colors[activeTheme] || colors.light);
    }
    themeQuickButtons.forEach((button) => {
      const nextChoice = themeCycle[(themeCycle.indexOf(themeCycle.includes(selectedChoice) ? selectedChoice : activeTheme) + 1) % themeCycle.length];
      button.dataset.themeQuickBound = "true";
      button.classList.toggle("is-dark", activeTheme === "dark");
      button.classList.remove("is-white", "is-black");
      button.textContent = themeChoiceIcons[selectedChoice] || themeChoiceIcons.light;
      button.setAttribute("aria-label", `Thème ${themeChoiceLabels[selectedChoice]} actif. Passer au mode ${themeChoiceLabels[nextChoice]}.`);
      button.setAttribute("title", `Thème ${themeChoiceLabels[selectedChoice]} · prochain : ${themeChoiceLabels[nextChoice]}`);
    });
    themeChoices.forEach((button) => {
      const isActive = button.dataset.themeChoice === selectedChoice;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    if (themeStatus) {
      const labels = {
        light: "Mode clair actif.",
        dark: "Mode sombre actif."
      };
      themeStatus.textContent = labels[selectedChoice];
    }
    if (persist) {
      try {
        window.localStorage.setItem("strivea-theme", selectedChoice);
      } catch (error) {
        // The visual preference still applies if browser storage is unavailable.
      }
    }
  }

  function setProfileTab(name) {
    const tab = name === "appearance" ? "appearance" : "overview";
    profileTabs.forEach((button) => {
      const isActive = button.dataset.profileTab === tab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    profilePanels.forEach((panel) => {
      const isActive = panel.id === "profile-" + tab;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
    });
  }

  function setRoute(route, writeHistory, shouldScroll) {
    const nextRoute = normalizeRoute(route);
    const currentRoute = document.body.dataset.route || null;
    const routeChanged = currentRoute !== nextRoute;
    const isLanding = nextRoute === "vitrine";
    const isLogin = nextRoute === "login";
    document.body.dataset.route = nextRoute;
    document.body.classList.remove("command-hidden");
    lastScrollY = window.scrollY;
    landing.hidden = !isLanding;
    if (loginView) loginView.hidden = !isLogin;
    workspace.hidden = isLanding || isLogin;
    if (assistantWidget) {
      assistantWidget.hidden = isLanding || isLogin;
      if (isLanding || isLogin) setAssistantOpen(false);
    }
    appViews.forEach((view) => {
      view.classList.toggle("active", view.id === "view-" + nextRoute);
    });
    routeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.route === nextRoute);
      if (button.dataset.route === nextRoute) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (!isLanding) setLandingSectionActive(null);
    if (mobileRoute) mobileRoute.textContent = routeNames[nextRoute];
    document.title = isLanding ? "Strivea Vet — suivi post-consultation" : routeNames[nextRoute] + " — Strivea Vet";
    if (writeHistory && window.location.hash !== "#" + nextRoute) {
      window.history.pushState({ route: nextRoute }, "", "#" + nextRoute);
      lastHandledHash = window.location.hash;
    }
    if (shouldScroll !== false && routeChanged) window.scrollTo({ top: 0, behavior: "auto" });
  }

  routeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const route = button.dataset.route;
      if (!route) return;
      event.preventDefault();
      setRoute(route, true);
    });
  });

  function enterStriveaDemo() {
    showToast("Accès démo ouvert. Bienvenue dans Strivea Vet.");
    setRoute("today", true);
  }

  enterStriveaButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      enterStriveaDemo();
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      enterStriveaDemo();
    });
  }

  landingSectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const section = link.dataset.landingSection;
      if (!section) return;
      event.preventDefault();
      revealLandingSection(section, true, true);
    });
  });

  window.addEventListener("popstate", () => {
    syncRouteFromLocation(false);
  });
  window.addEventListener("hashchange", () => {
    syncRouteFromLocation(false);
  });

  function safeUrl(value, fallback) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function updateLink(inputId, previewId, fallback, labelInputId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const labelInput = labelInputId ? document.getElementById(labelInputId) : null;
    if (!input || !preview) return;
    const sync = () => {
      preview.href = safeUrl(input.value, fallback);
      const labelTarget = preview.querySelector("[data-link-label]");
      if (labelTarget && labelInput) {
        labelTarget.textContent = labelInput.value.trim() || labelTarget.dataset.default || "Ouvrir le lien";
      }
    };
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    if (labelInput) {
      labelInput.addEventListener("input", sync);
      labelInput.addEventListener("change", sync);
    }
    sync();
  }

  updateLink("doctolib-link", "doctolib-preview", "https://www.doctolib.fr/", "doctolib-label");
  updateLink("google-review-link", "google-review-preview", "https://g.page/r/CliniqueLaurentVetDemo/review", "google-review-label");
  updateLink("strivea-link", "strivea-preview", "https://strivea.demo/suivi/camille");

  const doctolibInput = document.getElementById("doctolib-link");
  const doctolibButton = document.getElementById("open-doctolib");
  if (doctolibButton && doctolibInput) {
    doctolibButton.addEventListener("click", () => {
      window.open(safeUrl(doctolibInput.value, "https://www.doctolib.fr/"), "_blank", "noopener,noreferrer");
    });
  }
  const googleReviewInput = document.getElementById("google-review-link");
  const googleReviewButton = document.getElementById("open-google-review");
  if (googleReviewButton && googleReviewInput) {
    googleReviewButton.addEventListener("click", () => {
      window.open(safeUrl(googleReviewInput.value, "https://g.page/r/CliniqueLaurentVetDemo/review"), "_blank", "noopener,noreferrer");
    });
  }

  const doctolibTabs = Array.from(document.querySelectorAll("[data-doctolib-tab]"));
  const doctolibPanels = Array.from(document.querySelectorAll("[data-doctolib-panel]"));
  function setDoctolibTab(tabName) {
    const nextTab = tabName === "avis" ? "avis" : "rdv";
    doctolibTabs.forEach((button) => {
      const isActive = button.dataset.doctolibTab === nextTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });
    doctolibPanels.forEach((panel) => {
      const isActive = panel.dataset.doctolibPanel === nextTab;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
    });
  }
  doctolibTabs.forEach((button) => {
    button.addEventListener("click", () => setDoctolibTab(button.dataset.doctolibTab));
  });
  if (doctolibTabs.length) setDoctolibTab("rdv");

  function appendMessage(kind, text, sender) {
    const thread = document.getElementById("chat-thread");
    if (!thread) return;
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message " + kind;
    if (sender) {
      const senderLine = document.createElement("span");
      senderLine.className = "message-sender";
      senderLine.textContent = sender;
      wrapper.appendChild(senderLine);
    }
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    const time = document.createElement("time");
    time.textContent = "démo";
    wrapper.append(paragraph, time);
    thread.appendChild(wrapper);
    thread.scrollTop = thread.scrollHeight;
  }

  function setConsultationPriority(isActive) {
    consultationPriorityActive = Boolean(isActive);
    document.querySelectorAll("[data-consultation-alert]").forEach((element) => {
      element.classList.toggle("is-active", consultationPriorityActive);
      element.hidden = !consultationPriorityActive;
    });
    const count = document.getElementById("consultation-priority-count");
    if (count) count.textContent = consultationPriorityActive ? "1" : "0";
  }

  function markConsultationComplete() {
    const button = document.getElementById("consultation-complete");
    const status = document.getElementById("consultation-complete-status");
    if (!button || button.dataset.done === "true") return;
    button.dataset.done = "true";
    button.classList.add("is-complete");
    button.disabled = true;
    button.innerHTML = "Retour à domicile confirmé <span aria-hidden=\"true\">✓</span>";
    if (status) status.textContent = "Confirmation ajoutée au suivi de Nala dans cette démonstration.";
    appendMessage("patient", "Depuis l’espace Strivea Vet : le retour à domicile de Nala est confirmé.", "Confirmation propriétaire · démo");
    showToast("Confirmation de retour à domicile ajoutée au suivi.");
  }

  function cloneSignatureProtocol(protocol) {
    return protocol ? {...protocol, steps: [...protocol.steps]} : null;
  }

  function suggestSignatureProtocol(note) {
    const current = patientContext[selectedPatientKey] || patientContext.camille;
    const source = plainText([note, current.protocol, current.status, current.last].filter(Boolean).join(" "));
    let best = signatureProtocolCatalog[signatureProtocolCatalog.length - 1];
    let bestScore = -1;
    signatureProtocolCatalog.forEach((protocol) => {
      const score = protocol.keywords.reduce((total, keyword) => total + (source.includes(plainText(keyword)) ? 1 : 0), 0);
      if (score > bestScore) {
        best = protocol;
        bestScore = score;
      }
    });
    const confidence = Math.max(62, Math.min(94, 66 + bestScore * 7));
    return {...cloneSignatureProtocol(best), confidence};
  }

  function dayFromSignatureStep(step, index) {
    const normalized = plainText(step || "");
    const explicitDay = normalized.match(/j\+?(\d+)/);
    if (/^j0/.test(normalized)) return 0;
    if (explicitDay) return Number(explicitDay[1]);
    if (/mensuel|mois/.test(normalized)) return 30;
    if (/rappel.*annuel|j-30|prochain rappel/.test(normalized)) return 300;
    if (/rdv|rendez|controle|cloture|clôture|suite/.test(normalized)) return 7;
    return [0, 1, 3, 7, 14][index] || Math.min(30, index * 3);
  }

  function kindFromSignatureStep(step) {
    const normalized = plainText(step || "");
    if (/avis|google/.test(normalized)) return "Avis Google";
    if (/qcm|question/.test(normalized)) return "Questionnaire";
    if (/rdv|rendez|controle/.test(normalized)) return "Rappel de rendez-vous";
    if (/rappel|collerette|repos|soins/.test(normalized)) return "Rappel de soins";
    if (/consigne|retour|domicile/.test(normalized)) return "Consignes de convalescence";
    return "Message personnalisé";
  }

  function titleFromSignatureStep(step, index) {
    const text = String(step || "").trim();
    const parts = text.split("·").map((part) => part.trim()).filter(Boolean);
    return parts.length > 1 ? parts.slice(1).join(" · ") : (parts[0] || "Étape " + (index + 1));
  }

  function signatureProtocolToStoredModel(protocol, options = {}) {
    const current = patientContext[selectedPatientKey] || patientContext.camille;
    const animalName = current.animal || "[Nom animal]";
    const ownerName = current.owner || "le propriétaire";
    const fallbackSteps = [
      "J0 · message propriétaire selon les consignes validées",
      "J+1 · QCM court sur l’évolution générale",
      "J+3 · relance ou tâche équipe si un doute remonte",
      "J+7 · clôture ou rendez-vous uniquement après validation clinique"
    ];
    const steps = (Array.isArray(protocol?.steps) && protocol.steps.length ? protocol.steps : fallbackSteps).map((step, index) => {
      const cleanStep = String(step || fallbackSteps[index] || "").trim();
      const message = cleanStep
        .replaceAll(animalName, "[Nom animal]")
        .replaceAll(ownerName, "[Prénom]")
        .replace(/\s+/g, " ");
      return {
        day: dayFromSignatureStep(cleanStep, index),
        time: index === 0 ? "18:00" : "10:00",
        kind: kindFromSignatureStep(cleanStep),
        channel: "WhatsApp",
        title: titleFromSignatureStep(cleanStep, index),
        message: message + " — Message à relire par la clinique avant activation.",
        link: "",
        documents: []
      };
    });
    return {
      name: options.name || protocol?.name || "Protocole créé avec Numa",
      description: options.description || protocol?.reason || "Protocole créé localement depuis Suivi Signature. À relire et valider par le vétérinaire.",
      documents: [],
      steps
    };
  }

  function defaultStoredProtocolModels() {
    return signatureProtocolCatalog.map((protocol) => signatureProtocolToStoredModel(protocol, {
      name: protocol.name,
      description: protocol.reason
    }));
  }

  function loadStoredProtocolModels() {
    const key = "strivea-vet-protocol-models-v1";
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return defaultStoredProtocolModels();
  }

  function saveSignatureProtocolToLibrary(protocol, instruction) {
    const key = "strivea-vet-protocol-models-v1";
    const current = patientContext[selectedPatientKey] || patientContext.camille;
    const animalName = current.animal || "patient";
    const baseName = String(protocol?.name || "Protocole").replace(/\s·\s(ajusté|personnalisé).*$/i, "");
    const registry = window.StriveaProtocolModels;
    const models = registry?.listModels ? registry.listModels() : loadStoredProtocolModels();
    const existingNames = new Set(models.map((model) => model.name));
    let name = "Suivi personnalisé · " + animalName + " · " + baseName;
    let index = 2;
    while (existingNames.has(name)) {
      name = "Suivi personnalisé · " + animalName + " · " + baseName + " (" + index + ")";
      index += 1;
    }
    const model = signatureProtocolToStoredModel(protocol, {
      name,
      description: "Créé avec Numa depuis Suivi Signature. Demande vétérinaire : " + (instruction || "adapter ce protocole à ce patient") + "."
    });
    if (registry?.addModel) {
      return registry.addModel(model) || model;
    }
    try {
      models.push(model);
      localStorage.setItem(key, JSON.stringify(models));
      window.dispatchEvent(new CustomEvent("strivea:protocol-models-updated", {detail: {name: model.name}}));
      return model;
    } catch {
      return null;
    }
  }

  function renderSignatureProtocol(protocol, options = {}) {
    if (!protocol) return;
    signatureCurrentProtocol = cloneSignatureProtocol(protocol);
    signatureCurrentProtocol.confidence = protocol.confidence || signatureCurrentProtocol.confidence || 78;
    const match = document.getElementById("signature-protocol-match");
    const card = document.getElementById("signature-protocol-card");
    const name = document.getElementById("signature-protocol-name");
    const reason = document.getElementById("signature-protocol-reason");
    const steps = document.getElementById("signature-protocol-steps");
    const status = document.getElementById("signature-protocol-status");
    if (match) {
      match.textContent = options.accepted ? "Accepté" : "Correspondance " + signatureCurrentProtocol.confidence + "%";
      match.classList.toggle("tag-sage", Boolean(options.accepted));
      match.classList.toggle("tag-sand", !options.accepted);
    }
    if (card) card.classList.toggle("is-accepted", Boolean(options.accepted));
    if (name) name.textContent = signatureCurrentProtocol.name;
    if (reason) reason.textContent = (options.reason || signatureCurrentProtocol.reason) + " " + signatureCurrentProtocol.badge + ".";
    if (steps) {
      steps.replaceChildren();
      signatureCurrentProtocol.steps.forEach((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        steps.appendChild(item);
      });
    }
    if (status) status.textContent = options.accepted
      ? "Protocole accepté par la clinique. Numa peut préparer les messages, toujours en brouillon."
      : options.savedNew
        ? "Nouveau protocole enregistré dans la bibliothèque locale. Il reste à valider avant lancement."
        : "Base issue de la bibliothèque locale : acceptez-la, modifiez-la par discussion ou demandez à Numa de créer un nouveau protocole.";
    updateSignaturePreviewFromProtocol(signatureCurrentProtocol, options.accepted);
  }

  function updateSignaturePreviewFromProtocol(protocol, accepted) {
    const preview = document.getElementById("signature-preview");
    if (!preview || !protocol) return;
    const current = patientContext[selectedPatientKey] || patientContext.camille;
    const animalName = current.animal || "l’animal";
    const ownerName = current.owner || "le propriétaire";
    const title = preview.querySelector(".signature-preview-head strong");
    if (title) title.textContent = accepted ? "Suivi validé pour " + animalName : "Suivi illustré pour " + animalName;
    const cards = Array.from(preview.querySelectorAll(".signature-preview-grid article"));
    const generatedSteps = [
      ["Situation de " + animalName, protocol.reason || current.last || "Synthèse de la visite à relire par la clinique."],
      ["Protocole patient", protocol.name + " · préparé pour " + ownerName + "."],
      ["Ce que reçoit le propriétaire", protocol.steps[0] || "Message de retour à domicile selon protocole."],
      ["Points à surveiller", protocol.steps.slice(1).join(" · ") || "Validation humaine avant toute suite sensible."]
    ];
    cards.forEach((card, index) => {
      const strong = card.querySelector("strong");
      const small = card.querySelector("small");
      if (generatedSteps[index]) {
        if (strong) strong.textContent = generatedSteps[index][0];
        if (small) small.textContent = generatedSteps[index][1];
      }
    });
    preview.classList.add("is-ready");
  }

  function appendSignatureAiMessage(role, message) {
    const thread = document.getElementById("signature-ai-thread");
    if (!thread || !message) return;
    const bubble = document.createElement("div");
    bubble.className = "signature-ai-message " + role;
    const author = document.createElement("strong");
    author.textContent = role === "user" ? "Vétérinaire" : "Numa";
    const copy = document.createElement("p");
    copy.textContent = message;
    bubble.append(author, copy);
    thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
  }

  function modifySignatureProtocolWithAi(instruction) {
    const current = patientContext[selectedPatientKey] || patientContext.camille;
    const noteInput = document.getElementById("signature-note");
    const note = noteInput?.value?.trim() || "";
    const base = cloneSignatureProtocol(signatureCurrentProtocol || suggestSignatureProtocol(note));
    if (!base) return;
    const command = plainText(instruction);
    const wantsNewProtocol = /(\bnn+\b|\bnon\b|pas ca|ps ca|pas celui|pas ce protocole|autre protocole|nouveau protocole|creer.*protocole|cree.*protocole|créer.*protocole|enregistre.*protocole|sauvegarde.*protocole|dans la base|base des protocoles)/.test(command);
    base.name = base.name.includes("ajusté") ? base.name : base.name + " · ajusté";
    base.confidence = Math.min(96, Number(base.confidence || 78) + 2);
    if (/(vaccin|rappel annuel|vaccination)/.test(command)) {
      Object.assign(base, cloneSignatureProtocol(signatureProtocolCatalog.find((protocol) => protocol.id === "rappel-vaccin")));
      base.name += " · ajusté";
    } else if (/(boiterie|appui|orthop|pansement|repos)/.test(command)) {
      Object.assign(base, cloneSignatureProtocol(signatureProtocolCatalog.find((protocol) => protocol.id === "post-op-orthopedie")));
      base.name += " · ajusté";
    } else if (/(chronique|diab|traitement|poids|eau)/.test(command)) {
      Object.assign(base, cloneSignatureProtocol(signatureProtocolCatalog.find((protocol) => protocol.id === "suivi-chronique")));
      base.name += " · ajusté";
    }
    if (/(j\+?3|3 jours|trois jours)/.test(command) && !base.steps.some((step) => /J\+3/.test(step))) {
      base.steps.splice(Math.min(2, base.steps.length), 0, "J+3 · relance courte pour vérifier appétit, énergie et inquiétude propriétaire");
    }
    if (/(qcm.*court|plus court|simple|rapide)/.test(command)) {
      base.steps[1] = "J+1 · QCM très court : appétit, énergie, inquiétude, besoin d’un rappel";
    }
    if (/(rdv|rendez|controle|contrôle|lien)/.test(command)) {
      base.steps.push("RDV · lien préparé uniquement après validation humaine de la clinique");
    }
    if (/(appel|rappel|telephon|téléphon)/.test(command)) {
      base.steps.push("Tâche équipe · rappel propriétaire à organiser avant toute réponse sensible");
    }
    if (/(avis|google)/.test(command)) {
      base.steps.push("Clôture positive · avis Google facultatif, jamais si l’animal va moins bien");
    }
    if (!/(j\+?3|3 jours|trois jours|qcm|court|simple|rdv|rendez|controle|contrôle|lien|appel|rappel|avis|google|vaccin|boiterie|appui|orthop|chronique|diab|traitement|poids|eau)/.test(command)) {
      base.steps.push("Consigne clinique · " + instruction.slice(0, 120));
    }
    signatureProtocolAccepted = false;
    if (wantsNewProtocol) {
      base.name = base.name.replace(/\s·\sajusté$/i, "") + " · personnalisé";
      base.badge = "Nouveau protocole local · créé avec Numa";
      base.reason = "Créé depuis les consignes du vétérinaire pour " + (current.animal || "cet animal") + ". À relire avant toute activation.";
      if (!base.steps.some((step) => /Validation clinique|validation humaine/i.test(step))) {
        base.steps.push("Validation clinique · relire ce nouveau protocole avant tout message propriétaire");
      }
      const savedModel = saveSignatureProtocolToLibrary(base, instruction);
      renderSignatureProtocol(base, {
        reason: savedModel
          ? "Nouveau protocole ajouté à la bibliothèque locale : « " + savedModel.name + " »."
          : "Nouveau protocole préparé, mais l’enregistrement local n’a pas abouti.",
        savedNew: Boolean(savedModel)
      });
      appendSignatureAiMessage(
        "assistant",
        savedModel
          ? "D’accord, je n’utilise pas cette proposition telle quelle. J’ai créé « " + savedModel.name + " » dans la bibliothèque locale des protocoles. Vous pouvez encore me demander de le modifier ici avant de valider le suivi."
          : "J’ai préparé un nouveau protocole, mais le stockage local du navigateur n’a pas permis de l’enregistrer. Gardez cette page ouverte ou réessayez."
      );
      showToast(savedModel ? "Nouveau protocole enregistré dans la bibliothèque." : "Protocole préparé, enregistrement local impossible.");
      return;
    }
    renderSignatureProtocol(base, {reason: "Modifié avec Numa selon votre demande pour " + (current.animal || "cet animal") + "."});
    appendSignatureAiMessage("assistant", "J’ai ajusté le protocole depuis votre bibliothèque. Vérifiez les étapes puis cliquez sur “Valider et lancer le suivi” si cela correspond à la suite voulue.");
    showToast("Protocole modifié en brouillon avec Numa.");
  }

  function handleSignatureConversationInstruction(instruction) {
    const noteInput = document.getElementById("signature-note");
    const cleanInstruction = (instruction || "").trim();
    if (!cleanInstruction) return;
    if (!signatureFollowupGenerated && !signatureCurrentProtocol) {
      if (noteInput) noteInput.value = cleanInstruction;
      launchSignatureFollowup();
      showToast("Numa a préparé le suivi depuis votre échange.");
      return;
    }
    if (noteInput && cleanInstruction.length > 12) {
      noteInput.value = noteInput.value.trim()
        ? noteInput.value.trim() + "\n\nAjustement vétérinaire : " + cleanInstruction
        : cleanInstruction;
    }
    modifySignatureProtocolWithAi(cleanInstruction);
  }

  function launchSignatureFollowup() {
    const current = patientContext[selectedPatientKey] || patientContext.camille;
    const animalName = current.animal || "l’animal";
    const ownerName = current.owner || "le propriétaire";
    const noteInput = document.getElementById("signature-note");
    const status = document.getElementById("signature-status");
    const preview = document.getElementById("signature-preview");
    const mainButton = document.getElementById("signature-generate");
    const consultationButton = document.getElementById("consultation-complete");
    const consultationStatus = document.getElementById("consultation-complete-status");
    const wasAlreadyGenerated = signatureFollowupGenerated;
    const note = noteInput && noteInput.value.trim()
      ? noteInput.value.trim()
      : "Fin de visite : préparer un suivi de convalescence simple, rassurant et validable par la clinique.";
    const proposedProtocol = signatureCurrentProtocol || suggestSignatureProtocol(note);
    renderSignatureProtocol(proposedProtocol, {reason: proposedProtocol.reason, accepted: signatureProtocolAccepted});

    signatureFollowupGenerated = true;
    if (preview) {
      preview.classList.add("is-ready");
      updateSignaturePreviewFromProtocol(proposedProtocol, signatureProtocolAccepted);
    }
    if (status) status.textContent = signatureProtocolAccepted
      ? "Suivi lancé en brouillon validé : Numa peut préparer les messages selon ce protocole."
      : "Suivi préparé : le protocole patient, les messages, QCM et actions sont prêts à relire.";
    if (mainButton) {
      mainButton.classList.add("is-complete");
      mainButton.innerHTML = signatureProtocolAccepted
        ? "Suivi lancé pour " + animalName + " <span aria-hidden=\"true\">✓</span>"
        : "Suivi prêt pour " + animalName + " <span aria-hidden=\"true\">✓</span>";
    }
    if (consultationButton && consultationButton.dataset.done !== "true") {
      consultationButton.dataset.done = "true";
      consultationButton.classList.add("is-complete");
      consultationButton.disabled = true;
      consultationButton.innerHTML = "Retour à domicile confirmé <span aria-hidden=\"true\">✓</span>";
    }
    if (consultationStatus) consultationStatus.textContent = "Suivi Signature préparé pour cette visite.";

    buildNumaResult("signature", note);
    if (!wasAlreadyGenerated) {
      appendMessage("numa", "Suivi Signature prêt pour " + animalName + " : protocole « " + proposedProtocol.name + " », messages, QCM et synthèse clinique sont préparés en brouillon. La clinique valide avant tout envoi.", "Numa · brouillon à valider");
      appendAssistantMessage("assistant", "J’ai préparé le Suivi Signature pour " + animalName + " et " + ownerName + ".", "Base issue de la bibliothèque : " + proposedProtocol.name + ". Vous pouvez la valider, la modifier ou demander un autre protocole.");
      appendSignatureAiMessage("assistant", "Je pars de « " + proposedProtocol.name + " » dans votre bibliothèque. Si ce n’est pas le bon, dites-moi “pas ça” et décrivez le protocole voulu : je créerai une nouvelle base locale.");
    }
    showToast(wasAlreadyGenerated ? "Suivi Signature actualisé." : "Suivi Signature généré : la suite post-visite est prête à valider.");
  }

  function buildNumaResult(type, instruction) {
    const output = document.getElementById("numa-output");
    if (!output) return;
    const results = {
      summary: {
        label: "Cadre de Numa",
        title: "Numa reste dans le cadre validé par la clinique.",
        copy: "Vous définissez l’identité, le ton, le canal, les limites et les cas où l’équipe reprend la main. Les protocoles définissent ensuite les étapes concrètes envoyées au propriétaire.",
        boxTitle: "Règle proposée",
        draft: "J0 : rassurer le propriétaire au retour de visite. J+1 : proposer un QCM appétit, énergie, plaie. J+7 : proposer un rappel ou un lien de rendez-vous si la règle validée le prévoit."
      },
      reply: {
        label: "Message propriétaire proposé",
        title: "Un message J+1 à valider.",
        copy: "Ce message ne pourra être envoyé par Numa qu’après votre ajout au protocole. Il reste pratique et ne répond à aucune question clinique.",
        boxTitle: "Message propriétaire proposé",
        draft: "Bonjour Claire, comment va Nala ce matin ? A-t-elle mangé ? Son énergie vous semble-t-elle habituelle ? La plaie vous paraît-elle propre ?"
      },
      callback: {
        label: "Alerte rendez-vous",
        title: "Numa signale une consultation à évaluer.",
        copy: "Numa ne décide pas qu’un rendez-vous est nécessaire. Elle remonte seulement une situation prévue par vos règles pour que la clinique évalue la suite.",
        boxTitle: "Règle d’alerte proposée",
        draft: "Si le propriétaire signale un refus de manger, une plaie rouge/suintante, des vomissements répétés ou une boiterie qui s’aggrave, créer une alerte clinique avant tout lien de rendez-vous."
      },
      doctolib: {
        label: "Autonomie de Numa",
        title: "Ce qui peut partir seul reste limité.",
        copy: "Les rappels, QCM, demandes d’avis et liens ne partent seuls que s’ils sont activés par la clinique. Les réponses libres et les cas sensibles restent à relire.",
        boxTitle: "Règle d’autonomie proposée",
        draft: "Autoriser uniquement les messages validés, limiter les relances, transmettre les réponses libres à l’équipe et proposer Doctolib Vet, Vetstoria ou un lien direct seulement selon une règle explicite."
      },
      signature: {
        label: "Suivi Signature",
        title: "Une fin de visite transformée en plan de convalescence.",
        copy: "L’assistant clinique prépare la synthèse. Numa prépare les messages propriétaires selon le protocole, sans diagnostic, sans prescription et avec validation humaine pour les cas sensibles.",
        boxTitle: "Plan post-visite proposé",
        draft: "J0 : confirmer le retour à domicile et envoyer les consignes validées. J+1 : QCM appétit / énergie / plaie. J+3 : rappel collerette ou traitement. J+7 : proposer un contrôle ou un lien RDV si la règle validée le prévoit."
      },
      continuity: {
        label: "Radar de Continuité",
        title: "Une action simple pour éviter le décrochage.",
        copy: "Numa signale un suivi sans prochaine étape claire. L’assistant clinique prépare une action clinique, sans interprétation vétérinaire automatique.",
        boxTitle: "Action de continuité proposée",
        draft: "Préparer une relance douce au propriétaire, créer une tâche clinique ou proposer un lien uniquement si une règle validée l’autorise."
      },
      prompt: {
        label: "Instruction proposée",
        title: "Une nouvelle règle à valider.",
        copy: "Numa a reformulé votre instruction comme une règle simple, réversible et sans interprétation clinique de l’animal.",
        boxTitle: "Instruction Numa proposée",
        draft: "Après une réponse du propriétaire, rester sur les informations pratiques prévues au protocole, transmettre toute demande particulière à l’équipe et rappeler les consignes d’urgence vétérinaire en cas de besoin."
      }
    };
    const result = results[type] || results.prompt;
    if (type === "prompt" && instruction) {
      result.copy = "Vous avez formulé une instruction pour Numa. Elle est affichée ici comme une règle à relire avant activation.";
      result.draft = instruction;
    } else if (type === "signature" && instruction) {
      result.copy = "Note de visite utilisée pour préparer le suivi : " + instruction;
    } else if (type === "continuity" && instruction) {
      result.copy = "Signal Radar traité : " + instruction;
      result.draft = instruction;
    }
    output.replaceChildren();
    const label = document.createElement("p");
    label.className = "result-label";
    label.textContent = result.label;
    const title = document.createElement("h3");
    title.textContent = result.title;
    const copy = document.createElement("p");
    copy.textContent = result.copy;
    const box = document.createElement("div");
    box.className = "result-box";
    const boxTitle = document.createElement("strong");
    boxTitle.textContent = result.boxTitle;
    const draft = document.createElement("p");
    draft.textContent = "« " + result.draft + " »";
    box.append(boxTitle, draft);
    output.append(label, title, copy, box);
  }

  function handleContinuityAction(action, patientName) {
    const actions = {
      callback: {
        label: "Tâche rappel préparée",
        draft: "Créer une tâche pour rappeler le propriétaire de " + patientName + " et clarifier la suite du suivi avant tout lien automatisé.",
        message: "La clinique a préparé une tâche de rappel. Aucun message réel n’est envoyé sans validation."
      },
      doctolib: {
        label: "Lien RDV à valider",
        draft: "Préparer le lien RDV pour " + patientName + ", à proposer seulement si la clinique confirme que c’est pertinent.",
        message: "Un lien de rendez-vous est prêt en brouillon, avec validation humaine avant proposition."
      },
      reminder: {
        label: "Relance douce préparée",
        draft: "Envoyer une relance courte au propriétaire de " + patientName + " : demander simplement si tout va bien et rappeler que la clinique reste disponible.",
        message: "Une relance douce est prête pour reprendre le lien sans pression."
      },
      close: {
        label: "Clôture propre préparée",
        draft: "Proposer au propriétaire de " + patientName + " de clôturer le suivi ou de demander un rappel si une question persiste.",
        message: "Un message de clôture propre est prêt, avec possibilité de reprise par la clinique."
      },
      qcm: {
        label: "Mini point final préparé",
        draft: "Envoyer au propriétaire de " + patientName + " un mini QCM final : appétit, énergie, comportement, besoin d’un rappel ou clôture du suivi.",
        message: "Un mini point final est prêt pour vérifier la suite sans créer de charge inutile."
      },
      review: {
        label: "Action de continuité proposée",
        draft: "Relire le suivi de " + patientName + ", choisir la bonne suite et éviter que le parcours reste sans conclusion claire.",
        message: "Le radar propose une action à relire par la clinique."
      }
    };
    const selectedAction = actions[action] || actions.review;
    const summary = document.getElementById("continuity-summary");
    if (summary) {
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "✓";
      const paragraph = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = selectedAction.label + " : ";
      paragraph.append(strong, selectedAction.draft);
      summary.replaceChildren(icon, paragraph);
      summary.classList.add("is-ready");
    }
    if (action === "doctolib") setConsultationPriority(true);
    buildNumaResult("continuity", selectedAction.draft);
    appendMessage("numa", "Radar de Continuité — " + patientName + " : " + selectedAction.message, "Numa · brouillon à valider");
    appendAssistantMessage("assistant", "Radar de Continuité : action préparée pour " + patientName + ".", selectedAction.draft);
    showToast(selectedAction.label + " pour " + patientName + ".");
  }

  function appendAssistantMessage(kind, text, note) {
    if (!assistantThread) return;
    const message = document.createElement("div");
    message.className = "assistant-message assistant-message-" + kind;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.appendChild(paragraph);
    if (note) {
      const small = document.createElement("small");
      small.textContent = note;
      message.appendChild(small);
    }
    assistantThread.appendChild(message);
    window.requestAnimationFrame(() => {
      assistantThread.scrollTop = assistantThread.scrollHeight;
    });
  }

  function markassistantReminderPrepared() {
    if (assistantReminderPrepared) return;
    assistantReminderPrepared = true;
    const count = document.getElementById("organize-count");
    if (count) count.textContent = String(Number(count.textContent || 0) + 1);
  }

  function plainText(value) {
    return value
      .toLocaleLowerCase("fr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function runAssistantRequest(value) {
    const request = (value || "").trim();
    if (!request) {
      showToast("Dites à l’assistant clinique ce que vous souhaitez préparer.");
      return;
    }
    appendAssistantMessage("user", request);
    const command = plainText(request);

    if (/(urgence|danger immediat|malaise|112|15\b|114\b)/.test(command)) {
      setRoute("urgent", true);
      appendAssistantMessage("assistant", "J’ouvre les consignes d’urgence. Pour une situation vétérinaire potentiellement grave, Strivea Vet ne poursuit pas l’échange automatisé.", "N’attendez pas une réponse dans l’application : contactez la clinique ou une urgence vétérinaire immédiatement.");
      return;
    }

    if (/(diagnostic|symptome|douleur|medicament|prescri|ordonnance|avis medical)/.test(command)) {
      appendAssistantMessage("assistant", "Je peux vous aider à organiser un suivi, mais je ne peux pas interpréter l’état de santé d’un animal ni fournir un avis vétérinaire.", "Pour une situation inquiétante, ouvrez « Urgence & cadre » ou orientez le propriétaire vers la clinique.");
      return;
    }

    if (/(supprim|export|partag|droit|acces|mot de passe|facturation|paiement)/.test(command)) {
      appendAssistantMessage("assistant", "Cette action mérite une vérification explicite de votre part. Je peux vous guider vers le bon espace, mais je ne la réalise pas automatiquement.", "L’assistant clinique ne modifie pas les droits, la sécurité, les données sensibles ou les actions externes.");
      return;
    }

    if (/(rappel|relance)/.test(command)) {
      updatePatientContext(/camille|claire|nala/.test(command) ? "camille" : selectedPatientKey);
      setRoute("messages", true);
      markassistantReminderPrepared();
      appendMessage("numa", "Brouillon de tâche : organiser un rappel pour " + selectedPatient + ".", "Assistant clinique · non envoyé");
      appendAssistantMessage("assistant", "J’ai préparé une tâche de rappel pour " + selectedPatient + ".", "Elle reste à vérifier et à attribuer à votre équipe ; aucun message ni appel n’est envoyé.");
      showToast("Rappel préparé pour relecture.");
      return;
    }

    if (/(brouillon|repond|reponse|message a preparer)/.test(command)) {
      setRoute("messages", true);
      appendMessage("numa", "Brouillon : merci pour votre message. L’équipe en prend connaissance et vous recontactera selon les modalités de la clinique.", "Assistant clinique · non envoyé");
      appendAssistantMessage("assistant", "J’ai ajouté un brouillon dans la conversation.", "Vous pourrez le relire, l’adapter et décider vous-même de la suite.");
      return;
    }

    if (/(synthese|resume|resumer)/.test(command)) {
      setRoute("today", true);
      appendAssistantMessage("assistant", "J’ai préparé une synthèse de coordination pour vos priorités.", "Elle reste un résumé opérationnel ; elle ne contient aucune conclusion clinique.");
      showToast("Synthèse préparée pour cette démonstration.");
      return;
    }

    if (/(doctolib|rendez[ -]?vous|\brdv\b)/.test(command)) {
      setRoute("numa", true);
      appendAssistantMessage("assistant", "J’ouvre Numa.", "Les liens de rendez-vous, avis Google et rappels restent encadrés dans les règles Numa validées par votre clinique.");
      return;
    }

    if (/(numa|ia patient|conversation patient|proprietaire|animal)/.test(command)) {
      setRoute("numa", true);
      appendAssistantMessage("assistant", "J’ouvre Numa, l’IA qui échange avec les propriétaires.", "Vous pourrez voir et valider ce qu’elle est autorisée à dire dans le protocole.");
      return;
    }

    if (/(programme|parcours|qcm|configuration|automatis)/.test(command)) {
      setRoute("programme", true);
      appendAssistantMessage("assistant", "J’ouvre vos protocoles Numa.", "Vous pouvez y définir les messages, QCM, liens et validations humaines.");
      return;
    }

    if (/(launch|checklist|mise en route|lancement|ouvrir la clinique|ouvrir le cabinet)/.test(command)) {
      setRoute("launch", true);
      appendAssistantMessage("assistant", "J’ouvre le plan de lancement.", "Il aide à organiser la mise en œuvre ; chaque élément important reste à valider par la bonne personne.");
      return;
    }

    if (/(profil|compte|cabinet|equipe|equipe)/.test(command)) {
      setRoute("profile", true);
      appendAssistantMessage("assistant", "J’ouvre votre espace personnel.", "Vous y retrouvez la clinique, l’équipe, WhatsApp Business et le journal des accès.");
      return;
    }

    if (/(message|conversation|whatsapp|patient|proprietaire|animal)/.test(command)) {
      setRoute("messages", true);
      appendAssistantMessage("assistant", "J’ouvre les messages propriétaires.", "Les réponses libres restent à relire par votre équipe avant toute suite.");
      return;
    }

    if (/(priorite|priorites|aujourd|tableau|a traiter)/.test(command)) {
      setRoute("today", true);
      appendAssistantMessage("assistant", "J’ouvre vos priorités du jour.", "Vous y voyez les réponses à lire et les prochains pas à organiser.");
      return;
    }

    if (/(aide|comment|parcour|fonctionnalite|que peux)/.test(command)) {
      appendAssistantMessage("assistant", "Je suis l’assistant clinique : je peux ouvrir une page, retrouver vos priorités ou préparer un brouillon, un rappel ou une synthèse.", "Numa est séparée : elle parle aux propriétaires uniquement selon les protocoles que vous validez.");
      return;
    }

    appendAssistantMessage("assistant", "Je peux vous guider dans Strivea Vet ou préparer une action simple à relire.", "Essayez : « ouvre Numa », « montre mes priorités » ou « prépare un rappel pour Nala ».");
  }

  function handleNumaAction(action) {
    if (action === "reply" || action === "summary" || action === "callback" || action === "doctolib") {
      setRoute("numa", true);
      buildNumaResult(action);
      showToast("Numa a préparé une règle de protocole à valider.");
    }
  }

  document.querySelectorAll("[data-ai-action]").forEach((button) => {
    button.addEventListener("click", () => handleNumaAction(button.dataset.aiAction));
  });

  const runNuma = document.getElementById("run-numa");
  const numaInput = document.getElementById("numa-input");
  if (runNuma) {
    runNuma.addEventListener("click", () => {
      buildNumaResult("prompt", numaInput ? numaInput.value.trim() : "");
      showToast("Instruction Numa proposée. Validez-la avant de l’ajouter au protocole.");
    });
  }

  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  if (messageForm && messageInput) {
    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = messageInput.value.trim();
      if (!text) {
        showToast("Écrivez un brouillon avant de l’ajouter.");
        return;
      }
      appendMessage("numa", text, "Brouillon équipe · non envoyé");
      messageInput.value = "";
      showToast("Brouillon ajouté à cette démonstration.");
    });
  }

  const qcm = document.getElementById("followup-qcm");
  if (qcm) {
    qcm.addEventListener("click", (event) => {
      const option = event.target.closest("[data-qcm]");
      if (!option || qcm.dataset.done) return;
      const labels = {
        progresse: "Elle va bien",
        stable: "C’est stable",
        difficile: "Je suis inquiète",
        rappel: "Je veux être rappelée"
      };
      qcm.dataset.done = "true";
      qcm.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
        button.classList.toggle("selected", button === option);
      });
      appendMessage("patient", "Réponse propriétaire au point de suivi : " + labels[option.dataset.qcm] + ".", "");
      if (option.dataset.qcm === "difficile") {
        setConsultationPriority(true);
        appendMessage("numa", "Merci pour votre retour. Votre réponse est transmise à la clinique pour qu’elle évalue la suite. En cas d’urgence vétérinaire ou de danger immédiat, contactez la clinique ou le service d’urgence.", "Numa · assistant de la clinique");
        showToast("Signal de protocole : une consultation est à évaluer par la clinique.");
      } else if (option.dataset.qcm === "rappel") {
        appendMessage("numa", "Merci pour votre retour. L’équipe a été informée pour organiser la suite. En cas d’urgence vétérinaire ou de danger immédiat, contactez la clinique ou le service d’urgence.", "Numa · assistant de la clinique");
        showToast("Une action de relecture humaine est signalée.");
      } else {
        appendMessage("numa", "Merci pour votre retour. L’équipe conserve votre réponse dans le suivi de Nala.", "Numa · assistant de la clinique");
        showToast("Réponse ajoutée à la démo.");
      }
    });
  }

  function selectPatientButton(button) {
    if (!button) return;
    document.querySelectorAll("[data-patient]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    updatePatientContext(button.dataset.patient);
    const data = patientContext[selectedPatientKey] || patientContext.camille;
    const firstName = (data.owner || selectedPatient).split(" ")[0];
    const name = document.getElementById("thread-name");
    const greeting = document.querySelector(".chat-message.numa p");
    const recordTitle = document.querySelector(".patient-record-top h2");
    const recordMeta = document.querySelector(".patient-record-top small");
    const statusPill = document.querySelector(".patient-record-top .status-pill");
    if (name) name.textContent = selectedPatient;
    if (recordTitle) recordTitle.textContent = data.animal || selectedPatient;
    if (recordMeta) recordMeta.textContent = "Propriétaire : " + (data.owner || "à renseigner") + " · Protocole actif : " + (data.protocol || "à configurer");
    if (statusPill) statusPill.textContent = data.status || "NORMAL";
    if (greeting) greeting.textContent = "Bonjour " + firstName + ", je prends des nouvelles de " + (data.animal || "votre animal") + " selon le protocole validé par votre vétérinaire. Comment se passe le retour à la maison ?";
    showToast("Conversation de démonstration : " + selectedPatient + ".");
  }

  function attachPatientButton(button) {
    if (!button || button.dataset.patientBound === "true") return;
    button.dataset.patientBound = "true";
    button.addEventListener("click", () => selectPatientButton(button));
  }

  document.querySelectorAll("[data-patient]").forEach(attachPatientButton);

  const openAnimalProfile = document.getElementById("open-animal-profile");
  const animalProfilePanel = document.getElementById("animal-profile-panel");
  const closeAnimalProfile = document.getElementById("close-animal-profile");
  const cancelAnimalProfile = document.getElementById("cancel-animal-profile");
  const animalProfileForm = document.getElementById("animal-profile-form");
  const animalProfileList = document.getElementById("animal-profile-list");

  function setAnimalProfilePanel(open) {
    if (!animalProfilePanel) return;
    animalProfilePanel.hidden = !open;
    if (open) {
      window.requestAnimationFrame(() => {
        const input = document.getElementById("new-animal-name");
        if (input) input.focus({ preventScroll: true });
      });
    }
  }

  function createPatientKey(animalName, ownerName) {
    const base = (animalName + "-" + ownerName)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "animal";
    let key = base;
    let index = 2;
    while (patientContext[key]) {
      key = base + "-" + index;
      index += 1;
    }
    return key;
  }

  function addAnimalConversation(key, data) {
    if (!animalProfileList) return null;
    const button = document.createElement("button");
    button.className = "conversation";
    button.type = "button";
    button.dataset.patient = key;

    const initials = document.createElement("span");
    initials.className = "person-initials person-soft";
    initials.textContent = initialsForAnimal(data.animal);

    const content = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = data.name;
    const subtitle = document.createElement("small");
    subtitle.textContent = data.status + " · " + data.protocol;
    content.append(title, subtitle);

    const time = document.createElement("time");
    time.textContent = "Maint.";
    button.append(initials, content, time);

    animalProfileList.appendChild(button);
    attachPatientButton(button);
    refreshAgendaPatientOptions();
    return button;
  }

  function refreshAgendaPatientOptions() {
    if (!agendaExistingPatient) return;
    const currentValue = agendaExistingPatient.value;
    agendaExistingPatient.replaceChildren();
    Object.entries(patientContext).forEach(([key, data]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = (data.animal || data.name || key) + " · " + (data.owner || "propriétaire");
      agendaExistingPatient.appendChild(option);
    });
    if (currentValue && patientContext[currentValue]) agendaExistingPatient.value = currentValue;
    else agendaExistingPatient.value = selectedPatientKey;
  }

  if (openAnimalProfile) openAnimalProfile.addEventListener("click", () => setAnimalProfilePanel(true));
  if (closeAnimalProfile) closeAnimalProfile.addEventListener("click", () => setAnimalProfilePanel(false));
  if (cancelAnimalProfile) cancelAnimalProfile.addEventListener("click", () => setAnimalProfilePanel(false));

  if (animalProfileForm) {
    animalProfileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const animalInput = document.getElementById("new-animal-name");
      const ownerInput = document.getElementById("new-owner-name");
      const protocolInput = document.getElementById("new-protocol-name");
      const statusInput = document.getElementById("new-followup-status");
      const animalName = animalInput ? animalInput.value.trim() : "";
      const ownerName = ownerInput ? ownerInput.value.trim() : "";
      if (!animalName || !ownerName) {
        showToast("Ajoutez au minimum le nom de l’animal et du propriétaire.");
        return;
      }
      const key = createPatientKey(animalName, ownerName);
      const statusValue = statusInput && statusInput.value ? statusInput.value : "NORMAL";
      patientContext[key] = {
        name: animalName + " · " + ownerName,
        animal: animalName,
        owner: ownerName,
        protocol: protocolInput && protocolInput.value.trim() ? protocolInput.value.trim() : "J0 · retour consultation",
        status: statusValue,
        last: "Profil créé maintenant · protocole à personnaliser"
      };
      const button = addAnimalConversation(key, patientContext[key]);
      if (button) selectPatientButton(button);
      animalProfileForm.reset();
      if (protocolInput) protocolInput.value = "J0 · retour consultation";
      setAnimalProfilePanel(false);
      showToast("Profil créé : " + animalName + " est ajouté à la file.");
    });
  }

  function ensurePatientFromAppointment(animalName, ownerName, protocolName, statusText) {
    const existingKey = Object.keys(patientContext).find((key) => {
      const entry = patientContext[key];
      return entry && entry.animal && entry.owner
        && entry.animal.toLowerCase() === animalName.toLowerCase()
        && entry.owner.toLowerCase() === ownerName.toLowerCase();
    });
    if (existingKey) return existingKey;
    const key = createPatientKey(animalName, ownerName);
    patientContext[key] = {
      name: animalName + " · " + ownerName,
      animal: animalName,
      owner: ownerName,
      protocol: protocolName || "J0 · retour consultation",
      status: statusText || "RDV PLANIFIÉ",
      last: "Rendez-vous ajouté depuis l’agenda"
    };
    addAnimalConversation(key, patientContext[key]);
    return key;
  }

  function setAgendaModal(open) {
    if (!agendaModal) return;
    agendaModal.hidden = !open;
    document.body.classList.toggle("agenda-modal-open", Boolean(open));
    if (open) {
      refreshAgendaPatientOptions();
      window.requestAnimationFrame(() => {
        const firstField = document.getElementById("agenda-existing-patient") || document.getElementById("agenda-animal");
        if (firstField) firstField.focus({ preventScroll: true });
      });
    }
  }

  function syncAgendaClientMode() {
    const selected = agendaClientModeInputs.find((input) => input.checked)?.value || "existing";
    if (agendaExistingClient) agendaExistingClient.hidden = selected !== "existing";
    if (agendaNewClient) agendaNewClient.hidden = selected !== "new";
  }

  if (openAgendaModalButton) openAgendaModalButton.addEventListener("click", () => setAgendaModal(true));
  if (closeAgendaModalButton) closeAgendaModalButton.addEventListener("click", () => setAgendaModal(false));
  if (agendaModal) {
    agendaModal.addEventListener("pointerdown", (event) => {
      if (event.target === agendaModal) setAgendaModal(false);
    });
  }
  agendaClientModeInputs.forEach((input) => input.addEventListener("change", syncAgendaClientMode));

  if (calendarGrid && calendarMouseLine && calendarMouseTime) {
    calendarGrid.addEventListener("pointermove", (event) => {
      const rect = calendarGrid.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      const ratio = rect.height ? y / rect.height : 0;
      const start = 8 * 60;
      const end = 21 * 60;
      const minutes = Math.round((start + (end - start) * ratio) / 5) * 5;
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      calendarMouseLine.hidden = false;
      calendarMouseLine.style.top = y + "px";
      calendarMouseTime.textContent = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
    });
    calendarGrid.addEventListener("pointerleave", () => {
      calendarMouseLine.hidden = true;
    });
  }

  if (agendaForm) {
    agendaForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const mode = agendaClientModeInputs.find((input) => input.checked)?.value || "existing";
      const dayInput = document.getElementById("agenda-day");
      const timeInput = document.getElementById("agenda-time");
      const durationInput = document.getElementById("agenda-duration");
      const typeInput = document.getElementById("agenda-type");
      const animalInput = document.getElementById("agenda-animal");
      const ownerInput = document.getElementById("agenda-owner");
      const phoneInput = document.getElementById("agenda-phone");
      const reasonInput = document.getElementById("agenda-reason");
      const protocolInput = document.getElementById("agenda-protocol");
      const noteInput = document.getElementById("agenda-note");
      let patientKey = agendaExistingPatient ? agendaExistingPatient.value : selectedPatientKey;
      let existing = patientContext[patientKey];
      let animalName = existing ? existing.animal : "";
      let ownerName = existing ? existing.owner : "";
      if (mode === "new") {
        animalName = animalInput ? animalInput.value.trim() : "";
        ownerName = ownerInput ? ownerInput.value.trim() : "";
        existing = null;
      }
      const reason = reasonInput ? reasonInput.value.trim() : "";
      if (!animalName || !ownerName || !reason) {
        showToast(mode === "new" ? "Complétez l’animal, le propriétaire et le motif." : "Choisissez un client et ajoutez le motif.");
        return;
      }
      const protocol = protocolInput && protocolInput.value ? protocolInput.value : "J0 · retour consultation";
      const type = typeInput && typeInput.value ? typeInput.value : "Consultation";
      if (mode === "new") patientKey = ensurePatientFromAppointment(animalName, ownerName, protocol, "RDV PLANIFIÉ");
      else if (existing && protocol !== "Aucun pour l’instant") existing.protocol = protocol;
      const appointment = {
        id: "rdv-" + Date.now(),
        day: dayInput && dayInput.value ? Number(dayInput.value) : 5,
        time: timeInput && timeInput.value ? timeInput.value : "14:30",
        duration: durationInput && durationInput.value ? durationInput.value : "30 min",
        animal: animalName,
        owner: ownerName,
        phone: phoneInput && phoneInput.value ? phoneInput.value.trim() : "",
        type,
        reason,
        protocol,
        status: type.toLowerCase().includes("urgence") ? "Signal à évaluer" : "RDV planifié",
        patientKey,
        note: noteInput && noteInput.value ? noteInput.value.trim() : "À préparer par l’équipe."
      };
      appointments.push(appointment);
      renderAppointments();
      updatePatientContext(patientKey);
      agendaForm.reset();
      if (agendaClientModeInputs[0]) agendaClientModeInputs[0].checked = true;
      syncAgendaClientMode();
      if (timeInput) timeInput.value = "14:30";
      if (dayInput) dayInput.value = "5";
      if (durationInput) durationInput.value = "30 min";
      refreshAgendaPatientOptions();
      setAgendaModal(false);
      showToast("Rendez-vous ajouté : " + appointment.time + " · " + animalName + ".");
    });
  }

  const agendaDemoFill = document.getElementById("agenda-demo-fill");
  if (agendaDemoFill) {
    agendaDemoFill.addEventListener("click", () => {
      const values = {
        "agenda-day": "5",
        "agenda-time": "16:15",
        "agenda-animal": "Rio",
        "agenda-owner": "Manon Petit",
        "agenda-phone": "+33 6 12 34 56 78",
        "agenda-reason": "Contrôle de boiterie après promenade, propriétaire inquiet.",
        "agenda-note": "Prévoir une question sur l’appui et la durée de la gêne."
      };
      Object.entries(values).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field) field.value = value;
      });
      if (agendaClientModeInputs[1]) agendaClientModeInputs[1].checked = true;
      syncAgendaClientMode();
      showToast("Exemple rempli. Vous pouvez l’ajouter au planning.");
    });
  }

  document.querySelectorAll("[data-agenda-focus-form]").forEach((button) => {
    button.addEventListener("click", () => {
      setAgendaModal(true);
    });
  });

  if (agendaImportDropzone && agendaScreenshotInput) {
    agendaImportDropzone.addEventListener("click", () => agendaScreenshotInput.click());
    agendaImportDropzone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        agendaScreenshotInput.click();
      }
    });
    agendaScreenshotInput.addEventListener("change", () => {
      handleAgendaScreenshotFile(agendaScreenshotInput.files && agendaScreenshotInput.files[0]);
    });
    ["dragenter", "dragover"].forEach((eventName) => {
      agendaImportDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        agendaImportDropzone.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      agendaImportDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        agendaImportDropzone.classList.remove("is-dragging");
      });
    });
    agendaImportDropzone.addEventListener("drop", (event) => {
      handleAgendaScreenshotFile(event.dataTransfer?.files && event.dataTransfer.files[0]);
    });
  }

  if (agendaImportApply) agendaImportApply.addEventListener("click", importDetectedAgendaAppointments);
  if (agendaImportClear) agendaImportClear.addEventListener("click", () => {
    clearAgendaImport();
    showToast("Import de capture réinitialisé.");
  });

  if (connectGoogleCalendar) {
    connectGoogleCalendar.addEventListener("click", () => {
      googleCalendarConnected = true;
      connectGoogleCalendar.textContent = "Google Calendar connecté";
      connectGoogleCalendar.disabled = true;
      if (syncGoogleCalendar) syncGoogleCalendar.disabled = false;
      if (exportGoogleCalendar) exportGoogleCalendar.disabled = false;
      if (googleCalendarStatus) {
        googleCalendarStatus.textContent = "Connecté";
        googleCalendarStatus.classList.remove("tag-sand");
        googleCalendarStatus.classList.add("tag-sage");
      }
      if (googleCalendarNote) {
        googleCalendarNote.innerHTML = "<span aria-hidden=\"true\">✓</span><p>Démo : " + (googleCalendarEmail?.value || "l’agenda clinique") + " est marqué comme connecté. En production, OAuth Google et la synchronisation passent par un serveur sécurisé.</p>";
      }
      showToast("Google Calendar connecté en mode démo.");
    });
  }

  if (syncGoogleCalendar) {
    syncGoogleCalendar.addEventListener("click", () => {
      if (!googleCalendarConnected) {
        showToast("Connectez d’abord Google Calendar.");
        return;
      }
      const added = addGoogleCalendarDemoAppointments();
      showToast(added ? added + " rendez-vous synchronisés depuis Google Calendar." : "Agenda déjà synchronisé pour cette semaine.");
    });
  }

  if (exportGoogleCalendar) {
    exportGoogleCalendar.addEventListener("click", () => {
      if (!googleCalendarConnected) {
        showToast("Connectez d’abord Google Calendar.");
        return;
      }
      showToast("Export préparé : " + appointments.length + " rendez-vous Strivea seraient envoyés à Google Calendar.");
    });
  }

  function setNumaTab(tabName) {
    const tab = tabName || "postvisit";
    numaTabButtons.forEach((button) => {
      const isActive = button.dataset.numaTab === tab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    numaTabPanels.forEach((panel) => {
      const isActive = panel.dataset.numaPanel === tab;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
    });
  }

  numaTabButtons.forEach((button) => {
    button.addEventListener("click", () => setNumaTab(button.dataset.numaTab));
  });

  const specialty = document.getElementById("specialty-select");
  const specialtyLabel = document.getElementById("specialty-label");
  if (specialty && specialtyLabel) {
    specialty.addEventListener("change", () => {
      specialtyLabel.textContent = " " + specialty.value.toLowerCase();
      showToast("Spécialité de démonstration mise à jour.");
    });
  }

  document.getElementById('simulate-appointment-alert').addEventListener('click', () => {
    const result = document.getElementById('appointment-alert-result'); result.hidden = false; result.replaceChildren();
    if (!document.getElementById('appointment-alert-enabled').checked) { result.textContent = 'Alerte désactivée pour ce protocole.'; return; }
    const text = document.createElement('p'); text.textContent = 'Exemple fictif · Nala : « Elle ne mange pas et la plaie est rouge. » Rendez-vous à évaluer par la clinique. Cette simulation ne réalise aucune analyse IA.';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'button button-forest'; button.textContent = 'Examiner la demande en clinique';
    button.addEventListener('click', () => setRoute('messages', true));
    result.append(text, button); setConsultationPriority(true);
  });
  const saveProgramme = document.getElementById("save-programme");
  if (saveProgramme) {
    saveProgramme.addEventListener("click", () => showToast("Protocole Numa enregistré dans cette démonstration."));
  }

  const consultationCompleteButton = document.getElementById("consultation-complete");
  if (consultationCompleteButton) consultationCompleteButton.addEventListener("click", markConsultationComplete);

  document.querySelectorAll("[data-signature-start]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id !== "signature-generate") {
        setRoute("signature", true);
        showToast("Ouverture de la page Suivi Signature.");
        return;
      }
      launchSignatureFollowup();
    });
  });

  const signatureAcceptProtocol = document.getElementById("signature-accept-protocol");
  if (signatureAcceptProtocol) {
    signatureAcceptProtocol.addEventListener("click", () => {
      const noteInput = document.getElementById("signature-note");
      const note = noteInput?.value?.trim() || "";
      const protocol = signatureCurrentProtocol || suggestSignatureProtocol(note);
      signatureProtocolAccepted = true;
      renderSignatureProtocol(protocol, {accepted: true, reason: "Validé par le vétérinaire pour ce suivi post-consultation."});
      const current = patientContext[selectedPatientKey] || patientContext.camille;
      if (current) current.protocol = protocol.name;
      launchSignatureFollowup();
      appendSignatureAiMessage("assistant", "Suivi lancé en brouillon validé. Les messages WhatsApp, le QCM et la synthèse sont prêts selon ce protocole, sans envoi réel dans cette démo.");
      showToast("Suivi lancé en brouillon validé.");
    });
  }

  const signatureEditProtocol = document.getElementById("signature-edit-protocol");
  if (signatureEditProtocol) {
    signatureEditProtocol.addEventListener("click", () => {
      const input = document.getElementById("signature-ai-input");
      if (input) input.focus({preventScroll: false});
      showToast("Décrivez à Numa ce que vous voulez modifier dans le protocole.");
    });
  }

  const signatureAiForm = document.getElementById("signature-ai-form");
  const signatureAiInput = document.getElementById("signature-ai-input");
  if (signatureAiForm && signatureAiInput) {
    signatureAiForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const instruction = signatureAiInput.value.trim();
      if (!instruction) {
        showToast("Écrivez ce que Numa doit modifier dans le protocole.");
        return;
      }
      appendSignatureAiMessage("user", instruction);
      signatureAiInput.value = "";
      handleSignatureConversationInstruction(instruction);
      window.requestAnimationFrame(() => signatureAiInput.focus({preventScroll: true}));
    });
  }

  document.querySelectorAll("[data-signature-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.signaturePrompt || "";
      if (signatureAiInput) signatureAiInput.value = prompt;
      appendSignatureAiMessage("user", prompt);
      handleSignatureConversationInstruction(prompt);
    });
  });

  function buildProtocolAiDraft(prompt) {
    const command = plainText(prompt || "");
    const isDental = /(dentar|dentaire|dent|extraction|detartr|détartr|bouche|saignement)/.test(command);
    const isOrtho = /(orthop|boiterie|appui|repos strict|pansement|ligament|fracture)/.test(command);
    const isVaccine = /(vaccin|rappel|reaction|réaction|annuel)/.test(command);
    const isChronic = /(chronique|diab|traitement|poids|eau|observance)/.test(command);
    const name = isDental
      ? "Post-détartrage / extraction dentaire"
      : isOrtho
        ? "Post-chirurgie orthopédique"
        : isVaccine
          ? "Suivi vaccinal"
          : isChronic
            ? "Suivi chronique personnalisé"
            : "Protocole post-consultation personnalisé";
    const description = prompt || "Protocole créé avec Numa à valider par le vétérinaire.";
    const steps = isDental ? [
      "J0 · message retour soins dentaires : alimentation adaptée, calme, surveillance saignement",
      "J+1 · QCM alimentation, confort, saignement, comportement",
      "J+3 · relance courte si gêne ou doute propriétaire",
      "J+7 · clôture ou contrôle si gêne persistante"
    ] : isOrtho ? [
      "J0 · consignes repos strict, sorties courtes, pansement et environnement calme",
      "J+1 · QCM appui, appétit, douleur apparente et comportement",
      "J+3 · relance appui/pansement + tâche équipe si aggravation",
      "J+10/J+21 · rappel contrôle selon validation clinique"
    ] : isVaccine ? [
      "J0 · message après vaccin et signes à surveiller",
      "J+1 · QCM réaction éventuelle, appétit, énergie, gonflement",
      "J+7 · clôture si tout va bien",
      "Avant rappel · séquence J-30 / J-7 / J-2"
    ] : isChronic ? [
      "J0 · rappel du cadre de suivi sans modification de traitement",
      "J+3 · QCM appétit, prise du traitement, eau, énergie",
      "J+7 · synthèse équipe avant prochain contrôle",
      "Mensuel · bilan propriétaire non médical et validation clinique"
    ] : [
      "J0 · résumé de visite et consignes validées",
      "J+1 · QCM court sur évolution générale et inquiétude",
      "J+3 · relance si silence ou doute",
      "J+7 · clôture, tâche équipe ou RDV validé"
    ];
    return {name, description, steps};
  }

  function renderProtocolAiDraft(draft) {
    const output = document.getElementById("protocol-ai-output");
    if (!output || !draft) return;
    output.replaceChildren();
    const head = document.createElement("div");
    head.className = "protocol-ai-output-head";
    head.innerHTML = "<span aria-hidden=\"true\">✦</span><strong>Proposition Numa</strong>";
    const title = document.createElement("h3");
    title.textContent = draft.name;
    const copy = document.createElement("p");
    copy.textContent = "Base proposée à partir de votre demande. Le vétérinaire peut ensuite modifier les jours, messages, QCM, documents et garde-fous avant publication.";
    const list = document.createElement("ol");
    draft.steps.forEach((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      list.appendChild(item);
    });
    const warning = document.createElement("p");
    warning.className = "field-help";
    warning.textContent = "Numa conseille une structure, mais ne remplace pas la validation clinique du protocole.";
    const use = document.createElement("button");
    use.className = "button button-outline";
    use.type = "button";
    use.id = "protocol-ai-use";
    use.textContent = "Utiliser comme base";
    use.addEventListener("click", () => {
      const createButton = document.getElementById("library-create") || document.getElementById("protocol-new");
      if (createButton) createButton.click();
      window.setTimeout(() => {
        const nameInput = document.getElementById("protocol-model-name");
        if (nameInput) {
          nameInput.value = draft.name;
          nameInput.dispatchEvent(new Event("input", {bubbles: true}));
        }
      }, 120);
      showToast("Proposition Numa utilisée comme base : complétez les étapes dans le créateur.");
    });
    output.append(head, title, copy, list, warning, use);
  }

  function handleProtocolAiPrompt(prompt) {
    const clean = (prompt || "").trim();
    if (!clean) {
      showToast("Décrivez le protocole que Numa doit construire.");
      return;
    }
    protocolAiDraft = buildProtocolAiDraft(clean);
    renderProtocolAiDraft(protocolAiDraft);
    showToast("Numa a préparé une base de protocole à valider.");
  }

  const protocolAiForm = document.getElementById("protocol-ai-form");
  const protocolAiInput = document.getElementById("protocol-ai-input");
  if (protocolAiForm && protocolAiInput) {
    protocolAiForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleProtocolAiPrompt(protocolAiInput.value);
    });
  }

  document.querySelectorAll("[data-protocol-ai-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.protocolAiPrompt || "";
      if (protocolAiInput) protocolAiInput.value = prompt;
      handleProtocolAiPrompt(prompt);
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest && event.target.closest("#protocol-ai-use");
    if (!button || protocolAiDraft) return;
    showToast("Demandez d’abord une proposition à Numa, puis utilisez-la comme base.");
  });

  const numaAdvancedSettings = document.getElementById("numa-advanced-settings");
  if (numaAdvancedSettings) {
    numaAdvancedSettings.addEventListener("toggle", () => {
      const summaryStatus = numaAdvancedSettings.querySelector("summary small");
      if (summaryStatus) {
        summaryStatus.textContent = numaAdvancedSettings.open
          ? "Réglages affichés : cadre, autonomie, alertes et garde-fous"
          : "Cadre, autonomie, alertes et garde-fous de la clinique";
      }
      if (numaAdvancedSettings.open) {
        window.requestAnimationFrame(() => {
          numaAdvancedSettings.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    });
  }

  document.querySelectorAll("[data-continuity-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.continuityAction || "review";
      const patientName = button.dataset.continuityPatient || selectedPatient || "ce patient";
      handleContinuityAction(action, patientName);
    });
  });

  const launchTasks = Array.from(document.querySelectorAll("[data-launch-task]"));
  const launchCompleteCount = document.getElementById("launch-complete-count");
  const launchTotalCount = document.getElementById("launch-total-count");
  const launchProgressCopy = document.getElementById("launch-progress-copy");
  function updatelaunchProgress() {
    const completed = launchTasks.filter((task) => task.classList.contains("is-done")).length;
    const remaining = launchTasks.length - completed;
    if (launchCompleteCount) launchCompleteCount.textContent = String(completed);
    if (launchTotalCount) launchTotalCount.textContent = String(launchTasks.length);
    if (launchProgressCopy) launchProgressCopy.textContent = remaining ? remaining + " éléments restent à vérifier avant un vrai lancement." : "Toutes les actions de cette démonstration sont marquées comme prêtes.";
  }
  launchTasks.forEach((task) => {
    task.addEventListener("click", () => {
      const isDone = !task.classList.contains("is-done");
      task.classList.toggle("is-done", isDone);
      task.setAttribute("aria-pressed", String(isDone));
      const status = task.querySelector(".launch-task-status");
      if (status) {
        status.textContent = isDone ? "Prêt" : "À faire";
        status.classList.toggle("tag-sage", isDone);
        status.classList.toggle("tag-sand", !isDone);
      }
      updatelaunchProgress();
      showToast(isDone ? "Action marquée comme prête dans le plan de lancement." : "Action remise à vérifier dans le plan de lancement.");
    });
  });

  const launchReviewButtons = Array.from(document.querySelectorAll("[data-launch-review]"));
  const launchReviewCount = document.getElementById("launch-review-count");
  const launchReviewCopy = document.getElementById("launch-review-copy");
  function updatelaunchReview() {
    const reviewed = launchReviewButtons.filter((button) => button.getAttribute("aria-pressed") === "true").length;
    if (launchReviewCount) launchReviewCount.textContent = String(reviewed);
    if (launchReviewCopy) launchReviewCopy.textContent = reviewed === launchReviewButtons.length ? "Toutes les pages de Strivea Vet ont été marquées comme revues. Le plan de lancement reste votre suivi de mise en œuvre." : reviewed + " page" + (reviewed > 1 ? "s revues" : " revue") + " sur " + launchReviewButtons.length + ". Ouvrez une page, vérifiez-la, puis marquez-la comme revue.";
  }
  launchReviewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isReviewed = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(isReviewed));
      const item = document.querySelector('[data-review-item="' + button.dataset.launchReview + '"]');
      if (item) item.classList.toggle("is-reviewed", isReviewed);
      updatelaunchReview();
      showToast(isReviewed ? "Page marquée comme revue dans le plan de lancement." : "Page remise dans les vérifications du plan de lancement.");
    });
  });
  document.querySelectorAll("[data-review-open]").forEach((button) => {
    button.addEventListener("click", () => {
      setRoute(button.dataset.reviewOpen, true);
      showToast("Page ouverte pour revue. Revenez dans Lancement lorsque vous avez terminé.");
    });
  });

  const integrationLabels = {
    stripe: "Stripe",
    whatsapp: "WhatsApp Business",
    email: "E-mail transactionnel",
    data: "Base et authentification",
    monitoring: "Supervision"
  };
  document.querySelectorAll("[data-integration]").forEach((button) => {
    button.addEventListener("click", () => {
      const integration = button.dataset.integration;
      const card = document.querySelector('[data-integration-card="' + integration + '"]');
      const status = document.getElementById("integration-status-" + integration);
      if (card) card.classList.add("is-prepared");
      if (status) {
        status.textContent = integration === "doctolib" ? "Vérifié" : "Préparé en démo";
        status.classList.remove("tag-sand");
        status.classList.add("tag-sage");
      }
      button.disabled = true;
      button.textContent = integration === "doctolib" ? "Vérifié" : "Préparé";
      showToast((integrationLabels[integration] || "Ce service") + " est préparé dans la démo. Aucune connexion réelle ni donnée n’est transmise.");
    });
  });

  const vetAgentScenarios = {
    reception: {
      title: "Réception IA préparée",
      copy: "Strivea Vet simule une demande entrante : le propriétaire est identifié, l’animal est rattaché au bon dossier, puis une tâche est créée pour l’équipe si la demande n’est pas routinière.",
      next: "À brancher : téléphone/VoIP, WhatsApp Business, FAQ clinique et règles d’escalade."
    },
    agenda: {
      title: "Créneau intelligent proposé",
      copy: "Le prototype prépare deux créneaux compatibles avec le motif, le vétérinaire et la disponibilité. Aucun rendez-vous réel n’est créé sans intégration agenda.",
      next: "À brancher : Google Calendar, Doctolib synchronisé, Vetstoria ou API interne de rendez-vous."
    },
    vaccines: {
      title: "Séquence vaccin prête",
      copy: "Strivea Vet prépare les rappels J-30, J-7 et J-2 avec message WhatsApp/email selon consentement. Les animaux sans réponse rejoignent la file de relance.",
      next: "À brancher : base vaccinale, consentement marketing/transactionnel et désinscription."
    },
    scribe: {
      title: "Copilote consultation en brouillon",
      copy: "L’assistant clinique prépare une note SOAP fictive, une consigne post-visite et une facture brouillon. Le vétérinaire doit relire et valider avant enregistrement.",
      next: "À brancher : dictée vocale, dossier clinique, modèles de notes, facturation et audit IA."
    },
    booking: {
      title: "Prise de rendez-vous qualifiée",
      copy: "Numa demande le motif, l’animal, le propriétaire et les préférences horaires. Si le motif semble sensible, elle stoppe la réservation automatique et transmet à l’équipe.",
      next: "Workflow réel : calendrier temps réel + anti-conflit + confirmation propriétaire."
    },
    triage: {
      title: "Triage prudent sans diagnostic",
      copy: "Numa repère des mots-clés d’urgence et affiche les consignes de contact immédiat. Elle ne confirme jamais une urgence clinique et ne recommande pas de traitement.",
      next: "Workflow réel : règles vétérinaires validées + alerte email/SMS équipe + journalisation."
    },
    postop: {
      title: "Post-op intelligent activé",
      copy: "Le scénario envoie un QCM J+1, classe la réponse comme normale, à surveiller ou à relire, puis prépare une synthèse pour le vétérinaire.",
      next: "Workflow réel : protocoles par intervention + photos optionnelles + seuils de reprise humaine."
    },
    vaccine: {
      title: "Rappel vaccin programmé",
      copy: "La séquence propriétaire est préparée : J-30 information, J-7 rappel, J-2 confirmation, puis liste d’attente si aucun créneau n’est pris.",
      next: "Workflow réel : carnet vaccinal, agenda et préférences de communication."
    },
    refill: {
      title: "Demande d’ordonnance encadrée",
      copy: "La demande est transformée en tâche vétérinaire. Numa ne valide pas de renouvellement, ne propose pas de dosage et ne modifie aucun traitement.",
      next: "Workflow réel : dossier médical, historique prescription et signature vétérinaire."
    },
    noshow: {
      title: "No-show relancé proprement",
      copy: "Strivea Vet prépare une relance non culpabilisante, remet l’animal dans la file et peut proposer un créneau libéré si l’agenda le permet.",
      next: "Workflow réel : statut rendez-vous + règles de relance + liste d’attente."
    },
    "owner-report": {
      title: "Rapport propriétaire préparé",
      copy: "Le rapport mensuel regroupe rendez-vous, vaccins, documents et rappels pratiques. Il reste non médical et ne contient aucune conclusion clinique automatique.",
      next: "Workflow réel : portail propriétaire + PDF + historique de consentement."
    }
  };

  const vetAgentAutomationDetails = {
    booking: {
      status: "Page automatisation RDV ouverte",
      steps: ["Identifier propriétaire + animal", "Qualifier le motif sans diagnostic", "Chercher un créneau compatible", "Créer une confirmation à valider"],
      actions: ["Créer une demande RDV", "Préparer confirmation WhatsApp", "Ajouter à l’agenda test"],
      guardrail: "Si douleur intense, détresse, saignement important ou doute urgent : pas de réservation automatique, alerte clinique.",
      integrations: ["Agenda réel", "WhatsApp Business", "Base propriétaire/animal"]
    },
    triage: {
      status: "Page triage prudent ouverte",
      steps: ["Détecter un signal sensible", "Arrêter l’échange automatisé", "Afficher consignes d’urgence", "Notifier la clinique avec contexte"],
      actions: ["Créer alerte prioritaire", "Ouvrir dossier animal", "Préparer rappel humain"],
      guardrail: "Numa ne confirme jamais une urgence clinique, ne diagnostique pas et ne conseille aucun traitement.",
      integrations: ["Règles vétérinaires validées", "Notification équipe", "Journal IA"]
    },
    postop: {
      status: "Page post-op intelligent ouverte",
      steps: ["Envoyer QCM J+1", "Classer la réponse", "Créer synthèse vétérinaire", "Déclencher alerte si signal hors cadre"],
      actions: ["Envoyer QCM démo", "Préparer synthèse Nala", "Créer tâche ASV"],
      guardrail: "Les réponses libres et les signaux inquiétants sont bloqués pour validation humaine.",
      integrations: ["Protocoles", "WhatsApp", "Stockage documents", "Alertes clinique"]
    },
    vaccine: {
      status: "Page rappel vaccin ouverte",
      steps: ["Repérer échéance vaccin", "Programmer J-30/J-7/J-2", "Proposer créneau", "Relancer si aucune réponse"],
      actions: ["Créer séquence rappel", "Préparer lien RDV", "Ajouter à liste d’attente"],
      guardrail: "Message informatif uniquement, sans avis médical personnalisé.",
      integrations: ["Carnet vaccinal", "Agenda", "Consentement communication"]
    },
    refill: {
      status: "Page demande ordonnance ouverte",
      steps: ["Collecter la demande propriétaire", "Vérifier l’animal concerné", "Créer tâche vétérinaire", "Envoyer réponse d’attente neutre"],
      actions: ["Créer tâche vétérinaire", "Préparer message attente", "Joindre contexte dossier"],
      guardrail: "Aucun renouvellement, dosage ou modification de traitement ne part automatiquement.",
      integrations: ["Dossier animal", "Rôles vétérinaire", "Signature/validation"]
    },
    noshow: {
      status: "Page no-show ouverte",
      steps: ["Détecter absence RDV", "Préparer relance douce", "Proposer replanification", "Libérer ou remplir le créneau"],
      actions: ["Créer relance", "Ouvrir créneaux", "Notifier liste d’attente"],
      guardrail: "Aucune pression commerciale ; le propriétaire reste libre de reprendre contact.",
      integrations: ["Agenda", "Liste d’attente", "Templates relance"]
    },
    "owner-report": {
      status: "Page rapport propriétaire ouverte",
      steps: ["Regrouper événements non sensibles", "Lister RDV/vaccins/documents", "Créer PDF ou page sécurisée", "Notifier propriétaire"],
      actions: ["Préparer rapport mensuel", "Créer lien sécurisé", "Archiver consentement"],
      guardrail: "Rapport pratique uniquement : pas de conclusion clinique automatique.",
      integrations: ["Portail propriétaire", "Documents", "Consentements"]
    },
    scribe: {
      status: "Page copilote consultation ouverte",
      steps: ["Recevoir note ou dictée", "Structurer en SOAP brouillon", "Préparer consignes post-visite", "Attendre validation vétérinaire"],
      actions: ["Créer note brouillon", "Préparer facture brouillon", "Lancer Suivi Signature"],
      guardrail: "Rien n’est enregistré dans le dossier clinique sans validation du vétérinaire.",
      integrations: ["Dictée vocale", "Dossier clinique", "Facturation", "Audit IA"]
    },
    reception: {
      status: "Page réception IA ouverte",
      steps: ["Répondre à une demande entrante", "Identifier propriétaire/animal", "Qualifier routine vs sensible", "Créer action clinique"],
      actions: ["Créer tâche accueil", "Préparer réponse", "Escalader si complexe"],
      guardrail: "L’agent transfère à l’équipe dès qu’une demande devient clinique, urgente ou sensible.",
      integrations: ["Téléphonie", "WhatsApp", "FAQ clinique", "PIMS/CRM"]
    },
    agenda: {
      status: "Page agenda intelligent ouverte",
      steps: ["Lire disponibilités", "Éviter conflits vétérinaire/salle", "Proposer créneaux", "Confirmer ou mettre en attente"],
      actions: ["Simuler créneau", "Préparer confirmation", "Ouvrir automatisations"],
      guardrail: "Aucun créneau réel n’est bloqué sans API agenda et règles de validation.",
      integrations: ["Google Calendar", "Doctolib/Vetstoria", "Règles motifs"]
    },
    vaccines: {
      status: "Page séquence vaccin ouverte",
      steps: ["Importer échéances", "Segmenter animaux à rappeler", "Programmer messages", "Suivre confirmations"],
      actions: ["Créer rappel J-30", "Créer rappel J-7", "Créer rappel J-2"],
      guardrail: "Respect du consentement et désinscription claire pour les communications.",
      integrations: ["Base vaccinale", "WhatsApp/email", "Consentement"]
    }
  };

  function renderAutomationChips(items) {
    return (items || []).map((item) => "<span>" + item + "</span>").join("");
  }

  function renderAutomationSteps(items) {
    return (items || []).map((item, index) => "<li><span>0" + (index + 1) + "</span><p>" + item + "</p></li>").join("");
  }

  function renderVetAgentResult(targetId, scenarioKey) {
    const target = document.getElementById(targetId);
    const scenario = vetAgentScenarios[scenarioKey];
    if (!target || !scenario) return;
    target.innerHTML = '<span class="vet-agent-result-icon" aria-hidden="true">✦</span><div><strong>' + scenario.title + '</strong><p>' + scenario.copy + '</p><small>' + scenario.next + '</small></div>';
  }

  document.querySelectorAll("[data-vet-agent-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.vetAgentAction;
      renderVetAgentResult("vet-agent-live-output", action);
      showToast("Module Vet Agent simulé : " + (vetAgentScenarios[action]?.title || "action préparée") + ".");
      if (action === "agenda") setRoute("agenda", true);
      if (action === "scribe") setRoute("signature", true);
    });
  });

  document.querySelectorAll("[data-vet-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = button.dataset.vetScenario;
      renderVetAgentResult("vet-agent-result", scenario);
      if (scenario === "triage") setConsultationPriority(true);
      appendAssistantMessage("assistant", "Vet Agent Studio : " + (vetAgentScenarios[scenario]?.title || "scénario préparé") + ".", vetAgentScenarios[scenario]?.next || "Action de démonstration préparée.");
      showToast("Scénario Vet Agent préparé dans Numa.");
    });
  });

  const productionChecks = Array.from(document.querySelectorAll("[data-production-check]"));
  const productionCheckCount = document.getElementById("production-check-count");
  const productionStatus = document.getElementById("production-status");
  function updateProductionReadiness() {
    const ready = productionChecks.filter((check) => check.checked).length;
    if (productionCheckCount) productionCheckCount.textContent = String(ready);
    if (!productionStatus) return;
    if (ready < 3) {
      productionStatus.innerHTML = "<strong>Priorité actuelle : base + WhatsApp + agenda.</strong><p>Sans ces trois briques, le produit reste une belle démo. Avec elles, tu peux vendre un pilote très cadré à une clinique.</p>";
    } else if (ready < 7) {
      productionStatus.innerHTML = "<strong>Bon début : tu peux préparer un pilote fermé.</strong><p>Continue avec IA sécurisée, automatisations, paiements et import CSV avant de promettre une utilisation complète.</p>";
    } else if (ready < productionChecks.length) {
      productionStatus.innerHTML = "<strong>Presque vendable en pilote réel.</strong><p>Il reste la supervision, les exports, la conformité et les tests de charge avant une commercialisation plus large.</p>";
    } else {
      productionStatus.innerHTML = "<strong>Checklist prototype → SaaS cochée.</strong><p>Prochaine étape : audit sécurité/juridique, vraie clinique pilote, mesure du temps gagné et itération produit.</p>";
    }
  }

  productionChecks.forEach((check) => {
    check.addEventListener("change", () => {
      updateProductionReadiness();
      showToast(check.checked ? "Brique marquée comme prête." : "Brique remise à préparer.");
    });
  });

  if (assistantToggle) {
    assistantToggle.addEventListener("click", () => {
      setAssistantOpen(assistantPanel ? assistantPanel.hidden : true);
    });
  }

  if (assistantClose) {
    assistantClose.addEventListener("click", () => setAssistantOpen(false));
  }

  document.querySelectorAll("[data-assistant-open]").forEach((button) => {
    button.addEventListener("click", () => setAssistantOpen(true));
  });

  document.querySelectorAll("[data-assistant-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompts = {
        reply: "Prépare un brouillon de réponse",
        callback: "Prépare un rappel pour Nala",
        doctolib: "Ouvre les règles Numa"
      };
      setAssistantOpen(true);
      runAssistantRequest(prompts[button.dataset.assistantAction] || "Aide-moi");
    });
  });

  if (assistantForm && assistantInput) {
    assistantForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const request = assistantInput.value;
      assistantInput.value = "";
      runAssistantRequest(request);
      window.requestAnimationFrame(() => assistantInput.focus({ preventScroll: true }));
    });
  }

  document.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
    button.addEventListener("click", () => runAssistantRequest(button.dataset.assistantPrompt));
  });

  document.addEventListener("pointerdown", (event) => {
    if (assistantPanel && !assistantPanel.hidden && assistantWidget && !assistantWidget.contains(event.target)) {
      setAssistantOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantPanel && !assistantPanel.hidden) setAssistantOpen(false);
    if (event.key === "Escape" && agendaModal && !agendaModal.hidden) setAgendaModal(false);
  });

  profileTabs.forEach((button) => {
    button.addEventListener("click", () => setProfileTab(button.dataset.profileTab));
  });

  themeChoices.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.themeChoice;
      applyTheme(choice, true);
      const labels = { light: "Mode clair activé.", white: "Mode blanc activé.", dark: "Mode sombre activé.", black: "Mode noir activé.", system: "Mode système activé." };
      showToast(labels[choice] || "Thème mis à jour.");
    });
  });

  themeQuickButtons.forEach((button) => {
    button.dataset.themeQuickBound = "true";
    button.addEventListener("click", () => {
      const nextTheme = nextThemeChoice();
      applyTheme(nextTheme, true);
      const labels = { light: "Mode clair activé.", dark: "Mode sombre activé." };
      showToast(labels[nextTheme] || "Thème mis à jour.");
    });
  });

  if (window.matchMedia) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const refreshSystemTheme = () => {
      let stored = null;
      try {
        stored = window.localStorage.getItem("strivea-theme");
      } catch (error) {
        stored = null;
      }
      if (stored !== "light" && stored !== "dark") applyTheme(preferredTheme(), false);
    };
    if (systemTheme.addEventListener) systemTheme.addEventListener("change", refreshSystemTheme);
    else if (systemTheme.addListener) systemTheme.addListener(refreshSystemTheme);
  }

  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });

  applyTheme(preferredTheme(), false);
  setProfileTab("overview");
  updatePatientContext(selectedPatientKey);
  refreshAgendaPatientOptions();
  syncAgendaClientMode();
  renderAppointments();
  setConsultationPriority(consultationPriorityActive);
  updatelaunchProgress();
  updatelaunchReview();
  updateProductionReadiness();
  syncRouteFromLocation(false);
})();
