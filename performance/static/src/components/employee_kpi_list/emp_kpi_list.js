/** @odoo-module **/
import { registry } from '@web/core/registry'
const { Component, useState, onWillStart, useRef, onMounted } = owl
import { useService } from '@web/core/utils/hooks'

export class EmpKPIList extends Component {
    setup()
    {
     this.emp_kpi = 'hr.kpi.employee'
     this.orm = useService('orm')
//     this.modalRef = useRef('modal-ref')
     this.state = useState({
       empKPIList: [],
       mappedKpi: [],
       calculation_view: []
     })

     onWillStart(async () => {
            let num  = 100;
            console.log(num++)
            await this.getEmpKpiList()
        })
    }
    async getEmpKpiList(){
        this.state.empKPIList = await this.orm.call(this.emp_kpi, 'getEmpKpiList', [], [])
    }

    async getMappedKPIs(){
         let mappedKpisIds = {}
         await this.state.empKPIList.map(obj => {
            mappedKpisIds =  obj.mapped_kpi
         });
        this.state.mappedKpi = await this.orm.call(this.emp_kpi, 'getMappedKpi', [mappedKpisIds], [])
        this.dialogMappedKpiToggle()
    }
    async getCalculationView(){
        let desig_id;
         await this.state.empKPIList.map(obj => {
            desig_id =  obj.desig_id
         });
         let cal_result = await this.orm.call(this.emp_kpi, 'getCalculationView', [desig_id], [])
         await cal_result.map((calc, i) => {
            let grp_name = `group_hele_${i+1}`
            this.state.calculation_view.push({'cal': calc.calculation, 'grp_name': calc[grp_name]})
         });
//        console.log(this.state.calculation_view);

         this.dialogCalculationViewToggle()

    }
    dialogMappedKpiToggle() {
        $('#mappedKpiModal').modal('toggle');
    }
    dialogCalculationViewToggle() {
        $('#calculationViewModal').modal('toggle');
    }
    async deleteEmpKpiCalc(empKpi){
//        console.log(empKpi);
        let response = await this.orm.call(this.emp_kpi, 'delete_emp_kpi', [empKpi], [])
        console.log(response);
    }

}

EmpKPIList.template = 'hr.emp_kpi_list'
registry.category('actions').add('hr.action_emp_kpi_list_js', EmpKPIList)