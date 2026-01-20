# SkinPilot Backend (FastAPI)

This is a small proxy to the OpenAI Chat API used by the mobile app.

Setup

1. Create a virtualenv and install dependencies:

```bash
cd example/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Create a `.env` file from `.env.example` and set `OPENAI_API_KEY`.

3. Run the server:

```bash
uvicorn main:app --reload --port 8000
```

The mobile app can call `http://<host>:8000/chat` with a JSON body `{ "message": "..." }`.
