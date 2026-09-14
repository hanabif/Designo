# Designo API Documentation

All endpoints (except `/auth/register` and `/auth/login`) require a JWT Bearer Token in the `Authorization` header: `Authorization: Bearer <token>`.

---

## Auth

`POST /auth/register`
- **Body:** `{ "email": "candidate@example.com", "password": "Password123", "fullName": "Alex Rivera", "targetCompany": "Google", "targetLevel": "L5" }`
- **Response:** `{ "user": {...}, "accessToken": "...", "refreshToken": "..." }`

`POST /auth/login`
- **Body:** `{ "email": "candidate@example.com", "password": "Password123" }`
- **Response:** `{ "user": {...}, "accessToken": "...", "refreshToken": "..." }`

---

## Users

`GET /users/me`
`PATCH /users/me`

---

## Questions

`GET /questions`
`POST /questions`
`GET /questions/:id`

---

## Mock Interviews

`POST /interviews/start`
- **Body:** `{ "questionId": "...", "difficulty": "INTERMEDIATE", "companyTrack": "GOOGLE" }`

`POST /interviews/:id/message`
- **Body:** `{ "content": "..." }`
- **Response:** Candidate turn + real-time AI interviewer turn + updated stage.

`POST /interviews/:id/finish`
- Completes interview session and enqueues evaluation report.

`GET /interviews/:id`
`GET /interviews/history`

---

## Evaluations

`POST /evaluations/generate`
- **Body:** `{ "interviewId": "..." }`

`GET /evaluations/:id`
- Returns weighted scores across 7 pillars: Requirements (15%), Architecture (25%), Scalability (20%), Database (10%), Reliability (15%), Security (10%), Cost (5%).

---

## Diagrams Studio

`POST /diagrams/generate`
- **Body:** `{ "title": "...", "prompt": "...", "format": "MERMAID" }`

`POST /diagrams/review`
- **Body:** `{ "diagramId": "..." }`
- **Response:** Performs SPOF detection, security, scalability, and reliability risk analysis.

`GET /diagrams`
`GET /diagrams/:id`

---

## Recommendations & Analytics

`GET /recommendations` — AI Mentor learning roadmap.
`GET /analytics/dashboard` — Platform statistics & score averages.
`GET /analytics/progress` — Score progression over time.

---

## Notifications & Billing

`GET /notifications`
`PATCH /notifications/read`
`POST /billing/checkout`
`GET /billing/history`
