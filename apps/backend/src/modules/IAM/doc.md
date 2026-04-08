<!--
@file doc.md
@module IAM
@description Documentacion funcional y tecnica resumida del modulo IAM del backend.

@tfi
section: IEEE 830 11 / 12.1
rf: RF-01
rnf: RNF-05

@business
inputs: responsabilidades del modulo, endpoints y decisiones de integracion con SDK y Prisma
outputs: documento de apoyo para mantenimiento y auditoria del modulo IAM backend
rules: documentar responsabilidades reales y mantener alineacion con handlers, services y contracts

@technical
dependencies: modulo IAM backend, contracts IAM, Prisma, consumido como documentacion del equipo
flow: resume el objetivo del modulo; enumera endpoints y responsabilidades; documenta interacciones con services, contracts y seguridad.

@estimation
complexity: Low
fpa: EO
story_points: 1
estimated_hours: 1

@testing
cases: TC-DOC-IAM-02

@notes
decisions: la documentacion breve del modulo se mantiene cerca del backend para facilitar auditoria y onboarding.
-->

# Module Documentation

- purpose: Handle features for this module.
- responsibilities: Provide encapsulated logic.
- design decisions: Follows CQRS/Modular monolith architecture.
- interactions: Communicates via Contracts.
