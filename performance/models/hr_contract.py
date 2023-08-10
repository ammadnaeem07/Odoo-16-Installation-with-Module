from odoo import models, fields, api, _
class HrContractInherit(models.Model):
    _inherit = "hr.contract"

    kpi_category_id = fields.Many2one('hr.kpi.category', string='Employee KPI Category', tracking=True)
