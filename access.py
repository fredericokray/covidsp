from models import CovidTable, CovidTableSchema
from config import connexion
from sqlalchemy import func

# Functions to access the DB through the ORM


# Returns the data filtering by "nome_munic"
def read_covidtable_munic():
    nome_munic = connexion.request.args.get('nome_munic')
    res = CovidTable.query
    res = res.filter(CovidTable.nome_munic == nome_munic).all()
    cases_schema = CovidTableSchema(many=True)
    data = cases_schema.dump(res)
    return data[0]


# Returns the totals of covid data in the state
def read_covidtable_total():
    datatotal = CovidTable.query.with_entities(CovidTable.datahora,
                                               func.sum(CovidTable.casos).label("casos"),
                                               func.sum(CovidTable.casos_pc),
                                               func.sum(CovidTable.casos_exp),
                                               func.sum(CovidTable.casos_mm7d),
                                               func.sum(CovidTable.casos_novos),
                                               func.sum(CovidTable.casos_novos_mm7d),
                                               func.sum(CovidTable.obitos),
                                               func.sum(CovidTable.obitos_pc),
                                               func.sum(CovidTable.obitos_exp),
                                               func.sum(CovidTable.obitos_mm7d),
                                               func.sum(CovidTable.obitos_novos),
                                               func.sum(CovidTable.obitos_novos_mm7d),
                                               func.sum(CovidTable.pop),
                                               ).group_by(CovidTable.datahora).all()

    data = []
    for i in range(len(datatotal)):
        data.append({
            "datahora": datatotal[i][0],
            "casos": datatotal[i][1],
            "casos_pc": datatotal[i][1]/datatotal[i][13] * 100000,
            "casos_exp": 0,
            "casos_mm7d": datatotal[i][4],
            "casos_novos": datatotal[i][5],
            "casos_novos_mm7d": datatotal[i][6],
            "obitos": datatotal[i][7],
            "obitos_pc": datatotal[i][7]/datatotal[i][13] * 100000,
            "obitos_exp": 0,
            "obitos_mm7d": datatotal[i][10],
            "obitos_novos": datatotal[i][11],
            "obitos_novos_mm7d": datatotal[i][12],
            "pop": datatotal[i][13]
        })
    return data

# Returns the data filtering by last day
def read_covidtable_laststate():
    res = CovidTable.query
    res = res.filter(CovidTable.datahora == "2020-12-31").all()
    cases_schema = CovidTableSchema(many=True)
    data = cases_schema.dump(res)
    return data[0]
