import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError

# Segredinho com amor: a chave JWT vem do ambiente para proteger a assinatura dos tokens.
SECRET = os.getenv("JWT_SECRET", "troque-esta-chave-em-producao")
ALGORITHM = "HS256"
EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    # Com carinho e seguranca, transformamos a senha em hash antes de salvar no banco.
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    # Com cuidado, comparamos a senha digitada com o hash salvo para validar o login.
    return pwd_context.verify(plain, hashed)


def create_token(data: dict) -> str:
    # Com um toque de protecao, criamos JWT com expiracao para controlar a sessao.
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=EXPIRE_HOURS)
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Lança JWTError se o token for inválido ou expirado."""
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])