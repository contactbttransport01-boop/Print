# Relier le bracelet AliExpress à Shopify

Ce kit contient des textes à copier et un tableau de référence, pas un import automatique Shopify et pas une connexion au fournisseur. Il ne modifie pas la boutique ni le thème.

Source : https://fr.aliexpress.com/item/1005010153583798.html

## Si le bracelet n’existe pas dans Shopify

1. Ouvrir DSers depuis les applications Shopify. Si l’application n’est pas encore installée, la rechercher dans l’App Store Shopify et examiner ses conditions et autorisations avant installation.
2. Importer l’article à partir de son lien AliExpress dans la liste d’import DSers ; l’extension AliExpress DSers constitue une autre méthode si elle est déjà installée.
3. Choisir les variantes réellement à vendre et vérifier pour chacune la photo, la référence fournisseur, le stock, le coût livré et l’expédition vers le pays visé. A/B/C ne signifie pas qu’un modèle convient à une montre particulière.
4. Renseigner le prix de vente choisi pour la boutique, le titre et la description ci-dessous. Le prix de 2,79 € transmis est un prix fournisseur variable, pas un prix de vente Print ni un coût livré garanti.
5. Envoyer le produit vers Shopify en le conservant en brouillon pendant les vérifications. Ne pas créer une seconde fiche si le même bracelet y existe déjà.

## Si le bracelet existe déjà dans Shopify

Ne pas importer un doublon. Utiliser la fonction de correspondance produit (mapping) de DSers pour associer la fiche Shopify existante au lien AliExpress. Associer chaque variante Shopify à sa référence exacte et à son image fournisseur. Les noms de menus peuvent varier selon la version de DSers.

Cette association est nécessaire pour que DSers retrouve le fournisseur et la bonne variante lors du traitement des commandes. Un simple lien AliExpress dans une description, un thème ou un CSV ne réalise pas cette association.

## Textes prêts à reprendre

Titre : **Bracelet de montre silicone 22 mm — votre duo de couleurs**

Titre SEO : **Bracelet silicone 22 mm | Print**

Description SEO : **Changez l’allure de votre montre avec un bracelet silicone 22 mm. Explorez les coloris et vérifiez la fixation adaptée à votre modèle.**

Description : ouvrir `description-bracelet.html` et copier son contenu dans le mode HTML de la description du produit Shopify. Vérifier d’abord que matière, largeur et contenu correspondent bien aux variantes conservées. Les données proviennent du texte fournisseur transmis, sans vérification indépendante.

Le fichier `references-coloris.csv` est une aide à la correspondance des 25 références transmises. Il ne contient pas les identifiants de variantes AliExpress/Shopify et ne doit pas être utilisé comme fichier d’import ou de mapping automatique. DSers doit récupérer ces identifiants via l’import du produit réel.

Les photos doivent être importées depuis la fiche fournisseur dans DSers et associées aux variantes correspondantes. Les illustrations du thème restent des images de secours.

## Relier au thème Print

Après vérification du prix, des variantes, des conditions de vente et de la livraison, rendre le produit actif et disponible sur le canal Boutique en ligne. Dans le thème : **Personnaliser → Paramètres du thème → Produit vedette**, puis choisir le bracelet. Laisser la sélection locale de la section Produit vedette vide pour qu’elle reprenne le réglage global, ou choisir le même produit.

Prévisualiser, choisir une variante, contrôler photo et prix, ajouter au panier et effectuer une commande de test via le mode de test configuré dans Shopify. Vérifier ensuite sa correspondance dans DSers sans lancer ni payer de commande fournisseur réelle. Aucun achat fournisseur ou abonnement payant n’a été effectué pour préparer ce kit.

## Informations encore manquantes

Le propriétaire a confirmé que le produit existe déjà dans Shopify : utiliser la correspondance DSers, sans nouvel import. Les prix souhaités sont 14,90 € au lieu de 19,90 €, deux pour 24,90 € et trois pour 34,90 €. Voir SHOPIFY-OFFRES.md pour appliquer réellement ces montants. Restent à confirmer les variantes retenues, les photos, les compatibilités, la destination de livraison et le coût livré. Aucun accès Shopify/DSers n’est connecté à la conversation ; l’import et la correspondance dans le compte restent à effectuer par le propriétaire.
