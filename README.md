# Elembo — site de la marque

Site public de la marque de jus **Elembo** (Kimpese, Kongo-Central, RDC), en français.
Next.js 16 (App Router, Turbopack, Cache Components) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger.

## Démarrer

```bash
npm install
npm run dev -- -p 3800     # http://localhost:3800
npm run build && npm start # production
```

Node 20 ou plus récent.

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Hero interactif (5 saveurs), intro éditoriale, collection + fiches produit, bandeau, pause lifestyle, origine/production, villes, réseaux |
| `/produits` | Les 5 jus en grand, « À savoir sur nos jus », contact |
| `/notre-histoire` | Marque, chronologie, les gens, engagements, marque vs ONGD vs association AdEL |
| `/points-de-vente` | Intro, 3 villes, livraison, événements & partenariats (hors annuaire) |
| `/points-de-vente/kinshasa` · `/kimpese` · `/matadi` | Adresses par type de point de vente, itinéraires, livraison |
| `/contact` | Formulaire (client / livraison / revendeur) + coordonnées directes |
| `/api/contact` | Réception du formulaire (voir « Formulaire de contact ») |

## Où modifier le contenu

Tout le contenu factuel est dans `src/data/` (prêt à brancher sur un CMS plus tard) :

- `products.ts` — saveurs, descriptions, couleurs de thème, fruits décoratifs, faits communs à la gamme
- `locations.ts` — villes, points de vente (adresse, repère, coordonnées GPS, prix), livraison, événements
- `site.ts` — e-mail, téléphones, réseaux sociaux, association, navigation, numéro WhatsApp
- `assets.ts` — **manifeste central des images** (chemin, dimensions, texte alternatif, provenance)

Ajouter des coordonnées GPS (`coordinates: { lat, lng }`) à un point de vente fait passer son lien
« Itinéraire » en navigation GPS. Ajouter des prix (`prices`) les affiche sur la fiche du point de vente.

## Formulaire de contact

Aucun service d’envoi n’est encore configuré. Sans configuration, `/api/contact` répond 503 et le
formulaire l’annonce clairement, puis propose d’envoyer le même message par e-mail (texte prérempli)
ou d’appeler. **Aucun faux message de succès.**

Pour activer l’envoi : définir `CONTACT_WEBHOOK_URL` (webhook Make/Zapier/n8n, Formspree, ou votre
propre service) dans `.env.local` ou chez l’hébergeur. Le message validé y est envoyé en JSON
(`sujet`, `nom`, `telephone`, `email`, `ville`, `message`, `source`, `receivedAt`), et le succès
n’est affiché que si ce service répond `2xx`.

Les boutons WhatsApp apparaissent automatiquement dès que `whatsappNumber` est renseigné dans
`src/data/site.ts` (aucun numéro WhatsApp n’a été confirmé).

## Bouteille 3D

La bouteille du hero tourne en vraie 3D (three.js, chargé après l’affichage de la page). Pour chaque
saveur, `scripts/unwrap-bottles.py` mesure la silhouette de la bouteille (canal alpha) et « déroule » la
photo sur 360° : `public/images/bottles/3d/<saveur>.webp` + `src/data/bottle-profiles.json`. Les photos
ne montrant que la face avant, chaque face reprend la partie nette de l’étiquette (±72° autour du centre,
non inversée) et les côtés deviennent du papier d’étiquette blanc : pas de raccord étiré. Avec « mouvement réduit » ou sans WebGL, l’image fixe s’affiche.

```bash
python3 scripts/unwrap-bottles.py   # à relancer si une photo de bouteille change
```

## Musique

Bouton « Musique » dans l’en-tête : rien n’est chargé ni joué tant que le visiteur ne l’active pas.
La boucle (`public/audio/elembo-soleil.mp3`, 66 s, ~1,2 Mo) est une composition originale générée
par `scripts/compose-music.py` (style rumba / soukous : guitares en tierces, basse, congas, shaker,
mi majeur, 116 BPM). Pour utiliser un morceau produit par un musicien, remplacez simplement ce fichier
(même nom) — idéalement une boucle sans silence au début ni à la fin.

```bash
python3 scripts/compose-music.py assets-source/music/elembo-soleil.wav   # nécessite numpy et scipy
ffmpeg -i assets-source/music/elembo-soleil.wav -c:a libmp3lame -q:a 5 public/audio/elembo-soleil.mp3
```

## Images

Voir `assets-source/README.md` : origine de chaque fichier, traitements appliqués, et ce qui reste à fournir.
Les originaux restent intacts dans `assets-source/`; les versions web optimisées sont dans `public/images/`.

## Vérification

Avec le serveur lancé :

```bash
node scripts/check.mjs http://localhost:3800   # 29 contrôles d’interaction (saveurs, fiches au clavier, menu mobile, contact, mouvement réduit, 404…)
node scripts/shoot.mjs http://localhost:3800 shots   # captures pleine page desktop 1440 px et mobile 390 px
```

Les deux scripts utilisent `puppeteer-core` avec Google Chrome installé localement
(`/Applications/Google Chrome.app`). Adapter `executablePath` sur une autre machine.

## Choix de conception

- Inspiration : composition de drinkcharlies.com (grand panneau arrondi, logo centré dans une encoche,
  bouteille surdimensionnée, sélecteur de saveur, navigation en pilule, bandeaux, sections inclinées,
  pied de page contrasté) — sans reprendre logo, emballage, slogans ni photos.
- Typographies libres : Bricolage Grotesque (titres condensés et texte) et Caveat Brush (accents manuscrits,
  proche du lettrage brossé de la marque). La police d’origine de la marque n’a pas été fournie.
- Le logo officiel n’est jamais recoloré : sur fond coloré il est posé sur une pastille crème.
- Les animations ne masquent jamais le contenu dans le HTML : si GSAP ne charge pas, tout reste lisible.
  `prefers-reduced-motion` désactive flottement, bandeaux et révélations.

## Déploiement

- Code : dépôt GitHub privé `myglord/elembo`, branche `main`.
- Hébergement : projet Vercel `elembo` → https://elembo-ten.vercel.app
- Chaque `git push` sur `main` déploie automatiquement en production ; les autres branches et les pull requests reçoivent une URL de prévisualisation.
- Variable à définir dans Vercel (Settings → Environment Variables) pour activer le formulaire : `CONTACT_WEBHOOK_URL`.
