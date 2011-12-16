A simple module to automate authentication against the [Gimme Bar API](https://gimmebar.com/api/v0). *Warning*: I'm a total Node noob.

# How To
To use this module you must have your Gimme Bar App's `client_id` &amp; `client_secret` handy. If you don't, go get one, I'll wait. Now, lets grab a user's `requestToken`.

    var gimmeOauth = require('./gimmeOauth');
    var requestToken;

    gimmeOauth.getRequestToken(clientId, clientSecret, function(token){
        requestToken = token;
    });
    
Once you have a user's `requestToken` you can go wild! For instance, you can grab a user's tags.

    gimmeOauth.authenticateAndRetrieve('/tags', clientId, requestToken, function(data) {
        console.log(data);
    });
    
Hope this helps!

# Thanks
Shout out to [@sirevanhaas](https://twitter.com/#!/sirevanhaas) for preventing me from looking like a fool and giving me the code to encode my query strings.