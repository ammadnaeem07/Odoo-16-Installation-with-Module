from odoo import api, fields, models
from odoo.http import request
from datetime import datetime
from statistics import mean


class KpiPerfDashboard(models.Model):
    _name = 'hr.kpi.dashboard'

    @api.model
    def getCurrentEmpData(self):
        curr_udata = self.env['hr.employee'].search([('user_id', '=', self._uid)])
        is_admin = self.env.user._is_admin() if True else False
        # print(is_admin)
        return {
            'emp_id': curr_udata.id,
            'job_id': curr_udata.job_id.id,
            'is_admin': is_admin
        }

    @api.model
    def getSixMonthPerf(self, month_list):
        print(month_list)
        curr_udata = self.env['hr.employee'].search([('user_id', '=', self._uid)])

        emp_kpi = self.env['hr.kpi.emp.entry'].search([
            ('emp_id', '=', curr_udata.id)], limit=5)
        print()
        data = []
        for rec in emp_kpi:
            result = []
            result.append(rec.kpi_id.kpi_name)
            for month in month_list:
                score_pt = self.env['hr.kpi.emp.entry'].search([
                    ('emp_id', '=', curr_udata.id),
                    ('month_year', '=', month), ('kpi_id', '=', rec.kpi_id.id)]).score_pt
                print(rec.kpi_id.id)
                print(score_pt)
                result.append(score_pt)
            data.append(result)
        return data


    @api.model
    def getIndividualPerf(self, args):
        emp_month = self.env['hr.kpi.emp.entry'].sudo().search([
            ('desig_id', '=', args['job_id']),
            ('emp_id', '=', args['emp_id'])
        ]).read_group([], ['month_year'], ['month_year'])
        monthly_perf = []
        for rec in emp_month:
            kpi_entered = self.env['hr.kpi.emp.entry'].sudo().search([
                ('desig_id', '=', args['job_id']),
                ('emp_id', '=', args['emp_id']),
                ('month_year', '=', rec['month_year'])
            ])
            individual_perf = self.individualPerf(kpi_entered)
            individual_perf['month_year'] = rec['month_year']
            monthly_perf.append(individual_perf)
        result = []
        for month in range(1, 12):
            month_year = datetime(datetime.today().year, int(month), 1).strftime('%m-%Y')
            ps = ''
            for my_perf in monthly_perf:
                if month_year == my_perf['month_year']:
                    ps = my_perf['final_score']
            if ps:
                result.append(ps)
            else:
                result.append(0)
        return result

    def individualPerf(self, kpis):
        primary_list = []
        secondery_list = []
        tertiary_list = []
        for rec in kpis:
            print(rec)
            if rec.kpi_id.kpi_type_id.id == 1:
                primary_list.append(rec.score_pt)
            if rec.kpi_id.kpi_type_id.id == 2:
                secondery_list.append(rec.score_pt)
            if rec.kpi_id.kpi_type_id.id == 3:
                tertiary_list.append(rec.score_pt)
        task_score = sum(primary_list)
        build_multiplier = mean(secondery_list) if len(secondery_list) > 0 else 0
        add_points_fac = mean(tertiary_list) if len(tertiary_list) > 0 else 0
        cumulative_score = (build_multiplier / 100) * add_points_fac
        final_score = int(task_score * cumulative_score)
        curr_grade = request.env['hr.desig.points'].sudo().search([('points', '=', final_score)])
        return {'final_score': final_score, 'curr_grade': curr_grade}

    @api.model
    def singleMonthPerf(self, args):
        kpi_entered = request.env['hr.kpi.emp.entry'].sudo().search([
            ('desig_id', '=', args['emp_data']['job_id']),
            ('emp_id', '=', args['emp_data']['emp_id']),
            ('month_year', '=', args['month_year'])

        ])
        data = []
        emp_kpi_data = self.search([('id', 'in', kpi_entered.ids)])
        for i, rec in enumerate(kpi_entered):
            print(rec)
            pt_list = []
            is_selected_option = ''
            pt_lb_score = self.env['hr.kpi.points.tbl'].search([('kpi_id', '=', rec.kpi_id.id)])
            print(pt_lb_score)
            kpi_setup = self.env['hr.kpi.setup'].search([('id', '=', rec.kpi_id.id)])
            if emp_kpi_data:
                is_selected_option = emp_kpi_data[i].score_pt
            for pt_lbl_score in pt_lb_score:
                pt_list.append({
                    'pt_label': pt_lbl_score.display_name,
                    'pt_score': pt_lbl_score.pt_score
                })
            data.append({
                'kpi_id': rec.id,
                'kpi_name': rec.kpi_id['kpi_name'],
                'kpi_pt_score': pt_list,
                'input_field_type': kpi_setup.input_field,
                'selected_value': is_selected_option,
                'kpi_type': kpi_setup.kpi_type_id.id
            })
        return data
