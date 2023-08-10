# Setup Guide Line on local Odoo | Python | Pycharm.

#### 1- download and Install Stuff  -> Python, PyCharm, PosGreSql, GIT, Clone Oddoo-version from github.
#### 2- PyCharm -> venv setup with python, copy odoo.conf from odoo/debain into new folder on root called conf.
#### 3- While creating VENV from configuration create a new python file and make sure to add odoo.conf file path into Parameters and odoo-bin path into script path.
#### Add below Code into conf file `[options]
; This is the password that allows database operations:
admin_passwd = admin_postgreSql_password
db_host = host
db_port = 5432
db_user = odoo16
db_password = odoo16
addons_path = odoo addons and custom path
default_productivity_apps = True
http_port = 8069
pg_path = C:\Program Files\PostgreSQL\12\bin
bin_path = C:\Program Files\wkhtmltopdf\bin` 
#### 4- install packages in your venv `pip install -r requirements.txt`
#### 5- We are good to go....  