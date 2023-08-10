from odoo import api, fields, models


class HrDesigPoints(models.Model):
    _name = 'hr.desig.points'
    _description = 'Designation Points'
    _rec_name = 'level_id'

    level_id = fields.Many2one('hr.emp.level', string="Employee Levels", required=True)
    grade_id = fields.Many2one('hr.emp.grade', string="Employee Grade", domain="[('level_id', '=', level_id)]", required=True)
    job_id = fields.Many2many('hr.kpi.category', string='Employee KPI Category', required=True)
    points = fields.Char(string="Points", required=True)

    # @api.onchange('level_id')
    # def get_lvl_grade(self):
    #     print(self)
