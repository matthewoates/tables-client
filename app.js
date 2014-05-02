// global variables
// it's a hackathon. get over it
var accessToken,
    merchantId,
    employeeId,
    tables = {};

(function () {
    'use strict';

    var config = {
        clientId: 'TCFQX7K4ABKPW',
        domain: 'https://dev1.dev.clover.com/'
    };


    function redirect() {
        location.href = config.domain +
            'oauth/authorize?response_type=token&client_id=' +
            config.clientId +
            '&redirect_uri=' +
            encodeURIComponent('tables-app.com');
    }

    function getTokens() {
        var parts = location.hash.substr(1).split(/[=|&]/);

        accessToken = parts[1];
        merchantId = parts[3];
        employeeId = parts[5];
    }

    function getTableData() {
        return $.get(config.domain + 'v2/merchant/' + merchantId + '/tables?access_token=' + accessToken);
    }

    function updateTableOnServer(table) {
        var data = {
            cloverData: JSON.stringify(table)
        };

        return $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/table/' + table.id,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        });
    }

    $(function () {
        var paper = Raphael('paper', 1330, 630);

        if (!location.hash) {
            redirect();
        } else {
            // we are authenticated
            getTokens();

            getTableData().then(function (data) {
                for (var i = 0; i < data.tables.length; i++) {
                    if (!data.tables[i].section) {
                        var table = new Table(paper, data.tables[i]);

                        console.log('created table with id', table.id);
                        tables[table.id] = table;
                    }
                }
            });
        }

        $('.table-is-rect').click(function () {
            if (selectedTable) {
                selectedTable.setIsRect(this.checked);
            }
        });
    });

    function getTableDataFromNode() {
        return $.get('http://localhost:3000/tables');
    };

    setInterval(function () {
        console.log('poll');
        getTableDataFromNode().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].section) {
                    tables[data[i].id].refresh(data[i]);
                }
            }
        });
    }, 10000);
}());

var selectedTable;

function selectTable(table) {
    selectedTable = table;

    var json = JSON.parse(table.cloverData || '{}');

    $('.table-name').text(json.name);
    $('.table-is-rect').attr('checked', table.isRect);
}
