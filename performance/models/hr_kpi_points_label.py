from odoo import api, fields, models


class KpiPointsLabel(models.Model):
    _name = 'hr.kpi.points.label'
    _description = 'KPI Points Label'
    _rec_name = 'pt_label'

    pt_label = fields.Char(string='Point Label', required=True)
