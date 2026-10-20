# AI-Driven News Aggregator

AI-powered news aggregator that clusters semantically similar articles and presents unified stories through a FastAPI backend and React frontend.

## Requirements

- Python 3.10+
- Node.js 18+
- API keys listed in `.env.example`

## Backend

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

The API is available at `http://127.0.0.1:8000` and its interactive docs are at `http://127.0.0.1:8000/docs`.

## Frontend

```powershell
cd news-frontend
npm install
npm start
```

The UI is available at `http://localhost:3000`.

Copy `.env.example` to `.env` and add your keys before starting the backend. Never commit `.env` or publish API keys.
