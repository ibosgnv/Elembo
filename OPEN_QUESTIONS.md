# Informations à confirmer

Le site n’affiche que ce que confirment elembo-rdc.com (mars 2026), le dépliant B2B Elembo et le
document « Elembo RDC.pdf ». Tout le reste est listé ici.

## Produits

- [ ] **Composition** de chaque jus (fruits, eau, sucre ajouté ?, pourcentages) — la fiche produit l’annonce « bientôt disponible ».
- [ ] **Valeurs nutritionnelles**.
- [ ] **Allégations** « 100 % naturel », « bio », « sans additif », « faible en sucre ajouté » : présentes sur l’ancien site et le dépliant, **non reprises** faute de certification ou de fiche technique. Confirmer et fournir la preuve (certificat bio ?) avant de les publier.
- [ ] **Logo OCC** (Office Congolais de Contrôle) demandé dans la revue UX — non fourni. Le contrôle OCC est mentionné en texte.
- [ ] **Saisons** : quels mois pour l’orange, l’ananas, la mangue ? Le site dit seulement « selon la saison ».
- [ ] **Conservation** : le site dit « jusqu’à 1 année », le dépliant « plus d’un an ». Le site retient « jusqu’à un an ».
- [ ] **Prix** : aucun prix confirmé. L’ancienne page d’accueil affiche « $5 / 750 ml », incompatible avec le format 30 cl (reste d’un modèle WordPress) — ignoré.
- [ ] **Badge « 100% naturel · RD Congo »** (fichier officiel disponible) : à utiliser seulement si l’allégation est confirmée.

## Points de vente

- [ ] **Coordonnées GPS** de chaque point de vente → activent la carte et la navigation GPS. Pour l’instant, « Itinéraire » ouvre une recherche par adresse dans Google Maps.
- [ ] **Noms** de trois points de vente sans nom sur l’ancien site (dépositaire Kasa-Vubu, détaillant Mont-Ngafula, point de vente de Matadi) — intitulés provisoires.
- [ ] **Prix par point de vente** (la revue UX demande des sous-pages par lieu) — structure prête (`prices` dans `locations.ts`).
- [ ] Hôtel(s) de Kinshasa « à voir », supermarchés à venir, écoles : adresses quand elles existent.
- [ ] Matadi : un seul point de vente connu. D’autres ?

## Contact et réseaux

- [ ] **Numéro WhatsApp** confirmé (et lequel) → renseigner `whatsappNumber` dans `src/data/site.ts`.
- [ ] **Service d’envoi du formulaire** → `CONTACT_WEBHOOK_URL` (voir README).
- [ ] **TikTok** : le site actuel pointe vers `@jus.elembo6`, le compte-rendu mentionne `@juselembo`. Lequel est le bon ?
- [ ] Le site actuel écrit « lexandre Isekama » : corrigé en « Alexandre Isekama » — à confirmer.
- [ ] Adresse de l’ONGD (dépliant : Av. Bundimbu, Q. Lukengezi, Kimpese) vs Espace Elembo (Av. Kadiazila 21) : les deux sont affichés, à des endroits différents.

## Contenus

- [ ] **Musique** : la boucle actuelle est une composition générée par script (sans droits tiers). Un morceau original enregistré par un artiste congolais serait plus fort pour la marque.

- [ ] **Photos authentiques** de l’usine, des producteurs et de l’équipe (la photo des fondateurs de l’ancien site est utilisée, 902×873 px : une version plus grande serait préférable) (shooting prévu par le vidéaste en Suisse/RDC). Aucune image générée ne les remplace.
- [ ] Nom de famille de Pauline (co-fondatrice) et accord pour publier la bio de Christopher.
- [ ] Police officielle de la marque (la graphiste en Suisse) : remplacer Caveat Brush / Bricolage Grotesque si une licence web est disponible.
- [ ] Version SVG du logo.
- [ ] Pages légales (mentions légales, confidentialité) : non créées faute de contenu ; à ajouter avant mise en ligne si le formulaire collecte des données.
- [ ] Texte lingala « Tongo etani na mboka » utilisé tel quel (repris du dépliant) — traduction officielle si souhaitée.
