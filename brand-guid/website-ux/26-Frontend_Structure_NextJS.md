# Frontend Structure - Next.js (AECS Production Blueprint)

## 1. Core Architecture

AECS Frontend is built on Next.js App Router architecture with a system-based modular design.

Principle:
> UI is not pages. UI is a system of engineering modules.

---

## 2. Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS (or AECS Design Tokens)
- Zustand (State Management)
- Server Components + Client Islands
- Optional: Framer Motion (restricted usage)

---

## 3. Folder Structure

app/
 ├── layout.tsx
 ├── page.tsx                      # Homepage (System Entry)
 │
 ├── systems/
 │    ├── page.tsx                # Systems overview
 │    ├── [slug]/page.tsx         # Dynamic system page
 │
 ├── projects/
 │    ├── page.tsx                # Case study list
 │    ├── [id]/page.tsx           # Project detail engine
 │
 ├── engineering/
 │    ├── page.tsx                # System logic explanation
 │
 ├── rfq/
 │    ├── page.tsx                # RFQ Engine (core conversion)
 │
 ├── about/
 │    ├── page.tsx
 │
 ├── contact/
 │    ├── page.tsx

---

## 4. Component Architecture

components/
 ├── ui/                          # Base UI primitives
 ├── system/                      # System logic components
 ├── engineering/                 # Engineering flow components
 ├── projects/                    # Case study components
 ├── rfq/                         # RFQ engine components
 ├── shared/                      # Global reusable components

---

## 5. System Component Model

### SystemCard
- Displays engineering system
- Shows structural logic
- Expands into system details

### ProjectCaseCard
- Problem → Solution → Execution
- Engineering breakdown included

### RFQEngine
- Multi-step system input
- Engineering validation logic
- Project definition output

---

## 6. Data Flow Architecture

User Input → RFQ Engine → Validation Layer → Project Structuring → Engineering Review Queue

---

## 7. State Management

- RFQ State (global)
- System Selection State
- Project Draft State

Tool: Zustand preferred

---

## 8. Rendering Strategy

- Homepage: SSR
- Systems: ISR
- Projects: ISR + dynamic rendering
- RFQ: Client-side interactive system

---

## 9. API Layer

/api/rfq/submit

Responsibilities:
- Validate project input
- Classify system type
- Assign engineering complexity
- Generate project ID
- Route to internal workflow

---

## 10. SEO Architecture

- System-based URLs
- Engineering structured data
- No marketing keywords
- Focus: "engineering systems", not "products"

---

## 11. Performance Rules

- No unnecessary client-side JS
- Lazy load heavy diagrams
- Optimize RFQ as isolated island
- Use streaming where possible

---

## 12. Final Principle

This frontend is not a website.

It is an Engineering Interface System for architectural decision-making.
