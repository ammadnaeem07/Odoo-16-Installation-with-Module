from odoo import api, fields, models


class KpiType(models.Model):
    _name = 'hr.kpi.type'
    _description = 'KPI Type'
    _rec_name = 'type_name'

    type_name = fields.Char(string='KPI Type', required=True)
