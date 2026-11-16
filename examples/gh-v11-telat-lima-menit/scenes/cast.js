// scenes/cast.js — GarisHidup 3D-shaded capsule cast
import * as GH from '/engine/garishidup.js';
export const CAST = {
  aku:   (g, o = {}) => GH.figure(g, { role: 'hero',  garment: 'none',   label: 'AKU',   ...o }),
  ayah:  (g, o = {}) => GH.figure(g, { role: 'slate', garment: 'kopiah', label: 'AYAH',  ...o }),
  ibu:   (g, o = {}) => GH.figure(g, { role: 'mauve', garment: 'ibu',    label: 'IBU',   ...o }),
  oknum: (g, o = {}) => GH.figure(g, { role: 'gold',  garment: 'suit',   label: 'OKNUM', ...o }),
};
