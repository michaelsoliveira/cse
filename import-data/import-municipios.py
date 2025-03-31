import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy import insert, text

load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Conecte ao seu banco PostgreSQL (ajuste os dados de acesso)
engine = create_engine(f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
directory_path = os.getcwd()
df = pd.read_csv(os.path.join(directory_path, "municipios.csv"), sep=';', header=1)

# Carrega os dados

df.columns = [
    "id", "nome", "ibge", "lat_lon", "estado_id"
]

# Lista de valores considerados inválidos
valores_invalidos = ["S/B", "s/b", "S/N", "s/n", "null", "NULL", "N/A", "n/a", "-", "--", pd.NA, None]

# Substituir todos os valores inválidos por string vazia
df.replace(valores_invalidos, "", inplace=True)

df.fillna("", inplace=True)

# Função para inserir uma linha
def inserir_dados(row):
    with engine.begin() as conn:
        # 1. Inserir endereço
        conn.execute(
            text("""
            INSERT INTO municipio (id, nome, estado_id, ibge, lat_lon)
            VALUES (:id, :nome, :estado_id, :ibge, :lat_lon)
            """),
            { 
                "id": row.id,
                "nome": row.nome, 
                "estado_id": row.estado_id, 
                "ibge": row.ibge, 
                "lat_lon": row.lat_lon
            }
        )
        
# Aplicar para cada linha
df.apply(inserir_dados, axis=1)
