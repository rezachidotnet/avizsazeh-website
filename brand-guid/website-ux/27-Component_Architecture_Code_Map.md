# Component Architecture Code Map (AECS)

## 1. Core Principle
This document maps UI components to engineering system logic in AECS architecture.

UI components are not visual blocks. They are functional engineering modules.

---

## 2. Component Philosophy

- Component = System Function
- UI = Engineering Interface Layer
- Every component has a logical role in the system flow

---

## 3. Core Component Categories

### 3.1 UI Primitives Layer
Base building blocks of the system.

- Button
- Input
- Card
- Modal
- Container
- Grid

---

### 3.2 System Components Layer
Engineering-aware UI components.

#### SystemCard
Represents a ceiling system as an engineering module.

Props:
- title
- systemType
- engineeringLogic
- previewDiagram

---

#### SystemFlowDiagram
Visualizes engineering process.

Flow:
Design → Engineering → Manufacturing → Execution

---

#### TrustMetricsBar
Displays engineering credibility indicators.

- Projects count
- Regions
- System categories

---

### 3.3 Project Components Layer

#### ProjectCaseCard
Displays engineering case study.

Structure:
- Problem definition
- Engineering solution
- Execution outcome

---

#### ProjectDetailEngine
Full case study breakdown system.

Sections:
- Engineering challenge
- Structural logic
- Material system
- Execution process
- Result validation

---

### 3.4 RFQ Components Layer (Critical System)

#### RFQEngine
Multi-step engineering project definition system.

Steps:
1. Project type
2. System selection
3. Technical parameters
4. File upload
5. Engineering submission

---

#### RFQStepController
Controls system-based navigation between RFQ stages.

Rules:
- No page reload
- Step = system state transition

---

### 3.5 Engineering Components Layer

#### EngineeringLogicBlock
Displays structural engineering logic.

Includes:
- load behavior
- material constraints
- system validation

---

#### ExecutionFlowVisualizer
Shows real-world execution process.

Stages:
Design → Site preparation → Installation → Verification

---

## 4. Component Interaction Rules

- Hover = reveal system logic
- Click = expand engineering module
- Scroll = narrative system flow
- Transition = state change (not animation)

---

## 5. Component State Model

Each component has 3 states:

1. Default state
2. Active state
3. Expanded system state

---

## 6. Data Binding Logic

Components consume structured AECS data:

- system.json
- project.json
- rfq.json

---

## 7. Architecture Rule

No component is purely visual.

Every component must:
- Represent system logic
- Participate in UX flow
- Contribute to conversion engine

---

## 8. Final Principle

Components are not UI elements.

They are engineering interfaces inside a decision-making system.
