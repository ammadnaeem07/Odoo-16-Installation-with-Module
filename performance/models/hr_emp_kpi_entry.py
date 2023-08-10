from odoo import api, fields, models
from datetime import datetime
from dateutil.relativedelta import relativedelta


class HrEmpKpiEntry(models.Model):
    _name = 'hr.kpi.emp.entry'
    _description = 'Employee KPI Entry'
    # _rec_name = 'desig_id'

    emp_id = fields.Many2one('hr.employee', string='Employee Designation')
    desig_id = fields.Many2one('hr.job', string='Designation')
    kpi_id = fields.Many2one('hr.kpi.setup', string='KPI')
    score_pt = fields.Float(string='KPI Score')
    month_year = fields.Char(string="Month Year")

    @api.model
    def getCurrentUserData(self):
        curr_udata = self.env['res.users'].search([('id', '=', self._uid)])
        if self.env.user._is_admin():
            allow_pdke = True
        else:
            allow_pdke = curr_udata.has_group('tek_hr_performance.allow_post_date_kpi_entry')
        return {
            'allow_pdke': allow_pdke
        }

    @api.model
    def getAllEmpKpi(self):
        employee = self.env['hr.employee']
        responsible_id = employee.search([('user_id', '=', self._uid)]).id
        emp_info = employee.search([('parent_id', '=', responsible_id)])
        emp_list = []
        for rec in emp_info:
            is_kpi_entered = []
            kpi_entered = self.env['hr.kpi.emp.entry'].sudo().search([
                ('desig_id', '=', rec.contract_id.job_id.id),
                ('emp_id', '=', rec.id),
                ('month_year', '=', (datetime.today() - relativedelta(months=1)).date().strftime('%m-%Y'))

            ]);
            # print(kpi_entered)
            if kpi_entered:
                is_kpi_entered = kpi_entered.ids
            single_emp = {
                'id': rec.id,
                'code': rec.employee_code,
                'name': rec.name,
                'job_id': rec.contract_id.job_id.id,
                'designation': rec.contract_id.job_id.name,
                'department': rec.contract_id.department_id.name,
                'grade': rec.contract_id.grade_id.grade,
                'kpi_entered': is_kpi_entered
            }
            emp_list.append(single_emp)
        return emp_list

    @api.model
    def getEmployeeKPI(self, emp):
        # print(emp)
        job_ids = self.env['hr.kpi.employee'].search([('desig_id', '=', emp['kpi_cat_id'])])
        # print(job_ids)
        data = []
        emp_kpi_data = self.search([('id', 'in', emp['kpi_entered'])])
        for i, rec in enumerate(job_ids.kpi_ids):
            pt_list = []
            is_selected_option = ''
            pt_lb_score = self.env['hr.kpi.points.tbl'].search([('kpi_id', '=', rec.id)])
            kpi_setup = self.env['hr.kpi.setup'].search([('id', '=', rec.id)])
            if emp_kpi_data:
                is_selected_option = emp_kpi_data[i].score_pt
            for pt_lbl_score in pt_lb_score:
                pt_list.append({
                    'pt_label': pt_lbl_score.display_name,
                    'pt_score': pt_lbl_score.pt_score
                })
            data.append({
                'kpi_id': rec.id,
                'kpi_name': rec.kpi_name,
                'kpi_pt_score': pt_list,
                'input_field_type': kpi_setup.input_field,
                'selected_value': is_selected_option,
                'kpi_type': kpi_setup.kpi_type_id.id
            })
        # for i, cmpdKpi in enumerate(job_ids.cmpd_kpi_ids):
        #     print(cmpdKpi)

        return data

    # @api.model
    # def is_kpi_entered(self, emp_id, job_id):
    #     return 'Working is_kpi_entered'
