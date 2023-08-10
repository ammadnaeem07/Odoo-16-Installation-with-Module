/** @odoo-module **/
import { registry } from '@web/core/registry'
const { Component, useState, onWillStart, useRef, onMounted } = owl
import { useService } from '@web/core/utils/hooks'


export class EmployeeKPI extends Component {
    setup(){
        this.desig_model = 'hr.kpi.category'
        this.kpi_setup_model = 'hr.kpi.setup'
        this.hr_kpi_employee = 'hr.kpi.employee'
        this.orm = useService('orm')
        this.state = useState({
           grp_ele_index: 1,
           fac_ele_index: 1,
           desigList: [],
           kpiList:[],
           group_hele: []
        })
        onWillStart(async () => {
            await this.getAllDesignations()
            await this.getAllKpiList()
        })
        onMounted(() => {
//          console.log(this.state.desigList);
//          console.log(this.state.getAllKpiList);
        });
    }

    cloneGroup(){
            this.state.grp_ele_index +=  1;
            this.state.fac_ele_index = 1;
            let group_ele = document.getElementById("group_ele");
            let kpiFacId = 'kpi_fac_ele_'+ this.state.grp_ele_index
            let kpi_list = '';
            this.state.kpiList.map(obj => {
            kpi_list += `<option value="${obj.id}">
                            ${obj.kpi_name}
                        </option>`;
            })
          this.cloneGroupHtml(kpi_list, kpiFacId,this.state.grp_ele_index, this.state.fac_ele_index)
          let that = this.state
          let func_that = this
          let fac_ele = document.getElementById("cloneKpiFacEle_"+this.state.grp_ele_index);
          fac_ele.addEventListener('click', function ( event ) {
          func_that.cloneKpiFac()
//            that.fac_ele_index += 1;
//            console.log("Factor", that.fac_ele_index);
//            console.log("Group", that.grp_ele_index);
//            let kpi_fac_ele = document.getElementById(kpiFacId);
//            let fc_clone_ele = kpi_fac_ele.firstElementChild.cloneNode(true);
//            fc_clone_ele.classList.add('mt-2');
//            kpi_fac_ele.appendChild(fc_clone_ele);
          })
    }
    cloneGroupHtml(kpi_list, kpiFacId, grp_ele_index, fac_ele_index){
        let clone_html = `<div class="col-lg-12 border group_ele_${grp_ele_index}" style="height:auto;">
                                <div class="card-header mb-2">
                                        <div class="row">
                                        <div class="col-lg-2 p-0" style="padding-left: 5px !important;">
                                            <button type="button" id="cloneKpiFacEle_${grp_ele_index}" class="btn btn-primary">
                                            <i class="fa fa-plus"></i>
                                        </button>
                                        </div>
                                        <div class="col-lg-4 p-0 float-right">
                                            <input type="text" class="form-control group_hele_${grp_ele_index}" placeholder="Group Name" />
                                        </div>
                                        <div class="col-lg-2 p-0 float-right" style="margin-left: 20px;">
                                             <select size="0" class="form-control group_output_${grp_ele_index}" name="grp_output">
                                                <option value="" selected="true" disabled="true">Group Output</option>
                                                  <option value="value">Value</option>
                                                  <option value="percentage">Percentage</option>
                                             </select>
                                        </div>
                                    </div>
                                </div>
                                <div id="${kpiFacId}" class="kpi_fac_ele_${this.state.grp_ele_index}">
                                    <div class="row">
                                        <div class="col">
                                            <select size="0" class="form-control fact_opt_${fac_ele_index}" name="fact_opt">
                                             <option value="" selected="true" disabled="true">Factor Operator</option>
                                                <option value="add">Additions (+)</option>
                                                <option value="subs">Subtractions (-)</option>
                                                <option value="multiply">Multiply(*)</option>
                                                <option value="factor">Based on Factor</option>
                                            </select>
                                        </div>
                                        <div class="col">
                                            <select size="0" class="form-control fact_opt_${fac_ele_index}" name="kpi_id">
                                                <option value="" selected="true" disabled="true">Select KPI</option>
                                                ${kpi_list}
                                            </select>
                                        </div>
                                        <div class="col">
                                            <select size="0" class="form-control fact_opt_${fac_ele_index}" name="factor">
                                                <option value="" selected="true" disabled="true">Factor</option>
                                                <option value="primary">Primary</option>
                                                <option value="secondary">Secondary</option>
                                                <option value="tertiary">Tertiary</option>
                                                 <option value="sum">Sum</option>
                                                 <option value="mul">Multiply</option>
                                                <option value="avg">Average</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
          $('#group_ele').append(clone_html);

    }
    cloneKpiFac(){
    let kpiFacId = 'kpi_fac_ele_'+ this.state.grp_ele_index
           this.state.fac_ele_index += 1;
           this.cloneKpiFacHtml(kpiFacId, this.state.fac_ele_index, this.state.grp_ele_index);
           let btnClass = '.dlt_fac_ele_'+this.state.fac_ele_index
           const dlt_fac_ele = document.querySelectorAll(btnClass);
           dlt_fac_ele.forEach(button => {
              button.addEventListener('click', event => {
              const clickedButton = event.target.closest(btnClass);
              const buttonData = clickedButton.getAttribute('data-info');
//              console.log(buttonData); // Output: The data-info value of the clicked button
              const parentDiv = document.getElementsByClassName(buttonData);
              parentDiv[0].remove();
              });
           });
//           console.log(dlt_fac_ele);
//           dlt_fac_ele.addEventListener('click', event => {
//           console.log(event.target);
//           let parent_id = event.target.getAttribute('data-info');
//           console.log('Element clicked:', event.target, parent_id);
//          });
    }
    cloneKpiFacHtml(kpi_fac_ele, fact_opt_index, grp_index){
            let fact_opt = 'fact_opt_'+ fact_opt_index
            let kpi_list = '';
            this.state.kpiList.map(obj => {
            kpi_list += `<option value="${obj.id}">
                            ${obj.kpi_name}
                        </option>`;
            })
         let clone_html = `<div class="row mt-2 row_${grp_index}_${fact_opt_index}">
                                        <div class="col">
                                            <select size="0" class="form-control ${fact_opt}" name="fact_opt">
                                                <option value="" selected="true" disabled="true">Factor Operator</option>
                                                <option value="add">Additions (+)</option>
                                                <option value="subs">Subtractions (-)</option>
                                                <option value="multiply">Multiply(*)</option>
                                                <option value="factor">Based on Factor</option>

                                            </select>
                                        </div>
                                        <div class="col">
                                            <select size="0" class="form-control ${fact_opt}" name="kpi_id">
                                                <option selected="true" disabled="true" value="">Select KPI</option>
                                                ${kpi_list}
                                            </select>
                                        </div>

                                        <div class="col">
                                            <div class="input-group">
                                                <select size="0" class="form-control ${fact_opt}" name="factor">
                                                    <option value="" selected="true" disabled="true">Factor</option>
                                                    <option value="primary">Primary</option>
                                                    <option value="secondary">Secondary</option>
                                                    <option value="tertiary">Tertiary</option>
                                                    <option value="sum">Sum</option>
                                                    <option value="mul">Multiply</option>
                                                    <option value="avg">Average</option>
                                                </select>
                                                <button type="button" data-info="row_${grp_index}_${fact_opt_index}" class="ml-2 btn btn-sm btn-danger dlt_fac_ele_${this.state.fac_ele_index}"><i class="fa fa-trash" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>`
         $(".kpi_fac_ele_"+this.state.grp_ele_index).append(clone_html);
    }
    async getAllDesignations(){
        this.state.desigList = await this.orm.searchRead(this.desig_model,[],['id', 'display_name'])
    }

    async getAllKpiList(){
        this.state.kpiList = await this.orm.searchRead(this.kpi_setup_model,[],['id','kpi_name'])
    }
    async handleEmpKpi(){
        toastr.options = {
            progressBar : true,
            closeButton : true
        }
        let job_id = $('#job_id').val();
        if(job_id === null){
            toastr.error('Employee designation is required!', 'Error')
            return false;
        }
        else{
        let kpiIds = this.getAllSelectedKpis();
        let data = []
        for(let i=1; i<= this.state.grp_ele_index; i++){
            let kpi_fac_ele = document.querySelector(".kpi_fac_ele_"+i);
            let childFactEle = kpi_fac_ele.querySelectorAll('.row');
            let grpClass = 'group_ele_'+i
            let grpCal = document.querySelector(".group_hele_"+i);
            let grpOutput = document.querySelector(".group_output_"+i);
//            console.log(grpCal.value);
            let grpCalKey = 'group_hele_'+i;
//            console.log(grpCalKey);
//            let grpCalObj = {}
//            grpCalObj[grpCalKey] = grpCal.value
            var values = {
                calculation: []
            };
            values[grpCalKey] = grpCal.value
            values['grp_output'] = grpOutput.value
//            values.grpCalKey;
            for(let j=1; j<=childFactEle.length; j++){
                let factClass = 'fact_opt_'+j
                let inputs = document.querySelectorAll(`.${grpClass}  select.${factClass}`);
                let rowObj = Array.from(inputs).reduce(function(obj, input) {
                                  obj[input.name] = input.value;
                                  return obj;
                              }, {});
                if(!this.isEmptyObj(rowObj)){
                    values.calculation.push(rowObj)
                }
            }
            data.push(values);
//            let group_ele = $('.grp_operator_'+i).val();
//            if(group_ele){
//                data.push({'grp_operator': group_ele});
//            }
        }
//        console.log(data);
//        return false;
//        let grpCal = this.getGroupCal();
        data.push({'grp_calc': this.getGroupCal()})
//        console.log(data);
//        return false;
        let res = await this.orm.call(this.hr_kpi_employee, 'emp_kpi_create', [job_id, data, kpiIds], []);
        if(res.exists){
            toastr.error('KPIs already Mapped with Employee on selected Designation.', 'Already Added')
            return false;
        }
        if(res){
            toastr.success('Successfully Mapped KPI with Employee', 'Successfully Added')
        }
        }
    }
    getGroupCal(){
        const containerElement = document.getElementById('grp_selection_ele');
        const grpParentEle = containerElement.querySelectorAll('select');
        const grpCalArray = [];
        grpParentEle.forEach((input) => {
          grpCalArray.push(input.value);
        });
        return grpCalArray
    }
    getAllSelectedKpis(){
        let kpi_ids = document.getElementsByName('kpi_id');
        let ids = []
        for (let i = 0; i < kpi_ids.length; i++) {
          ids.push(kpi_ids[i].value)
        }
        return ids
    }
    isEmptyObj(obj) {
      for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
          return false;
        }
      }

      return true;
    }

    groupCalculation(){
    this.state.group_hele = []
       for(let i=1; i<= this.state.grp_ele_index; i++){
//            console.log($(".group_hele_"+i).val());
            let grpVal = $(".group_hele_"+i).val();
            this.state.group_hele.push({'val': "group_hele_"+i, 'title': grpVal})
       }
//       console.log(this.state.group_hele);
       this.addGrpSelection(true);
    }

    addGrpSelection(reset= false){
       $('#grp_calculation').show();
       if(reset === true){
        $('#grp_selection_ele').empty()
       }
       let sltd_grp_list = '';
        this.state.group_hele.map(obj => {
        sltd_grp_list += `<option value="${obj.val}">
                        ${obj.title}
                    </option>`;
        })
//        console.log(sltd_grp_list);
        let grp_selection = `<div class="mb-3">
                           <select size="0" class="form-control">
                                <option selected="true" disabled="true" value="">Select Group</option>
                                ${sltd_grp_list}
                            </select></div>`;
       $('#grp_selection_ele').append(grp_selection);
    }
    addArithmeticOperation(){
           let arthEle = `<div class="mb-3">
                           <select size="0" class="form-control" name="">
                                <option selected="true" disabled="true" value="">Select Operation</option>
                                <option value="add">Additions (+)</option>
                                <option value="subs">Subtractions (-)</option>
                                <option value="multiply">Multiply(*)</option>
                            </select></div>`;
       $('#grp_selection_ele').append(arthEle);
    }
}

EmployeeKPI.template = 'hr.employee_kpi'
registry.category('actions').add('hr.action_employee_kpi_js', EmployeeKPI)
