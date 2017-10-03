const Tweet = require("../models/tweet"),
    appConfig = require("../config/twitterAPI"),
    twitter = require("twitter");

const Twitter = new twitter(appConfig);

function tweetArray(number, userName) {
    var array = [
        'Hello! ' + userName + ", check out our bath bomb and soap bar subscriptions and use SUDZ10 for 10% off your order! http://bit.ly/sudzly",
        'We think you might enjoy our bath time subscription service ' + userName + '! Use SUDZ10 for 10% off your order! http://bit.ly/sudzly',
        'Hey ' + userName + '! Check out our bath time subscription service and use SUDZ10 for 10% off your order! http://bit.ly/sudzly',
        'Hi ' + userName + '! We think you\'ll like our bath time subscription service! Use SUDZ10 for 10% off your order! http://bit.ly/sudzly',
        'We know you\'ll love our bath time subsription service ' + userName + '! Use SUDZ10 for 10% off your order! http://bit.ly/sudzly',
        'Try our our bath bomb and soap bar subscription severce ' + userName + ' and get 10% off with code SUDZ10 http://bit.ly/sudzly',
        'Check out our bath bomb and soap bar subscription severce ' + userName + ' and get 10% off with code SUDZ10 http://bit.ly/sudzly',
        'Hey ' + userName + '! See the bath bombs and soap bars everyone is raving about here and get 10% off! http://bit.ly/sudzly',
        'Hello ' + userName + '! See the bath bombs and soap bars everyone is raving about here and get 10% off! http://bit.ly/sudzly',
        'Hi ' + userName + '! See the bath bombs and soap bars everyone is raving about here and get 10% off! http://bit.ly/sudzly'
    ];
    return array[number];
};

function quoteTweet(number, link) {
    var array = [
        'Love it! ',
        'Wow! ',
        'This is great! ',
        'We feel you ',
        '',
        'Wonderful! ',
        'Yup! ',
        'Interesting ',
        'We agree ',
        'Great! ',
        "Very cool! ",
        "Nice! ",
        "Cool! "
    ]

    return array[number];
}

function randomizer() {
    var rand = Math.random();
    if (rand < .5) {
        return 70000 - Math.floor(Math.random() * 20000);
    }
    return 70000 + Math.floor(Math.random() * 20000);

}


setInterval(function() {
    var rand = Math.floor(Math.random() * 20);
    Tweet.findOne({}, function(err, tweet) {
        if (err) { console.log(err); }
        if (rand < 6 && !tweet.retweet) {
            Twitter.post('statuses/retweet/', { id: tweet.messageID }, function(error, response) {
                if (error) {
                    console.log(error);
                }
                console.log("retweet");
            });
        } else if (rand >= 6 && rand < 11) {
            if (rand < 9) {
                Twitter.post('statuses/update', { status: tweetArray(Math.floor(Math.random() * 10), tweet.userName) }, function(error, tweeted, response) {
                    if (error) {
                        console.log(error);
                    }
                    console.log("did it");
                });
            } else {
                Twitter.post('statuses/update', { status: quoteTweet(Math.floor(Math.random() * 12)) + tweet.link }, function(error, tweeted, response) {
                    if (error) {
                        console.log(error);
                    }
                    console.log("did it")
                });
            }
        } else if (rand >= 11 && rand < 16) {
            Twitter.post('favorites/create', { id: tweet.messageID }, function(err, response) {
                // if there was an error while 'favorite'
                if (err) {
                    console.log('CANNOT BE FAVORITE... Error');
                } else {
                    console.log('FAVORITED... Success!!!');
                }
            });
        } else {
            Twitter.post('friendships/create', { screen_name: tweet.userName }, function(err, response) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(tweet.userName, ': **FOLLOWED**');
                }
            });
        }
        tweet.remove();
    });

}, randomizer());