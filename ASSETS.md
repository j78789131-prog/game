# 3D assets and licence checklist

The first build should keep the runtime lightweight: use a compact CC0 car model and procedural Parisian blocks for background buildings, then add detailed landmark GLBs after checking their download terms, file size, scale, and mobile performance. Do not scrape or redistribute model files without verifying the individual licence.

## Cars

- **Kenney Car Kit** — 40+ vehicle models in glTF/GLB, FBX and OBJ; CC0 1.0, commercial use permitted, attribution not required (credit appreciated). Good lightweight starter traffic/player vehicles.  
  Source: https://kenney.nl/assets/car-kit  
  Alternate pack page: https://kenney-assets.itch.io/car-kit
- **Kenney Racing Kit models** — useful additional vehicle shapes and props, including compact GLB assets; check each pack's CC0 notice.  
  Source: https://kenney.nl/assets/racing-kit

These are stylized/low-poly rather than photorealistic. For a true high-detail hero car, choose a specific downloadable GLB with a clear licence, optimized mesh, and no brand/trademark issues before bundling it.

## Paris landmarks

- **Eiffel Tower — Brian Trepanier**: downloadable Sketchfab model, CC BY. Credit the creator and include the required attribution in the game's credits. The listed mesh is high-detail (~1.4M triangles), so it should be decimated/LODed before shipping to mobile.  
  https://sketchfab.com/3d-models/eiffel-tower-paris-france-a68b9ffb898d4aa7a44505926a536ce3
- **Notre-Dame de Paris — copybrian**: downloadable Sketchfab model, CC BY; listed around 46K triangles, a more promising starting point for mobile after checking textures and download terms.  
  https://sketchfab.com/3d-models/notre-dame-de-paris-cbe2bbde869c4139912ce2cc35567d2c
- **Arc de Triomphe — PeeJaa**: free-standard Sketchfab model, marked NoAI. Do not use it until the exact free-standard terms and redistribution permissions are confirmed; the NoAI condition must be respected.  
  https://sketchfab.com/3d-models/arc-de-triomphe-c6d32b3f4cfa48409b9004a127e23fb5

## City streets and buildings

- Use OpenStreetMap-derived road/building footprints for accurate street layout and approximate building placement. OSM data is ODbL; provide attribution and review share-alike requirements before distributing derived data.  
  Licence: https://www.openstreetmap.org/copyright
- Procedural Haussmann-style blocks are recommended for distant/background buildings. Reserve photogrammetry/detail for landmarks near the player.
- For every imported asset, record creator, source URL, licence, required credit, original filename, modifications, and redistribution permissions in this file.

## Important

A model being viewable or labelled “free” does not automatically mean its file can be repackaged into an APK or EXE. Confirm the individual licence and download terms before release.
