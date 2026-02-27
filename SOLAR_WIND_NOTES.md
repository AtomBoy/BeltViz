# Overview

We want to model the effect of solar wind on the Earth's magnetic field.

# Sources

There are figures at these websites that illustrate solar wind effects on the magnetosphere.

 1. https://svs.gsfc.nasa.gov/4188/ (These images are a favorite.)
 2. https://www.swpc.noaa.gov/products/geospace-magnetosphere-movies
 3. https://www.swpc.noaa.gov/phenomena/earths-magnetosphere
 4. https://scied.ucar.edu/image/earth-magnetosphere-visualization
 5. https://science.nasa.gov/blogs/the-sun-spot/2023/09/26/earths-magnetosphere-and-plasmasheet/

This paper gives a good overview of the physics: https://www.physics.purdue.edu/~lyutikov/Liter/solwind_interact_magsphere_tutorial.pdf . It also includes some good figures. It might provide the basis of a good computational aproach for us. If the pdf cannot be read, we can provide the text - please ask.

The Space Weather Modeling Framework (SWMF) is probably too involved and compute intesive for our needs but there might be some ideas we could use. The main page is here https://clasp.engin.umich.edu/research/theory-computational-methods/space-weather-modeling-framework/ and there are software repo here https://github.com/SWMFsoftware/BATSRUS and here https://github.com/SWMFsoftware/SWMF . 

# Previously considered

- **Magnetopause model**: Shue et al. 1998, "Magnetopause location under extreme solar wind conditions", JGR 103(A8):17691-17700 ([doi:10.1029/98JA01103](https://doi.org/10.1029/98JA01103))
- **Magnetopause shape**: Shue et al. 1997, "A new functional form to study the solar wind control of the magnetopause size and shape", JGR 102(A5):9497-9511 ([doi:10.1029/97JA00196](https://doi.org/10.1029/97JA00196))
- **Tsyganenko T96** — considered and skipped. T01 is the direct target (T96 is an interim step with no advantage given G1/G2 are now available from Qin-Denton).
- **Tsyganenko T01** — **current implementation target**. Same closed-form current-system architecture as T89c (~2–5× more compute, still O(1) per evaluation). Adds direct Pdyn/Dst/By/Bz inputs and G1/G2 storm-history indices. G1/G2 sourced from Qin-Denton pre-computed hourly database (NASA ISWA).
- **Tsyganenko TA15 / TA16 RBF** — evaluated and **ruled out**. TA16 uses 1,296 radial basis function centres per B-field evaluation (~70,000 ops/call vs T89c's ~50 ops/call — roughly 1,400× slower). At ~120,000 B-field calls per field-line rebuild, TA16 would require ~200 minutes per frame. Spatial coverage (X ≥ −15 Re) is identical to T01, so there is no spatial advantage either.

# Our Goal

We want to find a physics modeling aproach that produces realistic field line shapes for the full range of solar wind scales (calm to very stormy) but is apropriate for a browser based visualization and will support modest levels of animation (a few frames per second on a modern desktop with graphics card- we are not targeting phones or tablets). It is understood that some level of accuracy might be sacrificed, but the rusults should be visually close to  the referenced sources.

Our aproach should also be testable.

Our current aproach works ok in calm conditions, but in higher solar winds, it has bugs that lead to unrealistic field line shapes. See "@Screenshot 2026-02-20 at 7.05.47 PM.png" and "@Screenshot 2026-02-20 at 7.20.10 PM.png". Attempts to fix these bugs took a lot of work and were unsucessful so we think its time to take a step back and reevaluate.

# Technologies to consider

 - https://en.wikipedia.org/wiki/Smoothed-particle_hydrodynamics
 - Soft Body Physics Simulation https://github.com/Junwoo-Seo-1998/SoftBodyWebDemo
 - 