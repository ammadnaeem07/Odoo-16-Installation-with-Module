{
    'name': 'Employee Performance Module',
    'author': 'Tekrevol Odoo Team',
    'data': [
        'security/ir.model.access.csv',
        'security/performance_groups.xml',
        # 'views/kpi_dashboard.xml',
        'views/menu.xml',
        'views/kpi_setup.xml',
        'views/hr_kpi_type.xml',
        'views/hr_kpi_points_tbl.xml',
        'views/hr_kpi_groups.xml',
        'views/hr_kpi_cmpd_pt.xml',
        'views/hr_emp_kpi.xml',
        'views/hr_desig_points.xml',
        'views/hr_contract.xml'
    ],
    'depends': ['hr','tek_hr_employee'],
    'assets': {
        'web.assets_backend': [
            '//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/css/bootstrap-datepicker.min.css',
            '//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/js/bootstrap-datepicker.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/1.4.0/chartjs-plugin-annotation.js',
            'tek_hr_performance/static/src/js/lib/select2/select2.full.min.js',
            'tek_hr_performance/static/src/css/lib/select2/select2.min.css',
            # 'tek_hr_performance/static/src/css/lib/chosen/chosen.min.css',
            # 'tek_hr_performance/static/src/js/lib/chosen/chosen.jquery.min.js',
            # '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css',
            # '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js',
            'tek_hr_performance/static/src/css/lib/toastr/toastr.min.css',
            'tek_hr_performance/static/src/js/lib/toastr/toastr.min.js',
            'tek_hr_performance/static/src/services/*.js',
            'tek_hr_performance/static/src/components/*/*.js',
            'tek_hr_performance/static/src/components/*/*.xml',
            'tek_hr_performance/static/src/components/*/*.scss',
            # 'tek_hr_performance/static/src/js/custom.js',
            'tek_hr_performance/static/src/css/style.css',
            'tek_hr_performance/static/src/css/lib/themify-icons.css',
            # 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js',
            # 'tek_hr_performance/static/src/css/lib/font-awesome.min.css'
            # 'https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/css/tom-select.css',
            # 'https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/js/tom-select.complete.min.js',
            # '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css',
            # '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js',

            # 'tek_hr_performance/static/src/'
            # 'tek_hr_performance/static/src/'




            # 'tek_hr_performance/static/src/js/lib/morris-chart/morris.js',
            # 'tek_hr_performance/static/src/js/lib/morris-chart/morris-init.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/excanvas.min.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.pie.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.time.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.stack.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.resize.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.crosshair.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/curvedLines.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/jquery.flot.tooltip.min.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/flot-chart-init.js',
            # 'tek_hr_performance/static/src/js/lib/flot-chart/*.js',
            # 'tek_hr_performance/static/src/js/custom.js',
            # 'tek_hr_performance/static/src/'
            # 'tek_hr_performance/static/src/'
        ],
    }
}
