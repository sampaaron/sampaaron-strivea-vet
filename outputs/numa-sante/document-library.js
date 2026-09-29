(() => {
  const dbName = 'strivea-document-library-v1';
  const storeName = 'documents';
  const fallbackKey = 'strivea-document-library-fallback-v1';
  const maxFileSize = 10 * 1024 * 1024;
  const acceptedName = /\.(pdf|docx?|txt)$/i;
  const acceptedImageName = /\.(png|jpe?g|webp|gif|bmp|svg|heic|heif)$/i;
  const listeners = new Set();
  let dbPromise = null;
  const memoryBlobs = new Map();

  const cryptoId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return 'doc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  };

  const cleanDocument = item => {
    const status = item?.status === 'validated' || item?.status === 'validé' || item?.approved ? 'validated' : 'pending';
    const rawType = String(item?.type || '');
    const selectedType = item?.category
      || (rawType && !rawType.includes('/') ? rawType : '')
      || 'Consignes de convalescence';
    return {
      id: String(item?.id || cryptoId()),
      name: String(item?.name || 'Document sans nom'),
      size: Number(item?.size || 0),
      type: String(selectedType),
      category: String(selectedType),
      fileKind: String(item?.fileKind || item?.mimeType || (rawType.includes('/') ? rawType : '') || 'Document'),
      visibility: item?.visibility === 'team' ? 'team' : 'patient',
      approved: status === 'validated',
      status,
      notes: String(item?.notes || ''),
      addedAt: item?.addedAt || new Date().toISOString(),
      blob: item?.blob instanceof Blob ? item.blob : null
    };
  };

  const publicDocument = item => {
    const doc = cleanDocument(item);
    return {
      id: doc.id,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      category: doc.category,
      fileKind: doc.fileKind,
      visibility: doc.visibility,
      approved: doc.approved,
      status: doc.status,
      notes: doc.notes,
      addedAt: doc.addedAt,
      hasFile: Boolean(doc.blob)
    };
  };

  const emitChange = () => {
    listeners.forEach(listener => {
      try {
        listener();
      } catch {
        // Une vue qui échoue ne doit pas bloquer la bibliothèque.
      }
    });
  };

  const transactionDone = tx => new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Transaction IndexedDB échouée.'));
    tx.onabort = () => reject(tx.error || new Error('Transaction IndexedDB annulée.'));
  });

  const requestResult = request => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Requête IndexedDB échouée.'));
  });

  const openDb = () => {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB indisponible.'));
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {keyPath: 'id'});
            store.createIndex('addedAt', 'addedAt', {unique: false});
            store.createIndex('category', 'category', {unique: false});
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Ouverture IndexedDB échouée.'));
        request.onblocked = () => reject(new Error('Bibliothèque documents bloquée par un autre onglet.'));
      });
    }
    return dbPromise;
  };

  const loadFallback = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(fallbackKey));
      if (Array.isArray(saved)) return saved.map(cleanDocument).map(doc => ({...doc, blob: memoryBlobs.get(doc.id) || null}));
    } catch {
      // Fallback silencieux : la page reste utilisable.
    }
    return [];
  };

  const saveFallbackMetadata = docs => {
    try {
      window.localStorage.setItem(fallbackKey, JSON.stringify(docs.map(publicDocument)));
    } catch {
      // Si le stockage local est plein, on conserve au moins les fichiers en mémoire.
    }
  };

  const listDocuments = async () => {
    try {
      const db = await openDb();
      const tx = db.transaction(storeName, 'readonly');
      const docs = await requestResult(tx.objectStore(storeName).getAll());
      return docs
        .map(cleanDocument)
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .map(publicDocument);
    } catch {
      return loadFallback()
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .map(publicDocument);
    }
  };

  const getDocument = async id => {
    try {
      const db = await openDb();
      const tx = db.transaction(storeName, 'readonly');
      const doc = await requestResult(tx.objectStore(storeName).get(String(id)));
      return doc ? cleanDocument(doc) : null;
    } catch {
      return loadFallback().find(doc => doc.id === String(id)) || null;
    }
  };

  const saveFiles = async (fileList, defaults = {}) => {
    const files = Array.from(fileList || []);
    const accepted = [];
    let rejected = 0;

    files.forEach(file => {
      const ok = (acceptedName.test(file.name) || acceptedImageName.test(file.name) || String(file.type || '').startsWith('image/')) && file.size <= maxFileSize;
      if (!ok) {
        rejected += 1;
        return;
      }
      accepted.push(cleanDocument({
        id: cryptoId(),
        name: file.name,
        size: file.size,
        type: defaults.type || defaults.category || 'Consignes de convalescence',
        category: defaults.category || defaults.type || 'Consignes de convalescence',
        fileKind: file.type || file.name.split('.').pop()?.toUpperCase() || 'Document',
        visibility: defaults.visibility,
        approved: defaults.approved,
        status: defaults.status,
        notes: defaults.notes,
        addedAt: new Date().toISOString(),
        blob: file
      }));
    });

    if (!accepted.length) return {saved: [], rejected};

    try {
      const db = await openDb();
      const tx = db.transaction(storeName, 'readwrite');
      accepted.forEach(doc => tx.objectStore(storeName).put(doc));
      await transactionDone(tx);
      emitChange();
      return {saved: accepted.map(publicDocument), rejected};
    } catch {
      const docs = loadFallback();
      accepted.forEach(doc => {
        memoryBlobs.set(doc.id, doc.blob);
        docs.unshift(doc);
      });
      saveFallbackMetadata(docs);
      emitChange();
      return {saved: accepted.map(publicDocument), rejected};
    }
  };

  const updateDocument = async (id, changes = {}) => {
    const current = await getDocument(id);
    if (!current) return null;
    const next = cleanDocument({
      ...current,
      ...changes,
      id: current.id,
      name: changes.name || current.name,
      size: current.size,
      type: current.type,
      category: changes.category || changes.type || current.category,
      fileKind: current.fileKind,
      blob: current.blob
    });

    try {
      const db = await openDb();
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(next);
      await transactionDone(tx);
    } catch {
      const docs = loadFallback().map(doc => doc.id === next.id ? next : doc);
      if (next.blob) memoryBlobs.set(next.id, next.blob);
      saveFallbackMetadata(docs);
    }
    emitChange();
    return publicDocument(next);
  };

  const deleteDocument = async id => {
    const documentId = String(id);
    try {
      const db = await openDb();
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(documentId);
      await transactionDone(tx);
    } catch {
      const docs = loadFallback().filter(doc => doc.id !== documentId);
      memoryBlobs.delete(documentId);
      saveFallbackMetadata(docs);
    }
    emitChange();
  };

  const clearDocuments = async () => {
    try {
      const db = await openDb();
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).clear();
      await transactionDone(tx);
    } catch {
      memoryBlobs.clear();
      saveFallbackMetadata([]);
    }
    emitChange();
  };

  const createObjectUrl = async id => {
    const doc = typeof id === 'string' ? await getDocument(id) : cleanDocument(id);
    if (!doc?.blob) return '';
    return URL.createObjectURL(doc.blob);
  };

  window.StriveaDocumentLibrary = {
    listDocuments,
    saveFiles,
    updateDocument,
    deleteDocument,
    clearDocuments,
    createObjectUrl,
    onChange(listener) {
      if (typeof listener !== 'function') return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emitChange
  };
})();
