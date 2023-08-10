from odoo import api, fields, models


class KpiCompdPT(models.Model):
    _name = 'hr.kpi.compd.pt'
    _description = 'Compound KPI'
    _rec_name = 'cmpd_name'

    cmpd_name = fields.Char(string="Compound KPI Name", readonly=True);
    first_kpi_id = fields.Many2one('hr.kpi.setup', string='First KPI')
    first_label_id = fields.Many2one('hr.kpi.points.label', string='First KPI Label')
    second_kpi_id = fields.Many2one('hr.kpi.setup', string='Second KPI')
    second_label_id = fields.Many2one('hr.kpi.points.label', string='Second KPI Label')
    pt_score = fields.Float(string='Point Score', required=True)

    @api.onchange('first_kpi_id', 'second_kpi_id')
    def _onchange_cmpd_name(self):
        if self.first_kpi_id and self.second_kpi_id:
            self.cmpd_name = self.first_kpi_id.kpi_name.replace(" ", "_") + '_' + self.second_kpi_id.kpi_name.replace(
                " ", "_")
