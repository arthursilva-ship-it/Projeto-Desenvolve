from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    # Com jeitinho didatico, este modelo valida os dados recebidos no cadastro.
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        # Com amor e seguranca, exigimos no minimo 6 caracteres na senha.
        if len(v) < 6:
            raise ValueError("A senha deve ter pelo menos 6 caracteres")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Task(BaseModel):
    # Com simplicidade, este modelo define os campos base usados no CRUD de tarefas.
    title: str
    description: str = ""
    status: str = "pendente"