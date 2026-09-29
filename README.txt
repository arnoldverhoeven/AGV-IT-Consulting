AGV IT — SEO-update + nieuw logo (29/09/2026)
=============================================
Uitpakken in de ROOT van de repo (naast index.html), bestaande bestanden overschrijven.

VERVANGEN
  index.html                     nieuwe title/description, canonical, structured data,
                                 sectie "Affordable websites", footer-links, nieuw logo + favicons
  portfolio/index.html           scherpere title/description + canonical, nieuw logo + favicons
  portfolio/assets/style.css     .logo-stijl voor het nieuwe SVG-logo (portfolio + landingspagina)
  og-image.png                   nieuw social-share-beeld (1200×630)
  signature-logo.png             nieuw logo voor de e-mailhandtekening (300×105, transparant)

NIEUW
  betaalbare-website/index.html  Nederlandstalige landingspagina (+ FAQ)
  robots.txt                     crawlers + AI-bots toegelaten, mock-ups uitgesloten
  sitemap.xml                    3 pagina's voor Google Search Console
  llms.txt                       samenvatting voor AI-assistenten
  assets/agv-logo.svg            logo voor de header (knipperende caret, respecteert reduced-motion)
  assets/agv-logo-dark.svg       idem, voor donkere achtergrond
  assets/agv-logo-static.svg     statische varianten (drukwerk, afbeeldingen)
  assets/agv-logo-dark-static.svg
  assets/favicon.svg             nieuwe favicon (navy tegel met "A/")
  assets/favicon-16.png, favicon-32.png, favicon-192.png, apple-touch-icon.png

Geen wijziging nodig aan _headers, main.js, clarity.js of de portfolio-afbeeldingen.
Oude favicon-bestanden in de root (favicon.ico e.d.) mogen blijven staan of weg.
AI-vermeldingen: enkel nog in meta-omschrijvingen, structured data en llms.txt — niet in zichtbare tekst.
Daarna: sitemap indienen in Google Search Console; cache van Netlify/browser verversen voor het logo.
