from odoo import api, fields, models


class KpiPointsTable(models.Model):
    _name = 'hr.kpi.points.tbl'
    _description = 'KPI Points Table'
    _rec_name = 'pt_label_id'

    kpi_id = fields.Many2one('hr.kpi.setup', string='KPI')
    pt_label_id = fields.Many2one('hr.kpi.points.label',string='Point Label')
    pt_score = fields.Float(string='Point Score', required=True)
