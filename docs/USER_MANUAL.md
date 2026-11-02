# Vortex PT - Engineering User Manual & Technical Guide

**Automated Post-Tensioned Concrete Detailing, 3D Profiling & AutoCAD DWG Generator**  
*Built for Post-Tensioning Structural Engineers and CAD Draftspersons*

---

## Table of Contents
1. [Introduction & Overview](#1-introduction--overview)
2. [Getting Started & Opening Models](#2-getting-started--opening-models)
3. [The 2D CAD Viewport & Navigation](#3-the-2d-cad-viewport--navigation)
4. [Tendon Profile Viewer & Chair Heights](#4-tendon-profile-viewer--chair-heights)
5. [Engineering Validation & Quality Warnings](#5-engineering-validation--quality-warnings)
6. [Post-Tensioning Schedules & Takeoffs](#6-post-tensioning-schedules--takeoffs)
7. [AutoCAD DWG Shop Drawing Exporting](#7-autocad-dwg-shop-drawing-exporting)
8. [Customizing DWG End Blocks & Tendon Colors](#8-customizing-dwg-end-blocks--tendon-colors)
9. [Configuring Rules & Chair Deductions](#9-configuring-rules--chair-deductions)
10. [Keyboard Shortcuts & Troubleshooting](#10-keyboard-shortcuts--troubleshooting)

---

## 1. Introduction & Overview
Vortex PT bridges the gap between finite element structural concrete software (Bentley RAM Concept and ADAPT-Builder) and fabrication-ready AutoCAD shop drawings. 

Key capabilities include:
- **Dual Structural Engine Support**:
  - **Bentley RAM Concept**: Parses `.cpt` and `.cpt8` models directly without requiring a RAM Concept license on drafting machines.
  - **ADAPT-Builder**: Imports ADAPT models directly by selecting the native `.adm` file, automatically reading the paired `.inb` / `.inp` companion exchange file with the same name.
- **True 3D Parabolic Profiling**: Accurately calculates real physical strand length, elongation, and support chair elevations.
- **Automated AutoCAD DWG Export**: Directly creates production `.dwg` files formatted to standard drafting practices.
- **Engineering Quality Warnings**: Automatically detects concrete cover violations, impossible two-dead-end anchors, and excessive tendon lengths.
- **Material Takeoff**: Generates comprehensive cutting lists, strand weight takeoffs, and chair height distribution tables.

---

## 2. Getting Started & Opening Models
1. **Launch Vortex PT**: Open the application from your desktop or application folder.
2. **Open a Model**:
   - Click the **"Open Model"** button in the top toolbar or press `Ctrl + O`.
   - Select any **Bentley RAM Concept file (`*.cpt`, `*.cpt8`)** or **ADAPT-Builder Generic Model (`*.inp`)**.
   - **Exporting from ADAPT-Builder**: In ADAPT-Builder Floor Pro / Edge, simply go to `File -> Export -> Generic Model (*.inp)` to generate the `.inp` file.
   - The status bar will show extraction progress as slabs, drop panels, columns, walls, beams, and continuous tendons are loaded into memory.
3. **Model Overview**:
   - Once loaded, the left sidebar displays project statistics: Total Slabs, Tendon Count, Total Strand Weight (kg), Live Stressing Jacks, and Dead Anchors.

---

## 3. The 2D CAD Viewport & Navigation
The central CAD viewport provides a GPU-accelerated 2D vector workspace:
- **Pan**: Click and drag with the **Middle Mouse Button (Scroll Wheel)** or **Right Mouse Button**.
- **Zoom**: Scroll the **Mouse Wheel** up to zoom in, down to zoom out (zooms toward cursor location).
- **Fit View**: Press `Spacebar` or click the **"Fit View"** button in the toolbar.
- **Select Tendon**: Left-click on any tendon line to select it. The selected tendon is highlighted in bright cyan with glowing anchor nodes.
- **Quick Search**: Type any tendon mark (e.g. `X-1`, `Y-15`) into the search bar or press `Ctrl + F` to highlight and center it.
- **Layer Toggles**: Use the sidebar checkboxes to toggle visibility of:
  - Tendons (Latitude and Longitude)
  - Concrete Slabs & Slab Boundaries
  - Drop Panels & Openings
  - Structural Columns & Shear Walls
  - Support Chair Elevation Labels & Ticks
  - Stressing Anchors & Dual Bubble Tags
  - Dimension Strings

---

## 4. Tendon Profile Viewer & Chair Heights
When a tendon is selected, the bottom dock displays its longitudinal cross-sectional profile:
- **Profile Curve**: Shows the exact parabolic draping of the tendon between supports.
- **High Points**: Peak elevations over support columns and walls (marked with yellow elevation tags).
- **Low Points**: Sag elevations in the middle of spans (marked with green chair tags).
- **Inflection Points**: Tangent transitions between reverse parabolas.
- **Chair Elevation Calculation**:
  - Automatically calculates physical chair heights:
    Chair Height = Profile CGS - Deduction
  - Anchors stay at the exact design elevation.
  - Chair heights are rounded to your configured increment (e.g. nearest 5 mm).

---

## 5. Engineering Validation & Quality Warnings
Vortex PT continuously validates tendon geometry and anchor configurations against structural engineering standards:

### A. Concrete Cover Compliance
- **Check**: Verifies that every point along the tendon has sufficient concrete cover from both the slab soffit (bottom) and the slab surface (top):
  Bottom Cover = Profile Elevation
  Top Cover = Slab Thickness - Profile Elevation
- **Alert**: If cover is less than your configured **Minimum Concrete Cover** (default: 25 mm), an alert is flagged showing the exact location and deficiency.

### B. Two Dead Ends Check
- **Check**: Verifies that a tendon is not accidentally configured with dead-end (blind) anchors on both ends.
- **Alert**: If both ends are dead anchors, a **Critical Warning** is issued because the tendon cannot be hydraulically stressed from either end.

### C. Two Live Ends Maximum Length
- **Check**: When both ends have live stressing jacks, checks that the tendon does not exceed the maximum allowable length (default: 35.0 m).
- **Alert**: Flagged to prompt the engineer to verify friction losses and total elongation.

---

## 6. Post-Tensioning Schedules & Takeoffs
Click the **"Schedules"** icon in the left navigation rail to view interactive tables:
1. **Cutting Lengths (Combined)**: Complete fabrication schedule with Tendon ID, Strand Count, Jacking Ends, Plan Length, Cutting Length (with tail allowance), Wedges, Duct Size, Weight (kg), and Theoretical Elongation (mm).
2. **Latitude Direction (X)**: Filtered cutting list for latitude tendons only.
3. **Longitude Direction (Y)**: Filtered cutting list for longitude tendons only.
4. **Chair Heights Summary Table**: Clean summary grouping all chairs by fabricated height (e.g. 25 mm, 30 mm, ..., 180 mm) and providing the exact quantity required for Latitude, Longitude, and Total Slabs.
5. **Takeoff Summary**: High-level bill of materials for strands, anchors, wedges, pocket formers, and ductwork.
- Click **"Export Excel"** or **"Export CSV"** to save to spreadsheets.

---

## 7. AutoCAD DWG Shop Drawing Exporting
Click the **"Export"** icon in the left navigation rail or press `Ctrl + E`:
1. **CAD Drawing Type**:
   - **Shop Drawing (Full Fabrication & Chairs)**: Complete fabrication drawing with chair elevation markers, remainder distance dimensions, and tendon spacing strings.
   - **Design Drawing (Profile Points Only)**: Clean engineering layout with Kholy profile point blocks and high/low labels.
2. **Plan Layout**:
   - **Side-by-Side Dual Plan [Recommended]**: Places both Latitude and Longitude drawings side-by-side on a single unified sheet for streamlined printing.
   - **Combined Plan**: All tendons on a single plan view.
   - **2 Separate Plans**: Outputs independent DWG files for Latitude and Longitude.
3. **Units**: Choose **Millimeters (mm)** or **Meters (m)**.
4. **Drawing Options**:
   - Include Embedded PT Cutting Schedule Table.
   - Include Chair Elevations and Remainder Dimensions.
   - Include Calculated Elongations on Plan (`Elo: XX mm`).

---

## 8. Customizing DWG End Blocks & Tendon Colors
Vortex PT loads standard and custom CAD blocks directly from the **`templates/`** folder located inside the application directory:
- **Template File**: `templates/blocks.dwg` (and pre-converted `templates/blocks.dxf`).
- **Adding Your Own Blocks**:
  1. Go to **Settings** -> **CAD Shop Drawing Detailing**.
  2. Click **"Edit in AutoCAD"** (or **"Open Folder"** and double-click `blocks.dwg`).
  3. Draw or paste your custom anchor blocks (e.g. `MY_LIVE_ANCHOR`, `SPECIAL_DEADEND`), oriented along the X-axis.
  4. Save the drawing and close AutoCAD.
  5. In Vortex PT, click **"Choose..."** next to Live End, Dead End, or Pan Box to select your new block, or type its name directly.
  6. When exporting, Vortex PT automatically detects and imports all blocks from `blocks.dwg` directly into your output DWG files!
- **Default Blocks**:
  - **Live End Anchor Block**: Default `LIVEND`.
  - **Dead End Anchor Block**: Default `DEADEND`.
  - **Pan Box Block**: Default `PAN`.
- **Tendon Colors in DWG**:
  - **Latitude Tendon DWG Color**: Select the ACI layer color (Magenta [6], Cyan [4], Green [3], Yellow [2], Red [1], Blue [5], White [7]).
  - **Longitude Tendon DWG Color**: Select the ACI layer color for longitude tendons to easily differentiate directions in AutoCAD.

---

## 9. Configuring Rules & Chair Deductions
In **Settings**, adjust technical PT parameters:
- **Standard Chair Spacing**: Default nominal spacing along tendon spans (default: 1000 mm).
- **Deductions**:
  - Low Point Chair Deduction: e.g. 0 mm or 15 mm.
  - High Point Chair Deduction: e.g. 0 mm or 10 mm.
  - Intermediate Chair Deduction: e.g. 0 mm or 10 mm.
- **Minimum Chair Height**: Minimum physical bar support fabricated (default: 20 mm).
- **Stressing Tail Addition**: Extra length added per live anchor for jack gripping (default: 0.30 m).
- **Jacking Force**: Percentage of tensile strength fpu (default: 75% or 80%).

---

## 10. Keyboard Shortcuts & Troubleshooting
| Shortcut | Action |
| :--- | :--- |
| `Ctrl + O` | Open RAM Concept (`.cpt`) or ADAPT-Builder (`.inp`) Model |
| `Ctrl + E` | Fast Export to AutoCAD DWG |
| `Ctrl + Shift + E` | Export Schedules to Excel (.xlsx) |
| `Ctrl + F` | Focus Search Box for Tendons |
| `Ctrl + ,` | Open Settings View |
| `Ctrl + B` | Toggle Navigation Rail Expanded / Compact |
| `Spacebar` / `F` | Zoom to Fit Drawing in Viewport |
| `Esc` | Clear Selected Tendon & Reset View |
| `F5` | Reload Current Model |

### Troubleshooting
- **AutoCAD DWG Conversion**: Ensure Autodesk AutoCAD is installed on the machine. Vortex PT automatically detects AutoCAD 2022 through 2027 `accoreconsole.exe`.
- **HDR Displays**: If using Windows 11 HDR on multi-monitor setups, Vortex PT automatically applies a solid Fluent dark theme so that the window renders crisply on all monitors.
