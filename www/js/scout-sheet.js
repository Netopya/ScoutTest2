(function(theme) {
    document.addEventListener("deviceready", init, false);

    const HERD_ENCODE_MAP = {
        na: 0,
        herd: 1,
        collect: 2
    };

    const HERD_DECODE_MAP = {
        '0': 'na',
        '1': 'herd',
        '2': 'collect'
    };

    function encodeReport($sheet) {
        let form_data = $sheet.serializeArray().reduce((acc, cur) => {
            acc[cur.name] = cur.value;
            return acc;
        }, {});

        let output = "";

        output += form_data['team-number'].slice(0, 4).padStart(4, '0');
        output += form_data['line-cross'] ? '1' : '0';
        output += form_data['cores'];
        output += form_data['rocks'].slice(0, 3).padStart(3, '0');
        output += form_data['herd-collect'] ? HERD_ENCODE_MAP[form_data['herd-collect']] : 0;

        console.log('Encoded scout data', output);

        console.log('adding data', parseInt(output));
        console.log("String'd data", parseInt(output).toString(36));

        output = parseInt(output).toString(36);



        drawCode(output);
        decodeReport(output);

        return output;
    }

    function decodeReport(data) {

        console.log('received data', data);
        console.log('parsed data', parseInt(data, 36));


        data = parseInt(data, 36).toString().padStart(10, '0');

        console.log('decoded string', data);


        let decoded_data = {
            team_number: parseInt(data.slice(0, 4)),
            line_cross: data.slice(4, 5) === '1',
            cores: parseInt(data.slice(5, 6)),
            rocks: parseInt(data.slice(6, 9)),
            herd_collect: HERD_DECODE_MAP[data.slice(9, 10)]
        }

        console.log('decoded data', decoded_data);

        theme.collector.addReport(decoded_data);

        return decoded_data;
    }


    theme.decoder = decodeReport;

    function drawCode(data) {
        let container = $('.js-scout-sheet-encoded');
        container.empty();

        //var draw = SVG(container[0]).size('100%', '100%');

        //var qr = new QRCode(0, 0, 'NUMBER');



        //qr.addData(parseInt(data));
        //qr.make();

        //var modules = qr.getModuleCount();

        /*draw.viewbox(0, 0, modules, modules);

        for (var row = 0; row < modules; row++) {
            for (var col = 0; col < modules; col++) {
                var color = qr.isDark(row, col) ? '#000' : '#fff';
                
                draw.rect(1, 1).attr({ fill: color, x: col, y: row });
            }
        }*/

        let best_height = Math.min(window.innerHeight, window.innerWidth, 1140) * 0.8;

        var qrcode = new QRCode(container[0], {
            text: data,
            width: best_height,
            height: best_height,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        console.log('QR code', qrcode);

        $('.js-scout-result-modal').modal('show');
    }


    function init() {
        let $scout_sheet = $('.js-scout-sheet');
        $scout_sheet.on('submit', () => {
            console.log('Serialized scout sheet array', $scout_sheet.serializeArray());

            encodeReport($scout_sheet);

            return false;
        })
    }
})(window.theme = window.theme || {});

