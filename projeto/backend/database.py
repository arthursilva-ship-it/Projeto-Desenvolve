import os
from pymongo import MongoClient

# Com flexibilidade e amor, a URI vem do ambiente para trocar conexao sem editar codigo.
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")

# Com cuidado, o MongoClient abre a conexao com o servidor MongoDB usando a URI informada.
client = MongoClient(MONGO_URI)
# Com organizacao, este e o banco principal onde vivem as colecoes do projeto.
db = client["taskflow"]
# Com esse objeto db, acessamos colecoes como db.users e db.tasks nas rotas.