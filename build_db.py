from config import db
from models import CovidTable
import numpy as np
import pandas as pd

df_covid = pd.read_csv("/home/magno/Área de Trabalho/DataScience/Projects/DataScienceProj/ProjCOVID19/DadosOficiaisSP/data/dados_covid_sp1007.csv", ";")
df_covid = df_covid[(df_covid['casos_novos']>=0) & (df_covid['obitos_novos']>=0) & (df_covid['casos']>=0)]

df_covid = df_covid[['nome_munic', 'codigo_ibge', 'datahora', 'casos', 'casos_novos', 'casos_pc', 'casos_mm7d', 'obitos', 'obitos_novos', 'obitos_pc', 'obitos_mm7d','semana_epidem', 'pop']]
columns_to_float = ['casos_pc', 'casos_mm7d', 'obitos_pc', 'obitos_mm7d']

for c in columns_to_float:
    df_covid[c] = df_covid[c].str.replace(',','.').astype('float')

df_covid = df_covid.rename(columns={'casos_mm7d':'casos_novos_mm7d', 'obitos_mm7d': 'obitos_novos_mm7d'})

aux = df_covid.groupby('nome_munic')['casos', 'obitos'].rolling(7, min_periods=1).mean()
aux = aux.rename(columns={'casos':'casos_mm7d', 'obitos':'obitos_mm7d'})

df_covid = df_covid.set_index(['nome_munic', df_covid.index])
df_covid = df_covid.join(aux.reindex(df_covid.index))
df_covid = df_covid.reset_index()
df_covid.drop(columns=['level_1'], inplace=True)

df_covid[['casos_exp', 'obitos_exp']] = np.log10(df_covid[['casos', 'obitos']])
df_covid['casos_exp'].replace(-np.inf, 0, inplace=True)
df_covid['obitos_exp'].replace(-np.inf, 0, inplace=True)

df_covid = df_covid[['nome_munic', 'codigo_ibge', 'datahora', 'semana_epidem', 'casos', 'casos_mm7d', 'casos_exp', 'casos_novos', 'casos_novos_mm7d', 'obitos', 'obitos_mm7d', 'obitos_exp', 'obitos_novos', 'obitos_novos_mm7d', 'casos_pc', 'obitos_pc', 'pop']]

DATA = [
    {
        "city": "São Paulo",
        "cases": 900000,
    },
    {
        "city": "Campinas",
        "cases": 350000,
    },
    {
        "city": "São Carlos",
        "cases": 50000,
    },
]

#if os.path.exists("covidtable.db"):
#    os.remove("covidtable.db")

db.create_all()

for d in DATA:
    c = CovidTable(city=d.get('city'), cases=d.get('cases'))
    db.session.add(c)

db.session.commit()
