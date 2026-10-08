AGV IT — complete update (8/10/2026): SEO + nieuw logo + Google Ads-meting + cookietoestemming
=============================================================================================
Uitpakken in de ROOT van de repo (naast index.html), bestaande bestanden overschrijven.
Dit pakket is cumulatief: het bevat ook alles uit de vorige zips (SEO, logo, favicons, GIF-handtekening).

VERVANGEN
  _headers                       CSP uitgebreid met Google-domeinen (rest van de beveiliging ongewijzigd)
  index.html                     laadt nu consent.js i.p.v. clarity.js
  portfolio/index.html           idem
  portfolio/assets/style.css     (logo-stijl, uit vorige update)
  assets/main.js                 1 regel erbij: conversie "offerteformulier" na geldige verzending
  og-image.png, signature-logo.png

NIEUW
  assets/consent.js              cookiebanner + Google-tag (AW-18483138321) + Clarity, pas na toestemming
  privacy/index.html             privacyverklaring + cookiebeleid (NL + EN)
  betaalbare-website/index.html  NL landingspagina (laadt consent.js)
  signature-logo.gif             geanimeerde handtekening
  robots.txt, sitemap.xml, llms.txt, assets/agv-logo*.svg, favicons

NA DE CONVERSIEACTIE IN GOOGLE ADS:
  Open assets/consent.js, bovenaan staat LABELS = { form: 'VERVANG_…', mail: 'VERVANG_…' }.
  Vervang enkel die twee waarden door de labels uit Google Ads (of stuur ze door).
  Zolang er VERVANG staat, wordt er nog geen conversie verstuurd.

KBO-nummer staat in privacy/index.html.
