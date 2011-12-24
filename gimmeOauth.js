var request = require('request');
var qs = require('querystring');
var baseUrl = 'https://gimmebar.com/api/v0';
request.defaults({json: true});

function getRequestToken(id, secret, callback) {
    var params = { client_id: id, client_secret: secret, type: 'app' };
    var url = baseUrl + '/auth/reqtoken';
    var body = qs.stringify(params);

    request.post({url: url, body: body}, function (error, response, body) {
        var object = JSON.parse(body);
        error = error || object.errors;
        if (callback) {
            return error ?
                callback(error, null) :
                callback(null, object.request_token);
        }
    });
}

function getAccessToken(id, requestToken, callback) {
    var params = { client_id: id, token: requestToken, response_type: 'code' };
    var authorizeUrl = baseUrl + '/auth/exchange/request';
    var body = qs.stringify(params);

    request.post({url: authorizeUrl, body: body}, function (error, response, body) {
        var object = JSON.parse(body);
        error = error || object.errors;
        if (callback && error) {
            return callback(error, null);
        }

        var params = { code: object.code, grant_type: 'authorization_code' };
        var accessUrl = baseUrl + '/auth/exchange/authorization';
        var body = qs.stringify(params);

        request.post({url: accessUrl, body: body}, function(error, response, body){
            var object = JSON.parse(body);
            error = error || object.errors;
            if (callback) {
                return error ?
                    callback(error, null) :
                    callback(null, object);
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

    request(options, function (error, response, body) {
        var object = JSON.parse(body);
        error = error || object.errors;
        if (callback) {
            return error ?
                callback(error, null) :
                callback(null, object);
        }
    });
}

exports.getRequestToken = getRequestToken;
exports.getAccessToken = getAccessToken;
exports.requestAPI = requestAPI;