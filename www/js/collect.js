(function(theme) {
    class Collector {
        constructor() {
            this.scout_reports = [];
            this.elements = {
                $table: $('.js-results-table'),
                $scan_trigger: $('.js-scan-report')
            }

            $(document).on('page-show.collect-page', this.refresh.bind(this));

            this.elements.$table.bootstrapTable({
                columns: [{
                    field: 'team_number',
                    title: 'Team Number'
                }, {
                    field: 'line_cross',
                    title: 'Line Cross Success',
                    formatter: (value) => (value*100).toFixed(1) + "%"
                }, {
                    field: 'cores',
                    title: 'Average Cores'
                }, {
                    field: 'rocks',
                    title: 'Average Rocks'
                }, {
                    field: 'herd_count',
                    title: 'Herd Score'
                }, {
                    field: 'collect_count',
                    title: 'Collect Score'
                }]
            });

            this.elements.$scan_trigger.on('click', () => {
                cordova.plugins.barcodeScanner.scan(
                    result => {
                        $('.js-scan-result').html("Result: " + result.text + "<br/>" +
						"Format: " + result.format + "<br/>" +
						"Cancelled: " + result.cancelled);
                        
                        //$('.js-scan-toast').toast('show');

                        $('.js-scan-console').append('scan worked!');

                        theme.decoder(result.text);

                        //alert(this.scout_reports);

                        this.refresh();
                    },
                    error => {
                        $('.js-scan-result').html('Scan Failed!' + error);
                        $('.js-scan-console').append('scan failed!');
                    }
                );

                 $('.js-scan-console').append('<strong>Scan Triggered</strong>');
            });
        }

        refresh() {
            let grouped_reports = this.scout_reports.reduce((acc, cur) => {
                if (acc[cur.team_number]) {
                    acc[cur.team_number].push(cur);
                } else {
                    acc[cur.team_number] = [cur];
                }

                return acc;
            }, {});

            let results = Object.keys(grouped_reports).map((team_number) => {
                let team_reports = grouped_reports[team_number]

                let report_count = team_reports.length;

                let team_report = team_reports.reduce((acc, cur) => {
                    acc.line_cross += cur.line_cross ? 1 : 0;
                    acc.cores += cur.cores;
                    acc.rocks += cur.rocks;
                    
                    switch(cur.herd_collect) {
                        case 'herd':
                            acc.herd_count += 1;
                            break;
                        case 'collect':
                            acc.collect_count += 1;
                            break;
                    }

                    return acc;
                }, {
                    line_cross: 0,
                    cores: 0,
                    rocks: 0,
                    herd_count: 0,
                    collect_count: 0
                });

                team_report.line_cross /= report_count;
                team_report.cores /= report_count;
                team_report.rocks /= report_count;

                team_report.team_number = team_number;

                return team_report;
            });


            this.elements.$table.bootstrapTable('removeAll');
            this.elements.$table.bootstrapTable('append',results);
        }

        addReport(report) {
            this.scout_reports.push(report);
        }
    }

    document.addEventListener("deviceready", init, false);

    function init() {
        theme.collector = new Collector();
    }

})(window.theme = window.theme || {});