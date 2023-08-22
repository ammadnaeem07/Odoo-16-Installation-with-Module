//import { _onChangeDesig } from '../components/kpi_entry/kpi_entry.js';
//const parse = require('../components/kpi_entry/kpi_entry');

(function(){
    $('.select2').select2()
    $(document.body).on("change","#empDesig",function(){
//     alert(this.value);
     $.ajax({
            type: "POST",
            url: "/kpi/entry",
            data: {
                'id': this.value
            },
//            dataType: "json",
            success: function(response) {
                alert(response.message);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
     });
//     _onChangeDesig()
    });
})();