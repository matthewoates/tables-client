(function () {
    'use strict';

    var config = {
        clientId: 'TCFQX7K4ABKPW',
        domain: 'https://dev1.dev.clover.com/'
    };

    var accessToken,
        merchantId,
        employeeId;

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

        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/table/' + table.id,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        });
    }

    if (!location.hash) {
        redirect();
    } else {
        // we are authenticated
        getTokens();

        getTableData().then(function (data) {
            for (var i = 0; i < data.tables.length; i++) {
                updateTableOnServer(data.tables[i]);
            }
        });
    }
}());