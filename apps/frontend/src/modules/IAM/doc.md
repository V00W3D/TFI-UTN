<!--
@file doc.md
@module IAM
@description Documentacion funcional y tecnica resumida del modulo IAM del frontend.

@tfi
section: IEEE 830 11 / 12.1
rf: RF-01
rnf: RNF-05

@business
inputs: decisiones del modulo, responsabilidades y relaciones con contratos y SDK
outputs: documento de apoyo para mantenimiento y auditoria del modulo IAM
rules: describir responsabilidades reales y mantener consistencia con el codigo fuente

@technical
dependencies: modulo IAM frontend, contracts IAM, sdk.ts, consumido como documentacion del equipo
flow: resume el objetivo del modulo; enumera responsabilidades y decisiones de diseno; documenta interacciones con contracts y SDK.

@estimation
complexity: Low
fpa: EO
story_points: 1
estimated_hours: 1

@testing
cases: TC-DOC-IAM-01

@notes
decisions: la documentacion breve del modulo se mantiene junto al codigo para facilitar trazabilidad.
-->

# Module Documentation

- purpose: Handle features for this module.
- responsibilities: Provide encapsulated logic.
- design decisions: Follows CQRS/Modular monolith architecture.
- interactions: Communicates via Contracts.
