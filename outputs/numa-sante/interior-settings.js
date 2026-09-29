(() => {
  const byId = id => document.getElementById(id);
  const documentLibrary = window.StriveaDocumentLibrary;
  const settingsKey = 'strivea-vet-interior-settings-v1';
  const routeCopy = {
    today: ['Aujourd’hui', 'Suivis actifs, exceptions, alertes et synthèses à relire.'],
    messages: ['Animaux', 'Statuts de suivi, timeline, synthèses et reprise humaine.'],
    numa: ['Numa', 'Cadre, autonomie, lien RDV, avis Google, alertes clinique et limites de l’assistant.'],
    programme: ['Protocoles', 'Étapes, QCM, documents et parcours post-visite.'],
    aaron: ['AARON', 'Plan de lancement et choses à terminer avant un vrai SaaS.'],
    urgent: ['Urgence & cadre', 'Consignes, limites et mentions indispensables.'],
    profile: ['Profil clinique', 'Équipe, accès et informations du compte.']
  };
  const defaults = {
    cabinet: {
      name: 'Clinique Laurent Vet',
      practitioner: 'Dr Emma Laurent',
      specialty: 'Médecine vétérinaire',
      tone: 'Chaleureux et rassurant',
      whatsapp: '+33 6 00 00 00 00',
      sendWindow: '9h-19h · jours ouvrés',
      striveaLink: 'https://strivea.demo/suivi/nala',
      googleLink: 'https://g.page/r/CliniqueLaurentVetDemo/review'
    },
    autonomy: {
      reminders: true,
      doctolib: true,
      review: true,
      freeReview: true,
      humanLevel: 'balanced',
      maxFollowups: 2,
      appointmentAlert: true,
      appointmentTrigger: 'Le propriétaire décrit un signe prévu par le protocole : appétit absent, plaie rouge/suintante, vomissements répétés, abattement marqué ou demande un rappel.'
    },
    frame: {
      profileMode: 'Équilibré · clair et humain',
      alertThreshold: 'Standard · seulement les écarts importants',
      followupStyle: 'Post-opératoire',
      freeQuestions: true,
      hoursLimit: true,
      rdvValidation: true
    },
    documents: {
      defaultCategory: 'Consignes de convalescence',
      defaultVisibility: 'patient',
      notes: '',
      items: []
    }
  };

  const memory = new Map();
  let documentRenderRun = 0;
  let settings = loadSettings();
  let protocolReferenceFiles = [];
  const protocolDocumentMaxSize = 10 * 1024 * 1024;
  const protocolDocumentExtensions = /\.(pdf|docx?|txt)$/i;
  const protocolImageExtensions = /\.(png|jpe?g|webp|gif|bmp|svg|heic|heif)$/i;

  function mergeSettings(saved) {
    return {
      cabinet: {...defaults.cabinet, ...(saved?.cabinet || {})},
      autonomy: {...defaults.autonomy, ...(saved?.autonomy || {})},
      frame: {...defaults.frame, ...(saved?.frame || {})},
      documents: {
        ...defaults.documents,
        ...(saved?.documents || {}),
        items: Array.isArray(saved?.documents?.items) ? saved.documents.items.map(normalizeDocument) : []
      }
    };
  }

  function normalizeDocument(item) {
    const storedType = String(item?.type || '');
    const selectedType = item?.category
      || (storedType && !storedType.includes('/') ? storedType : '')
      || defaults.documents.defaultCategory;
    const fileKind = String(item?.fileKind || item?.mimeType || (storedType.includes('/') ? storedType : '') || 'Document');
    const status = item?.status === 'validated' || item?.status === 'validé' || item?.approved ? 'validated' : 'pending';
    return {
      id: item?.id || cryptoId(),
      name: String(item?.name || 'Document sans nom'),
      size: Number(item?.size || 0),
      type: String(selectedType),
      category: String(selectedType),
      fileKind,
      visibility: item?.visibility === 'team' ? 'team' : 'patient',
      approved: status === 'validated',
      status,
      notes: String(item?.notes || ''),
      hasFile: item?.hasFile !== false,
      addedAt: item?.addedAt || new Date().toISOString(),
      objectUrl: item?.objectUrl || '',
      file: item?.file || null
    };
  }

  function loadSettings() {
    try {
      return mergeSettings(JSON.parse(localStorage.getItem(settingsKey)));
    } catch {
      return mergeSettings(null);
    }
  }

  function saveSettings(message) {
    try {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      if (message) showToast(message);
      return true;
    } catch {
      showToast('Impossible d’enregistrer sur cet appareil.');
      return false;
    }
  }

  function cryptoId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return 'doc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }

  function setValue(id, value) {
    const input = byId(id);
    if (!input) return;
    if (input.type === 'checkbox') input.checked = Boolean(value);
    else input.value = value ?? '';
  }

  function getValue(id) {
    const input = byId(id);
    if (!input) return '';
    return input.type === 'checkbox' ? input.checked : input.value.trim();
  }

  function safeUrl(value, fallback) {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : fallback;
    } catch {
      return fallback;
    }
  }

  function showToast(message) {
    const toast = byId('toast');
    if (!toast || !message) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function updateInteriorHeader() {
    const route = document.body.dataset.route;
    const copy = routeCopy[route];
    const title = byId('interior-page-title');
    const subtitle = byId('interior-page-subtitle');
    if (!copy || !title || !subtitle) return;
    title.textContent = copy[0];
    subtitle.textContent = copy[1];
  }

  function setupSearch() {
    const input = byId('interior-search');
    const results = byId('interior-search-results');
    if (!input || !results) return;
    const index = [
      ['Nala · Claire Martin', 'Animal + propriétaire · urgence probable', 'messages'],
      ['Oslo · Karim Benali', 'Animal + propriétaire · à surveiller', 'messages'],
      ['Protocole post-stérilisation', 'Étapes, QCM, soins et documents vétérinaires', 'programme'],
      ['Documents vétérinaires', 'Consignes de convalescence, questionnaires et références', 'programme'],
      ['Cadre de Numa', 'Ton, clinique, WhatsApp et lien Strivea Vet', 'numa'],
      ['Autonomie Numa', 'Rappels, lien RDV, avis Google et validation humaine', 'numa'],
      ['Alerte clinique', 'Quand Numa signale une attention nécessaire', 'numa'],
      ['Règles RDV & avis', 'Rendez-vous vétérinaire et avis Google encadrés dans Numa', 'numa'],
      ['Urgence', 'Cadre, numéros et consignes', 'urgent'],
      ['Thème sombre', 'Préférences d’apparence', 'profile']
    ];
    input.addEventListener('input', () => {
      const query = input.value.trim().toLocaleLowerCase('fr');
      results.replaceChildren();
      if (!query) {
        results.hidden = true;
        return;
      }
      const matches = index.filter(item => item.join(' ').toLocaleLowerCase('fr').includes(query)).slice(0, 5);
      matches.forEach(([label, note, route]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = `<strong></strong><small></small>`;
        button.querySelector('strong').textContent = label;
        button.querySelector('small').textContent = note;
        button.addEventListener('click', () => {
          document.querySelector(`[data-route="${route}"]`)?.click();
          input.value = '';
          results.hidden = true;
        });
        results.append(button);
      });
      if (!matches.length) {
        const empty = document.createElement('p');
        empty.textContent = 'Aucun résultat dans cette démo.';
        results.append(empty);
      }
      results.hidden = false;
    });
    document.addEventListener('pointerdown', event => {
      if (!results.hidden && !results.contains(event.target) && event.target !== input) results.hidden = true;
    });
  }

  function setupThemeQuickButton() {
    const button = document.querySelector('[data-theme-quick]');
    if (!button) return;
    if (button.dataset.themeQuickBound === 'true') return;
    const themeCycle = ['light', 'dark'];
    const themeLabels = {
      light: 'Clair',
      dark: 'Sombre'
    };
    const themeIcons = {
      light: '☀',
      dark: '☾'
    };
    const setTheme = next => {
      const baseTheme = next === 'dark' ? 'dark' : 'light';
      document.documentElement.dataset.theme = baseTheme;
      document.documentElement.dataset.themePreference = next;
      document.documentElement.dataset.themeVariant = 'standard';
      const currentIndex = themeCycle.indexOf(next);
      const following = themeCycle[(currentIndex + 1) % themeCycle.length];
      button.classList.toggle('is-dark', baseTheme === 'dark');
      button.classList.remove('is-white', 'is-black');
      button.textContent = themeIcons[next] || themeIcons.light;
      button.setAttribute('aria-label', `Thème ${themeLabels[next]} actif. Passer au mode ${themeLabels[following]}.`);
      button.setAttribute('title', `Thème ${themeLabels[next]} · prochain : ${themeLabels[following]}`);
      try {
        window.localStorage.setItem('strivea-theme', next);
      } catch {
        // La préférence visuelle reste active même si le stockage local est indisponible.
      }
    };
    button.addEventListener('click', () => {
      const current = document.documentElement.dataset.themePreference;
      const fallback = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const activeChoice = themeCycle.includes(current) ? current : fallback;
      const next = themeCycle[(themeCycle.indexOf(activeChoice) + 1) % themeCycle.length];
      setTheme(next);
    });
  }

  function applyCabinetSettings() {
    setValue('cabinet-name', settings.cabinet.name);
    setValue('practitioner-name', settings.cabinet.practitioner);
    setValue('specialty-select', settings.cabinet.specialty);
    setValue('tone-select', settings.cabinet.tone);
    setValue('whatsapp-number', settings.cabinet.whatsapp);
    setValue('send-window', settings.cabinet.sendWindow);
    setValue('strivea-link', settings.cabinet.striveaLink);
    setValue('cabinet-google-link', settings.cabinet.googleLink);
    setValue('google-review-link', settings.cabinet.googleLink);
    updateCabinetPreview();
  }

  function readCabinetSettings() {
    const activeId = document.activeElement?.id;
    const googleLink = activeId === 'cabinet-google-link' || activeId === 'google-review-link'
      ? getValue(activeId)
      : getValue('cabinet-google-link') || getValue('google-review-link') || settings.cabinet.googleLink || defaults.cabinet.googleLink;
    settings.cabinet = {
      name: getValue('cabinet-name') || defaults.cabinet.name,
      practitioner: getValue('practitioner-name') || defaults.cabinet.practitioner,
      specialty: getValue('specialty-select') || defaults.cabinet.specialty,
      tone: getValue('tone-select') || defaults.cabinet.tone,
      whatsapp: getValue('whatsapp-number') || defaults.cabinet.whatsapp,
      sendWindow: getValue('send-window') || defaults.cabinet.sendWindow,
      striveaLink: getValue('strivea-link') || defaults.cabinet.striveaLink,
      googleLink: googleLink || defaults.cabinet.googleLink
    };
  }

  function updateCabinetPreview() {
    readCabinetSettings();
    const cabinetName = settings.cabinet.name;
    const practitioner = settings.cabinet.practitioner;
    const firstPreview = byId('preview-practitioner');
    if (firstPreview) firstPreview.textContent = practitioner;
    const specialtyLabel = byId('specialty-label');
    if (specialtyLabel) specialtyLabel.textContent = ' ' + settings.cabinet.specialty.toLocaleLowerCase('fr');
    const striveaPreview = byId('strivea-preview');
    if (striveaPreview) striveaPreview.href = safeUrl(settings.cabinet.striveaLink, defaults.cabinet.striveaLink);
    const googleReviewPreview = byId('google-review-preview');
    if (googleReviewPreview) googleReviewPreview.href = safeUrl(settings.cabinet.googleLink, defaults.cabinet.googleLink);
    ['cabinet-google-link', 'google-review-link'].forEach(id => {
      const input = byId(id);
      if (input && document.activeElement !== input) input.value = settings.cabinet.googleLink;
    });
    document.querySelectorAll('.preview-phone-head strong').forEach(node => {
      if (node.textContent.includes('Numa')) node.textContent = 'Numa · ' + cabinetName;
    });
    const profileName = document.querySelector('.profile-identity h2');
    if (profileName) profileName.textContent = practitioner;
    const profileRole = document.querySelector('.profile-identity p');
    if (profileRole) profileRole.textContent = settings.cabinet.specialty + ' · ' + cabinetName;
    const sidebarName = document.querySelector('.profile-nav strong');
    if (sidebarName) sidebarName.textContent = practitioner;

    const preview = byId('cabinet-live-preview');
    if (!preview) return;
    preview.innerHTML = '';
    [
      ['Identité propriétaire', `Numa se présente comme l’IA de suivi de ${cabinetName}.`],
      ['Vétérinaire référent', `${practitioner} · ${settings.cabinet.specialty}`],
      ['Canal', `${settings.cabinet.whatsapp} · ${settings.cabinet.sendWindow}`],
      ['Ton', settings.cabinet.tone]
    ].forEach(([label, value]) => {
      const row = document.createElement('p');
      row.innerHTML = '<strong></strong><span></span>';
      row.querySelector('strong').textContent = label;
      row.querySelector('span').textContent = value;
      preview.append(row);
    });
    fillFramePreview(byId('numa-frame-live-preview'), false);
    fillFramePreview(byId('numa-frame-current'), true);
  }

  function setupCabinetSettings() {
    applyCabinetSettings();
    ['cabinet-name', 'practitioner-name', 'specialty-select', 'tone-select', 'whatsapp-number', 'send-window', 'strivea-link', 'cabinet-google-link', 'google-review-link'].forEach(id => {
      byId(id)?.addEventListener('input', () => {
        updateCabinetPreview();
        saveSettings();
      });
      byId(id)?.addEventListener('change', () => {
        updateCabinetPreview();
        saveSettings();
      });
    });
    byId('save-programme')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      updateCabinetPreview();
      saveSettings('Cadre de la clinique enregistré.');
    }, true);
  }

  function applyAutonomySettings() {
    setValue('auto-reminders', settings.autonomy.reminders);
    setValue('auto-doctolib', settings.autonomy.doctolib);
    setValue('auto-review', settings.autonomy.review);
    setValue('free-response-review', settings.autonomy.freeReview);
    setValue('human-review-level', settings.autonomy.humanLevel);
    setValue('max-followups', settings.autonomy.maxFollowups);
    setValue('appointment-alert-enabled', settings.autonomy.appointmentAlert);
    setValue('appointment-trigger', settings.autonomy.appointmentTrigger);
    updateAutonomyPreview();
  }

  function readAutonomySettings() {
    settings.autonomy = {
      reminders: Boolean(getValue('auto-reminders')),
      doctolib: Boolean(getValue('auto-doctolib')),
      review: Boolean(getValue('auto-review')),
      freeReview: Boolean(getValue('free-response-review')),
      humanLevel: getValue('human-review-level') || defaults.autonomy.humanLevel,
      maxFollowups: Math.max(0, Math.min(6, Number(getValue('max-followups') || 0))),
      appointmentAlert: Boolean(getValue('appointment-alert-enabled')),
      appointmentTrigger: getValue('appointment-trigger') || defaults.autonomy.appointmentTrigger
    };
  }

  function updateAutonomyPreview() {
    readAutonomySettings();
    const preview = byId('autonomy-live-preview');
    if (!preview) return;
    const active = [
      settings.autonomy.reminders,
      settings.autonomy.doctolib,
      settings.autonomy.review,
      settings.autonomy.freeReview,
      settings.autonomy.appointmentAlert
    ].filter(Boolean).length;
    const modeLabels = {
      balanced: 'Relire les cas sensibles',
      strict: 'Relire avant tout contenu non prévu',
      manual: 'Numa prépare, la clinique valide'
    };
    preview.innerHTML = '';
    const score = document.createElement('strong');
    score.textContent = active + '/5 actifs';
    const rows = [
      ['Mode', modeLabels[settings.autonomy.humanLevel] || modeLabels.balanced],
      ['Relances', settings.autonomy.reminders ? settings.autonomy.maxFollowups + ' maximum' : 'Désactivées'],
      ['Lien RDV', settings.autonomy.doctolib ? 'Proposé selon règle validée' : 'Jamais proposé automatiquement'],
      ['Avis Google', settings.autonomy.review ? 'Autorisé par protocole' : 'Désactivé'],
      ['Alerte clinique', settings.autonomy.appointmentAlert ? 'Consultation à évaluer signalée' : 'En pause']
    ];
    preview.append(score, ...rows.map(([label, value]) => {
      const row = document.createElement('p');
      row.innerHTML = '<span></span><b></b>';
      row.querySelector('span').textContent = label;
      row.querySelector('b').textContent = value;
      return row;
    }));
    fillFramePreview(byId('numa-frame-live-preview'), false);
    fillFramePreview(byId('numa-frame-current'), true);
  }

  function setupAutonomySettings() {
    applyAutonomySettings();
    ['auto-reminders', 'auto-doctolib', 'auto-review', 'free-response-review', 'human-review-level', 'max-followups', 'appointment-alert-enabled', 'appointment-trigger'].forEach(id => {
      const element = byId(id);
      if (!element) return;
      element.addEventListener('input', () => {
        updateAutonomyPreview();
        saveSettings();
      });
      element.addEventListener('change', () => {
        updateAutonomyPreview();
        saveSettings();
      });
    });
    byId('save-autonomy-config')?.addEventListener('click', () => {
      updateAutonomyPreview();
      saveSettings('Niveau d’autonomie enregistré.');
    });
  }

  function applyFrameSettings() {
    setValue('numa-profile-mode', settings.frame.profileMode);
    setValue('numa-alert-threshold', settings.frame.alertThreshold);
    setValue('numa-followup-style', settings.frame.followupStyle);
    setValue('numa-free-questions', settings.frame.freeQuestions);
    setValue('numa-hours-limit', settings.frame.hoursLimit);
    setValue('numa-rdv-validation', settings.frame.rdvValidation);
    updateFramePreview();
  }

  function readFrameSettings() {
    settings.frame = {
      profileMode: getValue('numa-profile-mode') || defaults.frame.profileMode,
      alertThreshold: getValue('numa-alert-threshold') || defaults.frame.alertThreshold,
      followupStyle: getValue('numa-followup-style') || defaults.frame.followupStyle,
      freeQuestions: Boolean(getValue('numa-free-questions')),
      hoursLimit: Boolean(getValue('numa-hours-limit')),
      rdvValidation: Boolean(getValue('numa-rdv-validation'))
    };
  }

  function frameRows() {
    const reviewLabels = {
      balanced: 'Validation humaine sur les cas sensibles',
      strict: 'Validation avant tout contenu non prévu',
      manual: 'Numa prépare seulement, l’équipe valide tout'
    };
    return [
      ['Clinique', settings.cabinet.name],
      ['Référent', settings.cabinet.practitioner],
      ['Ton', settings.cabinet.tone],
      ['Canal', settings.cabinet.whatsapp],
      ['Plage', settings.cabinet.sendWindow],
      ['Personnalité', settings.frame.profileMode],
      ['Sensibilité', settings.frame.alertThreshold],
      ['Suivi principal', settings.frame.followupStyle],
      ['Questions libres', settings.frame.freeQuestions ? 'Acceptées puis filtrées' : 'Désactivées'],
      ['Hors horaires', settings.frame.hoursLimit ? 'Messages non urgents bloqués' : 'Selon protocole'],
      ['Lien RDV', settings.frame.rdvValidation ? 'Validation équipe obligatoire' : 'Proposition selon règle publiée'],
      ['Avis Google', settings.autonomy.review ? 'Autorisé selon protocole' : 'Désactivé'],
      ['Alerte clinique', settings.autonomy.appointmentAlert ? 'Active' : 'En pause'],
      ['Relecture', reviewLabels[settings.autonomy.humanLevel] || reviewLabels.balanced],
      ['Relances', settings.autonomy.reminders ? settings.autonomy.maxFollowups + ' maximum' : 'Désactivées']
    ];
  }

  function fillFramePreview(target, compact) {
    if (!target) return;
    target.innerHTML = '';
    const title = document.createElement('strong');
    title.textContent = compact ? 'Cadre actuel de Numa' : 'Cadre modifiable enregistré';
    target.append(title);
    frameRows().forEach(([label, value]) => {
      const row = document.createElement('p');
      row.innerHTML = '<span></span><b></b>';
      row.querySelector('span').textContent = label;
      row.querySelector('b').textContent = value;
      target.append(row);
    });
  }

  function updateFramePreview() {
    readFrameSettings();
    fillFramePreview(byId('numa-frame-live-preview'), false);
    fillFramePreview(byId('numa-frame-current'), true);
  }

  function setupFrameSettings() {
    applyFrameSettings();
    ['numa-profile-mode', 'numa-alert-threshold', 'numa-followup-style', 'numa-free-questions', 'numa-hours-limit', 'numa-rdv-validation'].forEach(id => {
      const element = byId(id);
      if (!element) return;
      element.addEventListener('input', () => {
        updateFramePreview();
        saveSettings();
      });
      element.addEventListener('change', () => {
        updateFramePreview();
        saveSettings();
      });
    });
    byId('save-numa-frame-config')?.addEventListener('click', () => {
      updateFramePreview();
      saveSettings('Cadre avancé de Numa enregistré.');
    });
    byId('save-full-numa-frame')?.addEventListener('click', () => {
      updateCabinetPreview();
      updateAutonomyPreview();
      updateFramePreview();
      saveSettings('Tout le cadre de Numa est enregistré.');
    });
    document.querySelectorAll('[data-open-numa-settings]').forEach(button => {
      button.addEventListener('click', () => {
        const details = byId('numa-advanced-settings');
        if (details) {
          details.open = true;
          window.requestAnimationFrame(() => details.scrollIntoView({behavior: 'smooth', block: 'start'}));
        }
        showToast('Réglages avancés ouverts : vous pouvez modifier le cadre de Numa.');
      });
    });
  }

  function formatSize(size) {
    const bytes = Math.max(0, Number(size || 0));
    if (!bytes) return '0 Ko';
    if (bytes < 1024 * 1024) return Math.max(1, Math.ceil(bytes / 1024)) + ' Ko';
    return (bytes / 1024 / 1024).toFixed(1).replace('.', ',') + ' Mo';
  }

  function isAllowedProtocolFile(file) {
    const type = String(file?.type || '');
    const name = String(file?.name || '');
    return protocolDocumentExtensions.test(name) || protocolImageExtensions.test(name) || type.startsWith('image/');
  }

  function fileTypeLabel(file) {
    const type = String(file?.type || '');
    const extension = String(file?.name || '').split('.').pop()?.toUpperCase();
    if (type.startsWith('image/')) return 'Image';
    if (/\.pdf$/i.test(file.name)) return 'PDF';
    if (/\.docx?$/i.test(file.name)) return 'Word';
    if (/\.txt$/i.test(file.name)) return 'Texte';
    return extension || 'Document';
  }

  function validateProtocolFile(file) {
    if (!isAllowedProtocolFile(file)) {
      return {ok: false, reason: 'format non autorisé'};
    }
    if (file.size > protocolDocumentMaxSize) {
      return {ok: false, reason: 'plus de 10 Mo'};
    }
    return {ok: true, reason: ''};
  }

  async function loadStoredDocuments() {
    return protocolReferenceFiles;
  }

  async function updateStoredDocument(id, changes, message) {
    if (changes && Object.prototype.hasOwnProperty.call(changes, 'status')) {
      changes.approved = changes.status === 'validated';
    }
    if (changes && Object.prototype.hasOwnProperty.call(changes, 'approved')) {
      changes.status = changes.approved ? 'validated' : 'pending';
    }
    const item = protocolReferenceFiles.find(documentItem => documentItem.id === id);
    if (item) Object.assign(item, changes);
    if (message) showToast(message);
    renderDocuments();
  }

  async function openStoredDocument(item, button) {
    const url = item.objectUrl || '';
    if (!url) {
      showToast('Fichier à réimporter depuis votre ordinateur.');
      if (button) button.textContent = 'À réimporter';
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function applyDocumentSettings() {
    setValue('protocol-document-category', settings.documents.defaultCategory);
    setValue('protocol-document-visibility', settings.documents.defaultVisibility);
    setValue('protocol-notes', settings.documents.notes);
    renderDocuments();
  }

  function readDocumentDefaults() {
    settings.documents.defaultCategory = getValue('protocol-document-category') || defaults.documents.defaultCategory;
    settings.documents.defaultVisibility = getValue('protocol-document-visibility') || defaults.documents.defaultVisibility;
    settings.documents.notes = getValue('protocol-notes');
  }

  function setUploadFeedback(message) {
    const feedback = byId('protocol-upload-feedback');
    if (feedback && message) feedback.textContent = message;
  }

  function renderDocumentSummary(filteredItems) {
    const summary = byId('protocol-document-summary');
    if (!summary) return;
    const items = protocolReferenceFiles;
    const patientVisible = items.filter(item => item.visibility !== 'team').length;
    const approved = items.filter(item => item.approved || item.status === 'validated').length;
    const size = items.reduce((total, item) => total + Number(item.size || 0), 0);
    const data = [
      ['Documents', String(items.length), 'références ajoutées'],
      ['Validés', String(approved), 'utilisables par Numa'],
      ['Côté propriétaire', String(patientVisible), 'visibles via le lien Strivea Vet'],
      ['Taille', formatSize(size), filteredItems.length === items.length ? 'total local' : 'filtré']
    ];
    summary.replaceChildren(...data.map(([label, value, note]) => {
      const item = document.createElement('article');
      item.innerHTML = '<strong></strong><span></span><small></small>';
      item.querySelector('strong').textContent = value;
      item.querySelector('span').textContent = label;
      item.querySelector('small').textContent = note;
      return item;
    }));
  }

  async function renderDocuments() {
    readDocumentDefaults();
    const list = byId('protocol-file-list');
    if (!list) return;
    documentRenderRun += 1;
    const items = protocolReferenceFiles;
    const query = getValue('protocol-document-search').toLocaleLowerCase('fr');
    const filtered = items.filter(item => (
      item.name + ' ' + item.type + ' ' + item.category + ' ' + item.visibility + ' ' + (item.approved || item.status === 'validated' ? 'validé' : 'en attente')
    ).toLocaleLowerCase('fr').includes(query));
    list.replaceChildren();
    renderDocumentSummary(filtered);

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'programme-empty-state';
      empty.textContent = protocolReferenceFiles.length ? 'Aucun document ne correspond à la recherche.' : 'Aucun document enregistré. Importez une fiche depuis votre ordinateur.';
      list.append(empty);
      if (!protocolReferenceFiles.length) {
        setUploadFeedback('Choisissez un fichier depuis votre ordinateur : il apparaîtra juste en dessous.');
      }
      return;
    }

    setUploadFeedback(`${protocolReferenceFiles.length} document${protocolReferenceFiles.length > 1 ? 's' : ''} enregistré${protocolReferenceFiles.length > 1 ? 's' : ''} juste en dessous.`);

    filtered.forEach(item => {
      const row = document.createElement('article');
      row.className = 'protocol-document-row';
      const main = document.createElement('div');
      main.className = 'document-main';
      const title = document.createElement('strong');
      title.textContent = item.name;
      const meta = document.createElement('small');
      meta.textContent = item.type + ' · ' + formatSize(item.size) + ' · importé le ' + new Date(item.addedAt).toLocaleDateString('fr-FR');
      main.append(title, meta);

      const category = document.createElement('select');
      ['Consignes de convalescence', 'Rappel de soins', 'Questionnaire propriétaire', 'Document administratif', 'Référence interne'].forEach(option => category.add(new Option(option, option)));
      category.value = item.type || item.category;
      category.addEventListener('change', () => {
        updateStoredDocument(item.id, {type: category.value, category: category.value});
      });

      const visibility = document.createElement('select');
      visibility.add(new Option('Visible propriétaire', 'patient'));
      visibility.add(new Option('Clinique uniquement', 'team'));
      visibility.value = item.visibility;
      visibility.addEventListener('change', () => {
        updateStoredDocument(item.id, {visibility: visibility.value});
      });

      const isApproved = item.approved || item.status === 'validated';
      const statusBadge = document.createElement('span');
      statusBadge.className = 'document-status-badge ' + (isApproved ? 'is-valid' : 'is-pending');
      statusBadge.textContent = isApproved ? 'Validé' : 'En attente';

      const validate = document.createElement('button');
      validate.type = 'button';
      validate.className = 'quiet-button';
      validate.textContent = isApproved ? 'Remettre en attente' : 'Valider';
      validate.addEventListener('click', () => {
        updateStoredDocument(
          item.id,
          {status: isApproved ? 'pending' : 'validated'},
          isApproved ? 'Document remis en attente.' : 'Document validé pour Numa.'
        );
      });

      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'quiet-button';
      open.textContent = 'Ouvrir';
      open.addEventListener('click', () => openStoredDocument(item, open));

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'quiet-button';
      remove.textContent = 'Supprimer';
      remove.addEventListener('click', () => {
        if (item.objectUrl) URL.revokeObjectURL(item.objectUrl);
        protocolReferenceFiles = protocolReferenceFiles.filter(documentItem => documentItem.id !== item.id);
        showToast('Document supprimé de la page.');
        renderDocuments();
      });
      row.append(main, category, visibility, statusBadge, validate, open, remove);
      list.append(row);
    });
  }

  async function importProtocolFiles(fileList) {
    readDocumentDefaults();
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const accepted = [];
    const rejected = [];
    files.forEach(file => {
      const validation = validateProtocolFile(file);
      if (validation.ok) accepted.push(file);
      else rejected.push(`${file.name} : ${validation.reason}`);
    });

    if (!accepted.length) {
      const reason = rejected.length ? ' ' + rejected.slice(0, 3).join(' · ') : '';
      setUploadFeedback('Aucun document importé.' + reason);
      showToast('Aucun document importé : format non autorisé ou fichier trop lourd.');
      return;
    }

    const saved = [];
    setUploadFeedback('Import en cours… les fichiers validés vont apparaître juste en dessous.');

    accepted.forEach(file => {
      const documentItem = normalizeDocument({
        id: cryptoId(),
        name: file.name,
        size: file.size,
        type: settings.documents.defaultCategory,
        category: settings.documents.defaultCategory,
        fileKind: fileTypeLabel(file),
        visibility: settings.documents.defaultVisibility,
        status: 'pending',
        approved: false,
        hasFile: true,
        objectUrl: URL.createObjectURL(file),
        file
      });
      saved.push(documentItem);
    });

    protocolReferenceFiles = [...saved, ...protocolReferenceFiles];
    await renderDocuments();

    const savedMessage = `${saved.length} document${saved.length > 1 ? 's' : ''} importé${saved.length > 1 ? 's' : ''} et enregistré${saved.length > 1 ? 's' : ''} dans la page.`;
    const rejectedMessage = rejected.length ? ' Refusé : ' + rejected.slice(0, 3).join(' · ') + (rejected.length > 3 ? '…' : '') : '';
    setUploadFeedback(savedMessage + rejectedMessage);
    const status = byId('protocol-document-status');
    if (status) status.textContent = 'Les documents importés restent en local dans cette démo. Ils sont prêts à être validés, filtrés ou supprimés.';
    showToast(savedMessage);
  }

  function setupDocuments() {
    applyDocumentSettings();
    byId('protocol-document-category')?.addEventListener('change', () => {
      readDocumentDefaults();
      saveSettings();
    });
    byId('protocol-document-visibility')?.addEventListener('change', () => {
      readDocumentDefaults();
      saveSettings();
    });
    byId('protocol-document-search')?.addEventListener('input', renderDocuments);
    byId('protocol-notes')?.addEventListener('input', () => {
      readDocumentDefaults();
      saveSettings();
    });
    const protocolFilesInput = byId('protocol-files');
    const protocolDropzone = byId('protocol-dropzone');
    const protocolFilePlus = byId('protocol-file-plus');
    const openProtocolPicker = () => {
      if (!protocolFilesInput) {
        setUploadFeedback('Sélecteur de fichiers indisponible dans cette page.');
        return;
      }
      protocolFilesInput.click();
    };

    protocolFilePlus?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openProtocolPicker();
    });
    protocolDropzone?.addEventListener('click', event => {
      event.preventDefault();
      openProtocolPicker();
    });
    protocolDropzone?.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openProtocolPicker();
    });
    ['dragenter', 'dragover'].forEach(type => {
      protocolDropzone?.addEventListener(type, event => {
        event.preventDefault();
        protocolDropzone.classList.add('is-dragover');
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
      });
    });
    ['dragleave', 'dragend', 'drop'].forEach(type => {
      protocolDropzone?.addEventListener(type, () => protocolDropzone.classList.remove('is-dragover'));
    });
    protocolDropzone?.addEventListener('drop', event => {
      event.preventDefault();
      importProtocolFiles(event.dataTransfer?.files);
    });
    protocolFilesInput?.addEventListener('change', async event => {
      await importProtocolFiles(event.target.files);
      event.target.value = '';
    });
    byId('save-document-config')?.addEventListener('click', () => {
      readDocumentDefaults();
      saveSettings('Documents et consignes enregistrés.');
      renderDocuments();
    });
    byId('copy-document-summary')?.addEventListener('click', async () => {
      readDocumentDefaults();
      await loadStoredDocuments();
      const approved = settings.documents.items.filter(item => item.approved || item.status === 'validated');
      const summary = [
        'Documents du protocole Strivea Vet',
        'Consignes Numa : ' + (settings.documents.notes || 'aucune consigne ajoutée'),
        ...approved.map(item => '- ' + item.name + ' · ' + (item.type || item.category) + ' · ' + (item.visibility === 'patient' ? 'visible propriétaire' : 'clinique uniquement'))
      ].join('\n');
      try {
        await navigator.clipboard.writeText(summary);
        showToast('Résumé clinique copié. Vous pouvez le coller dans une note interne.');
      } catch {
        byId('protocol-document-status').textContent = summary;
      }
    });
    byId('clear-protocol-documents')?.addEventListener('click', async () => {
      memory.forEach(value => URL.revokeObjectURL(value.url));
      memory.clear();
      if (documentLibrary?.clearDocuments) {
        try {
          await documentLibrary.clearDocuments();
        } catch {
          // La configuration locale est vidée juste après.
        }
      }
      settings.documents.items = [];
      saveSettings('Documents retirés de cette démo.');
      renderDocuments();
    });
    documentLibrary?.onChange?.(renderDocuments);
  }

  const observer = new MutationObserver(updateInteriorHeader);
  observer.observe(document.body, {attributes: true, attributeFilter: ['data-route']});
  updateInteriorHeader();
  setupSearch();
  setupThemeQuickButton();
  setupCabinetSettings();
  setupAutonomySettings();
  setupFrameSettings();
  setupDocuments();
})();
