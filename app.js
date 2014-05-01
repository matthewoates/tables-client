(function () {
    'use strict';

    var config = {
        clientId: 'TCFQX7K4ABKPW',
        domain: 'https://dev1.dev.clover.com/'
    };

    var accessToken,
        merchantId,
        employeeId;

    var jsonRequest = function (type, url, data) {
        if (csrf) {
            url += '?_csrfToken=' + csrf;
        }

        return $.ajax({
            type: type,
            url: url,
            data: JSON.stringify(data || {}),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        });
    }

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

    if (!location.hash) {
        redirect();
    } else {
        // we are authenticated
        getTokens();
    }
}());