from config import db, ma
from marshmallow import fields

# ORM using SQLAlchemy
# Schema using Marshmallow

class CovidTable(db.Model):
    __tablename__ = "covidtable"
    event_id = db.Column(db.Integer, primary_key=True)
    nome_munic = db.Column(db.String(32))
    codigo_ibge = db.Column(db.Integer)
    datahora = db.Column(db.String(32))
    semana_epidem = db.Column(db.Integer)
    casos = db.Column(db.Integer)
    casos_mm7d = db.Column(db.Float)
    casos_exp = db.Column(db.Float)
    casos_novos = db.Column(db.Integer)
    casos_novos_mm7d = db.Column(db.Float)
    obitos = db.Column(db.Integer)
    obitos_mm7d = db.Column(db.Float)
    obitos_exp = db.Column(db.Float)
    obitos_novos = db.Column(db.Integer)
    obitos_novos_mm7d = db.Column(db.Float)
    casos_pc = db.Column(db.Float)
    obitos_pc = db.Column(db.Float)
    pop = db.Column(db.Integer)


class CovidTableSchema(ma.Schema):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    event_id = fields.Int()
    nome_munic = fields.Str()
    codigo_ibge = fields.Int()
    datahora = fields.Str()
    semana_epidem = fields.Int()
    casos = fields.Int()
    casos_mm7d = fields.Float()
    casos_exp = fields.Float()
    casos_novos = fields.Int()
    casos_novos_mm7d = fields.Float()
    obitos = fields.Int()
    obitos_mm7d = fields.Float()
    obitos_exp = fields.Float()
    obitos_novos = fields.Int()
    obitos_novos_mm7d = fields.Float()
    casos_pc = fields.Float()
    obitos_pc = fields.Float()
    pop = fields.Int()
