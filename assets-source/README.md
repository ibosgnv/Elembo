# Sources des images

Originaux conservés tels quels. Les fichiers servis par le site sont dans `public/images/` et déclarés
dans `src/data/assets.ts` (manifeste central : chemin, dimensions, alt, provenance).

## `logo/` — fichiers officiels (elembo-rdc.com, médiathèque WordPress)

| Fichier | Taille | Usage |
| --- | --- | --- |
| `Elembo_corporate_logotype_RVB-300ppi.png` | 4167×1435, PNG transparent | **Source du logo du site** → `public/images/brand/elembo-logo.png` (rogné, 1200 px) |
| `Elembo_corporate_logotype_RVB-300ppi(-1)-scaled.png` | 2560×882 | variantes réduites par WordPress, non utilisées |
| `Elembo_corporate_label_1080x1080px_MASTER-300ppi-scaled.png` | 2560×2560 | badge « 100% naturel · RD Congo » — **non utilisé** tant que l’allégation n’est pas confirmée |
| `elembo.png` | 194×65 | ancien logo d’en-tête |
| `cropped-elembo-1.png` | 512×512 | source du favicon et de l’icône 192 px |

Aucun SVG du logo n’existe sur le site actuel : le PNG 300 ppi est la meilleure source disponible.

## `uploads/` — fichiers fournis par le client (maquettes générées)

| Fichier | Contenu vérifié | Transparence | Sortie web |
| --- | --- | --- | --- |
| `bottle-orange.webp` | Jus d’orange 30 cl | alpha réel, bords propres | `bottles/orange.webp` (+ `-sm`) |
| `bottle-ananas.webp` | Jus d’ananas 30 cl | alpha réel | `bottles/ananas.webp` |
| `bottle-mangue.webp` | Jus de mangue 30 cl | alpha réel | `bottles/mangue.webp` |
| `bottle-orange-ananas.webp` | Orange-Ananas 30 cl | alpha réel | `bottles/orange-ananas.webp` |
| `bottle-mangue-ananas.webp` | Mangue-Ananas 30 cl | alpha réel | `bottles/mangue-ananas.webp` |
| `fruit-composition.webp` | orange, mangue, ananas, feuilles, gouttes | alpha réel | découpée en 19 pièces → `fruit/*.webp` |
| `banner-trio.webp` | 3 bouteilles + fruits, espace vide à gauche | opaque (photo) | `campaign/banner-trio.webp` |
| `lifestyle-cafe.webp` | femme tenant un jus d’orange en terrasse | opaque (photo) | `campaign/lifestyle-cafe.webp` |

Traitements :

- **Alpha vérifié** sur chaque bouteille et sur la composition (canal alpha réel, coins à 0, aucun halo
  rectangulaire) et testé sur crème, orange et vert foncé. Aucun détourage n’a été nécessaire.
- **Bouteilles alignées** : les cinq images partagent la même boîte de recadrage (380×1504, x=330, y=10),
  calculée sur l’union de leurs contours. Elles se remplacent donc sans saut d’échelle ni de position.
  Jamais étirées : le site fixe la hauteur et conserve le ratio 380/1504.
- **Fruits découpés** : composantes connexes du canal alpha (scipy), puis rognage. Chaque pièce flottante
  du hero est un vrai fichier transparent, pas la composition entière animée.
- Export WebP (qualité 82–88, alpha 95–100).

Les étiquettes de ces maquettes ne sont pas une documentation produit : aucune information n’en est tirée
au-delà de ce que confirment le site actuel et le brief.

## `site-photos/` — photos publiées sur elembo-rdc.com

| Fichier | Contenu | Usage |
| --- | --- | --- |
| `IMG_0003-scaled.jpeg` | deux personnes trinquent devant un étal | accueil (origine) |
| `IMG_0011-scaled.jpeg` | jeune femme qui boit un Elembo | accueil (réseaux) |
| `IMG_0015-scaled.jpeg` | deux bouteilles levées | accueil (réseaux) |
| `IMG_0018-scaled.jpeg` | jeune femme tend une bouteille | accueil (réseaux), notre histoire |
| `Fiche_comm_site_web_Elembo_202512.docx-2.png` | les fondateurs, Christopher et Pauline (photo de la page « A propos », nom de fichier trompeur) | notre histoire → `photos/founders.webp` |
| `photo2.jpeg`, `qualite.jpeg`, `bon_pour_la_sante.jpeg` | pictogrammes de marque (recyclage, usine, mangue) | étapes de production |
| `flyer1.jpeg`, `flyer2.jpeg` | dépliant B2B Elembo | référence (couleurs, ton, coordonnées) — non affichés |
| `photo1-*.jpeg`, `made_in_rdc.jpeg` | visuels de travail | non utilisés |

Ces photos montrent les vraies bouteilles actuelles (étiquette différente des maquettes). Elles sont
légendées « Photo : Elembo » sans identifier les personnes. Aucune image générée n’est présentée comme
une photo de l’usine, des producteurs, des fondateurs ou de l’équipe.

## `public/images/texture/splatter.svg`

Texture d’éclaboussures originale (générée par script), teintée en CSS via `mask`.
