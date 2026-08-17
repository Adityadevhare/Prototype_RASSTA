# 🚦 RAASTA — AI-Powered Traffic Intelligence & Command Center

### AI-Based Traffic Risk Heatmap and Police Deployment Decision Support for Nagpur City

> **Transforming traffic data into actionable intelligence for safer, smarter, and more responsive urban mobility.**

---

## 📌 Overview

**RAASTA** is an AI-powered traffic intelligence and decision-support platform designed to help traffic authorities **identify high-risk areas, monitor traffic conditions, analyze risk patterns, and make informed police deployment decisions** across Nagpur City.

Built as a prototype for the **Manthan 4 Yuva Hackathon at VNIT Nagpur**, RAASTA combines an interactive command-center dashboard with a Python-based backend to transform traffic data into meaningful, actionable insights.

Instead of simply displaying traffic information, RAASTA focuses on answering three important questions:

> **Where is the traffic risk?**
> **How severe is it?**
> **Where should resources be prioritized?**

---

# 🎯 Problem Statement

### AI-Based Traffic Risk Heatmap and Police Deployment Decision Support for Nagpur City

Managing traffic in a rapidly growing city requires authorities to continuously monitor congestion, incidents, and potential risk zones.

However, traffic information can often be:

* Distributed across multiple sources
* Difficult to interpret quickly
* Reactive rather than predictive
* Challenging to convert into operational decisions
* Difficult to visualize geographically

At the same time, police resources are limited and need to be strategically deployed.

### The Challenge

How can we transform traffic-related data into a system that allows authorities to:

* Identify high-risk traffic zones
* Understand the severity of each location
* Monitor changing traffic conditions
* Prioritize incidents
* Visualize risk geographically
* Support efficient police deployment

---

# 💡 Our Solution — RAASTA

RAASTA provides a **centralized traffic command center** that brings traffic intelligence, risk analysis, visualization, alerts, and police-resource information into a single interface.

The platform converts raw traffic information into a visual decision-support workflow:

```text
Raw Traffic Data
       ↓
Data Processing & Risk Analysis
       ↓
Risk Scoring
       ↓
Geographical Visualization
       ↓
Traffic Intelligence Dashboard
       ↓
Police Deployment Decision Support
```

The result is a system designed to help authorities move from:

> **Data → Understanding → Action**

---

# ✨ Key Features

## 🗺️ Interactive Traffic Risk Heatmap

RAASTA provides a geographical view of traffic-risk conditions across monitored locations.

Different risk levels are represented visually, allowing operators to quickly identify areas that require attention.

### Risk Classification

| Level       | Interpretation               |
| ----------- | ---------------------------- |
| 🔴 Critical | Immediate attention required |
| 🟠 High     | Significant traffic risk     |
| 🟡 Moderate | Requires monitoring          |
| 🟢 Normal   | Relatively normal conditions |

---

## 📊 Intelligent Risk Scoring

Each monitored location can be assigned a traffic-risk score.

The prototype currently works with risk scores such as:

```text
81.5
66.6
64.2
51.4
33.5
```

These scores allow locations to be compared based on their relative risk level.

---

## 🚨 Real-Time-Ready Alert System

The dashboard includes an alert interface designed to highlight locations requiring attention.

Instead of forcing operators to inspect every location manually, the system provides a prioritized view of important traffic situations.

---

## 👮 Police Deployment Decision Support

One of RAASTA's primary objectives is connecting **traffic intelligence with operational response**.

The system represents police resources alongside traffic-risk information to support decisions such as:

```text
Identify Risk
     ↓
Measure Severity
     ↓
Check Available Resources
     ↓
Prioritize Locations
     ↓
Support Police Deployment
```

The current prototype represents **11 police units** within the system.

> RAASTA is a decision-support platform and does not replace human judgment or official authority.

---

## 📍 Location Intelligence

Operators can select individual traffic locations and inspect detailed information.

This creates a drill-down experience:

```text
City Overview
      ↓
Risk Hotspot
      ↓
Specific Location
      ↓
Detailed Traffic Information
```

---

## 📈 Traffic Analytics

RAASTA provides an analytics-oriented view of traffic and risk information.

This allows users to go beyond simply seeing a map and instead understand:

* Risk distribution
* Traffic conditions
* Location-level trends
* Priority areas
* Overall city status

---

## 🖥️ Command Center Dashboard

The entire platform is designed around a centralized command-center experience.

The interface provides quick access to:

* Overview
* Traffic map
* Alerts
* Analytics
* Location details
* System status
* Traffic metrics

The objective is to reduce the time required to understand the current traffic situation.

---

# 🧠 System Architecture

```text
                    ┌───────────────────────┐
                    │     Traffic Data      │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    FastAPI Backend    │
                    │                       │
                    │  Risk Analysis        │
                    │  Traffic Processing   │
                    │  Summary Generation   │
                    │  Routing Logic        │
                    └───────────┬───────────┘
                                │
                         REST API Layer
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        /api/risk          /api/traffic      /api/summary
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   React + Vite UI     │
                    │                       │
                    │  Command Dashboard    │
                    │  Risk Heatmap         │
                    │  Alerts               │
                    │  Analytics            │
                    │  Location Details     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Decision Support    │
                    └───────────────────────┘
```

---

# 🔄 Application Workflow

```text
                    START
                      │
                      ▼
             Traffic Information
                      │
                      ▼
             Backend Processing
                      │
                      ▼
               Risk Calculation
                      │
                      ▼
            Location Risk Scoring
                      │
                      ▼
            ┌──────────────────┐
            │  Risk Category   │
            └────────┬─────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Critical     High     Moderate/Normal
          │          │          │
          └──────────┼──────────┘
                     ▼
              Dashboard Display
                     │
                     ▼
              Operator Analysis
                     │
                     ▼
          Police Deployment Support
```

---

# 🛠️ Technology Stack

## Frontend

| Technology        | Purpose                              |
| ----------------- | ------------------------------------ |
| **React**         | User interface                       |
| **Vite**          | Frontend development & build tooling |
| **TypeScript**    | Type-safe development                |
| **Tailwind CSS**  | UI styling                           |
| **Framer Motion** | Animations & interactions            |

## Backend

| Technology  | Purpose             |
| ----------- | ------------------- |
| **Python**  | Backend development |
| **FastAPI** | REST API framework  |
| **Uvicorn** | ASGI server         |

## Architecture

```text
Frontend
React + Vite
     │
     │ REST API
     ▼
Backend
FastAPI + Python
     │
     ▼
Traffic / Risk Data
```

---

# 📂 Project Structure

```text
Prototype_RASSTA/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── routing.py
│       └── ...
│
├── frontend/
│   └── nagpur-traffic-command-main/
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/
│       │   │   ├── layout/
│       │   │   ├── map/
│       │   │   └── traffic/
│       │   │
│       │   ├── data/
│       │   ├── lib/
│       │   │   └── raasta/
│       │   ├── routes/
│       │   ├── services/
│       │   │   └── api.ts
│       │   └── styles.css
│       │
│       ├── package.json
│       └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure you have installed:

* Python 3.10+
* Node.js
* npm
* Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Adityadevhare/Prototype_RASSTA.git
```

```bash
cd Prototype_RASSTA
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

Activate it using:

```powershell
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### API Documentation

FastAPI automatically provides interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open a **new terminal**.

Navigate to:

```bash
cd frontend/nagpur-traffic-command-main
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🔗 API Integration

The frontend communicates with the FastAPI backend through REST APIs.

Current backend routes include:

```text
GET /api/risk
GET /api/traffic
GET /api/summary
```

The communication flow is:

```text
React Frontend
      │
      │ HTTP Request
      ▼
FastAPI Backend
      │
      │ JSON Response
      ▼
React State
      │
      ▼
Dashboard Components
```

---

# 🔐 Environment Variables

Environment configuration files are intentionally excluded from version control.

Typical local environment files include:

```text
backend/.env
frontend/nagpur-traffic-command-main/.env
```

### Important

Never commit:

* API keys
* Access tokens
* Passwords
* Private credentials
* Secret configuration

The repository's `.gitignore` is configured to prevent local environment files and generated dependencies from being uploaded.

---

# 🧪 Building the Frontend

To create a production build:

```bash
npm run build
```

The Vite production build validates that the frontend can be compiled successfully.

---

# 📊 Prototype Data

The current prototype contains a set of monitored traffic locations and associated risk information.

Example risk scores:

```text
81.5
66.6
64.2
51.4
33.5
```

The prototype also represents:

```text
11 Police Units
```

These values are intended for demonstration and prototype purposes.

---

# 🚀 Future Scope

RAASTA is designed to evolve from a hackathon prototype into a scalable intelligent traffic-management platform.

## 🤖 Predictive Traffic Risk

Future versions can use machine learning to predict:

* Traffic congestion
* Accident probability
* Traffic density
* Emerging hotspots
* High-risk time periods

---

## 📡 Real-Time Data Integration

The system can be extended to consume real-world data from:

* Traffic cameras
* GPS systems
* IoT sensors
* Public transportation systems
* Emergency services
* Official traffic APIs

---

## 🧠 Predictive Risk Heatmaps

Instead of only showing current risk:

```text
Current Risk
```

RAASTA could predict:

```text
Future Risk
```

allowing authorities to take preventive action.

---

## 🚔 Intelligent Police Allocation

Future versions can introduce optimization algorithms that consider:

* Risk severity
* Police availability
* Distance
* Estimated response time
* Incident priority
* Geographic coverage

The system could then recommend resource allocation strategies.

---

## 🏙️ Multi-City Expansion

The architecture can eventually be extended beyond Nagpur:

```text
Nagpur
   ↓
Other Maharashtra Cities
   ↓
Indian Smart Cities
   ↓
Nationwide Traffic Intelligence Platform
```

---

# 🏆 Hackathon Context

### Manthan 4 Yuva Hackathon — VNIT Nagpur

**Problem Statement:**

> **AI-Based Traffic Risk Heatmap and Police Deployment Decision Support for Nagpur City**

RAASTA was developed to demonstrate how:

**Artificial Intelligence + Data Analytics + Geospatial Visualization + Modern Web Technologies**

can be combined to support smarter urban traffic management.

---

# 🎯 Why RAASTA?

Traditional traffic monitoring focuses heavily on:

> **"What is happening?"**

RAASTA aims to go one step further:

> **"Where is the risk, how severe is it, and how can available resources be prioritized?"**

This shift from **monitoring → intelligence → decision support** is the core idea behind RAASTA.

---

# 🔮 Vision

Our vision is to build an intelligent traffic-management ecosystem where authorities can move from **reactive traffic management** toward **predictive and data-driven decision making**.

```text
                DATA
                  ↓
             INTELLIGENCE
                  ↓
              INSIGHTS
                  ↓
             DECISIONS
                  ↓
              ACTION
                  ↓
        SAFER URBAN MOBILITY
```

---

# 👥 Team RAASTA

Built collaboratively for the **Manthan 4 Yuva Hackathon at VNIT Nagpur**.

---

# ⚠️ Disclaimer

RAASTA is a **hackathon prototype and decision-support demonstration**.

The traffic, risk, and police-resource information displayed by the prototype may use simulated or demonstration data and should **not be treated as real-world operational instructions**.

A production deployment would require:

* Official traffic datasets
* Real-time data validation
* Security and privacy controls
* Domain-expert review
* Integration with authorized government systems
* Extensive testing and validation

---

# 📜 License

This project is currently developed as a hackathon prototype.

A suitable open-source license can be added when the project is prepared for public distribution.

---

# ⭐ Support the Project

If you find **RAASTA** interesting, consider giving the repository a ⭐ on GitHub.

**GitHub Repository:**

https://github.com/Adityadevhare/Prototype_RASSTA

---

### 🚦 RAASTA

> **From traffic data to intelligent decisions.**
