# Print — bracelets silicone 22 mm

Vitrine en français pour un projet de boutique de bracelets de montre. Une page produit avec 25 références de coloris issues de la fiche AliExpress transmise, sélecteur de modèles A/B/C, favoris, guide de compatibilité, FAQ et navigation mobile. Les illustrations sont locales et non contractuelles ; les différences techniques entre A/B/C ne sont pas confirmées.

## Développement

Prérequis : Node.js 24 (voir `.nvmrc`), npm. Aucune dépendance externe d’exécution, aucun compte ni secret requis.

```sh
cd /workspace/Print
npm ci --ignore-scripts --no-audit --no-fund --cache /tmp/print-npm-cache
npm run dev
```

Le serveur écoute sur le port 3000. `PORT` et `HOST` permettent de modifier l’écoute. Recharger la page après modification de `public/`. Chaque tâche cloud est isolée : utiliser le checkout existant, sans créer de worktree sauf demande explicite.

## Validation et build

```sh
npm test
npm run build
npm start
```

Arrêter le serveur de développement avant `npm start` s’il utilise le même port, ou utiliser `PORT=3001 npm start`. Le build copie le site dans `dist/`, également hébergeable sur un service de fichiers statiques. Le serveur inclus ne sert jamais les sources du serveur ou les métadonnées Git.

Les tests vérifient les réponses HTTP, les assets, les chemins interdits et l’intégrité du catalogue. Pour les contrôles de navigateur facultatifs (Chromium déjà installé dans l’environnement cloud) :

```sh
npm install --prefix /tmp/print-browser-check --cache /tmp/print-npm-cache --no-audit --no-fund playwright
NODE_PATH=/tmp/print-browser-check/node_modules PRINT_TEST_URL=http://127.0.0.1:3001 node scripts/browser-check.cjs
```

Lancer d’abord le serveur sur le port correspondant. `CHROMIUM_PATH` permet d’utiliser un autre binaire, le chemin par défaut est `/usr/bin/chromium`. Playwright est un outil de validation séparé, pas une dépendance du site.

## Personnaliser

- `public/index.html` : textes, fiche produit, FAQ et navigation.
- `public/catalog.js` : références et noms exacts du fournisseur, palettes et source.
- `public/app.js` : sélection de variantes et favoris locaux.
- `public/styles.css` : identité visuelle et responsive.
- `public/assets/` : illustrations des coloris.
- `docs/produit-source.md` : provenance, limites et informations à vérifier.

Les favoris utilisent uniquement `print-strap-favorites` dans le stockage du navigateur. Ils peuvent être supprimés via « Mes coloris » → « Effacer ma sélection ». En cas de stockage désactivé, la sélection fonctionne en mémoire et l’interface prévient qu’elle sera perdue au rechargement.

## Avant une ouverture commerciale

Confirmer compatibilités, différences A/B/C, dimensions, stock et fournisseur. Ajouter les photos réelles autorisées, fixer le prix public et renseigner contact, identité de l’éditeur, livraison, retours et mentions légales. Les assertions de l’aperçu IA AliExpress ne sont pas des garanties validées. Print n’est pas affilié à SUUNTO.

Ce site ne propose ni paiement, ni panier, ni formulaire d’envoi. Le lien fournisseur mène à un vendeur externe. Aucun prix fournisseur, avis ou compteur de ventes n’est présenté comme appartenant à Print. La publication de l’environnement cloud ne met pas automatiquement le site en ligne sur un domaine public.

## Hébergement GitHub Pages

Les liens des fichiers sont relatifs pour fonctionner aussi sous `/Print/`.
La branche `gh-pages` est destinée au contenu statique généré dans `dist/`.
Dans les paramètres GitHub du dépôt, ouvrir **Pages**, choisir **Deploy from a branch**, puis **gh-pages** et **/ (root)**, et enregistrer.

L’adresse attendue après activation et déploiement réussi est `https://contactbttransport01-boop.github.io/Print/`. La présence d’une branche de publication ne prouve pas que Pages est activé.

Après toute modification du site, exécuter `npm test`, puis `npm run deploy:pages` pour générer et envoyer le contenu statique sur `gh-pages`. Cette commande publie les fichiers via Git, avec l’authentification existante ; elle ne peut pas activer GitHub Pages dans les paramètres. Une modification de `main` seule n’actualise pas cette branche.
