from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from database import db
from auth import hash_password, verify_password, create_token, decode_token
from models import UserRegister, UserLogin, Task

router = APIRouter()


# Com carinho pela seguranca, esta dependencia extrai e valida o JWT enviado no cabecalho Bearer.
def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Token não fornecido")
    token = authorization.split(" ", 1)[1]
    try:
        return decode_token(token)["email"]
    except Exception:
        raise HTTPException(401, "Token inválido ou expirado")


# Com amor pela autenticacao, as rotas abaixo cuidam de cadastro e login.

@router.post("/register", status_code=201)
def register(data: UserRegister):
    # Com cuidado no banco, db.users.find_one verifica se ja existe usuario com o mesmo e-mail.
    if db.users.find_one({"email": data.email}):
        raise HTTPException(400, "E-mail já cadastrado")
    # Com seguranca, db.users.insert_one cria o usuario novo com senha protegida por hash.
    db.users.insert_one({
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
    })
    return {"msg": "Usuário criado"}


@router.post("/login")
def login(data: UserLogin):
    # Com logica simples, buscamos o usuario por e-mail para validar credenciais.
    user = db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Credenciais inválidas")
    # Com acesso controlado, devolvemos um JWT para usar nas rotas protegidas.
    return {"token": create_token({"email": user["email"]})}


# Com organizacao e seguranca, as rotas abaixo fazem o CRUD de tarefas por usuario.

@router.post("/tasks", status_code=201)
def create_task(task: Task, email: str = Depends(get_current_user)):
    # Com carinho pelos dados, db.tasks.insert_one salva a tarefa ligada ao email do token.
    db.tasks.insert_one({"title": task.title, "description": task.description, "status": task.status, "user": email})
    return {"msg": "Tarefa criada"}


@router.get("/tasks")
def list_tasks(email: str = Depends(get_current_user)):
    # Com privacidade, db.tasks.find retorna apenas tarefas do usuario e oculta o campo _id.
    return list(db.tasks.find({"user": email}, {"_id": 0}))


@router.delete("/tasks/{title}")
def delete_task(title: str, email: str = Depends(get_current_user)):
    # Com precisao, db.tasks.delete_one remove so a tarefa do usuario que bate com o filtro.
    result = db.tasks.delete_one({"title": title, "user": email})
    if result.deleted_count == 0:
        raise HTTPException(404, "Tarefa não encontrada")
    return {"msg": "Tarefa removida"}