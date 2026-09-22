# Lens Lab · 人工晶状体取舍图解

A Chinese-first, interactive teaching tool for understanding cataract intraocular lens (IOL) trade-offs. Clinical terms stay in English with Chinese explanations, so they are easy to recognise during a consultation.

**[Open the website](https://tingyuansen.github.io/lens-lab/)** · [中文模型与核对记录](dist/VALIDATION.md)

> Educational illustrations, not a preview of anyone's postoperative vision. The optical model is not calibrated to a commercial lens, clinically validated, or reviewed by an ophthalmologist. Do not use the pictures to choose an implant or judge driving safety.

## What you can explore

- A/B comparison of Monofocal（单焦点）and a simplified Trifocal（三焦点）example.
- Night and daytime streets inspired by Petaling Jaya, a guava at an assumed 80 cm, and a reading page at 40 cm.
- Near and intermediate scenes that start **without glasses** on both sides. Drag the glasses down to add the appropriate ideal correction to A, or tap the switch.
- A visible Astigmatism（散光）topic comparing ideal cylinder glasses with aligned Toric（散光型）correction. An axis slider (0–30°) illustrates residual cylinder, not its likelihood. At 0°, both ideal corrections match; that equality is intentional.
- Symbolic focus-range diagrams for Enhanced monofocal（增强型单焦点）and EDOF（延长焦深）.
- Source-linked explanations, a short preference guide, and an optional Fourier-optics laboratory.

The illustration fills the main view; explanations and tables live in **详细说明**. Use **上一场景 / 下一场景**, the scene selector, keyboard arrows, or a horizontal swipe to change scenes. Drag the middle divider to compare the same scene. The layout supports desktop and portrait/landscape phones.

### About the halo slider

**光晕显示强度** adjusts the visibility of added halos and haze in the **night illustration**, from a gentler to a more noticeable example. The default is a gentle illustration, not a clinically estimated average. It changes the effect, not the image's zoom.

This is explicitly a **display-only illustration**. In linear light it blends the focused reference with the three-focus model rendering:

```text
I_display = (1 − t) I_focused + t I_model
```

The UI spans `t = 0…1`, initially `0.3`. Neither the endpoints nor the default are clinically calibrated. The control does not model surgical success, symptom probability, neuroadaptation, or a real lens's light allocation. It also reduces haze/contrast loss, rather than isolating a halo component. Imaging artifacts already in the generated photograph remain.

Reading, arm-length and astigmatism calculations stay unchanged. **Do not combine these scenes into a prediction of one particular lens's performance.** Technical PSF plots are available only in the optional, independent single-focus laboratory, not as a scene in the main app.

Street scenes use an assumed 40° horizontal field. Mapping a wide street image into the earlier 8° field made blur too large relative to the scene; the wider assumption reduces that presentation problem. This is not measured camera geometry or a clinically established “normal” halo size. Reading and arm-length targets retain their 8° teaching field.

## Run locally

No build step, package installation, account, API key, or backend is required. Use a local HTTP server because the app uses JavaScript modules and Web Workers:

```sh
git clone https://github.com/tingyuansen/lens-lab.git
cd lens-lab
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Open <http://127.0.0.1:8765/> in a modern browser. Opening `index.html` directly with `file://` will not reliably load the workers.

## Optical model and its limits

The numerical core uses scalar, paraxial Fourier optics, a circular pupil, and normalized PSFs. Convolution happens in linear light, with conversion back to sRGB for display.

The three-focus teaching example uses a 4 mm pupil, 550 nm wavelength, and equal **incoherent intensity weights** at powers of 0, 1.25, and 2.5 D in one effective optical plane:

```text
PSF_example(D) = [PSF(D) + PSF(D − 1.25) + PSF(D − 2.5)] / 3
```

These are illustrative parameters, **not measured performance or a physical pupil function of a particular trifocal IOL**. The model omits real diffractive designs, wavelength-dependent efficiency, complete ocular aberrations, neural processing, binocular vision, and individual eye disease. It cannot rank actual products or predict acuity, contrast sensitivity, halos, glare, adaptation, or satisfaction.

For matched cylinder correction, the axis slider follows:

```text
residual cylinder = 2 C |sin θ|
C = 1.00 D, θ = 15° → approximately 0.518 D
```

A numerically correct implementation does not establish clinical accuracy. Read the [full assumptions and audit](dist/VALIDATION.md) before interpreting or changing the illustrations.

## Validation

Use Node.js 22 or newer; there are no third-party JavaScript dependencies:

```sh
node audit-optics.mjs
node audit-illustrations.mjs
```

The checks cover FFT inversion, energy normalization, an analytical diffraction-limited MTF comparison, independent cylinder calculations, linear-light convolution, corrected/uncorrected near and intermediate behavior, and image-field kernel scaling. `optics-test-results.json` records a reference run of the core audit; run the scripts for fresh results.

The GitHub Actions workflow runs both audits before publishing `dist/`. These numerical checks do not constitute medical review, clinical validation, or testing on every physical phone. Responsive layouts and key controls have also been checked in a browser.

## Project layout

| Path | Purpose |
| --- | --- |
| `dist/index.html`, `compare.js`, `compare.css` | Main Chinese comparison interface |
| `dist/illustrations.js`, `illustration-worker.js` | Scene rendering and the three-focus teaching example |
| `dist/halo-display.js` | Display-only night illustration blending |
| `dist/optics.js`, `worker.js` | Fourier optics and convolution |
| `dist/bench.html`, `app.js`, `style.css` | Independent single-focus optical laboratory |
| `dist/evidence.js`, `method-content.html` | Clinical references and explanations |
| `dist/VALIDATION.md` | Model assumptions, evidence audit, and limitations |
| `audit-*.mjs` | Dependency-free numerical checks |
| `.github/workflows/pages.yml` | Validation and GitHub Pages deployment |

`dist/` is the directly maintained static website, not disposable generated output.

## Deploy to GitHub Pages

In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source. Push to `main`, or run the **Validate and publish Pages** workflow manually. The workflow validates the code, uploads only `dist/`, and deploys it to GitHub Pages. All asset URLs are relative, so the site works at the repository subpath.

## Evidence and asset provenance

General clinical explanations were checked against these sources on 22 September 2026. Model-specific advice requires current product information and an eye examination.

- [ESCRS cataract surgery recommendations](https://www.escrs.org/escrs-recommendations-for-cataract-surgery)
- [ESCRS patient information](https://www.escrs.org/patient-portal/cataract-surgery)
- [Royal College of Ophthalmologists / RNIB: Understanding Cataracts (2025)](https://www.rcophth.ac.uk/wp-content/uploads/2025/09/APDF-SE180804_Understanding-Cataracts-2025-v01.pdf)
- [Enhanced-monofocal randomized trial](https://pubmed.ncbi.nlm.nih.gov/40623059/)
- [Toric rotation and repositioning study](https://pubmed.ncbi.nlm.nih.gov/38152615/)
- [ESCRS explanation of spherical aberration](https://escrs.org/channels/eurotimes-articles/need-to-know-spherical-aberration)
- [Akondi et al. (2017), weighted-PSF simulation research](https://pmc.ncbi.nlm.nih.gov/articles/PMC5508838/) — methodological background, not validation of this app's parameters.

The PJ-style street and guava backgrounds were AI-generated using OpenAI image generation. They are not photographs of an identified place or patient, and already contain their own imaging artifacts. The reading target is drawn in code; optical effects and PSFs are calculated in code. No clinical photographs or patient records are included.

The app has no added analytics, advertising, or data-submission backend. Computation runs in the browser; GitHub Pages serves the files and external source links open their respective sites.

## Corrections and contributions

Please report factual, optical, accessibility, or usability problems through [GitHub Issues](https://github.com/tingyuansen/lens-lab/issues). For clinical statements, include a primary source and distinguish general evidence from model-specific results. For numerical changes, include the affected assumptions and a meaningful validation check. Do not post personal medical records in public issues.
