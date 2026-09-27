# 🌿 Seagrass — AI-Powered Meadow Assessment & Decision Support

An integrated system for seagrass meadow monitoring, species detection, and wave attenuation prediction. Built for marine researchers and coastal managers conducting field surveys.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Clients                             │
│  ┌──────────────┐              ┌──────────────────┐     │
│  │   Web App    │              │   Mobile App     │     │
│  │  React/Vite  │              │  Expo/React Native│    │
│  │  TypeScript  │              │  TypeScript      │     │
│  │  Leaflet/    │              │  Camera/GPS      │     │
│  │  MapLibre GL │              │  Offline-first   │     │
│  └──────┬───────┘              └────────┬─────────┘     │
│         │                               │               │
└─────────┼───────────────────────────────┼───────────────┘
          │          REST / JSON          │
          └──────────────┬────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API                           │
│              FastAPI · Python · Async                   │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │  YOLOv11    │ │  Wave Atten. │ │  Spatial Queries │ │
│  │  Detection  │ │  Regression  │ │  GeoJSON / Maps  │ │
│  └─────────────┘ └──────────────┘ └──────────────────┘ │
│                         │                               │
│              ┌──────────┴──────────┐                    │
│              ▼                     ▼                    │
│     PostgreSQL/PostGIS       S3/MinIO                   │
│     (surveys, spatial)       (images, models)           │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
seagrass/
├── backend/     Python · FastAPI · YOLOv11 · SQLAlchemy + PostGIS
├── web/         React · Vite · TypeScript · Leaflet · TanStack Query
└── mobile/      React Native · Expo · TypeScript · Offline-first
```

## Quickstart

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ with PostGIS extension
- (Optional) CUDA-compatible GPU for ML inference

### Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
# For ML/inference dependencies (adds ~2GB):
pip install -r requirements-ml.txt

cp .env.example .env
# Edit .env with your database and storage credentials

uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Web App

```bash
cd web
npm install
cp .env.example .env
# Edit .env with API URL and map tokens

npm run dev
```

Open `http://localhost:5173`

### Mobile App

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with API URL

npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | FastAPI, SQLAlchemy, asyncpg | Async REST API |
| **Database** | PostgreSQL + PostGIS | Spatial data, surveys |
| **AI/CV** | YOLOv11, ONNX Runtime | Seagrass species detection |
| **Science** | NumPy, SciPy, scikit-learn | Wave attenuation modeling |
| **Storage** | S3 / MinIO | Survey images, ML models |
| **Web** | React, Vite, TypeScript | Dashboard & GIS viewer |
| **Mobile** | Expo, React Native | Field data collection |
| **Maps** | Leaflet, MapLibre GL, react-native-maps | Geospatial visualization |

## License

TBD
