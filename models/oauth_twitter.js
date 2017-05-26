const OAuth = require('oauth');
const jwt = require('jsonwebtoken');
require('dotenv').config()


var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.Consumer_Key,
  process.env.Consumer_Secret,
  '1.0A',
  null,
  'HMAC-SHA1'
);



module.exports = {
  search: function(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
    oauth.get(
      'https://api.twitter.com/1.1/search/tweets.json?q=%23'+req.params.search+'&count=10',
      decoded.token, //test user token
      decoded.tokenSecret, //test user secret
      function (e, data){
        parse = JSON.parse(data)
        // let hasil = []
        // parse.forEach(function(a){
        //   hasil.push({
        //     created_at : a.created_at,
        //     name : a.user.name,
        //     text : a.text
        //   })
        // })
        e ? res.json({e}) : res.send(data)
      });
  },
  timeline: function(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
    oauth.get(
      'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+req.params.screen_name+'&count=10',
      decoded.token, //test user token
      decoded.tokenSecret, //test user secret
      function (e, data){
        data = JSON.parse(data)
        let hasil = []
        data.forEach(function(a){
          hasil.push({
            created_at : a.created_at,
            name : a.user.name,
            status : a.text
          })
        })
        e ? res.json({e}) : res.send(hasil)
      });
  },
  tweet: function(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
    oauth.post(
        `https://api.twitter.com/1.1/statuses/update.json?status=${req.body.tweet}`,
        decoded.token, //test user token
        decoded.tokenSecret, //test user secret
        req.params.status, "text",
        function (e, data){
          if (e) console.error(e);
          res.send(data)
        });
  }
}
  // oauth.get(
  //   'https://api.twitter.com/1.1/trends/place.json?id=23424977',
  //   'process.env.Access_Token', //test user token
  //   'process.env.Access_Token_secret', //test user secret
  //   function (e, data, res){
  //     if (e) console.error(e);
  //     console.log(require('util').inspect(data));
  //     done();
  //   });
