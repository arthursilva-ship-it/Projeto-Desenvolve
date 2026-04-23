from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI(title="Tarefy API")

# Com carinho pela integracao, o CORS libera o frontend na porta customizada para chamar a API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4310", "http://127.0.0.1:4310"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)