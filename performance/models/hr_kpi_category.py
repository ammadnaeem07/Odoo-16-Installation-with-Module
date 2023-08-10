from odoo import api, fields, models


class KpiCategory(models.Model):
    _name = 'hr.kpi.category'
    _description = 'KPI Category'
    _rec_name = 'cat_name'

    cat_name = fields.Char(string='KPI Category', required=True)