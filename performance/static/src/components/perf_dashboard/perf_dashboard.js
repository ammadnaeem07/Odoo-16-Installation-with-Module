/** @odoo-module **/
import { registry } from '@web/core/registry'
const { Component, useState, onWillStart, useRef, onRendered, onMounted } = owl
import { useService } from '@web/core/utils/hooks'



export class PerfDashboard extends Component {
    setup(){
        this.state = useState({
           empData: [],
           month_year:'',
           empKpiData:[],
           lastSixMonth: [],
           getSixMonthPerf: [],
           projected_perf: 0
        })
        this.chartRef = useRef('chart-ref')
        this.orm = useService('orm')
        this.rpc = useService("rpc")
        this.kpi_dashboard = 'hr.kpi.dashboard'

//        onRendered(() => {
//
//        })
        onWillStart(async () => {
           await this.loadCurrEmp()
           await this.getSixMonthPerf()
        })
        onMounted(async () => {
           await this.datePicker()
           await this.teamPerformance()
           if(!this.state.empData.is_admin){
                this.empPerformance()
           }
        })
    }
    async getSixMonthPerf(){
        this.state.lastSixMonth = this.lastSixMonth()
        let month_year = this.getMonthYearNumbers(this.state.lastSixMonth)
        console.log(month_year);
        this.state.getSixMonthPerf  = await this.orm.call(this.kpi_dashboard, 'getSixMonthPerf', [month_year] , []);
    }
    getMonthYearNumbers(months) {
      var monthNumbers = [];
      var year = new Date().getFullYear().toString();
      for (var i = 0; i < months.length; i++) {
        var monthNumber = (i + 1).toString().padStart(2, '0');
        monthNumber = monthNumber+'-'+ year
        monthNumbers.push(monthNumber);
      }

      return monthNumbers;
    }
    lastSixMonth(){

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var today = new Date();
    var d;
    var month;
    var year;
    var monthList = [];
    for(var i = 5; i >= 0; i--) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      month = monthNames[d.getMonth()];
      year = d.getFullYear();
      monthList.push(month)
    }
    return monthList
    }
    async datePicker(){
        $('#dp_dash').datepicker({
          format: 'mm-yyyy',
          startView: "months",
          minViewMode: "months",
          autoclose: true,
        }).on('changeDate', function(event) {
            const selectedDate = event.date;
            let monthYear = selectedDate.getMonth() + 1 +'-'+selectedDate.getFullYear();
            $('#month_year').val(monthYear);
        })
    }
    async loadCurrEmp(){
        this.state.empData = await this.orm.call(this.kpi_dashboard, 'getCurrentEmpData', [] , []);
    }
    async singleMonthPerf(){
            let params = {
                'emp_data': this.state.empData,
                'month_year': $('#month_year').val()
            }
            this.state.empKpiData =  await this.orm.call(this.kpi_dashboard, 'singleMonthPerf', [params] , []);
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
            console.log(this.state.empKpiData)
    }


    async empPerformance(){
        const labels = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
        var chrt = document.getElementById("EmpPerfDashboard").getContext("2d");
        let perf_data = await this.orm.call(this.kpi_dashboard, 'getIndividualPerf', [this.state.empData] , []);
        const filtered = perf_data.filter(Number);
        if(filtered.length > 0){
            const averagePerf = array => array.reduce((a, b) => a + b) / array.length;
            this.state.projected_perf = averagePerf(filtered) ?? 0
        }

        const chartConfig = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                   label: "Performance",
                   data: perf_data,
                   backgroundColor: ['#147cc4'],
                    //borderColor: ['red', 'blue', 'fuchsia', 'green', 'navy', 'black'],
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
                },
                plugins: {
                  annotation: {
                    annotations: {
                      current: {
                        type: 'line',
                        yMin: 1000,
                        yMax: 1000,
                        borderWidth: 2,
                        borderColor: 'red',
                        label: {
                            //backgroundColor: '',
                            content: 'Current',
                            enabled: true,
                            position: 'end'
                          },
                          borderDash: [10,10]
                      },
                      target: {
                        type: 'line',
                        yMin: 2522,
                        yMax: 2522,
                        borderWidth: 2,
                        borderColor: '#5A5A5A',
                        label: {
                            //backgroundColor: '',
                            content: 'Target',
                            enabled: true,
                            position: 'end'
                          },
                          borderDash: [10,10]
                      },
                      projected: {
                        type: 'line',
                        yMin: this.state.projected_perf,
                        yMax: this.state.projected_perf,
                        borderWidth: 2,
                        borderColor: 'green',
                        label: {
                            //backgroundColor: '',
                            content: 'Projected',
                            enabled: true,
                            position: 'end'
                          },
                          borderDash: [10,10]
                      }
                    }
                  }
                }

             },

          }
        var perfBarChart = new Chart(chrt, chartConfig);
    }

    async teamPerformance(){
        var chrt = document.getElementById("teamPerfDashboard").getContext("2d");
        const data = {
          labels: [
            'Eating',
            'Drinking',
            'Sleeping',
            'Designing',
            'Coding',
            'Cycling',
            'Running'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 90, 81, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }, {
            label: 'My Second Dataset',
            data: [28, 48, 40, 19, 96, 27, 100],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
        };
        // </block:setup>

        // <block:config:0>
        const chartConfig = {
          type: 'radar',
          data: data,
          options: {
            elements: {
              line: {
                borderWidth: 3
              }
            }
          },
        };
        var perfBarChart = new Chart(chrt, chartConfig);

    }
}



PerfDashboard.template = 'hr.perfDashboard'
registry.category('actions').add('hr.action_perf_dashboard_js', PerfDashboard)