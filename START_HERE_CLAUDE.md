# START HERE — Strivea Vet

Projet Strivea Vet importé depuis le prototype public.

Le code principal est dans :

```text
outputs/numa-sante/
```

Fichiers principaux :

- `outputs/numa-sante/index.html`
- `outputs/numa-sante/styles.css`
- `outputs/numa-sante/app.js`
- `outputs/numa-sante/portable.html`
- `outputs/numa-sante/protocol-editor.js`
- `outputs/numa-sante/interior-settings.js`
- `outputs/numa-sante/document-library.js`
- `outputs/numa-sante/assets/`

Pour tester localement :

```bash
python -m http.server 4173
```

Puis ouvrir :

```text
http://localhost:4173/outputs/numa-sante/index.html#today
```

Important : Numa ne doit jamais être présentée comme un vétérinaire IA. Elle aide au suivi, suit les protocoles validés par la clinique et remonte les signaux utiles à l’équipe.
