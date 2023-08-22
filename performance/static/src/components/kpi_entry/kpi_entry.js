/** @odoo-module **/
import { registry } from '@web/core/registry'
const { Component, useState, onWillStart, useRef, onRendered, useSubEnv } = owl
import { getDefaultConfig } from "@web/views/view"
import { useService } from '@web/core/utils/hooks'


export class KpiEntry extends Component {
    setup(){
        this.monthDic = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        this.state = useState({
           desigList: [],
           empList: [],
           empListWithCode: [],
           kpiEntryEmp: {},
           empKpiData:[],
           userData:[],
           month: this.monthDic[this.getCurrMY().month - 1],
           year: this.getCurrMY().year
        })

        useSubEnv({
            config: {
                ...getDefaultConfig(),
                ...this.env.config,
            }
        })

        this.orm = useService('orm')
        this.rpc = useService("rpc")
        this.kpi_model = 'hr.kpi.emp.entry'
        this.desig_model = 'hr.kpi.category'
//        this.calculateKpi = useService("calculateKpiService")
//        this.empModalRef = useRef('emp-kpi-modal')


        onWillStart(async () => {
            await this.getAllDesignations()
//            await this.setupComponent()
            await this.getCurrentUserData()
        })
    }

    // function called from service...
    get calculateEmpKpi() {
        const calPerfService = this.env.services.calculateKpiService
        return calPerfService.func
    }
    getCurrMY() {
      let currentDate = new Date();
      let month = currentDate.getMonth(); // Months are zero-based, so we add 1
      if(month <= 9)
        month = '0'+month;
      let year = currentDate.getFullYear();
      return {
          month,
          year
      }
    }
    async getCurrentUserData(){
        this.state.userData = await this.orm.call(this.kpi_model, 'getCurrentUserData',[], [])
    }

    async getAllDesignations(){
        this.state.desigList = await this.orm.searchRead(this.desig_model,[],['id', 'display_name'])
    }
    async getAllEmpKpi(){
        this.state.empList = await this.orm.call(this.kpi_model, 'getAllEmpKpi',[], [])
    }

    async _onChangeDesig(){
//        console.log(this.calculateEmpKpi)
        this.state.empList = []
        let desig_id = document.getElementById("empDesig").value;
        let emp_kpi = await this.rpc('/kpi/entry', {
            id: +desig_id
        });
        this.state.empList = emp_kpi
        this.state.empListWithCode = emp_kpi
    }
    async empKpiFormView(emp, mode=''){
            this.state.empKpiData = await this.orm.call(this.kpi_model, 'getEmployeeKPI', [emp], []);
            if(mode == 'add'){
                this.state.empKpiData.map((obj) => {
                    obj.selected_value = ''
                });
            }
            this.state.kpiEntryEmp = emp;
            this.openDialog('empKpiModal')
    }
    async viewEmpKpi(emp){
        this.openDialog('viewEmpKpiModal');
        this.state.kpiEntryEmp = emp;
        console.log(this.state.kpiEntryEmp)
        this.state.empKpiData = await this.orm.call(this.kpi_model, 'getEmployeeKPI', [emp], []);
        if(this.state.empKpiData){
            this.state.empKpiData.map((kpiData) => {
                    if(kpiData.kpi_type == 2){
                            kpiData.kpi_pt_score.map((ptScore) => {
                                if(ptScore.pt_score == kpiData.selected_value){
                                    kpiData.label = ptScore.pt_label
                                }
                            })
                    kpiData.selected_value += '%'
                    kpiData.badge = 'badge-danger'
                    }
                    if(kpiData.kpi_type == 3){
                        kpiData.kpi_pt_score.map((ptScore) => {
                            if(ptScore.pt_score == kpiData.selected_value){
                                kpiData.label = ptScore.pt_label
                            }
                        })
                    kpiData.badge = 'badge-success'
                    }
            kpiData.badge = 'badge-info'
            });

        }
    }
    async saveEmpPerf(){
        let fields = document.getElementsByName("kpi_score[]");
        let kpiIds = document.getElementsByName("kpi_ids[]");
        let kpi_month_year = document.getElementsByName("kpi_month_year");
        let m_year = ''
        if(kpi_month_year[0].value){
            m_year = kpi_month_year[0].value.split("-");
            m_year = m_year[1]+'-'+m_year[0];
        }
        if(this.state.kpiEntryEmp.kpi_entered){
           await this.orm.unlink(this.kpi_model, this.state.kpiEntryEmp.kpi_entered)
        }
         let result = []
        for(let i = 0; i < fields.length; i++) {
            let entryData =  {
            'score_pt': parseFloat(fields[i].value).toFixed(2),
            'kpi_id': kpiIds[i].value,
            'desig_id': this.state.kpiEntryEmp.kpi_cat_id,
            'emp_id': this.state.kpiEntryEmp.id,
            'month_year': m_year ? m_year : (this.getCurrMY().month) +'-'+ this.getCurrMY().year
            }
            result[i] = await this.orm.create(this.kpi_model, [entryData])
        }

        if (result.length > 0){
            $('.txt_field').val('');
            this._onChangeDesig();
            toastr.options = {
                progressBar : true,
                closeButton : true
            }
                toastr.success('KPI Added successfully against '+this.state.kpiEntryEmp.name, 'Successfully Added')
                this.closeDialog('empKpiModal')

            }

    }
    async viewEmpPerf(emp){
        this.state.kpiEntryEmp = emp;
        this.openDialog('viewEmpPerformance')
        const labels = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
        let perf_data = await this.rpc('/kpi/getIndividualPerf', {
            emp_data: emp
        });
        let chartStatus = Chart.getChart("perfBarChart");
        if (chartStatus != undefined) {
          chartStatus.destroy();
        }
        var chrt = document.getElementById("perfBarChart").getContext("2d");
        var perfBarChart = new Chart(chrt, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                   label: "Performance",
                   data: perf_data,
                   backgroundColor: ['#147cc4'],
    //                       borderColor: ['red', 'blue', 'fuchsia', 'green', 'navy', 'black'],
                   borderWidth: 2,
                }],
             },
             options: {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return value;
                            }
                        }
                    }
                }
             },
          });
    }
    closeDialog(modalId) {
        $('#'+modalId).modal('hide')
    }
    openDialog(modalId) {
        $('#'+modalId).modal('show')
    }
    async filterEmpList(){
           let emp_id = document.getElementById("ind_person").value;
            const singleEmp = []
            this.state.empList = []
            let desig_id = document.getElementById("empDesig").value;
            let emp_kpi = await this.rpc('/kpi/entry', {
                id: +desig_id
            });
            this.state.empList = emp_kpi
//            console.log(emp_kpi)
            if(this.state.empList){
                singleEmp.push(this.state.empList.find(obj => obj.id == emp_id));
                this.state.empList = singleEmp
            }

    }

}

KpiEntry.template = 'hr.kpiEntry'
registry.category('actions').add('hr.action_kpi_entry_js', KpiEntry)
