# Designo
## AI System Design Interview Coach

**Functional Requirements, Backend Specification & Role Definition Document**
**Version:** 1.0
**Document Type:** Product & Engineering Specification (AI-Assistant Ready)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Goals](#2-business-goals)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Functional Requirements](#4-functional-requirements)
5. [Backend Technical Specification](#5-backend-technical-specification)
6. [API Specification](#6-api-specification)
7. [Background Jobs](#7-background-jobs)
8. [Security Requirements](#8-security-requirements)
9. [MVP Scope & Phasing](#9-mvp-scope--phasing)

---

## 1. Project Overview

### 1.1 Product Vision

Designo is an AI-powered SaaS platform that helps software engineers prepare for **System Design Interviews** by:

- Simulating realistic interview scenarios
- Evaluating architecture solutions
- Generating system diagrams
- Identifying knowledge gaps
- Creating personalized learning roadmaps

### 1.2 Core Product Functions

The platform operates across four functional pillars:

| Function | Role |
|---|---|
| **AI Interviewer** | Conducts structured, multi-stage mock interviews |
| **AI Evaluator** | Scores performance objectively across weighted categories |
| **AI Mentor** | Recommends personalized learning content |
| **AI Progress Tracker** | Surfaces analytics and trends over time |

---

## 2. Business Goals

### 2.1 Primary Goals

- Help users improve system design interview performance
- Provide objective and repeatable evaluations
- Reduce dependency on human mock interviewers
- Build personalized learning paths

### 2.2 Secondary Goals

- Team coaching for bootcamps
- University partnerships
- Enterprise engineering training

---

## 3. User Roles & Permissions

### 3.1 Guest

**Can:**
- View Landing Page
- View Pricing
- View Features
- Register Account
- Login

**Cannot:**
- Access Dashboard
- Start Interviews
- Generate Diagrams
- View Analytics

### 3.2 Free User

**Can:**
- Manage Profile
- Access Question Library
- Start Mock Interviews
- View Basic Reports
- Access Basic Dashboard

**Limitations:**
- Maximum 3 interviews per month
- No diagram generation
- No advanced analytics
- No company-specific interview modes

### 3.3 Pro User

**Can:**
- Unlimited Interviews
- Generate Architecture Diagrams
- Diagram Review
- Advanced Analytics
- Personalized Learning Plans
- Interview Replay
- Company-Specific Interview Modes

### 3.4 Enterprise User

**Can:**
- Team Dashboard
- Team Analytics
- Team Reports
- Organization Management
- Invite Members
- Shared Learning Progress

### 3.5 Admin

**Can:**
- Manage Users
- Manage Questions
- View Analytics
- Manage Subscriptions
- Access Audit Logs

**Cannot:**
- Modify System Configuration

### 3.6 Super Admin

**Full System Access. Can:**
- Manage AI Configuration
- Manage Prompt Templates
- Manage Feature Flags
- Manage Platform Settings
- Manage Billing Configuration

### 3.7 Role Permission Matrix

| Capability | Guest | Free | Pro | Enterprise | Admin | Super Admin |
|---|---|---|---|---|---|---|
| View marketing pages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Start interviews | ❌ | ✅ (3/mo) | ✅ (unlimited) | ✅ (unlimited) | ✅ | ✅ |
| Generate diagrams | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Advanced analytics | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Team dashboard | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage users/questions | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage AI config / prompts | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Functional Requirements

### FR-01 Authentication Module

#### FR-01.1 User Registration
**Description:** Allow users to create accounts.

**Inputs:** Full Name, Email, Password

**Validation:**
- Email: Required, Unique, Valid Format
- Password: Minimum 8 characters, one uppercase letter, one number

**Success Criteria:** User created; verification email sent.

#### FR-01.2 Login
**Description:** Authenticate users.
**Inputs:** Email, Password
**Outputs:** Access Token, Refresh Token

#### FR-01.3 Password Reset
**Requirements:**
- Token expires after 15 minutes
- Single-use reset links

#### FR-01.4 OAuth Login
**Supported Providers:** Google, GitHub

---

### FR-02 Profile Module

**User Profile Fields:**
```
User ID
Full Name
Email
Profile Picture
Experience Level
Current Position
Years of Experience
Target Company
Target Level
Preferred Difficulty
```

**Experience Levels:** Student, Junior, Mid-Level, Senior, Staff

---

### FR-03 Question Bank

**Categories:**

| Level | Questions |
|---|---|
| Beginner | TinyURL, URL Shortener, Parking Lot |
| Intermediate | Twitter, Instagram Feed, YouTube |
| Advanced | WhatsApp, Uber, Netflix |
| Staff | Global CDN, Distributed Cache, Event Streaming Platform |

**Question Metadata Schema:**
```json
{
  "id": "",
  "title": "",
  "difficulty": "",
  "description": "",
  "expectedComponents": [],
  "tags": []
}
```

---

### FR-04 Interview Module

#### Start Interview
User selects: Question, Difficulty, Company Track
System creates: Interview Session

#### Company Tracks

| Company | Focus |
|---|---|
| Google | Scalability, Performance |
| Amazon | Tradeoffs, Operational Excellence |
| Meta | Massive Scale |
| Netflix | Reliability |

#### Interview Flow (9 Steps)

| Step | Stage | AI Behavior |
|---|---|---|
| 1 | Requirements Gathering | Asks about functional requirements and use cases |
| 2 | Non-Functional Requirements | Asks about latency, throughput, availability |
| 3 | Capacity Estimation | Asks about DAU, QPS, storage |
| 4 | High-Level Design | User proposes architecture |
| 5 | Detailed Design | AI drills into services, APIs, databases |
| 6 | Scalability | AI challenges assumptions |
| 7 | Reliability | AI explores failure scenarios |
| 8 | Tradeoffs | AI evaluates decisions |
| 9 | Final Assessment | Session completed |

#### Additional Features
- **Auto Save** — Save every message
- **Resume Session** — Continue incomplete interviews
- **Interview Replay** — Replay conversation

---

### FR-05 Evaluation Engine

**Evaluation Inputs:** Interview Transcript, User Notes, Architecture Diagram

**Scoring Categories & Weights:**

| Category | Weight |
|---|---|
| Requirements Gathering | 15% |
| Architecture | 25% |
| Scalability | 20% |
| Database Design | 10% |
| Reliability | 15% |
| Security | 10% |
| Cost Awareness | 5% |
| **Total** | **100%** |

**Output Schema:**
```json
{
  "overallScore": 82,
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}
```

---

### FR-06 Diagram Generator

**Input:** Natural language prompt (e.g., `"Design WhatsApp"`)

**Output Formats:** Mermaid, SVG, PNG, Draw.io

**Features:** Export Diagram, Save Diagram, Share Diagram

---

### FR-07 Diagram Review

**Upload Formats:** PNG, SVG, Draw.io

**Review Categories:**
- Architecture Completeness
- SPOF (Single Point of Failure) Detection
- Security Risks
- Scalability Risks
- Reliability Risks

**Output:** Annotated Review Report

---

### FR-08 Analytics Module

**Dashboard Metrics:**

| Group | Metrics |
|---|---|
| Interview Metrics | Total Interviews, Interviews This Month, Practice Hours |
| Performance Metrics | Average Score, Best Score, Worst Score |
| Category Metrics | Scalability Score, Security Score, Database Score |
| Learning Metrics | Weak Areas, Strong Areas |

---

### FR-09 Recommendation Engine

**Inputs:** Interview History, Evaluation Reports, Weak Categories

**Output:** Learning Roadmap

**Example:**
```
Weak Area: Database Design

Recommended Topics:
- Sharding
- Replication
- CAP Theorem
- Indexing
```

---

### FR-10 Notification Module

**Notification Types:**
- Interview Completed
- Score Generated
- Learning Reminder
- Subscription Expiring
- Weekly Progress Summary

---

### FR-11 Subscription Module

| Plan | Includes |
|---|---|
| **Free** | 3 interviews/month |
| **Pro** | Unlimited interviews, advanced reports, diagram tools |
| **Enterprise** | Team management, shared analytics, organization dashboard |

---

## 5. Backend Technical Specification

### 5.1 Architecture Style

**Recommended Architecture:** Modular Monolith (NestJS)

**Benefits:** Faster development, easier maintenance, easier deployment

### 5.2 Core Services

```
Auth Module
User Module
Question Module
Interview Module
Evaluation Module
Diagram Module
Recommendation Module
Analytics Module
Notification Module
Billing Module
Admin Module
```

### 5.3 Backend Folder Structure

```
src/
├── modules/
│   ├── auth
│   ├── users
│   ├── questions
│   ├── interviews
│   ├── evaluations
│   ├── diagrams
│   ├── recommendations
│   ├── analytics
│   ├── notifications
│   ├── billing
│   └── admin
├── common/
├── config/
├── database/
└── jobs/
```

### 5.4 Technology Stack

| Layer | Technology |
|---|---|
| API Layer | NestJS, TypeScript |
| Database | PostgreSQL |
| Cache | Redis |
| Queue | BullMQ |
| Object Storage | Cloudflare R2 or AWS S3 |
| AI Models | GPT-5.6, GPT-5.6-mini |

> **Note:** Verify current model names/availability with your AI provider at implementation time, as model naming conventions change frequently.

---

## 6. API Specification

### Auth
```http
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/google
POST /auth/github
```

### Users
```http
GET    /users/me
PATCH  /users/me
DELETE /users/me
```

### Questions
```http
GET    /questions
GET    /questions/:id
POST   /questions
PATCH  /questions/:id
DELETE /questions/:id
```

### Interviews
```http
POST /interviews/start
POST /interviews/:id/message
POST /interviews/:id/finish
GET  /interviews/:id
GET  /interviews/history
```

### Evaluations
```http
POST /evaluations/generate
GET  /evaluations/:id
```

### Diagrams
```http
POST /diagrams/generate
POST /diagrams/review
GET  /diagrams/:id
```

### Recommendations
```http
GET /recommendations
```

### Analytics
```http
GET /analytics/dashboard
GET /analytics/progress
```

### Notifications
```http
GET   /notifications
PATCH /notifications/read
```

### Billing
```http
POST /billing/checkout
GET  /billing/history
```

---

## 7. Background Jobs

| Queue | Purpose |
|---|---|
| **Evaluation Queue** | Generate evaluation asynchronously |
| **Diagram Queue** | Generate architecture diagrams |
| **Email Queue** | Send verification emails, password resets, weekly reports |
| **Analytics Queue** | Update dashboard statistics |

---

## 8. Security Requirements

### 8.1 Authentication
- JWT Access Token
- JWT Refresh Token

### 8.2 Authorization
- Role-Based Access Control (RBAC)

### 8.3 Password Storage
- Argon2 Hashing

### 8.4 API Security
- Rate Limiting
- Request Validation
- Input Sanitization
- CORS Protection

### 8.5 Audit Logging

Track:
- Login events
- Subscription changes
- Admin actions
- User deletion

---

## 9. MVP Scope & Phasing

| Phase | Deliverables |
|---|---|
| **Phase 1** | Authentication, Profiles, Question Bank, AI Interviews |
| **Phase 2** | Evaluation Engine, Dashboard, Analytics |
| **Phase 3** | Diagram Generator, Diagram Review, Recommendations |
| **Phase 4** | Billing, Team Features, Enterprise Features |

---

