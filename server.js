const twitter = require("twitter"),
    mongoose = require("mongoose"),
    appConfig = require("./config/twitterAPI"),
    dbConfig = require("./config/db"),
    express = require("express"),
    sentimentAnalysis = require("./controllers/sentiment"),
    Tweet = require("./models/tweet"),
    app = express();

const Twitter = new twitter(appConfig);

mongoose.connect(dbConfig.DATABASE, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("connected to db");
    }
});


// You can also get the stream in a callback if you prefer. 
Twitter.stream('statuses/filter', { track: 'bath bomb, lush, soap bar, hex bomb, soap, bath, bubble bath', language: "en" }, function(stream) {
    stream.on('data', function(event) {
        var sentimentScore = sentimentAnalysis.analyzeText(event.text);
        let tweet = new Tweet({
            userName: "@" + event.user.screen_name,
            message: event.text,
            score: sentimentScore.score,
            comparative: sentimentScore.comparative
        });
        tweet.save(function(err, tweet) {
            if (err) { throw err; }

            console.log("Saved!");
        });

        console.log(event.text);

        console.log(tweet._id);
        setTimeout(function() {
            Twitter.post('statuses/update', { status: 'Hello! ' + event.user.screen_name + " Use SUDZ10 for 10% off a our site here! http://bit.ly/sudzly" }, function(error, tweeted, response) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                console.log("Tweeted!");
            });


        }, 1000)


    });

    stream.on('error', function(error) {
        throw error;
    });
});



app.listen(8080, function(err) {
    if (err) throw err;
    console.log("server is now running");
});