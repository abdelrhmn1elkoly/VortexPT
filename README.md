# Vortex PT — Post-Tensioned Concrete CAD & Detailing Suite

[![Version](https://img.shields.io/badge/version-1.0.1-00a2ed.svg)](https://github.com/abdelrhmn1elkoly/VortexPT/releases/latest)
[![Platform](https://img.shields.io/badge/platform-Windows%2011%20%7C%2010%20(x64)-10b981.svg)](https://github.com/abdelrhmn1elkoly/VortexPT/releases/latest)
[![RAM Concept](https://img.shields.io/badge/Bentley%20RAM%20Concept-2024%20%26%202023-f59e0b.svg)](https://www.bentley.com)
[![ADAPT Builder](https://img.shields.io/badge/ADAPT--Builder-ADM%20%2F%20INP-8b5cf6.svg)](https://www.bentley.com)
[![AutoCAD](https://img.shields.io/badge/AutoCAD-Native%20DWG%20%2F%20DXF-ef4444.svg)](https://www.autodesk.com)
[![License](https://img.shields.io/badge/license-Commercial%20%2F%20Trial-blue.svg)](https://github.com/abdelrhmn1elkoly/VortexPT)

> **Turn Bentley RAM Concept (`.cpt`) and ADAPT-Builder (`.adm` / `.inp`) models into site-ready AutoCAD DWG shop drawings, true 3D parabolic drape profiles, and fabrication schedules. 100% offline.**

---

## ⚡ Quick Download

Download the official Windows standalone installer:

[![Download Vortex PT v1.0.1](https://img.shields.io/badge/Download-VortexPT--Setup--1.0.1.exe-00a2ed?style=for-the-badge&logo=windows)](https://github.com/abdelrhmn1elkoly/VortexPT/releases/download/v1.0.1/VortexPT-Setup-1.0.1.exe)

- **Version**: 1.0.1 (Production Release)
- **Installer Size**: ~32.7 MB
- **Prerequisites**: Windows 10 / 11 (64-bit). No separate Python or runtime installation needed.
- **Trial**: Full-featured 7-day trial with instant activation.

---

## 🚀 Key Features

### 1. Dual Structural Engine Support
- **Bentley RAM Concept (2024 & 2023)**:
  - Direct integration via official Bentley Python API.
  - Dynamic discovery of installed engines across system directories and Windows Registry.
  - Automatic version fallback and user preference control (`Auto-Detect`, `2024`, `2023`, or custom paths).
- **ADAPT-Builder (`.adm` / `.inp`)**:
  - Seamless import of ADAPT models and companion `.inp` definitions.
  - 4-angle circular direction clustering for rotated buildings (e.g. 43.4° / 133.4° grids).
  - RAM Concept-style sequential tendon numbering (`X-1, X-2, ...` and `Y-1, Y-2, ...`).

### 2. AutoCAD DWG / DXF Shop Drawing Generation
- **Native Dimension Style Synchronization**:
  - Automatically loads and applies dimension styles from your firm's template DWG/DXF files (`blocks.dwg`, `blocks.dxf`, `KHOLY TENDONS.dxf`).
  - Zero forced overrides: AutoCAD renders dimensions with 100% fidelity to the native style definition, including arrowheads, text height, extension offsets, and dimension rounding (`dimrnd`).
- **Selectable Profile Marker Blocks**:
  - Customizable high/low profile marker blocks (e.g. `Kholy point`, `_TagHexagon`, or custom firm blocks).
- **Flexible Chair Height Rounding**:
  - Configurable chair height rounding increment: **5 mm (Standard)**, **1 mm (Exact)**, **10 mm**, **2 mm**, or **25 mm (1 inch)**.
- **Layer & Detail Standards**:
  - Production layers: `S-SLAB-OUTLINE`, `S-SLAB-OPENING`, `S-COLS`, `S-WALLS`, `S-BEAMS`, `S-PT-TENDON-LAT`, `S-PT-TENDON-LONG`, `S-PT-JACKS`, `S-PT-DEAD-ENDS`, `S-PT-CHAIRS`, `S-DIM-CHAIRS`, `S-DIM-SPACING`.
  - Professional title block, border frame, and embedded CAD Tendon Schedule table.

### 3. Interactive CAD Canvas & Elevation Profile Viewer
- High-performance 2D CAD canvas with smooth pan, zoom, and layer controls.
- Interactive tendon selection displays the true longitudinal parabolic elevation profile, top of concrete (TOC), soffit boundaries, and individual chair height markers.

### 4. Excel Fabrication Takeoffs & Rebar BBS
- Multi-sheet Excel workbook (`.xlsx`):
  - **Project Summary & Takeoff**: Total slab area, concrete volume, strand tonnage, rebar tonnage, and anchor counts.
  - **PT Tendon Schedule**: Mark, strand count, length, unit weight, jacking force, and calculated elongation.
  - **Chair Heights Detail**: Accurate stationing, coordinates, and physical chair heights.
  - **Rebar Bar Bending Schedule (BBS)**: Bar marks, diameters, spacing, cut lengths, weights, and hook types.

### 5. Built-in Technical Documentation
- Instant access to the official **`Vortex_PT_User_Manual.pdf`** from the WinUI 3 command bar, keyboard shortcut **`F1`**, and Settings.

---

## 🛠️ System Requirements

| Component | Minimum Requirement | Recommended |
|-----------|---------------------|-------------|
| **OS** | Windows 10 (64-bit) | Windows 11 (22H2 or newer) |
| **RAM** | 8 GB | 16 GB+ |
| **CAD** | Any AutoCAD / DWG viewer | AutoCAD 2022 - 2026 |
| **FEA Engine** | RAM Concept 2023 or 2024 / ADAPT-Builder | Bentley RAM Concept 2024 |
| **Display** | 1920 × 1080 | 1920 × 1080 or higher with WinUI Mica Alt |

---

## 📖 User Manual & Documentation

- [User Manual (PDF)](docs/Vortex_PT_User_Manual.pdf)
- [Website & Product Tour](index.html)
- [Changelog](CHANGELOG.md)

---

## 📄 License & Commercial Support

Vortex PT is developed by **Abdelrhman Elkholy**.
- Website: [https://github.com/abdelrhmn1elkoly/VortexPT](https://github.com/abdelrhmn1elkoly/VortexPT)
- Support: [abdelrhmn1elkoly@gmail.com](mailto:abdelrhmn1elkoly@gmail.com)
- WhatsApp: [+20 155 222 8306](https://wa.me/201552228306)

© 2026 Vortex PT. All rights reserved.
