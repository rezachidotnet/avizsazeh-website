# UI Animation Specification (AECS)

## 1. Core Principle
UI animation in AECS is not visual decoration. It is a representation of system state transitions and engineering logic flow.

---

## 2. Animation Philosophy

- Animation = System State Transition
- No decorative motion allowed
- Every animation must have functional meaning
- Motion guides user cognition through the system

---

## 3. Animation Categories

### 3.1 Structural Animation
Represents layout and page structure changes.

Examples:
- Section reveal
- Page transitions
- Module expansion
- Layout shifts

---

### 3.2 System Animation
Represents engineering logic flow.

Examples:
- Design → Engineering → Execution flow
- System diagram unfolding
- Process visualization

---

### 3.3 Cognitive Animation
Represents user understanding progression.

Examples:
- Progressive disclosure
- Step-by-step RFQ flow
- Gradual information reveal

---

## 4. Page Transition Rules

- No hard reload perception
- Soft transition between system states
- Context must be preserved across navigation
- Maximum duration: 800ms

---

## 5. Component Animation Rules

### Cards
- Hover: subtle elevation + border activation
- Click: expand into system detail view

### System Modules
- Reveal engineering logic on interaction
- Expand smoothly into subsystem view

### Project Cards
- Show problem first, solution second
- Expand into full engineering case study

---

## 6. RFQ Engine Animation

- Step-based transitions (not page reloads)
- Each step represents engineering phase
- Progress indicator reflects system state
- Input validation is real-time and structural

---

## 7. Scroll Animation System

Scroll is treated as a narrative engine:

1. Introduction
2. System Definition
3. Proof Layer
4. Engineering Logic
5. Conversion Trigger

---

## 8. Timing Rules

- Micro interactions: 100–200ms
- Standard transitions: 300–600ms
- System transitions: 600–800ms
- No animation exceeds 800ms

---

## 9. Motion Constraints

Allowed:
- Fade transitions
- Slide transitions
- Structural expansion
- System flow animations

Not allowed:
- Bouncing effects
- Decorative looping animations
- Random motion
- Non-functional animation

---

## 10. Engineering Principle

Animation must answer:

"What changed in the system state?"

If it does not answer this, it must not exist.
