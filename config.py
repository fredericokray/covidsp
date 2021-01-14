import os
import connexion
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

basedir = os.path.abspath(os.path.dirname(__file__))

# Connexion instance
conn_app = connexion.App(__name__, specification_dir=basedir)

# Flask app instance
app = conn_app.app

# SQLite and Mysql URÇs for SQLAlchemy
sqlite_url = "sqlite:///" + os.path.join(basedir, "covidtable.db")
mysql_url = "mysql+pymysql://root: --- @localhost/covid"

# SQLAlchemy configuration
app.config["SQLALCHEMY_ECHO"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = sqlite_url
app.config["SQlALCHEMY_TRACK_MODIFICATIONS"] = False

# SQLAlchemy and Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)
