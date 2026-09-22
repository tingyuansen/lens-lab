# Lens Lab: evidence and numerical validation

Last reviewed: 22 September 2026. This app has not been reviewed by an ophthalmologist or clinically validated. It is an educational comparison, not a prescription, postoperative vision forecast, product ranking or driving-safety assessment.

## Clinical scope

Distance-targeted Monofocal lenses in both eyes usually require reading glasses. Compared with Multifocal lenses, they generally have fewer halo-related effects and less contrast loss, but do not guarantee freedom from glare or halos. Multifocal, including Trifocal, may reduce glasses dependence across distances, with additional optical trade-offs. Symptoms may lessen with adaptation or persist. Enhanced-monofocal and EDOF designs vary: category names do not establish the performance of a particular model.

Aspheric describes surface shape and the handling of spherical aberration. Some designs compensate for corneal spherical aberration; benefits and sensitivity to tilt/decentration depend on the eye and design. Toric corrects regular corneal astigmatism and requires alignment; rotation can leave residual cylinder and sometimes requires repositioning. It can coexist with other lens designs and does not remove their underlying trade-offs.

The preference guide offers consultation questions, not an implant recommendation. Individual decisions require examination results, a refractive target and exact model information.

## Main optical illustration

Scalar, paraxial Fourier optics generates unit-energy PSFs for a circular 4 mm pupil at 550 nm. The three-focus example is an equal, incoherent intensity mixture at 0, 1.25 and 2.5 D in a single effective optical plane. These focus powers correspond to distance, 80 cm and 40 cm in this teaching model. The one-third weights are illustrative choices, not a commercial IOL’s measured light allocation or pupil function.

The model omits real diffractive/refractive design details, coherent interactions between orders, spectral efficiency, complete ocular aberrations, neural processing and binocular vision. It cannot predict actual halo shape, severity, acuity or satisfaction.

Near and arm-length scenes start without glasses on either side. Putting on A’s glasses adds the ideal power for that scene; 40 cm and 80 cm require different additions, not one universally clear pair of glasses. Each scene retains its own glasses setting. Both sides in the lens-type topic have no residual astigmatism.

## Astigmatism comparison

A has ideal cylinder-glasses correction. B has an ideal Toric correction for the same 1.00 D of regular astigmatism. With the axis aligned at 0°, they match exactly; the equality is intentional.

The slider illustrates axis rotation from 0–30°, not a probability or a typical clinical range. For a matched cylinder magnitude C, residual cylinder is `2 C |sin θ|`. At 15°, C = 1.00 D leaves about 0.517638 D; at 30°, it leaves 1.00 D. Both sides receive the appropriate ideal near/intermediate addition in those scenes, so the comparison isolates astigmatism.

## Image generation and display-only halo control

Street and guava backgrounds are AI-generated, inspired by Petaling Jaya. They are not records of an identified location or patient and retain their original camera-like blur and artifacts. The guava’s assumed 80 cm distance is not recovered from image geometry. Reading text is drawn in code, with Chinese and English versions; neither is a standardized or cross-language-equated acuity chart.

Images are 640 × 360. The layout can crop photographic scenes centrally to fill the screen; A and B use identical framing. Reading targets and focus-range diagrams keep their full aspect ratio. Display size and viewing distance are not calibrated. Convolution uses linear light, a 129 × 129 normalized kernel, edge extension and conversion back to sRGB. The main street scenes assume a 40° horizontal field; near scenes and the independent lab use 8°. These are teaching assumptions, not measured camera fields. Mapping a wide street into the former 8° assumption enlarged blur relative to the scene, so the main street presentation was widened. This change does not establish a clinically typical halo size.

The halo/haze slider is a separate visual illustration step:

`I_display = (1 − t) I_focused + t I_model`

It uses linear light, spans t = 0…1, and defaults to 0.3. It affects B across all four main scenes. Lower values reduce added haze/halos and also improve apparent contrast and near detail. Existing image artifacts remain. Each scene uses a reference ideally focused at its own target distance: this is not one physically consistent lens model. The minimum does not establish a product with ideal focus at every distance and no optical trade-offs. Neither endpoints nor default represent clinical severity, likelihood, neuroadaptation or surgical success. Astigmatism illustrations are independent of this slider.

PSF plots are omitted from the main scene selector. The optional single-focus laboratory retains logarithmic plots for technical inspection; their size and brightness are not perceived halo severity.

## Independent optical laboratory

The lab allows pupil size, regular cylinder, axis rotation, a selected spherical-aberration term and displacement of an ideal compensation term. Spherical aberration is 0.20 μm at 6 mm and scales with pupil diameter to the fourth power. Compensation displacement is in the equivalent pupil plane, not a prediction for a physically displaced IOL. Lab glasses cancel cylinder only and do not add reading power. Clinical category selections do not alter its single-focus numerical model.

## Validation and limits

Run from the repository root:

```sh
node audit-optics.mjs
node audit-illustrations.mjs
python3 scripts/build-english.py --check
```

Core checks cover FFT inversion, nonnegative unit-energy PSFs, comparison of the ideal circular-pupil MTF with its analytical form, independent cylinder-tensor calculations, ideal correction cancellation, linear/sRGB round trips, constant-image and impulse convolution. The illustration checks cover near/intermediate/far behaviour, the exact equal-weight PSF mixture, matched cylinder correction, 0°/15°/30° rotation, kernel energy retention and the reduced pixel footprint at a wider field. The smallest retained kernel energy in the audited illustration set was approximately 99.8219%.

Display-blend tests verify exact endpoints, a constant-image result and the expected linear-light midpoint rather than an sRGB average. The translation build rejects untranslated Chinese source phrases and stale generated English files; both interfaces share the numerical workers and assets.

These checks establish consistency with the code’s chosen assumptions. They do not establish clinical truth, calibrated patient perception, equivalence between language reading targets, or coverage of every browser and physical device.

## Sources

- [ESCRS cataract surgery recommendations](https://www.escrs.org/escrs-recommendations-for-cataract-surgery)
- [ESCRS patient information](https://www.escrs.org/patient-portal/cataract-surgery)
- [RCOphth / RNIB Understanding Cataracts (2025)](https://www.rcophth.ac.uk/wp-content/uploads/2025/09/APDF-SE180804_Understanding-Cataracts-2025-v01.pdf)
- [Enhanced-monofocal randomized trial](https://pubmed.ncbi.nlm.nih.gov/40623059/): 172 patients; Eyhance Optiblue, Impress and NSP-3 compared with Tecnis monofocal Optiblue; two-month follow-up. No significant difference in measured outcomes does not prove equivalence or long-term safety.
- [Toric rotation/repositioning study](https://pubmed.ncbi.nlm.nih.gov/38152615/): the 1.6% recommendation for repositioning in 993 eyes is a study result, not an individual risk estimate.
- [ESCRS spherical aberration explanation](https://escrs.org/channels/eurotimes-articles/need-to-know-spherical-aberration)
- [Akondi et al. (2017)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5508838/): background for weighted-PSF simulation. The study’s model-specific calibration does not validate this app’s equal-weight teaching parameters or display slider.
