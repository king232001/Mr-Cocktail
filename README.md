# MR Cocktail — Site vitrine

Site statique (HTML, CSS, JavaScript) pour **MR Cocktail** : cocktails de fruits pour événements à **Lubumbashi (RDC)**.

---

## Analyse du projet (prêt GitHub Pages)

### Points forts

| Élément | Détail |
|--------|--------|
| Stack | 100 % statique — compatible GitHub Pages sans backend |
| Mobile | Menu hamburger, barre basse, scroll horizontal des offres / galerie / avis |
| Conversion | Boutons WhatsApp partout, numéro +243 975 083 780 |
| SEO | Meta description, Open Graph, canonical dynamique, JSON-LD `LocalBusiness` |
| Accessibilité | Labels formulaire, `aria-*` menu / lightbox, consentement avis |
| Performance | `loading="lazy"` sur images, loader désactivé sur mobile |
| Légal léger | Consentement avis + note confidentialité footer |

### À faire avant publication (obligatoire)

1. **URL du site** — Remplacer `votre-pseudo` dans **3 fichiers** :
   - `js/config.js` → `url: 'https://VOTRE-PSEUDO.github.io/NOM-DU-REPO/'`
   - `robots.txt` → ligne `Sitemap:`
   - `sitemap.xml` → balise `<loc>`

2. **Dossier `images/`** — Le dépôt doit contenir toutes les photos référencées dans `index.html` :
   - `images/hero/hero-main.jpg`
   - `images/services/*.jpg` (7 visuels)
   - `images/gallery/*.jpg`
   - `images/cocktails/*.jpg`
   - `images/team/*.jpg`  
   Sans ces fichiers, GitHub Pages affichera des images cassées.

3. **Cache navigateur** — Après chaque mise en ligne CSS/JS, incrémenter `?v=` dans `index.html` (ex. `style.css?v=20260528`).

4. **Test mobile réel** — Sur téléphone Android :
   - Glisser les **Nos offres** jusqu’à la dernière carte : elle doit **rester visible** (pas de grande zone vide après).
   - Section **Avis** : formulaire puis panneau avis à droite.

### Structure du dépôt

```
mr-cocktail/
├── index.html          # Page unique
├── 404.html            # Redirection accueil
├── .nojekyll           # Requis GitHub Pages (pas de Jekyll)
├── robots.txt
├── sitemap.xml
├── css/style.css
├── js/
│   ├── config.js       # URL site + contacts
│   └── script.js       # Menu, avis, lightbox, clamp scroll mobile
├── assets/             # logo.svg, favicon.svg
└── images/             # À fournir (non versionné si trop lourd → Git LFS ou repo séparé)
```

### Sections du site

| Section | ID | Comportement mobile |
|---------|-----|---------------------|
| Accueil | `#accueil` | Hero + CTA WhatsApp |
| Engagements | trust | Scroll horizontal |
| À propos | `#apropos` | Colonne |
| Équipe | `#equipe` | Scroll horizontal |
| Offres | `#services` | Scroll horizontal (7 cartes) |
| Galerie | `#galerie` | 3 bandeaux horizontaux + lightbox |
| Avis | `#avis` | Formulaire + liste côte à côte |
| Réservation | `#reserver` | Étapes horizontales |
| FAQ | `#faq` | Accordéon |
| Contact | `#contact` | WhatsApp, Instagram, email |

### Fonctionnement technique (scroll horizontal)

- Les bandeaux `.scroll-row` utilisent `display: flex` + `overflow-x: auto` en pleine largeur (`100vw`).
- Les wrappers internes (`services__grid`, etc.) utilisent `display: contents` pour que les cartes scrollent directement.
- **Clamp JS** (`initHorizontalScrollClamp`) : empêche de dépasser la dernière carte → plus de zone vide après le dernier élément.

### Limites connues

| Sujet | Note |
|-------|------|
| Avis clients | Stockés dans `localStorage` du navigateur — pas partagés entre appareils |
| Photos | Fichiers `bartender*.jpg` = noms de fichiers seulement, pas du contenu alcool |
| Email | Lien `mailto:` — pas de formulaire serveur |
| Analytics | Non intégré (ajouter plus tard si besoin : Plausible, GA4, etc.) |

### Contact (config)

- WhatsApp : +243 975 083 780  
- Instagram : [@mr_cocktail001](https://www.instagram.com/mr_cocktail001/)  
- Email : bukasakevin24@gmail.com  

---

## Hébergement sur GitHub Pages

### 1. Créer le dépôt

```bash
cd mr-cocktail
git init
git add .
git commit -m "Site MR Cocktail — version initiale"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/mr-cocktail.git
git push -u origin main
```

### 2. Activer Pages

1. GitHub → **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : `main` — dossier **`/` (root)**

### 3. Configurer l’URL

Modifier `js/config.js` :

```js
url: 'https://VOTRE-PSEUDO.github.io/mr-cocktail/',
```

Même URL dans `robots.txt` et `sitemap.xml`.

### 4. Vérifier

- Attendre 1–2 min après le push  
- Ouvrir : `https://VOTRE-PSEUDO.github.io/mr-cocktail/`  
- Tester WhatsApp, menu mobile, dernière carte des offres  

### Nom de dépôt ≠ `mr-cocktail`

Si le repo s’appelle autrement, l’URL change :

`https://VOTRE-PSEUDO.github.io/NOM-DU-REPO/`

---

## Test en local

```powershell
cd mr-cocktail
py -m http.server 8080
```

Puis : http://localhost:8080  

Pour simuler le mobile : outils développeur Chrome → mode responsive ≤ 768 px.

---

## Photos officielles

Les visuels actuels sont temporaires. Remplacez les fichiers dans `images/` lorsque vous recevrez les photos Instagram officielles, **sans changer les noms de fichiers** (ou mettez à jour les `src` dans `index.html`).

---

## Licence / crédits

Site réalisé pour MR Cocktail — Lubumbashi, RDC.
