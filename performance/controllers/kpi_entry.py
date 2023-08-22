import json
from builtins import print

from odoo import http
from odoo.http import request
from datetime import datetime
from statistics import mean
import math
from dateutil.relativedelta import relativedelta


class KpiEntry(http.Controller):

    @http.route('/kpi/entry', auth='none', type="json", csrf=False, cors='*')
    def kpi_entry(self, **args):

        # print(args)
        emp_info = request.env['hr.contract'].sudo().search(
            [('kpi_category_id', '=', int(args['id'])), ('state', '=', 'open')])
        emp_list = []
        for rec in emp_info:
            is_kpi_entered = []
            # print(rec)
            kpi_entered = request.env['hr.kpi.emp.entry'].sudo().search([
                ('desig_id', '=', rec.kpi_category_id.id),
                ('emp_id', '=', rec.employee_id.id),
                ('month_year', '=', (datetime.today() - relativedelta(months=1)).date().strftime('%m-%Y'))

            ])
            # print(kpi_entered)
            if kpi_entered:
                is_kpi_entered = kpi_entered.ids
            # print(kpi_entered)
            monthly_perf_score = ''
            if kpi_entered:
                monthly_perf_score = self.getEmpPerformance(kpi_entered)
            single_emp = {
                'id': rec.employee_id.id,
                'code': rec.employee_id.employee_code,
                'name': rec.employee_id.name,
                'job_id': rec.job_id.id,
                'designation': rec.job_id.name,
                'department': rec.department_id.name,
                'grade': rec.grade_id.grade,
                'kpi_entered': is_kpi_entered,
                'monthly_performance': monthly_perf_score,
                'kpi_cat_id': rec.kpi_category_id.id
            }
            emp_list.append(single_emp)
        # print(emp_list)
        return emp_list

    def getEmpPerformance(self, kpis):
        kpi_data = []
        for rec in kpis:
            # print(rec)
            kpi_data.append({
                'id': rec.id,
                'kpi_id': rec.kpi_id.id,
                'score_pt': rec.score_pt,
                'job_id': rec.desig_id.id
            })
        # print(kpi_data)
        individual_perf = self.individualPerf(kpi_data, rec.desig_id.id)
        final_score = individual_perf['final_score']
        dis_curr_grade = individual_perf['curr_grade'].grade_id.display_name
        if final_score:
            return str(final_score) + ' (' + str(dis_curr_grade) + ')'
        else:
            return None
        # return None

    def perform_arithmetic_operations(self, input_dict):
        result = None
        operators = {
            'multiply': lambda x, y: x * y,
            'add': lambda x, y: x + y,
            'subtract': lambda x, y: x - y
        }
        default_operation = lambda x, y: x  # Default operation (identity function)
        operation = default_operation
        for key, value in input_dict.items():
            if key in operators:
                operation = operators[key]
            elif key.startswith('group_hele_'):
                if result is None:
                    result = value
                else:
                    result = operation(result, value)
            else:
                # Use the default operation when there's no operator key
                if result is None:
                    result = value
                else:
                    result = default_operation(result, value)

        return result

    def individualPerf(self, kpis, job_id=''):
        # arithmetic_symbols = {
        #     'sum': '+',
        #     'multiply': '*'
        # }
        # print(kpis)
        # print(job_id)
        calc_json = request.env['hr.emp.kpi.calc'].sudo().search([('job_id', '=', job_id)]).calc_json
        calc_json = calc_json.replace("'", '"')
        load_json = json.loads(calc_json)
        result = {}
        grp_cal_array = load_json.pop()
        for i, calc in enumerate(load_json):
            print(calc)
            sum_result = []
            avg_result = []
            mul_result = []
            grp_output = calc['grp_output'] if 'grp_output' in calc else ''
            if 'calculation' in calc:
                for clc_obj in calc['calculation']:
                    print(clc_obj['factor'])
                    found_kpi_obj = next((obj for obj in kpis if obj['kpi_id'] == int(clc_obj['kpi_id'])), None)
                    if clc_obj['factor'] == 'sum':
                        sum_result.append(float(found_kpi_obj['score_pt']))
                    if clc_obj['factor'] == 'avg':
                        avg_result.append(float(found_kpi_obj['score_pt']))
                    if clc_obj['factor'] == 'mul':
                        print(found_kpi_obj)
                        mul_result.append(float(found_kpi_obj['score_pt']))
                # print(mul_result)
                result_key = 'group_hele_' + str(i + 1)
                if len(sum_result) > 0:
                    if grp_output == 'value':
                        res = sum(sum_result)
                    else:
                        res = sum(sum_result) / 100
                    result[result_key] = res
                if len(mul_result) > 0:
                    # print(mul_result)
                    if grp_output == 'value':
                        res = math.prod(mul_result)
                    else:
                        res = math.prod(mul_result) / 100
                    result[result_key] = res
                if len(avg_result) > 0:
                    total_sum = sum(avg_result)
                    average = total_sum / len(avg_result)
                    if grp_output == 'value':
                        result[result_key] = average
                    else:
                        res = average / 100
                        result[result_key] = res
        final_score = int(self.perform_arithmetic_operations(result))
        # print(final_score)
        curr_grade = request.env['hr.desig.points'].sudo().search(
            [('points', '<=', final_score), ('job_id', '=', job_id)], order='points desc', limit=1)
        # print(curr_grade)
        return {'final_score': final_score, 'curr_grade': curr_grade}

    @http.route('/kpi/getIndividualPerf', auth='none', type="json", csrf=False, cors='*')
    def getIndividualPerf(self, **args):
        emp_month = request.env['hr.kpi.emp.entry'].sudo().search([
            ('desig_id', '=', args['emp_data']['job_id']),
            ('emp_id', '=', args['emp_data']['id'])
        ]).read_group([], ['month_year'], ['month_year'])
        monthly_perf = []
        for rec in emp_month:
            kpi_entered = request.env['hr.kpi.emp.entry'].sudo().search([
                ('desig_id', '=', args['emp_data']['kpi_cat_id']),
                ('emp_id', '=', args['emp_data']['id']),
                ('month_year', '=', rec['month_year'])
            ])
            kpi_data = []
            for kpi_obj in kpi_entered:
                kpi_data.append({
                    'id': kpi_obj.id,
                    'kpi_id': kpi_obj.kpi_id.id,
                    'score_pt': kpi_obj.score_pt,
                    'job_id': kpi_obj.desig_id.id
                })
            # print(kpi_data)
            individual_perf = self.individualPerf(kpi_data, args['emp_data']['kpi_cat_id'])
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
