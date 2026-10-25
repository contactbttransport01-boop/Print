# Print Sport — installation Shopify

Le ZIP `artifacts/Print-Shopify.zip` contient un thème Shopify indépendant, pas une sauvegarde de votre thème actuel. Il utilise les produits, photos, prix, variantes et stocks déjà présents dans Shopify. Il ne crée ni produit ni tarif fictif.

1. Dans Shopify : **Boutique en ligne → Thèmes → Importer un thème → Importer un fichier ZIP**. Choisir `Print-Shopify.zip`.
2. Garder le thème actuel publié. Ouvrir **Personnaliser** sur le nouveau thème Print Sport.
3. Dans **Paramètres du thème → Produit vedette**, sélectionner le bracelet existant. Le produit doit être actif et disponible sur le canal Boutique en ligne. Sans choix explicite, le premier produit accessible du catalogue est utilisé.
4. Dans la section **Produit vedette** de l’accueil, laisser le produit local vide pour reprendre le réglage global. Un choix local remplace uniquement cette section. La bannière utilise le réglage global.
5. Ajuster les titres, la FAQ, l’adresse de contact, le nom et le menu. Les politiques Shopify renseignées dans les paramètres de la boutique sont automatiquement liées dans le pied de page et sur la fiche produit.
6. Prévisualiser le thème sur ordinateur et mobile. Tester chaque variante, son prix, sa photo et sa disponibilité ; ajouter au panier, modifier une quantité, retirer un article et accéder au paiement. Faire une commande de test selon les moyens de paiement configurés dans Shopify.
7. Renseigner livraison, retours, identité de l’entreprise et compatibilités exactes, puis publier lorsque les contrôles sont terminés.

## Contenu

- Accueil éditorial : bannière, produit vedette achetable, histoire de marque et FAQ.
- Fiche produit reliée au catalogue Shopify ; descriptions et photos du produit existant.
- Sélecteur des variantes réelles, prix et disponibilité actualisés, quantités et photos.
- Ajout au panier natif Shopify, panier modifiable et accès au paiement Shopify.
- Bouton d’achat mobile visible pendant la consultation du produit lorsque le bouton principal est hors écran.
- Collections, recherche, pages de contenu, page 404 et écran de boutique protégée.
- Emplacements de blocs d’applications dans les sections produit pour une éventuelle application d’avis réels.
- Paiement accéléré Shopify facultatif, activable dans la section produit et soumis à la configuration de la boutique.

Aucun faux avis, compteur de ventes, compte à rebours ou délai de livraison inventé. Aucune garantie de taux de conversion ou de chiffre d’affaires. Les illustrations de secours sont signalées comme non contractuelles et sont remplacées par les photos Shopify dès qu’elles existent.

## Limites de validation

Le thème est contrôlé localement avec Shopify Theme Check, ses fichiers JSON et son archive ZIP sont vérifiés. Les interactions JavaScript sont contrôlées dans Chromium sur des données de test. Sans accès à la boutique, l’installation réelle, les paiements, les applications et les politiques ne peuvent pas être validés ici. Le ZIP n’active rien, ne publie rien et ne change pas les produits existants.

## Régénérer le ZIP

Depuis la racine du dépôt : `python scripts/package-shopify.py`. Les dossiers Shopify doivent être à la racine de l’archive, sans dossier englobant. Les instructions sont livrées à part pour ne pas ajouter de fichier non reconnu au thème.
