# Changelog - Vortex PT

All notable changes to the **Vortex PT** Post-Tensioning Shop Drawing & Analysis Platform will be documented in this file.

---

## [1.0.0] - 2026-09-26

### 🚀 Highlights: Production 1.0.0 Release, AutoCAD Dimension Style Customization, Selectable Design Markers & Flexible Chair Rounding

### Added & Improved
- **AutoCAD Dimension Style Customization & Native Property Preservation**:
  - Automatically scans and imports dimension styles (`Kholy Tendons DIm`, `2D1`, `100`, `DIM-100`, `Standard`, etc.) directly from CAD template files (`blocks.dxf`, `KHOLY TENDONS.dxf`, `blocks.dwg`).
  - **Zero Destructive Overrides**: Removed forced override properties on imported dimstyles, allowing AutoCAD to render dimensions with 100% fidelity to the native style definition—including text height (`dimtxt`), arrowheads (`dimasz`), extension line extensions (`dimexe`), extension line offsets (`dimexo`), dimension gap (`dimgap`), and dimension rounding (`dimrnd`).
  - Added **"AutoCAD Dimension Style"** setting card with interactive dropdown picker in Settings Section 2.
- **Design Drawing Hexagon Marker Block Customization**:
  - Made the high/low profile point marker block fully customizable in Settings (defaulting to `"Kholy point"`).
  - Users can now select any custom block definition from the template library (e.g. `Kholy point`, `_TagHexagon`, or custom firm blocks) with an interactive block picker in Settings Section 2.
  - Safe import ensures user-customized CAD blocks retain their native orientation and geometry without unintended deletion.
- **Configurable Chair Height Rounding Increments**:
  - Added user-selectable chair height rounding increment in Settings Section 4 (`PT Anchors & Chairs`).
  - Supports standard construction increments: **5 mm (Standard)**, **1 mm (Exact)**, **10 mm**, **2 mm**, and **25 mm (1 inch)**.
  - Chair heights calculated across all tendon profile evaluation engines (RAM Concept and ADAPT-Builder) dynamically snap to the chosen increment.
- **Dual Bentley RAM Concept Engine Support (2024 & 2023)**:
  - Full automated runtime binding for RAM Concept 2024 and 2023 with version fallback and user preference control.
- **Direct PDF Technical Manual Integration**:
  - Instant access to `Vortex_PT_User_Manual.pdf` from the WinUI 3 command bar, keyboard shortcut `F1`, and Settings.
- **Official Production Release**:
  - Version incremented to **1.0.0** across all modules, cloud manifests, test suites, and Inno Setup installer.

---

## [0.9.7] - 2026-09-26

### 🚀 Highlights: Bentley RAM Concept 2023 & 2024 Dual-Engine Support & Direct PDF User Manual Access

### Added & Improved
- **Bentley RAM Concept 2023 & 2024 Dual-Engine Architecture**:
  - Added comprehensive native support for **RAM Concept 2023** alongside **RAM Concept 2024** without requiring third-party plugins or manual API configuration.
  - **Dynamic Engine Discovery & Version Resolution**: Automatically scans system program directories and Windows Registry (`HKCU\Software\Bentley\Engineering\Concept\Integration`) to discover all installed RAM Concept engines (2024, 2023, 2025, and custom installations).
  - **Seamless Runtime API Binding**: Dynamically isolates and activates the matching `ram_concept` Python API (`v23.0.1` or `v24.0.2`) on the fly, eliminating module cache collisions and version mismatch exceptions.
  - **Intelligent Auto-Switching Fallback**: If an engine (e.g. RAM Concept 2023) encounters a model file saved in a newer format ("Error: This file was not written by RAM Concept"), the extractor automatically switches to RAM Concept 2024 without interrupting user workflow.
  - **Configurable Engine Preference**: Added setting `ram_concept_version` in `SettingsView` allowing users to choose `"Auto-Detect (2024 / 2023)"`, `"RAM Concept 2024"`, `"RAM Concept 2023"`, or custom `Concept.exe` paths, displaying live detection summaries.

- **Direct PDF User Manual Integration**:
  - Replaced the in-app plain text/HTML documentation dialog with immediate launch of the official technical publication **`Vortex_PT_User_Manual.pdf`** in the system's default PDF viewer (Adobe Acrobat, Edge, Chrome, etc.).
  - Added a dedicated **"Manual"** command button with document icon on the primary WinUI 3 command toolbar.
  - Added global keyboard shortcut **`F1`** to instantly open the PDF manual from anywhere in the application.
  - Added **"Open User Manual (PDF)"** action card in Settings under General & Interface.
  - Fully bundled `Vortex_PT_User_Manual.pdf` inside PyInstaller standalone distribution and Inno Setup installer.

- **Packaging & Delivery**:
  - Updated PyInstaller specification `vortex_pt.spec` to bundle the complete PDF manual in both `docs/` and root distribution paths.
  - Updated Inno Setup installer definition `installer/VortexPT.iss` to build `VortexPT-Setup-0.9.7.exe`.

---

## [0.9.6] - 2026-09-26

### 🚀 Highlights: Rotated Slab Direction Clustering & RAM Concept-Style Sequential Renumbering

### Added & Improved
- **ADAPT-Builder Rotated Slab Direction Clustering**:
  - Replaced naive Cartesian `dx >= dy` tendon direction classification with a mathematical 2-axis circular 4-angle clustering algorithm.
  - Successfully detects principal grid orientations for any building rotation angle (e.g. 43.4° / 133.4° in angled basement slabs like `BASEMENT-PART-P`).
  - **Zero Direction Mixing**: Completely prevents transverse tendons from polluting the Longitude plan, and longitudinal tendons from polluting the Latitude plan.
  - Preserves distinct orthogonal tendon groups (e.g. 38 Latitude transverse tendons and 17 Longitude tendons in `BASEMENT-PART-P`).

- **Sequential RAM Concept-Style Tendon Numbering**:
  - Automatically renumbers ADAPT tendons identically to RAM Concept's convention:
    - **Latitude Tendons**: Renumbered sequentially as `X-1, X-2, X-3, ..., X-N`.
    - **Longitude Tendons**: Renumbered sequentially as `Y-1, Y-2, Y-3, ..., Y-M`.
  - Calculates physical transverse spacing order across the slab via orthogonal normal-vector projections ($\vec{P}_{\text{mid}} \cdot \vec{n}$).
  - Automatically detects model numbering direction covariance to maintain natural structural layout ordering from bottom-to-top and left-to-right.
  - Eliminates gaps, missing numbers, and duplicate tendon labels imported from legacy ADAPT models.
  - Seamlessly updates `ContinuousTendon.mark`, `tendon_number`, `strand_tag` (`"3S"`, `"4S"`), `span_set`, `layer_name` (`"ADAPT Latitude Tendon"`, `"ADAPT Longitude Tendon"`), tendon segments, and chair dimension records.

- **Seamless ADAPT-Builder Model Import**:
  - Automatically identifies and reads the companion Generic Model (`.inp`) beside the selected `.adm` database or inside backup directories.
  - Retained strict file dialog filtering (`.cpt` and `.adm`) to prevent accidental raw text file selection.

- **Automated Verification**:
  - Added test suite `test_rotated_building_direction_clustering_and_renumbering` in `tests/test_adapt_inp_extractor.py`.
  - Verified full DXF export and Excel takeoff schedule generation for rotated buildings.

---

## [0.9.5-beta] - 2026-09-22

### Added
- **Native Self-Measuring CAD Spacing Dimensions**:
  - Dynamic dimension lines between chair points directly on the CAD drawing.
  - Automatic collision avoidance and text offset along tendon drapes.
- **Configurable Strand Unit Weight**:
  - Added customizable strand unit weight in settings dialog (`0.785 kg/m` for 12.7mm, `1.100 kg/m` for 15.2mm).
- **Unified Pan Box CAD Block**:
  - Standardized internal dead/live pocket block insertion (`PAN`).
- **Cloud Update Verification**:
  - Integrated update checker and version dialog against GitHub releases.

---

## [0.9.4] - 2026-09-15

### Added
- **ADAPT-Builder `.INP` Generic Model Parser**:
  - Direct import of geometry, slab thicknesses, drop panels, columns, openings, and tendons.
  - Three-point reverse parabola drape curve evaluation.
  - Calculation of elongation, jacking forces, and friction/wobble losses.

---

## [0.9.0] - [0.9.3] - 2026-09-01

### Added
- **Bentley RAM Concept API Integration**:
  - Direct extraction of `.cpt` structural models.
- **Interactive 2D CAD Vector Canvas**:
  - Smooth pan/zoom, layer visibility filters, coordinate inspector, and click-to-inspect.
- **2D Tendon Drape Profile Viewer**:
  - Cross-sectional profile viewer with high/low chair heights, inflection points, and TOC/soffit datum.
- **AutoCAD DXF Shop Drawing Generator**:
  - Standard CAD layering, border sheets, title blocks, and embedded tendon schedules.
- **Excel & CSV Takeoff Schedules**:
  - Multi-sheet workbook with PT tendon schedule, chair height tables, and material takeoffs.
