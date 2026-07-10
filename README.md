# AWS Route53 Clone

A full-stack, highly accurate clone of the **Amazon Web Services (AWS) Route53** console. Built with a focus on UI/UX fidelity, this project perfectly replicates the core workflows of managing Hosted Zones and DNS Records in AWS.

---

## Objective
The goal of this project is to build a functional clone of the AWS Route53 web application. Rather than being a generic CRUD application, this platform goes above and beyond to replicate the exact Route53 experience — incorporating AWS-styled data tables, modal popups, toast notifications, navigation structures, and form elements.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Lucide React
- **Backend**: FastAPI, Python 3, SQLAlchemy
- **Database**: SQLite
- **Styling**: AWS-specific design system (colors, fonts, borders, responsive layouts)

---

## Features Delivered

### 1. Authentication (Mocked IAM)
- Beautifully recreated AWS login and signup pages featuring the exact full-screen isometric background illustrations.
- Stateful session persistence using Zustand.
- Automatic **10-minute session expiration** handling.

### 2. Hosted Zones Management
- Full CRUD capabilities for Hosted Zones (Create, View, Edit, Delete).
- AWS-styled data tables complete with pagination and live text-based search filtering.
- Persisted securely in the SQLite backend.

### 3. DNS Record Management
- Full CRUD for DNS Records within any Hosted Zone.
- Native dropdown support for all common Route53 record types: `A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`.
- Records are cascade-deleted when their parent Hosted Zone is removed.

### 4. Route53 Experience (UI/UX Fidelity)
- **Navigation**: Exact replica of the dark AWS Topbar and collapsible Left Sidebar.
- **Tables & Forms**: Matches AWS's precise font sizes (12px/13px), border colors (`#eaeded`), and focus rings (`#0073bb`).
- **Modals & Alerts**: Custom-built modal components and toast notifications that perfectly mimic AWS's popup dialogues and green/red banner alerts.

### 5. Mocked Placeholder Sections
- A Route53 Dashboard acting as a landing page with informational cards.
- Smart catch-all routing that gracefully intercepts unbuilt sidebar links (Traffic Policies, Health Checks, Resolver) and displays a clean, AWS-themed "Coming Soon" placeholder page.

---

## Setup Instructions

Follow these steps to run the AWS Route53 Clone locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup (FastAPI)
Open your terminal and navigate to the `backend` folder:
```bash
cd backend
```
Create a virtual environment and activate it:
```bash
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```
Install the Python dependencies:
```bash
pip install -r requirements.txt
```
Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
*(The backend runs on `http://127.0.0.1:8000`)*

### 2. Frontend Setup (Next.js)
Open a **new** terminal window and navigate to the `frontend` folder:
```bash
cd frontend
```
Install the Node dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
*(The frontend runs on `http://localhost:3000`)*

---

## Architecture Overview

This application follows a modern, decoupled three-tier architecture that cleanly separates concerns across the presentation, business logic, and data layers.

```
+---------------------------+        HTTP/REST        +---------------------------+
|      CLIENT LAYER         | ----------------------> |       API LAYER           |
|   Next.js 14 (Vercel)     |                         |   FastAPI (Render)        |
|                           | <---------------------- |                           |
|  - App Router (TypeScript)|        JSON             |  - RESTful Endpoints      |
|  - Zustand (Auth State)   |                         |  - Pydantic Validation    |
|  - Axios (HTTP Client)    |                         |  - SQLAlchemy ORM         |
|  - Tailwind CSS (UI)      |                         |                           |
+---------------------------+                         +-------------+-------------+
                                                                    |
                                                                    | SQL
                                                                    v
                                                      +---------------------------+
                                                      |       DATA LAYER          |
                                                      |   SQLite Database         |
                                                      |                           |
                                                      |  - users                  |
                                                      |  - hosted_zones           |
                                                      |  - dns_records            |
                                                      +---------------------------+
```

### Layer Breakdown

**Client Layer (Next.js)**
The React frontend handles all routing via the Next.js App Router, manages authentication state globally with Zustand, and communicates with the backend exclusively through a centralized Axios instance (`api.ts`). The `NEXT_PUBLIC_API_URL` environment variable allows the same codebase to point to localhost during development and to the live Render backend in production.

**API Layer (FastAPI)**
FastAPI serves as a lightweight, high-performance backend. It exposes a set of RESTful endpoints organized by domain (auth, zones, records). All incoming request bodies are strictly validated using Pydantic schemas before reaching the database layer, ensuring data integrity throughout.

**Data Layer (SQLite + SQLAlchemy)**
SQLAlchemy ORM manages all interactions with the SQLite database. Models are defined declaratively and relationships are enforced at the ORM level (e.g., cascade delete from `hosted_zones` to `dns_records`). The database file is created automatically on first startup if it does not already exist.

---

## Database Schema

The SQLite database consists of **3 tables** managed via SQLAlchemy ORM. The schema is defined in [`backend/models.py`](./backend/models.py).

---

### `users`
Stores mocked IAM user credentials for authentication.

| Column | Type | Constraints |
|---|---|---|
| `id` | STRING (UUID) | PRIMARY KEY |
| `email` | STRING | UNIQUE, NOT NULL, Indexed |
| `account_name` | STRING | NOT NULL |
| `password` | STRING | NOT NULL *(plain-text, mocked)* |
| `created_at` | DATETIME | DEFAULT: current UTC timestamp |

---

### `hosted_zones`
Stores all DNS Hosted Zones created by users.

| Column | Type | Constraints |
|---|---|---|
| `id` | STRING (UUID) | PRIMARY KEY |
| `name` | STRING | NOT NULL, Indexed |
| `type` | STRING | DEFAULT: `"Public"` |
| `comment` | STRING | NULLABLE |
| `created_at` | DATETIME | DEFAULT: current UTC timestamp |

---

### `dns_records`
Stores individual DNS records belonging to a Hosted Zone.

| Column | Type | Constraints |
|---|---|---|
| `id` | STRING (UUID) | PRIMARY KEY |
| `zone_id` | STRING (UUID) | FOREIGN KEY → `hosted_zones.id` |
| `name` | STRING | NOT NULL |
| `type` | STRING | NOT NULL *(A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA)* |
| `value` | STRING | NOT NULL |
| `ttl` | INTEGER | DEFAULT: `300` (seconds) |
| `routing_policy` | STRING | DEFAULT: `"Simple"` |

---

### Relationships

```
users
  └── (standalone, no foreign key relationships)

hosted_zones (1)
  └──── dns_records (many)
           └── zone_id → hosted_zones.id  [CASCADE DELETE]
```

> When a Hosted Zone is deleted, all its associated DNS Records are automatically deleted via `cascade="all, delete-orphan"` — exactly replicating the AWS Route53 behavior.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new mocked IAM user |
| `POST` | `/api/auth/login` | Authenticate and receive a mock access token |
| `GET` | `/api/zones/` | Retrieve paginated list of Hosted Zones |
| `POST` | `/api/zones/` | Create a new Hosted Zone |
| `PUT` | `/api/zones/{id}` | Edit a Hosted Zone |
| `DELETE` | `/api/zones/{id}` | Delete a Hosted Zone and its records |
| `GET` | `/api/zones/{id}/records/` | Retrieve DNS records for a specific zone |
| `POST` | `/api/zones/{id}/records/` | Create a new DNS record |
| `PUT` | `/api/records/{id}` | Edit a DNS record |
| `DELETE` | `/api/records/{id}` | Delete a DNS record |

---


