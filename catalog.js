// Source : fiche AliExpress copiée par le propriétaire. Aucun stock ni prix public validé.
export const supplierUrl = 'https://fr.aliexpress.com/item/1005010153583798.html';
export const variants = [
  { id: 'a-yellow-grey', series: 'a', source: 'a-Yellow Grey', label: 'Jaune · gris', base: 'yellow', accent: 'grey' },
  { id: 'a-black-grey', series: 'a', source: 'a-Black Grey', label: 'Noir · gris', base: 'black', accent: 'grey' },
  { id: 'a-black-yellow', series: 'a', source: 'a-Black Yellow', label: 'Noir · jaune', base: 'black', accent: 'yellow' },
  { id: 'a-black-red', series: 'a', source: 'a-Black Red', label: 'Noir · rouge', base: 'black', accent: 'red' },
  { id: 'a-green-black', series: 'a', source: 'a-Green Black', label: 'Vert · noir', base: 'green', accent: 'black' },
  { id: 'a-army-green-black', series: 'a', source: 'a-Army Green Black', label: 'Kaki · noir', base: 'army', accent: 'black' },
  { id: 'a-midnightblue-black', series: 'a', source: 'a-midnightblue Black', label: 'Bleu nuit · noir', base: 'midnight', accent: 'black' },
  { id: 'a-starlight-green', series: 'a', source: 'a-Starlight Green', label: 'Écru · vert', base: 'starlight', accent: 'green' },
  { id: 'a-starlight-orange', series: 'a', source: 'a-Starlight Orange', label: 'Écru · orange', base: 'starlight', accent: 'orange' },
  { id: 'a-white-blue', series: 'a', source: 'a-White Blue', label: 'Blanc · bleu', base: 'white', accent: 'blue' },
  { id: 'b-green-black', series: 'b', source: 'b-Green Black', label: 'Vert · noir', base: 'green', accent: 'black' },
  { id: 'b-black-grey', series: 'b', source: 'b-Black Grey', label: 'Noir · gris', base: 'black', accent: 'grey' },
  { id: 'b-teal-midnightblue', series: 'b', source: 'b-Teal Midnightblue', label: 'Bleu canard · bleu nuit', base: 'teal', accent: 'midnight' },
  { id: 'b-black-orange', series: 'b', source: 'b-Black Orange', label: 'Noir · orange', base: 'black', accent: 'orange' },
  { id: 'b-black-blue', series: 'b', source: 'b-Black Blue', label: 'Noir · bleu', base: 'black', accent: 'blue' },
  { id: 'c-antique-white', series: 'c', source: 'c-Antique White', label: 'Blanc antique', base: 'antique', accent: 'antique' },
  { id: 'c-yellow-grey', series: 'c', source: 'c-Yellow Grey', label: 'Jaune · gris', base: 'yellow', accent: 'grey' },
  { id: 'c-starlight-orange', series: 'c', source: 'c-Starlight Orange', label: 'Écru · orange', base: 'starlight', accent: 'orange' },
  { id: 'c-white-blue', series: 'c', source: 'c-White Blue', label: 'Blanc · bleu', base: 'white', accent: 'blue' },
  { id: 'c-black-orange', series: 'c', source: 'c-Black Orange', label: 'Noir · orange', base: 'black', accent: 'orange' },
  { id: 'c-red-black', series: 'c', source: 'c-Red Black', label: 'Rouge · noir', base: 'red', accent: 'black' },
  { id: 'c-black-grey', series: 'c', source: 'c-Black Grey', label: 'Noir · gris', base: 'black', accent: 'grey' },
  { id: 'c-army-green-black', series: 'c', source: 'c-Army Green Black', label: 'Kaki · noir', base: 'army', accent: 'black' },
  { id: 'c-black-green', series: 'c', source: 'c-Black Green', label: 'Noir · vert', base: 'black', accent: 'green' },
  { id: 'c-green-black', series: 'c', source: 'c-Green Black', label: 'Vert · noir', base: 'green', accent: 'black' }
];
export const defaultVariant = variants.find(variant => variant.id === 'b-green-black');
export function variantById(id) { return variants.find(variant => variant.id === id); }
export function imageFor(variant) { return `./assets/strap-${variant.base}-${variant.accent}.svg`; }
