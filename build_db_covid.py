from config import db
from models import CovidTable
import numpy as np
import pandas as pd
import os

# Create the .db file for the application use
# Or create the db table from the application use
# You have to run the server and then run (in the terminal) this code
# You may also include this code to run when you start the server, if you want.

df_covid = pd.read_csv("/home/magno/PycharmProjects/covidsp/dados-covid-sp-master/data/dados_covid_sp.csv", ';')
df_covid = df_covid[(df_covid['casos_novos']>=0) & (df_covid['obitos_novos']>=0) & (df_covid['casos']>=0)]
df_covid = df_covid.dropna()

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

DATA = df_covid.to_dict('index')

if os.path.exists("covidtable.db"):
    os.remove("covidtable.db")

db.create_all()

for key, item in DATA.items():
    c = CovidTable(
        nome_munic=item.get('nome_munic'),
        codigo_ibge=item.get('codigo_ibge'),
        datahora=item.get('datahora'),
        semana_epidem=item.get('semana_epidem'),
        casos=item.get('casos'),
        casos_mm7d=item.get('casos_mm7d'),
        casos_exp=item.get('casos_exp'),
        casos_novos=item.get('casos_novos'),
        casos_novos_mm7d=item.get('casos_novos_mm7d'),
        obitos=item.get('obitos'),
        obitos_mm7d=item.get('obitos_mm7d'),
        obitos_exp=item.get('obitos_exp'),
        obitos_novos=item.get('obitos_novos'),
        obitos_novos_mm7d=item.get('obitos_novos_mm7d'),
        casos_pc=item.get('casos_pc'),
        obitos_pc=item.get('obitos_pc'),
        pop=item.get('pop')
    )
    db.session.add(c)

db.session.commit()
