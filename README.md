# Print — site vitrine

Une vitrine en français pour une future boutique de dropshipping d’accessoires maison et du quotidien. Design responsive, illustrations SVG locales, catalogue filtrable, fiches produits, favoris conservés dans le navigateur, FAQ et navigation mobile.

## Développement

Prérequis : Node.js 24 (voir `.nvmrc`), npm. Aucune dépendance externe à installer, aucun compte ni secret requis.

```sh
cd /workspace/Print
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
```

Le serveur écoute sur le port 3000. `PORT` et `HOST` permettent de modifier l’écoute. Les modifications dans `public/` apparaissent au rechargement de la page. Chaque tâche cloud dispose déjà d’un environnement isolé : utiliser le checkout existant, sans créer de worktree sauf demande explicite.

## Validation et version à héberger

```sh
npm test
npm run build
npm start
```

Arrêter le serveur de développement avant `npm start` s’il utilise le même port, ou lancer `PORT=3001 npm start`. Le build copie le site dans `dist/`, qui peut aussi être hébergé sur un service de fichiers statiques. Le serveur inclus sert uniquement les fichiers publics autorisés, jamais les sources ou les métadonnées Git.

## Personnaliser

- Textes, navigation, FAQ et titre : `public/index.html`.
- Catalogue, prix, catégories, fiches et informations de contact : `public/app.js`.
- Couleurs, typographie et mise en page : `public/styles.css`.
- Illustrations originales : `public/assets/`.

Les favoris restent sur l’appareil ; aucune donnée n’est transmise à un service externe. Les prix en euros sont des exemples, pas des offres commerciales. Les palettes sont illustratives et ne sont pas des variantes commandables.

## Avant une ouverture commerciale

Remplacer les produits et les prix fictifs, confirmer les fournisseurs, caractéristiques, origine d’expédition, délais et politiques de retour. Ajouter une adresse de contact réelle ainsi que l’identité de l’éditeur et les mentions légales adaptées. Le bouton de contact explique actuellement que les coordonnées ne sont pas encore renseignées ; il n’envoie aucun message.

Ce projet est un **site vitrine**, sans panier, paiement, connexion fournisseur, traitement de commande ou envoi de formulaire. Ces fonctions nécessitent une intégration distincte si la boutique doit vendre en ligne. La publication de l’environnement cloud ne met pas automatiquement le site en ligne sur un domaine public.
