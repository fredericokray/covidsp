from flask import render_template
import config

# A simple WebApp that shows Covid data in the state of São Paulo
# The tolls used in this application are:
# Mysql or SQLite - Relational Database
# SQLAlchemy - ORM
# Marshmallow - Serialization and Deserialization of objects
# Connexion and Swagger - Rest API
# Flask - Server
# Python
# HTML, CSS, JavaScript, Crossfilter, D3 - Front End
# Numpy and Pandas - manipulate data and build DB

conn_app = config.conn_app
conn_app.add_api("swagger.yml")


@conn_app.route("/covidsp")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    conn_app.run(debug=True, host="0.0.0.0")
