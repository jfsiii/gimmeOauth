var request = require('request');
var baseUrl = 'https://gimmebar.com/api/v0';

function getRequestToken(id, secret, callback) {
    var params = { client_id: id, client_secret: secret, type: 'app' };
    var url = baseUrl + '/auth/reqtoken?' + buildQueryString(params);
    var jsonified;

    request.post(url, function (error, response, body) {
        if (error && callback) {
            callback(error);
        }
        jsonified = JSON.parse(body);

        if (callback) {
            callback.call(this, jsonified.request_token);
        }
    });
}

function getAccessToken(id, requestToken, callback) {
    var params = { client_id: id, token: requestToken, response_type: 'code' };
    var authorizeUrl = baseUrl + '/auth/exchange/request?' + buildQueryString(params);
    var accessUrl;
    var jsonified;

    request.post(authorizeUrl, function (error, response, body) {
        if (error && callback) {
            callback(error);
        }
        jsonified = JSON.parse(body);
        params = { code: jsonified.code, grant_type: 'authorization_code' };
        accessUrl = baseUrl + '/auth/exchange/authorization?' + buildQueryString(params);

        request.post(accessUrl, function(e, r, body){
            jsonified = JSON.parse(body);

            if (callback) {
                callback.call(this, jsonified);
            }
        });
    });
}

function requestAPI(url, method, username, accessToken, callback) {
    var auth    = 'Basic ' + new Buffer(username + ':' + accessToken).toString('base64');
    var headers = {
        Host: baseUrl,
        Authorization: auth
    };
    var options = {
        method: method,
        url: baseUrl + url,
        headers: headers
    };
    var jsonified;

    request(options, function (error, response, body) {
        if (error && callback) {
            callback(error);
        }
        jsonified = JSON.parse(body);

        if (callback) {
            callback(jsonified);
        }
    });
}

function buildQueryString(params) {
    var out = [];

    for (var k in params) {
        out.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    }

    return out.join('&');
}

exports.getRequestToken = getRequestToken;
exports.getAccessToken = getAccessToken;
exports.requestAPI = requestAPI;