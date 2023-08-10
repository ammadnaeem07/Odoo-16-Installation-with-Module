from odoo import api, fields, models


class KpiSetup(models.Model):
    _name = 'hr.kpi.setup'
    _description = 'KPI Records'
    _rec_name = 'kpi_name'

    kpi_name = fields.Char(string='KPI Name', required=True)
    input_field = fields.Selection([('1', 'Selection'), ('2', 'Text Field')], string="User Input")
    kpi_type_id = fields.Many2one('hr.kpi.type', string='KPI Type')
    group_ids = fields.Many2many('hr.kpi.groups', string='KPI Groups')
    is_parent_kpi = fields.Boolean(string="Is Parent KPI", default=False)
    kpi_parent_id = fields.Many2one('hr.kpi.setup', string="Parent KPI")
    kpi_description = fields.Char(string='Description')
    kpi_measure = fields.Char(string='Measure')


    @api.onchange('kpi_type_id')
    def on_kpi_type_id_change(self):
        for rec in self:
            emp_info = self.env['hr.employee'].search([('id', '=', 22)])
            print(emp_info)
            print(emp_info.job_id.display_name)

