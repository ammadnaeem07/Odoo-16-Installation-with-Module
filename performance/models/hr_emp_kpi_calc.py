from odoo import api, fields, models


class hrEmpKpiCalc(models.Model):
    _name = 'hr.emp.kpi.calc'
    _description = 'Employee Designation Calculation'

    job_id = fields.Integer()
    calc_json = fields.Text()
