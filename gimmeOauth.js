var request = require('request');
var baseUrl = 'https://gimmebar.com/api/v0';

function getRequestToken(id, secret, callback) {
	var url = baseUrl + '/auth/reqtoken?' + buildQueryString({ 'client_id': id, 'client_secret': secret, 'type': 'app' });
	var jsonified;
	
	request.post(url, function(e, r, body){
		jsonified = JSON.parse(body);
		
		if (callback) {
			callback.call(this, jsonified.request_token);
		}
	});
}

function authenticateAndRetrieve(url, id, requestToken, callback) {
	var authorizeUrl = baseUrl + '/auth/exchange/request?' + buildQueryString({ 'client_id': id, 'token': requestToken, 'response_type': 'code' });
	var accessUrl;
	var jsonified;

	request.post(authorizeUrl, function(e, r, body){
		jsonified = JSON.parse(body);
		accessUrl = baseUrl + '/auth/exchange/authorization?' + buildQueryString({ 'code': jsonified.code, 'grant_type': 'authorization_code' });
		
		request.post(accessUrl, function(e, r, body){
			jsonified   = JSON.parse(body);
			var auth    = 'Basic ' + new Buffer(jsonified.username + ':' + jsonified.access_token).toString('base64');
			var headers = { 
				'Host': baseUrl, 
				'Authorization': auth 
			};
			
			request.get({
				'url': baseUrl + url,
				'headers': headers
			}, function(e, r, body){
				jsonified = JSON.parse(body);
				
				if (callback) {
					callback.call(this, jsonified);
				}
			});
		});
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
exports.authenticateAndRetrieve = authenticateAndRetrieve;