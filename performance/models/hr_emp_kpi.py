import json
from odoo import api, fields, models


class HrEmpKpi(models.Model):
    _name = 'hr.kpi.employee'
    _description = 'Employee KPI'
    _rec_name = 'desig_id'

    desig_id = fields.Many2one('hr.kpi.category', string='Employee KPI Category')
    kpi_ids = fields.Many2many('hr.kpi.setup', string='KPI List', domain=[('is_parent_kpi', '!=', True)])

    # cmpd_kpi_ids = fields.Many2many('hr.kpi.compd.pt', string="Compound KPI")

    @api.model
    def emp_kpi_create(self, job_id, json_data, kpi_ids):
        # print(kpi_ids)
        # exit()
        is_record_exists = bool(self.env['hr.kpi.employee'].search([('desig_id', '=', int(job_id))]))
        if is_record_exists:
            return {'exists': True}
        else:
            ids = [eval(i) for i in kpi_ids]
            result = self.env['hr.kpi.employee'].create({'desig_id': int(job_id), 'kpi_ids': ids})
            if result:
                calc_result = self.env['hr.emp.kpi.calc'].create({'job_id': int(job_id), 'calc_json': json_data})
            return calc_result.id

    @api.model
    def getEmpKpiList(self):
        emp_kpi_obj = self.env['hr.kpi.employee'].search([]);
        emp_kpi_arr = []
        for rec in emp_kpi_obj:
            print(rec)
            obj = {
                'id': rec.id,
                'desig_id': rec.desig_id.id,
                'desig_name': rec.desig_id.display_name,
                'mapped_kpi': rec.kpi_ids.ids
            }
            emp_kpi_arr.append(obj)
        return emp_kpi_arr

    @api.model
    def getMappedKpi(self, kpiIds):
        # print(kpiIds)
        kpi_list = self.env['hr.kpi.setup'].search([('id', 'in', kpiIds)])
        result = []
        for rec in kpi_list:
            result.append({
                'id': rec.id,
                'name': rec.display_name
            })
        return result

    @api.model
    def getCalculationView(self, desig_id):
        # print(desig_id)
        calc_json = self.env['hr.emp.kpi.calc'].search([('job_id', '=', desig_id)]).calc_json
        # print(calc_json)
        calc_json = calc_json.replace("'", '"')
        load_json = json.loads(calc_json)
        # print(load_json)
        load_json.pop()
        # if 'calculation' in load_json:
        for rec in load_json:
            # print(rec)
            for i,obj in enumerate(rec['calculation']):
                # print(obj)
                kpi = self.env['hr.kpi.setup'].search([('id', '=', obj['kpi_id'])])
                print(kpi)
                rec['calculation'][i]['kpi_name'] = kpi['display_name']
                print(obj)
        # print(load_json)
        return load_json

    @api.model
    def delete_emp_kpi(self, arg):
        # print(arg['desig_id'])
        res = self.env['hr.kpi.emp.entry'].search([('desig_id', '=', arg['desig_id'])])
        print(res)
        if res:
            return {'exists': True, 'message': 'Records Exists!'}
        else:
            res.unlink()
            return {'exists': False, 'message': 'Records Deleted!'}



