A simple module to automate authentication against the [Gimme Bar API](https://gimmebar.com/api/v0). *Warning*: I'm a total Node noob.

# How To
To use this module you must have your Gimme Bar App's `client_id` &amp; `client_secret` handy. If you don't, go get one, I'll wait. Now, lets grab a user's `requestToken`.

    var gimmeOauth = require('./gimmeOauth');
    var requestToken;
    var accessToken;
    var username;

    gimmeOauth.getRequestToken(clientId, clientSecret, function(token){
        requestToken = token;
    });
    
Once you have a user's `request token` you must exchange it for an `access token`.

    gimmeOauth.getAccessToken(clientId, requestToken, function(data) {
        accessToken = data.access_token;
        username = data.username;
    });
    
Now that we have an `access token` we can go wild! For instance, we can grab a user's profile info.
    
    gimmeOauth.requestAPI('/user', 'GET', username, accessToken, function(data) {
        console.log('user: ' + data);
    });
    
Hope this helps!

# Thanks
Shout out to [@sirevanhaas](https://twitter.com/#!/sirevanhaas) for preventing me from looking like a fool and giving me the code to encode my query strings.