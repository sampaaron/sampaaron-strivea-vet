(() => {
  const panel = document.querySelector('#view-programme .timeline-panel');
  const layout = document.querySelector('#view-programme .programme-layout');
  if (!panel || !layout) return;

  const byId = id => document.getElementById(id);
  const documentLibrary = window.StriveaDocumentLibrary;
  const key = 'strivea-vet-protocol-models-v1';
  const communityKey = 'strivea-vet-community-demo-v1';
  const fields = ['day', 'time', 'kind', 'channel', 'title', 'message', 'link'];
  const defaultStep = {
    day: 1,
    time: '10:00',
    kind: 'Message personnalisé',
    channel: 'WhatsApp',
    title: '',
    message: '',
    link: '',
    documents: []
  };
  const defaults = [
    {
      name: 'Post-stérilisation chien/chat',
      description: 'Retour à domicile, collerette, appétit, plaie et contrôle J7-J10.',
      steps: [
        {day: 0, time: '18:00', kind: 'Consignes de convalescence', channel: 'WhatsApp', title: 'Retour à domicile', message: 'Bonjour [Prénom], [Nom animal] est bien rentré(e). Ce soir : calme, surveillance de la plaie, collerette si indiquée, et contactez la clinique si un signe vous inquiète. Numa ne remplace pas votre vétérinaire.', link: ''},
        {day: 1, time: '10:00', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Point appétit et plaie', message: 'Comment va [Nom animal] ce matin ? A-t-il/elle mangé ? Son énergie vous semble-t-elle habituelle ? La plaie vous paraît-elle propre ? En cas de refus de manger, plaie rouge/suintante ou abattement marqué, la clinique sera alertée.', link: ''},
        {day: 3, time: '11:00', kind: 'Rappel de soins', channel: 'WhatsApp', title: 'Collerette et repos', message: 'Petit rappel pour [Nom animal] : limiter les sauts, éviter le léchage de la plaie et garder la collerette ou le body selon les consignes données par la clinique.', link: ''},
        {day: 7, time: '10:30', kind: 'Rappel de rendez-vous', channel: 'WhatsApp', title: 'Contrôle J7-J10', message: 'Si un contrôle ou retrait de points est prévu, vous pouvez prendre rendez-vous avec la clinique. Ce lien ne remplace pas un appel en cas d’urgence.', link: ''},
        {day: 14, time: '12:00', kind: 'Avis Google', channel: 'WhatsApp', title: 'Avis facultatif', message: 'Si l’évolution de [Nom animal] est positive et si vous le souhaitez, vous pouvez laisser un avis public à la clinique. C’est entièrement facultatif.', link: ''}
      ]
    },
    {
      name: 'Post-chirurgie orthopédique',
      description: 'Suivi renforcé après fracture, ligament croisé ou immobilisation.',
      steps: [
        {day: 0, time: '18:30', kind: 'Consignes de convalescence', channel: 'WhatsApp', title: 'Retour après chirurgie', message: 'Bonjour [Prénom], [Nom animal] doit rester au calme ce soir. Respectez les consignes de repos strict données par le vétérinaire et contactez la clinique en cas de douleur intense, gonflement important ou saignement.', link: ''},
        {day: 1, time: '10:00', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Point douleur et appétit', message: 'Comment se passe la première journée de [Nom animal] ? A-t-il/elle mangé ? Se déplace-t-il/elle comme prévu ? La zone opérée vous semble-t-elle propre ? Les réponses inquiétantes seront remontées à la clinique.', link: ''},
        {day: 3, time: '10:30', kind: 'Rappel de soins', channel: 'WhatsApp', title: 'Repos strict', message: 'Rappel : évitez escaliers, sauts, jeux et sorties longues. Suivez uniquement les consignes données par la clinique pour [Nom animal].', link: ''},
        {day: 7, time: '11:00', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Boiterie et comportement', message: 'Avez-vous observé une boiterie qui s’aggrave, une baisse d’énergie ou une gêne inhabituelle chez [Nom animal] ? Si oui, la clinique sera alertée pour relire la situation.', link: ''},
        {day: 21, time: '10:00', kind: 'Rappel de rendez-vous', channel: 'WhatsApp', title: 'Contrôle orthopédique', message: 'Un contrôle peut être nécessaire selon le protocole. Voici le lien de rendez-vous validé par la clinique si vous devez planifier la suite.', link: ''}
      ]
    },
    {
      name: 'Post-détartrage / extraction dentaire',
      description: 'Douleur, alimentation, haleine, saignement et contrôle si besoin.',
      steps: [
        {day: 0, time: '18:00', kind: 'Consignes de convalescence', channel: 'WhatsApp', title: 'Retour après soins dentaires', message: 'Bonjour [Prénom], [Nom animal] peut être fatigué(e) après les soins dentaires. Proposez uniquement ce que la clinique a recommandé et contactez-nous en cas de saignement important ou comportement inhabituel.', link: ''},
        {day: 1, time: '10:00', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Alimentation et confort', message: '[Nom animal] a-t-il/elle mangé ? Semble-t-il/elle gêné(e) pour boire ou mâcher ? Observez-vous un saignement ou une douleur inhabituelle ? Les réponses sensibles remontent à la clinique.', link: ''},
        {day: 3, time: '11:00', kind: 'Rappel de soins', channel: 'WhatsApp', title: 'Surveillance bouche', message: 'Petit point : surveillez l’appétit, la salivation, l’haleine et le comportement de [Nom animal]. Numa transmet les signaux prévus au protocole, sans interpréter médicalement.', link: ''},
        {day: 7, time: '10:30', kind: 'Prise de nouvelles', channel: 'WhatsApp', title: 'Évolution dentaire', message: 'Comment évolue [Nom animal] depuis les soins dentaires ? Si tout est stable, vous pouvez clôturer ce suivi. Si un doute persiste, la clinique peut relire votre message.', link: ''},
        {day: 14, time: '12:00', kind: 'Avis Google', channel: 'WhatsApp', title: 'Retour d’expérience', message: 'Si vous êtes satisfait(e) de l’accompagnement et si vous le souhaitez, vous pouvez laisser un avis public. C’est libre et facultatif.', link: ''}
      ]
    },
    {
      name: 'Suivi vaccinal',
      description: 'Rappel vaccinal, réactions éventuelles et clôture simple.',
      steps: [
        {day: 0, time: '17:30', kind: 'Consignes de convalescence', channel: 'WhatsApp', title: 'Après le vaccin', message: 'Bonjour [Prénom], [Nom animal] peut être un peu calme après son vaccin. Surveillez son comportement et contactez la clinique en cas de réaction marquée ou doute important.', link: ''},
        {day: 1, time: '10:00', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Réaction éventuelle', message: 'Comment va [Nom animal] aujourd’hui ? Appétit, énergie et comportement vous semblent-ils habituels ? Si vous observez un gonflement important, vomissements répétés ou abattement marqué, la clinique sera alertée.', link: ''},
        {day: 7, time: '12:00', kind: 'Message personnalisé', channel: 'WhatsApp', title: 'Clôture du suivi vaccinal', message: 'Sans signal particulier, le suivi vaccinal de [Nom animal] peut être clôturé. Vous pouvez toujours contacter la clinique si une question apparaît.', link: ''},
        {day: 300, time: '09:00', kind: 'Rappel de rendez-vous', channel: 'WhatsApp', title: 'Anticiper le rappel', message: 'Le rappel vaccinal de [Nom animal] approche. Voici le lien de rendez-vous validé par la clinique si vous souhaitez réserver un créneau.', link: ''}
      ]
    },
    {
      name: 'Pathologie chronique · diabète félin',
      description: 'Suivi long terme, observance, appétit, poids et signaux à remonter.',
      steps: [
        {day: 0, time: '18:00', kind: 'Consignes de convalescence', channel: 'WhatsApp', title: 'Mise en route du suivi', message: 'Bonjour [Prénom], Numa vous aide à suivre les consignes validées pour [Nom animal]. Elle ne modifie jamais un traitement et remonte vos réponses à la clinique si nécessaire.', link: ''},
        {day: 1, time: '09:00', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Point quotidien', message: 'Comment va [Nom animal] ? Appétit, énergie, prise du traitement, soif et comportement vous semblent-ils conformes aux consignes ? Toute réponse inquiétante sera transmise à la clinique.', link: ''},
        {day: 7, time: '09:30', kind: 'Questionnaire', channel: 'WhatsApp', title: 'Bilan de semaine', message: 'Bilan rapide : appétit, énergie, poids si renseigné, prise du traitement et questions éventuelles. Numa prépare une synthèse pour l’équipe, sans conclusion clinique automatique.', link: ''},
        {day: 30, time: '10:00', kind: 'Rappel de rendez-vous', channel: 'WhatsApp', title: 'Contrôle à planifier', message: 'Selon le protocole validé, un contrôle peut être utile. Voici le lien de rendez-vous de la clinique si vous devez programmer la suite.', link: ''},
        {day: 45, time: '12:00', kind: 'Message personnalisé', channel: 'WhatsApp', title: 'Synthèse longue durée', message: 'Numa prépare une synthèse des échanges et signaux déclarés pour aider la clinique à relire le suivi de [Nom animal].', link: ''}
      ]
    }
  ];

  const textValue = (value, fallback = '') => typeof value === 'string' ? value : fallback;
  const normalizeDocumentIds = value => Array.isArray(value)
    ? [...new Set(value.map(id => String(id || '').trim()).filter(Boolean))]
    : [];
  const normalizeStep = step => {
    const day = Number(step?.day);
    return {
      day: Number.isFinite(day) ? Math.max(0, Math.min(365, day)) : defaultStep.day,
      time: textValue(step?.time, defaultStep.time) || defaultStep.time,
      kind: textValue(step?.kind, defaultStep.kind) || defaultStep.kind,
      channel: textValue(step?.channel, defaultStep.channel) || defaultStep.channel,
      title: textValue(step?.title, 'Étape sans titre') || 'Étape sans titre',
      message: textValue(step?.message, ''),
      link: textValue(step?.link, ''),
      documents: normalizeDocumentIds(step?.documents)
    };
  };
  const normalizeModel = model => ({
    name: textValue(model?.name, 'Protocole sans titre') || 'Protocole sans titre',
    description: textValue(model?.description, ''),
    documents: normalizeDocumentIds(model?.documents),
    steps: Array.isArray(model?.steps) ? model.steps.map(normalizeStep).filter(step => step.message) : []
  });
  const clone = value => JSON.parse(JSON.stringify(value));
  const loadModels = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved)) return saved.map(normalizeModel);
    } catch {}
    return defaults.map(normalizeModel);
  };
  const loadCommunity = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(communityKey));
      if (Array.isArray(saved)) return saved.map(normalizeModel).filter(model => model.name);
    } catch {}
    return [];
  };

  let models = loadModels();
  let community = loadCommunity();
  let selected = 0;
  let editing = -1;
  let libraryTab = 'mine';
  let publicationDraft = null;
  let workspaceDocumentRender = 0;
  let stepDocumentRender = 0;

  panel.replaceChildren();
  panel.insertAdjacentHTML('beforeend', `
    <p class="eyebrow">Étapes du suivi</p>
    <h2>Composez votre protocole</h2>
    <p>J0 correspond au jour de la visite, intervention ou chirurgie. Personnalisez chaque message et son moment d’envoi.</p>
    <div class="protocol-toolbar">
      <label>Modèle enregistré<select id="protocol-model-select"></select></label>
      <button type="button" class="quiet-button" id="protocol-new">+ Nouveau protocole</button>
      <button type="button" class="quiet-button" id="protocol-copy">Dupliquer</button>
    </div>
    <label for="protocol-model-name">Nom du protocole</label>
    <input id="protocol-model-name" maxlength="100">
    <div class="protocol-toolbar">
      <button type="button" class="button button-forest" id="protocol-add">+ Ajouter une étape</button>
      <button type="button" class="quiet-button" id="protocol-save">Enregistrer et fermer</button>
    </div>
    <p id="protocol-save-status" class="field-help" role="status">Modèles conservés sur cet appareil. Aucun message réel n’est envoyé.</p>
    <div id="protocol-step-list"></div>
  `);

  const library = document.createElement('section');
  library.className = 'protocol-library panel';
  library.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Bibliothèque vétérinaire</p>
        <h2>Un bon suivi commence ici.</h2>
        <p>Retrouvez vos modèles, adaptez vos messages et gardez un œil sur ce qui partira après la visite.</p>
      </div>
      <button type="button" class="button button-forest" id="library-create">+ Créer un protocole</button>
    </div>
    <div class="protocol-insights" id="protocol-insights" aria-label="Résumé des protocoles"></div>
    <div class="library-controls">
      <div class="library-tabs" role="group" aria-label="Bibliothèque de protocoles">
        <button type="button" id="library-mine" aria-pressed="true">Mes protocoles</button>
        <button type="button" id="library-community" aria-pressed="false">Communauté · démo</button>
      </div>
      <label class="library-search"><span class="sr-only">Rechercher un protocole</span><input id="library-search" type="search" placeholder="Rechercher un protocole…"></label>
    </div>
    <p id="library-caption" class="field-help"></p>
    <div id="library-cards" class="library-cards"></div>
    <p id="library-feedback" role="status" class="field-help"></p>
  `;
  layout.before(library);
  layout.hidden = true;
  layout.style.display = 'none';

  const editor = document.createElement('dialog');
  editor.className = 'protocol-workspace';
  editor.setAttribute('aria-labelledby', 'protocol-workspace-title');
  editor.innerHTML = `
    <header class="protocol-workspace-header">
      <div><p class="eyebrow">Créateur de suivi</p><h2 id="protocol-workspace-title">Votre protocole</h2></div>
      <button type="button" class="quiet-button" id="workspace-close" aria-label="Fermer le protocole">Fermer ✕</button>
    </header>
    <div class="protocol-workspace-grid">
      <div id="workspace-editor"></div>
      <aside class="protocol-live-preview">
        <p class="eyebrow">Côté propriétaire</p>
        <h3>Aperçu de ce protocole</h3>
        <p class="field-help">Messages programmés · illustration, aucun envoi.</p>
        <div class="protocol-preview-head">Numa · Votre clinique vétérinaire</div>
        <div id="protocol-live-messages" aria-live="polite"></div>
        <div id="protocol-preview-documents" class="protocol-preview-documents" aria-live="polite"></div>
        <div class="workspace-document-box">
          <div class="protocol-picker-head">
            <div><p class="eyebrow">Documents joints</p><strong>Fichiers de ce protocole</strong></div>
            <button type="button" class="quiet-button" id="workspace-document-refresh">Actualiser</button>
          </div>
          <label class="protocol-file-import" for="workspace-document-import">
            <span>Importer depuis l’ordinateur</span>
            <small>PDF, Word, texte ou image · 10 Mo max.</small>
            <input id="workspace-document-import" type="file" multiple accept=".pdf,.doc,.docx,.txt,image/*" />
          </label>
          <p class="field-help" id="workspace-document-status">Choisissez les fichiers enregistrés dans “Documents vétérinaires”.</p>
          <div id="workspace-document-picker" class="protocol-document-picker"></div>
        </div>
      </aside>
    </div>
  `;
  document.body.append(editor);
  byId('workspace-editor').append(panel);

  const dialog = document.createElement('dialog');
  dialog.className = 'protocol-dialog';
  dialog.setAttribute('aria-labelledby', 'protocol-dialog-title');
  dialog.innerHTML = `
    <form id="protocol-step-form" novalidate>
      <div class="panel-heading">
        <h2 id="protocol-dialog-title">Ajouter une étape</h2>
        <button type="button" id="protocol-close" class="quiet-button" aria-label="Fermer">✕</button>
      </div>
      <label>Reprendre une étape enregistrée<select id="protocol-step-source"><option value="">Créer une étape personnalisée</option></select></label>
      <div class="protocol-fields">
        <label>Jour après la visite<input id="step-day" type="number" min="0" max="365" required value="1"></label>
        <label>Heure d’envoi<input id="step-time" type="time" required value="10:00"></label>
      </div>
      <div class="protocol-fields">
        <label>Type de contenu<select id="step-kind"><option>Avis Google</option><option>Prise de nouvelles</option><option>Consignes de convalescence</option><option>Rappel de soins</option><option>Questionnaire</option><option>Rappel de rendez-vous</option><option>Message personnalisé</option></select></label>
        <label>Canal<select id="step-channel"><option>WhatsApp</option><option>Espace propriétaire Strivea</option></select></label>
      </div>
      <label>Titre de l’étape<input id="step-title" maxlength="120"></label>
      <label>Message ou questions à envoyer<textarea id="step-message" rows="5" maxlength="4000"></textarea></label>
      <label>Lien associé (Google, fiche ou questionnaire)<input id="step-link" type="text" inputmode="url" placeholder="https://…"></label>
      <div class="step-document-box">
        <div class="protocol-picker-head">
          <div><p class="eyebrow">Documents enregistrés</p><strong>Joindre à cette étape</strong></div>
          <button type="button" class="quiet-button" id="step-document-refresh">Actualiser</button>
        </div>
        <label class="protocol-file-import" for="step-document-import">
          <span>Importer et joindre à cette étape</span>
          <small>Le fichier sera gardé dans les documents de la clinique.</small>
          <input id="step-document-import" type="file" multiple accept=".pdf,.doc,.docx,.txt,image/*" />
        </label>
        <div id="step-document-picker" class="protocol-document-picker protocol-document-picker-compact"></div>
      </div>
      <p class="field-help">Pour un avis Google, ajoutez le lien de la clinique. Demande facultative, proposée sans filtrer les propriétaires selon leur satisfaction. Les envois restent soumis au consentement et aux règles d’urgence vétérinaire.</p>
      <p id="protocol-step-feedback" class="field-help" role="status"></p>
      <div class="protocol-toolbar">
        <button type="button" id="protocol-cancel" class="quiet-button">Annuler</button>
        <button type="button" class="button button-forest" id="protocol-step-save">Enregistrer et fermer</button>
      </div>
    </form>
  `;
  document.body.append(dialog);

  const publish = document.createElement('button');
  publish.type = 'button';
  publish.id = 'protocol-publish';
  publish.className = 'quiet-button';
  publish.textContent = 'Partager à la communauté';
  byId('protocol-save').after(publish);

  const pubDialog = document.createElement('dialog');
  pubDialog.className = 'protocol-dialog';
  pubDialog.setAttribute('aria-labelledby', 'publish-title');
  pubDialog.innerHTML = `
    <form id="publish-form">
      <div class="panel-heading">
        <div><p class="eyebrow">Communauté Strivea</p><h2 id="publish-title">Partager votre protocole</h2></div>
        <button class="quiet-button" id="publish-close" type="button" aria-label="Fermer">✕</button>
      </div>
      <p>Les vétérinaires pourront consulter votre modèle et en créer une copie pour leur clinique.</p>
      <label>Présentation du modèle<textarea id="publish-description" required maxlength="500" rows="3" placeholder="À qui s’adresse ce suivi ? Quel est son objectif ?"></textarea></label>
      <p class="field-help">Vérifiez le contenu ci-dessous. Les liens privés sont retirés ; les documents joints ne sont pas partagés.</p>
      <div id="publish-preview" class="publish-preview"></div>
      <label class="publish-consent"><input id="publish-consent" type="checkbox" required> Je confirme avoir le droit de partager ces textes et qu’ils ne contiennent aucune donnée propriétaire ou animal identifiable.</label>
      <p class="field-help">Publication de démonstration sur cet appareil uniquement. La bibliothèque commune et la modération restent à connecter.</p>
      <div class="protocol-toolbar">
        <button type="button" class="quiet-button" id="publish-cancel">Annuler</button>
        <button class="button button-forest" type="submit">Publier et fermer</button>
      </div>
    </form>
  `;
  document.body.append(pubDialog);

  function setStatus(message) {
    const status = byId('protocol-save-status');
    if (status) status.textContent = message;
  }

  function persist(message = 'Modèles enregistrés sur cet appareil · aucun envoi réel.') {
    if (models[selected]) {
      models[selected].name = byId('protocol-model-name').value.trim() || 'Protocole sans titre';
      models[selected] = normalizeModel(models[selected]);
    }
    try {
      localStorage.setItem(key, JSON.stringify(models));
      setStatus(message);
      return true;
    } catch {
      setStatus('Enregistrement indisponible : gardez cette page ouverte pour conserver vos modifications.');
      return false;
    }
  }

  function updateProtocolModalLock() {
    const isOpen = Boolean(editor?.open || dialog?.open || pubDialog?.open);
    document.body.classList.toggle('protocol-modal-open', isOpen);
  }

  function closeDialog(dialogElement) {
    if (dialogElement?.open) dialogElement.close();
    updateProtocolModalLock();
  }

  function saveWorkspaceAndClose() {
    if (!persist('Protocole enregistré.')) return;
    closeDialog(editor);
    render();
    byId('library-feedback').textContent = 'Protocole enregistré.';
  }

  function orderedSteps(model) {
    return [...(model?.steps || [])].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  }

  function formatDocumentSize(size) {
    if (!size) return 'taille non disponible';
    if (size < 1024 * 1024) return Math.ceil(size / 1024) + ' Ko';
    return (size / 1024 / 1024).toFixed(1).replace('.', ',') + ' Mo';
  }

  async function savedDocuments() {
    if (!documentLibrary?.listDocuments) return [];
    try {
      return await documentLibrary.listDocuments();
    } catch {
      return [];
    }
  }

  async function importDocumentsFromInput(input, scope) {
    const files = Array.from(input?.files || []);
    if (!files.length) return;
    const feedback = scope === 'step' ? byId('protocol-step-feedback') : byId('workspace-document-status');
    if (!documentLibrary?.saveFiles) {
      if (feedback) feedback.textContent = 'Import indisponible dans cette démo.';
      return;
    }
    if (feedback) feedback.textContent = 'Import des documents en cours…';
    const result = await documentLibrary.saveFiles(files, {
      category: 'Consignes de convalescence',
      visibility: 'patient',
      approved: false
    });
    const saved = result.saved || [];
    const rejected = result.rejected || 0;
    if (input) input.value = '';

    if (scope === 'step') {
      const next = [...new Set([...checkedDocumentIds('step-document-picker'), ...saved.map(doc => doc.id)])];
      await renderStepDocuments(next);
    } else if (models[selected]) {
      const next = new Set(normalizeDocumentIds(models[selected].documents));
      saved.forEach(doc => next.add(doc.id));
      models[selected].documents = [...next];
      persist('Documents importés et joints au protocole.');
      await renderWorkspaceDocuments();
      renderLibrary();
    }

    if (feedback) {
      const imported = saved.length
        ? `${saved.length} document${saved.length > 1 ? 's' : ''} importé${saved.length > 1 ? 's' : ''} et prêt${saved.length > 1 ? 's' : ''}.`
        : 'Aucun document importé.';
      feedback.textContent = rejected
        ? imported + ' Certains fichiers dépassent 10 Mo ou ne sont pas acceptés.'
        : imported;
    }
  }

  function allModelDocumentIds(model) {
    const ids = new Set(normalizeDocumentIds(model?.documents));
    (model?.steps || []).forEach(step => normalizeDocumentIds(step.documents).forEach(id => ids.add(id)));
    return [...ids];
  }

  function saveModelsSilently() {
    try {
      localStorage.setItem(key, JSON.stringify(models));
    } catch {
      // Le statut principal signalera déjà si l’enregistrement devient impossible.
    }
  }

  function pruneMissingDocuments(docs) {
    const availableIds = new Set(docs.map(doc => doc.id));
    let changed = false;
    models.forEach(model => {
      const nextModelDocuments = normalizeDocumentIds(model.documents).filter(id => availableIds.has(id));
      if (nextModelDocuments.length !== normalizeDocumentIds(model.documents).length) changed = true;
      model.documents = nextModelDocuments;
      model.steps.forEach(step => {
        const previous = normalizeDocumentIds(step.documents);
        const next = previous.filter(id => availableIds.has(id));
        if (next.length !== previous.length) changed = true;
        step.documents = next;
      });
    });
    return changed;
  }

  function checkedDocumentIds(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`))
      .map(input => input.value)
      .filter(Boolean);
  }

  async function openSavedDocument(doc) {
    if (!documentLibrary?.createObjectUrl) return false;
    const url = await documentLibrary.createObjectUrl(doc.id);
    if (!url) return false;
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  }

  function documentOption(doc, checked, onToggle) {
    const row = document.createElement('article');
    row.className = 'protocol-document-option' + (checked ? ' is-selected' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = doc.id;
    checkbox.checked = checked;
    const main = document.createElement('div');
    main.className = 'protocol-document-option-main';
    const title = document.createElement('strong');
    title.textContent = doc.name;
    const meta = document.createElement('small');
    meta.textContent = `${doc.category} · ${doc.visibility === 'patient' ? 'visible propriétaire' : 'clinique'} · ${formatDocumentSize(doc.size)}`;
    main.append(title, meta);
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'quiet-button';
    open.textContent = 'Ouvrir';
    open.onclick = async event => {
      event.stopPropagation();
      const didOpen = await openSavedDocument(doc);
      if (!didOpen) open.textContent = 'À réimporter';
    };
    const toggle = () => {
      row.classList.toggle('is-selected', checkbox.checked);
      onToggle?.(checkbox.checked, doc);
    };
    checkbox.addEventListener('change', toggle);
    row.addEventListener('click', event => {
      if (event.target.closest('button,input,a,select,textarea')) return;
      checkbox.checked = !checkbox.checked;
      toggle();
    });
    row.append(checkbox, main, open);
    return row;
  }

  function renderPreviewDocuments(docs) {
    const container = byId('protocol-preview-documents');
    if (!container) return;
    const model = models[selected];
    const ids = allModelDocumentIds(model);
    const attached = docs.filter(doc => ids.includes(doc.id));
    container.replaceChildren();
    if (!attached.length) {
      const empty = document.createElement('p');
      empty.className = 'field-help';
      empty.textContent = 'Aucun document joint au protocole pour l’instant.';
      container.append(empty);
      return;
    }
    const title = document.createElement('strong');
    title.textContent = attached.length + ' document' + (attached.length > 1 ? 's' : '') + ' joint' + (attached.length > 1 ? 's' : '');
    const chips = document.createElement('div');
    chips.className = 'protocol-document-chips';
    attached.slice(0, 5).forEach(doc => {
      const chip = document.createElement('span');
      chip.textContent = doc.name;
      chips.append(chip);
    });
    if (attached.length > 5) {
      const more = document.createElement('span');
      more.textContent = '+' + (attached.length - 5);
      chips.append(more);
    }
    container.append(title, chips);
  }

  async function renderWorkspaceDocuments() {
    const picker = byId('workspace-document-picker');
    const status = byId('workspace-document-status');
    if (!picker) return;
    const version = ++workspaceDocumentRender;
    picker.replaceChildren();
    const loading = document.createElement('p');
    loading.className = 'library-empty';
    loading.textContent = 'Chargement des documents enregistrés…';
    picker.append(loading);
    const docs = await savedDocuments();
    if (version !== workspaceDocumentRender) return;
    const current = models[selected];
    if (!current) return;
    if (pruneMissingDocuments(docs)) saveModelsSilently();
    const checked = new Set(current.documents);
    picker.replaceChildren();
    renderPreviewDocuments(docs);
    if (status) {
      status.textContent = checked.size
        ? `${checked.size} fichier${checked.size > 1 ? 's' : ''} lié${checked.size > 1 ? 's' : ''} au protocole.`
        : 'Choisissez les fichiers enregistrés dans “Documents vétérinaires”.';
    }
    if (!docs.length) {
      const empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = 'Aucun fichier enregistré. Importez vos consignes depuis la zone “Documents vétérinaires”, puis revenez ici.';
      picker.append(empty);
      return;
    }
    docs.forEach(doc => {
      picker.append(documentOption(doc, checked.has(doc.id), isChecked => {
        const next = new Set(normalizeDocumentIds(current.documents));
        if (isChecked) next.add(doc.id);
        else next.delete(doc.id);
        current.documents = [...next];
        persist('Documents du protocole enregistrés.');
        renderPreviewDocuments(docs);
        renderLibrary();
        renderStepDocuments(checkedDocumentIds('step-document-picker'));
      }));
    });
  }

  async function renderStepDocuments(selectedIds = []) {
    const picker = byId('step-document-picker');
    if (!picker) return;
    const version = ++stepDocumentRender;
    const checked = new Set(normalizeDocumentIds(selectedIds));
    picker.replaceChildren();
    const docs = await savedDocuments();
    if (version !== stepDocumentRender) return;
    picker.replaceChildren();
    if (!docs.length) {
      const empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = 'Aucun fichier enregistré à joindre. Importez d’abord un document dans la page Protocoles.';
      picker.append(empty);
      return;
    }
    docs.forEach(doc => {
      picker.append(documentOption(doc, checked.has(doc.id), isChecked => {
        if (isChecked) checked.add(doc.id);
        else checked.delete(doc.id);
      }));
    });
  }

  function renderPreview() {
    const title = byId('protocol-workspace-title');
    const preview = byId('protocol-live-messages');
    if (!title || !preview) return;
    const model = models[selected];
    title.textContent = model?.name || 'Votre protocole';
    preview.replaceChildren();
    if (!model || !model.steps.length) {
      const empty = document.createElement('p');
      empty.className = 'library-empty';
      empty.textContent = 'Ajoutez une première étape : son message apparaîtra ici.';
      preview.append(empty);
      renderWorkspaceDocuments();
      return;
    }
    orderedSteps(model).forEach(step => {
      const time = document.createElement('p');
      time.className = 'protocol-preview-time';
      time.textContent = `J${step.day ? '+' + step.day : '0'} · ${step.time} · ${step.channel}`;
      const bubble = document.createElement('article');
      bubble.className = 'protocol-preview-message';
      const heading = document.createElement('strong');
      heading.textContent = step.title;
      const message = document.createElement('p');
      message.textContent = step.message;
      bubble.append(heading, message);
      if (step.link) {
        const link = document.createElement('span');
        link.className = 'protocol-preview-link';
        link.textContent = step.link;
        bubble.append(link);
      }
      if (normalizeDocumentIds(step.documents).length) {
        const docs = document.createElement('span');
        docs.className = 'protocol-preview-link';
        docs.textContent = normalizeDocumentIds(step.documents).length + ' document' + (normalizeDocumentIds(step.documents).length > 1 ? 's' : '') + ' joint' + (normalizeDocumentIds(step.documents).length > 1 ? 's' : '');
        bubble.append(docs);
      }
      preview.append(time, bubble);
    });
    renderWorkspaceDocuments();
  }

  function renderInsights() {
    const insights = byId('protocol-insights');
    if (!insights) return;
    const totalSteps = models.reduce((total, model) => total + model.steps.length, 0);
    const activeModels = models.filter(model => model.steps.length).length;
    const selectedSteps = models[selected]?.steps || [];
    const firstStep = selectedSteps.length ? Math.min(...selectedSteps.map(step => step.day)) : null;
    const appointmentToggle = byId('appointment-alert-enabled');
    const data = [
      ['Protocoles prêts', models.length ? `${activeModels}/${models.length}` : '0', 'modèles avec au moins une étape'],
      ['Étapes programmées', String(totalSteps), 'messages, QCM ou rappels'],
      ['Prochain départ', firstStep === null ? 'À créer' : `J${firstStep ? '+' + firstStep : '0'}`, 'dans le protocole ouvert'],
      ['Alertes clinique', appointmentToggle && !appointmentToggle.checked ? 'En pause' : 'Actives', 'RDV à valider par l’équipe']
    ];
    insights.replaceChildren(...data.map(([label, value, note]) => {
      const item = document.createElement('article');
      const strong = document.createElement('strong');
      const span = document.createElement('span');
      const small = document.createElement('small');
      strong.textContent = value;
      span.textContent = label;
      small.textContent = note;
      item.append(strong, span, small);
      return item;
    }));
  }

  function renderLibrary() {
    renderInsights();
    byId('library-mine').setAttribute('aria-pressed', String(libraryTab === 'mine'));
    byId('library-community').setAttribute('aria-pressed', String(libraryTab === 'community'));
    byId('library-caption').textContent = libraryTab === 'mine'
      ? 'Vos modèles privés · sélectionnez un protocole pour le modifier.'
      : 'Partages locaux de démonstration · à relire et adapter avant toute utilisation. Aucun protocole ici n’est certifié par Strivea.';

    const cards = byId('library-cards');
    const query = byId('library-search').value.trim().toLocaleLowerCase('fr');
    const source = libraryTab === 'mine' ? models : community;
    cards.replaceChildren();

    source.forEach((model, index) => {
      if (!model.name.toLocaleLowerCase('fr').includes(query)) return;
      const card = document.createElement('article');
      card.className = 'library-card is-clickable' + (libraryTab === 'mine' && index === selected ? ' is-selected' : '');
      const badge = document.createElement('small');
      badge.className = 'library-badge';
      badge.textContent = libraryTab === 'mine' ? (index === selected ? 'En cours d’édition' : 'Privé') : 'Partagé par vous · démo';
      const title = document.createElement('h3');
      title.textContent = model.name;
      const desc = document.createElement('p');
      desc.textContent = model.description || 'Messages et points de suivi personnalisables après la visite.';
      const meta = document.createElement('p');
      meta.className = 'field-help';
      const documentCount = allModelDocumentIds(model).length;
      meta.textContent = `${model.steps.length} étapes · ${model.steps.length ? 'J0 à J+' + Math.max(...model.steps.map(step => step.day)) : 'À construire'}${documentCount ? ' · ' + documentCount + ' doc. joint' + (documentCount > 1 ? 's' : '') : ''}`;
      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'quiet-button';
      action.textContent = libraryTab === 'mine' ? 'Ouvrir le protocole →' : 'Copier dans mes protocoles →';
      action.setAttribute('aria-label', 'Ouvrir ' + model.name);
      action.onclick = () => {
        persist();
        if (libraryTab === 'community') {
          const communityCopy = clone(model);
          communityCopy.name = model.name + ' — copie';
          communityCopy.documents = [];
          communityCopy.steps = communityCopy.steps.map(step => ({...step, documents: []}));
          models.push(normalizeModel(communityCopy));
          selected = models.length - 1;
          libraryTab = 'mine';
          persist('Copie enregistrée dans vos protocoles.');
        } else {
          selected = index;
        }
        openWorkspace();
      };
      card.append(badge, title, desc, meta, action);
      card.addEventListener('click', event => {
        if (!event.target.closest('button,a,input')) action.click();
      });

      if (libraryTab === 'mine') {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'quiet-button';
        remove.textContent = 'Supprimer';
        remove.setAttribute('aria-label', 'Supprimer ' + model.name);
        remove.onclick = () => {
          persist();
          const removed = models[index];
          models.splice(index, 1);
          selected = Math.max(0, selected - (index <= selected ? 1 : 0));
          if (models[selected]) byId('protocol-model-name').value = models[selected].name;
          persist();
          render();
          const feedback = byId('library-feedback');
          feedback.textContent = '« ' + removed.name + ' » supprimé. ';
          const undo = document.createElement('button');
          undo.type = 'button';
          undo.className = 'quiet-button';
          undo.textContent = 'Annuler la suppression';
          undo.onclick = () => {
            models.splice(Math.min(index, models.length), 0, removed);
            selected = Math.min(index, models.length - 1);
            render();
            persist('Protocole restauré.');
            feedback.textContent = 'Protocole restauré.';
          };
          feedback.append(undo);
        };
        card.append(remove);
      }

      if (libraryTab === 'community') {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'quiet-button';
        remove.textContent = 'Retirer mon partage';
        remove.onclick = () => {
          const next = community.filter((_, currentIndex) => currentIndex !== index);
          try {
            localStorage.setItem(communityKey, JSON.stringify(next));
            community = next;
            renderLibrary();
            byId('library-feedback').textContent = 'Partage retiré de la démo. Votre modèle privé reste disponible.';
          } catch {
            byId('library-feedback').textContent = 'Impossible d’enregistrer le retrait sur cet appareil.';
          }
        };
        card.append(remove);
      }
      cards.append(card);
    });

    if (!cards.childElementCount) {
      const empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = query
        ? 'Aucun protocole ne correspond à votre recherche.'
        : libraryTab === 'community'
          ? 'Votre espace de partage est prêt. Ouvrez un modèle et choisissez « Partager à la communauté » pour essayer la publication.'
          : 'Créez votre premier protocole.';
      cards.append(empty);
    }
  }

  function render() {
    if (selected >= models.length) selected = Math.max(0, models.length - 1);
    const select = byId('protocol-model-select');
    const name = byId('protocol-model-name');
    const list = byId('protocol-step-list');
    select.replaceChildren();
    list.replaceChildren();

    if (!models.length) {
      name.value = '';
      renderPreview();
      renderLibrary();
      closeDialog(editor);
      return;
    }

    models.forEach((model, index) => select.add(new Option(model.name, String(index))));
    select.value = String(selected);
    name.value = models[selected].name;

    const steps = orderedSteps(models[selected]);
    models[selected].steps = steps;
    if (!steps.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Aucune étape. Ajoutez votre premier message pour construire ce suivi.';
      list.append(empty);
    }

    steps.forEach((step, index) => {
      const card = document.createElement('article');
      card.className = 'protocol-step-card';
      const meta = document.createElement('p');
      meta.className = 'eyebrow';
      meta.textContent = `J${step.day ? '+' + step.day : '0'} · ${step.time} · ${step.channel}`;
      const title = document.createElement('h3');
      title.textContent = step.title;
      const content = document.createElement('p');
      content.textContent = step.message;
      const link = document.createElement('small');
      const stepDocuments = normalizeDocumentIds(step.documents);
      link.textContent = [
        step.link || (step.kind === 'Avis Google' ? 'Lien Google de la clinique à renseigner' : step.kind),
        stepDocuments.length ? stepDocuments.length + ' doc. joint' + (stepDocuments.length > 1 ? 's' : '') : ''
      ].filter(Boolean).join(' · ');
      const actions = document.createElement('div');
      actions.className = 'protocol-toolbar';
      [
        ['Modifier', () => openStep(index)],
        ['Dupliquer', () => {
          models[selected].steps.push(clone(step));
          persist('Étape dupliquée et enregistrée.');
          render();
        }],
        ['Supprimer', () => {
          models[selected].steps.splice(index, 1);
          persist('Étape supprimée et protocole enregistré.');
          render();
        }]
      ].forEach(([label, action]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiet-button';
        button.textContent = label;
        button.onclick = action;
        actions.append(button);
      });
      card.append(meta, title, content, link, actions);
      list.append(card);
    });

    renderLibrary();
    renderPreview();
  }

  function fillStep(step) {
    const normalized = normalizeStep(step);
    fields.forEach(field => {
      byId('step-' + field).value = normalized[field] ?? '';
    });
    renderStepDocuments(normalized.documents);
  }

  function openStep(index) {
    persist();
    editing = index;
    byId('protocol-step-feedback').textContent = '';
    byId('step-link').setCustomValidity('');
    byId('protocol-dialog-title').textContent = index < 0 ? 'Ajouter une étape' : 'Modifier cette étape';
    const sources = byId('protocol-step-source');
    sources.replaceChildren(new Option('Créer une étape personnalisée', ''));
    models.forEach((model, modelIndex) => {
      orderedSteps(model).forEach((step, stepIndex) => {
        sources.add(new Option(model.name + ' — ' + step.title, modelIndex + ':' + stepIndex));
      });
    });
    fillStep(index < 0 ? defaultStep : models[selected].steps[index]);
    if (!dialog.open) dialog.showModal();
    updateProtocolModalLock();
  }

  function saveStepAndClose() {
    const values = Object.fromEntries(fields.map(field => [field, byId('step-' + field).value.trim()]));
    const feedback = byId('protocol-step-feedback');
    if (!values.title && !values.message) {
      feedback.textContent = 'Ajoutez au moins un titre ou un message pour enregistrer cette étape.';
      return;
    }
    if (!values.title) values.title = 'Étape sans titre';
    if (!values.message) values.message = 'Message à compléter par le vétérinaire.';
    const step = normalizeStep({...values, documents: checkedDocumentIds('step-document-picker')});
    const previousSteps = clone(models[selected].steps);
    if (editing < 0) models[selected].steps.push(step);
    else models[selected].steps[editing] = step;
    const message = 'Étape « ' + step.title + ' » enregistrée · ' + models[selected].steps.length + ' étapes dans ce protocole.';
    if (!persist(message)) {
      models[selected].steps = previousSteps;
      feedback.textContent = 'La sauvegarde sur cet appareil a échoué. Votre saisie est conservée ici : réessayez avant de fermer.';
      return;
    }
    closeDialog(dialog);
    render();
  }

  function openWorkspace() {
    render();
    if (!editor.open) editor.showModal();
    updateProtocolModalLock();
    byId('protocol-model-name').focus();
  }

  byId('workspace-close').onclick = saveWorkspaceAndClose;
  editor.addEventListener('cancel', event => {
    event.preventDefault();
    saveWorkspaceAndClose();
  });
  editor.addEventListener('click', event => {
    if (event.target === editor) {
      const rect = editor.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) saveWorkspaceAndClose();
    }
  });

  byId('protocol-step-source').onchange = event => {
    if (!event.target.value) return;
    const [modelIndex, stepIndex] = event.target.value.split(':').map(Number);
    fillStep(orderedSteps(models[modelIndex])[stepIndex]);
  };
  byId('protocol-add').onclick = () => openStep(-1);
  byId('protocol-close').onclick = byId('protocol-cancel').onclick = () => closeDialog(dialog);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    }
  });
  byId('protocol-step-form').onsubmit = event => {
    event.preventDefault();
    saveStepAndClose();
  };
  byId('protocol-step-save').onclick = saveStepAndClose;
  byId('step-link').oninput = event => event.target.setCustomValidity('');
  byId('workspace-document-refresh').onclick = renderWorkspaceDocuments;
  byId('step-document-refresh').onclick = () => renderStepDocuments(checkedDocumentIds('step-document-picker'));
  byId('workspace-document-import').addEventListener('change', event => importDocumentsFromInput(event.target, 'workspace'));
  byId('step-document-import').addEventListener('change', event => importDocumentsFromInput(event.target, 'step'));

  byId('library-search').oninput = renderLibrary;
  byId('library-mine').onclick = () => {
    libraryTab = 'mine';
    renderLibrary();
  };
  byId('library-community').onclick = () => {
    libraryTab = 'community';
    renderLibrary();
  };
  byId('library-create').onclick = () => {
    libraryTab = 'mine';
    byId('protocol-new').click();
    openWorkspace();
  };

  byId('protocol-model-select').onchange = event => {
    persist();
    selected = Number(event.target.value);
    render();
  };
  byId('protocol-save').onclick = saveWorkspaceAndClose;
  byId('protocol-model-name').addEventListener('input', () => {
    persist();
    renderLibrary();
    renderPreview();
  });
  byId('protocol-new').onclick = () => {
    persist();
    byId('library-search').value = '';
    libraryTab = 'mine';
    models.push({name: 'Nouveau protocole', documents: [], steps: []});
    selected = models.length - 1;
    render();
    persist('Nouveau protocole enregistré.');
    byId('protocol-model-name').focus();
  };
  byId('protocol-copy').onclick = () => {
    if (!models[selected]) return;
    persist();
    const copy = clone(models[selected]);
    copy.name += ' — copie';
    models.push(copy);
    selected = models.length - 1;
    render();
    persist('Copie enregistrée.');
  };
  publish.onclick = () => {
    persist();
    render();
    if (!models[selected]?.steps.length) {
      setStatus('Ajoutez au moins une étape avant de partager ce modèle.');
      return;
    }
    publicationDraft = clone(models[selected]);
    publicationDraft.documents = [];
    publicationDraft.steps.forEach(step => { step.link = ''; });
    publicationDraft.steps.forEach(step => { step.documents = []; });
    const preview = byId('publish-preview');
    preview.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = publicationDraft.name;
    preview.append(title);
    orderedSteps(publicationDraft).forEach(step => {
      const item = document.createElement('p');
      item.textContent = 'J+' + step.day + ' · ' + step.title + '\n' + step.message;
      preview.append(item);
    });
    byId('publish-form').reset();
    if (!pubDialog.open) pubDialog.showModal();
    updateProtocolModalLock();
  };
  byId('publish-close').onclick = byId('publish-cancel').onclick = () => closeDialog(pubDialog);
  pubDialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog(pubDialog);
  });
  pubDialog.addEventListener('click', event => {
    if (event.target === pubDialog) {
      const rect = pubDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(pubDialog);
    }
  });
  byId('publish-form').onsubmit = event => {
    event.preventDefault();
    publicationDraft.description = byId('publish-description').value.trim();
    const next = [...community, publicationDraft];
    try {
      localStorage.setItem(communityKey, JSON.stringify(next));
      community = next;
      libraryTab = 'community';
      byId('library-search').value = '';
      closeDialog(pubDialog);
      closeDialog(editor);
      renderLibrary();
      byId('library-feedback').textContent = 'Modèle publié dans la démo locale. Il n’est pas encore visible par d’autres vétérinaires.';
      library.scrollIntoView({behavior: 'auto'});
    } catch {
      byId('publish-description').setCustomValidity('Le stockage local est indisponible. Publication non enregistrée.');
      byId('publish-description').reportValidity();
    }
  };
  byId('publish-description').oninput = event => event.target.setCustomValidity('');
  [editor, dialog, pubDialog].forEach(modal => {
    modal.addEventListener('close', updateProtocolModalLock);
  });
  documentLibrary?.onChange?.(() => {
    renderWorkspaceDocuments();
    renderStepDocuments(checkedDocumentIds('step-document-picker'));
    renderLibrary();
  });

  window.StriveaProtocolModels = {
    listModels: () => clone(models),
    addModel: model => {
      const normalized = normalizeModel(model);
      models.push(normalized);
      selected = models.length - 1;
      libraryTab = 'mine';
      saveModelsSilently();
      render();
      const feedback = byId('library-feedback');
      if (feedback) feedback.textContent = '« ' + normalized.name + ' » ajouté depuis Suivi Signature.';
      return clone(normalized);
    }
  };

  window.addEventListener('strivea:protocol-models-updated', event => {
    models = loadModels();
    libraryTab = 'mine';
    const targetName = event.detail?.name;
    if (targetName) {
      const found = models.findIndex(model => model.name === targetName);
      if (found >= 0) selected = found;
    }
    render();
    const feedback = byId('library-feedback');
    if (feedback && targetName) feedback.textContent = '« ' + targetName + ' » ajouté depuis Suivi Signature.';
  });

  render();
})();
