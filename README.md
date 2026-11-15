# ESTELUX landing page

A responsive bilingual (English / Arabic RTL) medical-tourism landing page built with React, TypeScript, Vite, Framer Motion and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
npm run preview
```

## Included

- Responsive hero, about, four medical-service cards, care benefits, patient journey, travel-support services, gallery, consultation form and footer.
- English/Arabic language switcher with RTL layout.
- Mobile navigation, smooth section navigation and reduced-motion support.
- Basic form validation and clear demo-only submission messaging.
- SEO title and description.

## Replace before production

1. **Logo:** replace the text-based ESTELUX wordmark in `src/App.tsx` with the approved vector logo (prefer SVG). No ESTELUX logo was attached to the brief.
2. **Photography and video:** replace the editorial image URLs in `serviceImages`, `galleryImages`, and the `.hero-photo` CSS background in `src/App.tsx` / `src/styles.css` with clinic-approved photography and supplied service videos. Current photos are remote editorial placeholders, not representations of ESTELUX facilities or staff. The `/public/images` folder is ready for local assets.
3. **Contact details:** add the clinic's verified phone, email, address and official WhatsApp number. No contact details were provided, so none have been invented.
4. **Form backend:** connect the form submit handler in `src/App.tsx` to the clinic's secure API or approved CRM, add server-side validation, spam protection, consent logging and a privacy-policy URL. The current form validates in-browser but intentionally does not transmit or store personal data.
5. **Legal and medical review:** replace placeholder privacy/terms anchors with approved legal pages. Have the clinic review all service descriptions, translations and medical claims before publication.
6. **Booking integrations:** connect a real appointment scheduling system if patients should book confirmed slots online. The current CTA gathers an enquiry only; it does not confirm appointments.

## Notes

- Do not add doctor credentials, accreditations, patient outcomes, testimonials, treatment guarantees or clinical claims unless the clinic verifies them.
- Google Fonts and the temporary Unsplash images require internet access. Download approved assets locally for a fully self-hosted production deployment.
