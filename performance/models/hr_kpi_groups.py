from odoo import api, fields, models


class KpiGroups(models.Model):
    _name = 'hr.kpi.groups'
    _description = 'KPI Groups'
    _rec_name = 'grp_name'

    grp_name = fields.Char(string='KPI Group', required=True)
    objective = fields.Char(string='Objective')
    strategy = fields.Char(string='Strategy')
