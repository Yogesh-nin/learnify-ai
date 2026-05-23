# Learnify — AI Learning Management System

**Learnify** is an AI-powered LMS built with Next.js. Users sign in, create personalized courses from a topic and difficulty level, and study using AI-generated notes, flashcards, quizzes, and Q&A content.

---

## Table of Contents

1. [What We Built](#what-we-built)
2. [What We Achieved](#what-we-achieved)
3. [Tech Stack Overview](#tech-stack-overview)
4. [Packages — What, How, and Why](#packages--what-how-and-why)
5. [Why We Use Inngest](#why-we-use-inngest)
6. [Architecture & Data Flow](#architecture--data-flow)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [Project Structure](#project-structure)
10. [Environment Variables](#environment-variables)
11. [Running the Project](#running-the-project)

---

## What We Built

### Authentication & dashboard
- **Clerk** handles sign-in, sign-up, and session management.
- Protected routes: `/dashboard`, `/create`, `/course/*`, and course-related APIs.
- Dashboard lists the signed-in user’s courses with status (Generating / Ready / Failed), progress, and delete support.

### Course creation
- Multi-step **Create Course** flow: study type, topic, difficulty (Easy / Medium / Hard).
- **Gemini** generates a structured **course outline** (title, summary, chapters, topics with HTML content).
- Course is saved immediately with status `Generating` while chapter notes are produced in the background.

### Study materials (per course)
| Material        | How it is created                                      | UI route                    |
|-----------------|--------------------------------------------------------|-----------------------------|
| Notes / Chapters| Generated with the course (background job)             | `/course/[id]/notes`        |
| Flashcards      | On-demand via API + Gemini                             | `/course/[id]/flashcards`   |
| Quiz            | On-demand via API + Gemini                             | `/course/[id]/quiz`         |
| Q&A             | On-demand via API + Gemini                             | `/course/[id]/qa`           |

Notes are always shown as **Ready** on the course page (no separate “Generate” step). Flashcards, quiz, and Q&A use a generate → poll → view flow.

### UX & theming
- **Light / dark mode** with `next-themes` and semantic CSS variables (`bg-surface`, `text-foreground`, etc.).
- **Animated theme toggler** using the View Transitions API (circle reveal from the toggle button).
- **RippleUI** + **Tailwind** for buttons and layout; **Headless UI** for accessible modals.
- **Sonner** for toast notifications.
- Branded **favicon**, **web manifest**, and **Open Graph** metadata for Learnify.

### Security
- **Server-side course ownership**: every course API checks `courseId` **and** `createdBy` (user email from Clerk) in a single query.
- Clients cannot access another user’s course by changing the URL or `courseId`.
- `createdBy` is taken from the Clerk session on the server, not trusted from the request body.

---

## What We Achieved

### Reliability of AI course generation
- **`lib/courseLayout.js`** — normalizes messy AI JSON (arrays instead of objects, nested keys, markdown fences).
- **Dedicated outline generator** (`configs/generateCourseOutline.js`) so outline prompts are not polluted by chapter-notes chat history.
- **Shared chapter notes pipeline** (`lib/generateChapterNotes.js`) used by both Inngest (production) and Next.js `after()` (local dev).
- Courses move to **`Ready`** or **`Failed`** when background note generation finishes or errors.

### Developer experience
- **Local dev** does not require the Inngest CLI: chapter notes run via Next.js `after()` when `NODE_ENV !== "production"`.
- **Production** uses Inngest for durable, retriable background work on Vercel (serverless timeouts).

### Product polish
- Back navigation on all study sub-pages.
- Course access denied → redirect to dashboard with a clear message.
- Consistent Learnify branding and PWA-friendly icons in `/public`.

---

## Tech Stack Overview

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | Next.js 15 (App Router)             |
| UI               | React 18, Tailwind CSS, RippleUI    |
| Auth             | Clerk                               |
| Database         | Neon (PostgreSQL) + Drizzle ORM     |
| AI               | Google Gemini (`@google/generative-ai`) |
| Background jobs  | Inngest (production)                |
| Deployment       | Vercel (typical)                    |

---

## Packages — What, How, and Why

### Core framework

| Package | Role | How we use it |
|---------|------|----------------|
| **next** | App framework | App Router, API routes, `metadata` / `viewport`, `after()` for local background work |
| **react** / **react-dom** | UI | Client components for dashboard, course pages, create flow |

### Authentication

| Package | Role | How we use it |
|---------|------|----------------|
| **@clerk/nextjs** | Auth | `ClerkProvider`, `useUser`, `UserButton`, `clerkMiddleware` + `auth.protect()` on protected routes; server `auth()` / `currentUser()` in `lib/courseAccess.js` |

**Why:** Managed auth, secure sessions, and easy integration with Next.js middleware without building our own auth system.

### Database

| Package | Role | How we use it |
|---------|------|----------------|
| **@neondatabase/serverless** | Postgres driver | HTTP-friendly connection for serverless (Vercel) |
| **drizzle-orm** | ORM | Schema in `configs/schema.js`, queries in API routes and Inngest functions |
| **drizzle-kit** (dev) | Migrations | `drizzle/` SQL migrations |

**Why:** Type-safe queries, works well on serverless, and Neon fits edge/serverless Postgres.

### AI

| Package | Role | How we use it |
|---------|------|----------------|
| **@google/generative-ai** | Gemini SDK | Separate model configs in `configs/AiModel.js` for outlines, chapter notes, flashcards, quiz, Q&A; JSON `responseMimeType` where applicable |

**Why:** Strong structured JSON output for course outlines and study content; configurable model via `NEXT_PUBLIC_GEMINI_MODEL`.

### Background jobs

| Package | Role | How we use it |
|---------|------|----------------|
| **inngest** | Event-driven workflows | `inngest/client.ts`, functions in `inngest/functions.js`, served at `/api/inngest`; `notes.generate` event after course create |

See [Why We Use Inngest](#why-we-use-inngest) below.

### UI & styling

| Package | Role | How we use it |
|---------|------|----------------|
| **tailwindcss** | Utility CSS | Layout, responsive grid, semantic colors via CSS variables |
| **rippleui** | Component styles | `btn-primary`, `btn-outline-primary`, modals alignment |
| **daisyui** (dev) | Tailwind plugin | Optional utilities (if configured in Tailwind) |
| **@headlessui/react** | Headless components | Accessible dialog in delete / confirm modals |
| **lucide-react** | Icons | Menu, arrows, loaders, theme toggle |
| **framer-motion** | Animation | UI motion where used |
| **styled-components** | CSS-in-JS | Legacy / component-specific styling if present |
| **next-themes** | Theme switching | `ThemeProvider` with `class` strategy + system default |
| **sonner** | Toasts | Success/error on create course, etc. |

### Study experience

| Package | Role | How we use it |
|---------|------|----------------|
| **react-markdown** + **remark-gfm** | Markdown rendering | Chapter notes and Q&A content |
| **react-card-flip** | Flashcards | Flip animation on flashcard study page |
| **swiper** | Carousel | Flashcard slider navigation |
| **axios** | HTTP client | Dashboard and course pages calling REST APIs |

### Utilities

| Package | Role | How we use it |
|---------|------|----------------|
| **uuid** | IDs | `courseId` generation on create |
| **dotenv** | Env loading | Local / config |
| **@mdx-js/*** + **@next/mdx** | MDX | Optional MDX pages (`app/notes/page.tsx`) |

---

## Why We Use Inngest

### The problem

Creating a course is fast for the user, but **generating chapter notes** is slow:

- Multiple Gemini calls (one per chapter, run **sequentially** to avoid rate limits).
- Each call can take several seconds.
- Total work often exceeds **Vercel/serverless function timeouts** if done inside the same HTTP request that creates the course.

If we only used a synchronous API route, the browser would wait too long or the function would time out before all chapters were saved, leaving courses stuck on **Generating**.

### What Inngest solves

| Need | Inngest benefit |
|------|-----------------|
| **Run work after the HTTP response** | API returns immediately; `notes.generate` runs in a worker |
| **Durability & retries** | Failed steps can be retried; `step.run()` gives observable steps |
| **Production on Vercel** | Fits serverless: short API handler, long work elsewhere |
| **Observability** | Inngest dashboard shows runs, failures, and event history |

### How we use it in this project

1. User creates a course → `POST /api/generate-course-outline`.
2. Course row is inserted with `status: "Generating"`.
3. **Production** (`NODE_ENV === "production"` or `INNGEST_FORCE=1`):
   - `inngest.send({ name: "notes.generate", data: { course } })`.
   - **`GenerateNotes`** function calls `generateChapterNotesForCourse(course)`.
   - On success → `status: "Ready"`; on failure → `status: "Failed"`.
4. **Local development** (default):
   - Same logic runs via Next.js **`after()`** — no Inngest CLI required for day-to-day dev.

Shared logic lives in **`lib/generateChapterNotes.js`** so production and local dev behave the same; only the **runner** differs (Inngest vs `after()`).

### What we do *not* use Inngest for

- **Flashcards, quiz, Q&A** — generated synchronously in `POST /api/study-type-content` when the user clicks Generate (smaller, single-shot jobs).
- **Course outline** — generated in the create API request (one Gemini call, then background notes only).

### Optional local Inngest dev

```bash
npm run dev:inngest   # Inngest dev server
```

Useful to test the full Inngest path locally with `INNGEST_FORCE=1`.

---

## Architecture & Data Flow

```
┌─────────────┐     Clerk auth      ┌──────────────────┐
│   Browser   │ ──────────────────► │  Next.js App     │
│  (Learnify) │                     │  + API Routes    │
└─────────────┘                     └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
             ┌────────────┐          ┌────────────┐          ┌────────────┐
             │ Neon DB    │          │ Gemini API │          │ Inngest    │
             │ (Drizzle)  │          │ (Google)   │          │ (prod only)│
             └────────────┘          └────────────┘          └─────┬──────┘
                                                                    │
                                                                    ▼
                                                          generateChapterNotes
                                                          → chapterNotes table
                                                          → course status Ready
```

### Create course sequence

1. Client: topic + type + difficulty → `POST /api/generate-course-outline`.
2. Server: Gemini outline → normalize → insert `studyMaterial`.
3. Background: generate each chapter’s notes → `chapterNotes` rows.
4. Server: update `studyMaterial.status` to `Ready` or `Failed`.
5. Client: dashboard polls / refreshes course list; user opens course when Ready.

---

## Database Schema

| Table | Purpose |
|-------|---------|
| **users** | Clerk users mirrored in DB (`name`, `email`, `isMember`) |
| **studyMaterial** | Course metadata: `courseId`, `topic`, `courseLayout` (JSON), `createdBy`, `status`, `difficultyLevel` |
| **chapterNotes** | Per-chapter AI notes (`courseId`, `chapterId`, `notes` text/JSON) |
| **studyTypeContent** | Flashcards, quiz, Q&A JSON (`courseId`, `type`, `content`, `status`) |

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/courses` | GET | Single course (owner-only) |
| `/api/courses` | POST | List current user’s courses |
| `/api/courses` | DELETE | Delete course + related rows (owner-only) |
| `/api/generate-course-outline` | POST | Create course + queue note generation |
| `/api/study-type` | POST | Fetch notes / flashcards / quiz / qa |
| `/api/study-type-content` | POST | Generate flashcard / quiz / qa content |
| `/api/inngest` | GET/POST/PUT | Inngest serve endpoint |
| `/api/create-user` | — | User sync (public for webhooks / provider) |

All course-scoped routes use **`lib/courseAccess.js`** for authorization.

---

## Project Structure

```
ai-lms-main/
├── app/
│   ├── (auth)/              # Clerk sign-in / sign-up
│   ├── api/                 # Route handlers
│   ├── course/[courseId]/   # Course hub + notes, flashcards, quiz, qa
│   ├── create/              # Course creation wizard
│   ├── dashboard/           # Main app shell (sidebar, course list)
│   ├── _components/         # ThemeProvider, AnimatedThemeToggler
│   ├── layout.tsx           # Root layout + metadata
│   └── globals.css          # Theme tokens + RippleUI overrides
├── configs/
│   ├── schema.js            # Drizzle tables
│   ├── db.js                # DB connection
│   ├── AiModel.js           # Gemini chat models
│   └── generateCourseOutline.js
├── context/
│   └── CourseContext.tsx    # Shared course list state
├── inngest/
│   ├── client.ts
│   └── functions.js         # GenerateNotes, CreateNewUser, etc.
├── lib/
│   ├── courseAccess.js      # Auth + ownership checks
│   ├── courseLayout.js      # AI JSON normalization
│   └── generateChapterNotes.js
├── public/                  # Icons, logos, site.webmanifest
├── drizzle/                 # Migrations
└── middleware.js            # Clerk route protection
```

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string (server-only — never use `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_CLERK_*` | Clerk publishable keys / URLs |
| `CLERK_SECRET_KEY` | Clerk server secret |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_GEMINI_MODEL` | Optional model name (default: `gemini-2.0-flash-lite`) |
| `INNGEST_EVENT_KEY` | Inngest Cloud event key (production) |
| `INNGEST_SIGNING_KEY` | Inngest webhook signing (production) |
| `INNGEST_FORCE=1` | Force Inngest path in non-production |
| `NEXT_PUBLIC_APP_URL` | Canonical URL for metadata / OG tags |

---

## Running the Project

```bash
# Install dependencies
npm install

# Run database migrations (Drizzle)
npx drizzle-kit push   # or your migration command

# Development
npm run dev

# Production build
npm run build
npm start

# Optional: Inngest dev server (test background jobs locally)
npm run dev:inngest
```

---

## Summary

Learnify combines **Next.js**, **Clerk**, **Neon**, and **Gemini** into a full learning flow: create courses with AI, study with multiple formats, and stay secure with server-side ownership checks. **Inngest** is used specifically because **chapter note generation is too slow and too long-running for a single serverless HTTP request** in production; shared library code and a local **`after()`** fallback keep development simple without sacrificing reliable background processing when deployed.
