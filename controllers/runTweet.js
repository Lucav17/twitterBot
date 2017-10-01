const Tweet = require("../models/tweet"),
    appConfig = require("../config/twitterAPI"),
    twitter = require("twitter");

const Twitter = new twitter(appConfig);


setInterval(function() {
    Tweet.findOne({}, function(err, tweet) {
        if (err) { throw err }
        if (tweet.score > 3 && !tweet.retweet) {
            Twitter.post('statuses/retweet/', { id: tweet.messageID }, function(error, response) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                tweet.remove();
            });
        } else {
            Twitter.post('statuses/update', { status: 'Hello! ' + tweet.userName + ", check out our bath bomb and soap bar subscriptions and use SUDZ10 for 10% off your order! http://bit.ly/sudzly" }, function(error, tweeted, response) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                tweet.remove();
            });
        }
    });

}, 40000);