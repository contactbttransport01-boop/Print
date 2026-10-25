# Activer les offres Print sur le produit Shopify existant

Les tarifs demandés sont préparés dans le thème 1.1.0. Aucun produit n’a été réimporté et aucun prix, stock ou remise n’a été modifié dans Shopify : aucun accès à l’administration n’est connecté ici.

| Sélection | Total souhaité | Prix séparés à 14,90 € | Réduction nécessaire |
| --- | ---: | ---: | ---: |
| 1 bracelet | 14,90 € | 14,90 € | aucune remise de lot |
| 2 bracelets | 24,90 € | 29,80 € | 4,90 € par commande |
| 3 bracelets | 34,90 € | 44,70 € | 9,80 € par commande |

## 1. Régler le produit existant

Dans **Produits**, ouvrir le bracelet déjà présent. Dans les tarifs de chaque variante concernée, définir :

- Prix : **14,90 €**.
- Prix de comparaison : **19,90 €**, correspondant au prix de référence demandé.

Conserver les identifiants et les variantes existants pour préserver leur correspondance DSers. Ne pas créer un second produit et ne pas recréer des variantes « Duo » ou « Trio » : chaque bracelet conserve sa véritable référence fournisseur.

## 2. Créer deux réductions automatiques Shopify

Dans **Réductions → Créer une réduction**, choisir une réduction de type **Montant de réduction sur les produits**, avec la méthode **Automatique**. Les libellés peuvent varier selon l’interface.

### Offre Duo

- Nom : **Duo Print**.
- Type de valeur : **montant fixe de 4,90 €**.
- S’applique uniquement au bracelet existant et à ses variantes concernées.
- Cocher **Appliquer la réduction une seule fois par commande**. La réduction totale est 4,90 €, et non 4,90 € par bracelet.
- Condition minimum : **2 articles** du produit éligible.
- Ne pas autoriser le cumul avec l’offre Trio ou d’autres réductions sur ces produits pendant le test.
- Enregistrer et activer.

### Offre Trio

- Nom : **Trio Print**.
- Type de valeur : **montant fixe de 9,80 €**.
- Même produit et mêmes variantes éligibles.
- Cocher **Appliquer la réduction une seule fois par commande**.
- Condition minimum : **3 articles** éligibles.
- Ne pas autoriser le cumul avec l’offre Duo. Shopify doit retenir la meilleure réduction éligible.
- Enregistrer et activer.

Il s’agit de réductions de produit, pas de remises sur tous les articles du panier. Ne pas utiliser une réduction répétée par unité ni deux codes cumulés. Les frais de livraison et les éventuelles taxes supplémentaires suivent les réglages de la boutique.

## 3. Vérifier le panier et le paiement

Sur le produit existant, avant d’afficher les cartes d’offres :

- Un bracelet : **14,90 €**.
- Deux bracelets identiques : **24,90 €**.
- Deux coloris différents : **24,90 €**.
- Trois bracelets identiques ou mélangés : **34,90 €**.
- Si le nombre d’articles repasse à un, la réduction de lot disparaît.
- Un autre produit ajouté au panier ne doit pas bénéficier de ces remises ni déclencher un seuil.

Vérifier ces montants hors frais de livraison dans le panier **et à l’étape de paiement**, via le mode de test de la boutique. Les autres promotions ne doivent pas modifier le résultat attendu lors de cette validation.

Ces offres concernent les sélections de un à trois bracelets. Les deux réductions sont appliquées une seule fois par commande ; elles ne définissent pas une répétition illimitée de lots pour quatre, cinq ou davantage d’articles.

## 4. Relier le nouveau thème

Importer `Print-Shopify-Offres.zip` comme nouveau thème non publié, puis le personnaliser :

1. **Paramètres du thème → Produit vedette** : choisir le bracelet existant.
2. Laisser vide le remplacement local de la section Produit vedette, ou choisir le même bracelet.
3. **Paramètres du thème → Offres duo et trio** : choisir à nouveau ce bracelet dans « Bracelet concerné ».
4. Après vérification des deux réductions, cocher **Activer après configuration et test des remises**.
5. Prévisualiser sur mobile et ordinateur, choisir un coloris par bracelet et refaire les contrôles du panier avant publication.

Le sélecteur propose une, deux ou trois unités avec un choix de variante pour chacune. Les variantes identiques sont regroupées dans l’ajout au panier ; les variantes différentes restent des lignes distinctes pour être reconnues correctement par DSers.

Le thème n’affiche les offres que pour le produit choisi, en euros, si toutes ses variantes sont à 14,90 €. Dans les autres cas, il conserve le formulaire produit Shopify et les prix réels du catalogue. Le paiement accéléré est masqué lorsque le sélecteur de lots est actif, afin de passer par le panier.

## Validation effectuée ici

Shopify Theme Check, structure JSON/Liquid et archive ZIP ; tests Chromium avec une API simulée pour vérifier les montants affichés, les variantes envoyées, les quantités, les indisponibilités, les erreurs et l’affichage mobile. Aucune réduction réelle ni aucun paiement n’a pu être testé sur votre boutique. Les offres sont désactivées par défaut pour éviter un affichage commercial sans remise Shopify correspondante.
