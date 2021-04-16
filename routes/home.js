const express = require('express')
const router = express.Router()
const aws = require('aws-sdk')
var Set = require("set")
var HashMap = require("hashmap");
let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIA4QBLLSYMKH4BY4FS", "secretAccessKey": "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"
};
aws.config.update(awsConfig);
const docClient = new aws.DynamoDB.DocumentClient()

router.get('/', (req, res) => {
    var records = [];
    var params = {
        ProjectionExpression: "Survey_Name",
        TableName: "SurveyTable"
    };
    docClient.scan(params, function(err, data) {
        if(err) { console.log("DBScan error", err)}
        else{
             for (var i = 0; i < data.Items.length; i++){
                 records.push(data.Items[i].Survey_Name);
             }
             console.log(records);
             var queues = []
             var params1 = {
                ProjectionExpression: "Queue_Name",
                TableName: "Queue"
                };
             docClient.scan(params1, function(err, data) {
                if(err) {console.log("DBScan error", err)}
                else{
                    for (var i = 0; i < data.Items.length; i++){
                        queues.push(data.Items[i].Queue_Name);
                    }
                 res.render('home/home', { records, queues });
                }
            });
             //res.render('home/home', { records });
              }
    });
    //res.render('home/home.ejs')
})

router.post('/', (req, res) => {
    var survey_name = req.body.select_type;
    var from_date = req.body.from;
    var to_date = req.body.to;
    var queue = req.body.queue_type;
    console.log("From Date", from_date);
    console.log("To Date", to_date);
    if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
    console.log("Survey Name: " , survey_name);
    if(queue == "All")
    {
        var paramsQuery = {
            TableName: 'Questions',
            IndexName: 'CreateDate-index',
            FilterExpression: "CreateDate BETWEEN :fromDate AND :toDate AND Survey_Name = :survey",
            ExpressionAttributeValues: {
                ':fromDate': from_date,
                ':toDate': to_date,
                ':survey': survey_name,
            },
        };
    }
    else{
    var paramsQuery = {
        TableName: 'Questions',
        IndexName: 'CreateDate-index',
        FilterExpression: "CreateDate BETWEEN :fromDate AND :toDate AND Survey_Name = :survey AND Queue_Name = :queue",
        ExpressionAttributeValues: {
            ':fromDate': from_date,
            ':toDate': to_date,
            ':survey': survey_name,
            ':queue': queue,
        },
    };
    }
    docClient.scan(paramsQuery, function(err, data) {
        if(err)
        {
            console.log("DB Lookup failed", err);
        }
        else
        {
            var yes_count = 0;
            var no_count = 0;
            var rating_1 = 0;
            var rating_2 = 0;
            var rating_3 = 0;
            var rating_4 = 0;
            var rating_5 = 0;
            var total_rating = 0;
            var total_participation = 0;
            var comments = [];
            var data_length = 0;
            var opting = new Set();
            var optingMap = new HashMap();
            var callRatingMap = new HashMap();
            for (var i = 0; i < data.Items.length; i++)
            {
                if (data.Items[i].Question_Type == "Opting_Survey")
                {
                    //opting.add(question_object);
                    optingMap.set(data.Items[i].Question, data.Items[i].Question_Type);
                    opting.add(data.Items[i].Question);
                    if (data.Items[i].Response == "Yes")
                    {
                        yes_count = yes_count + 1;
                    }
                    if (data.Items[i].Response == "No")
                    {
                        no_count = no_count + 1;
                    }
                    total_participation = total_participation + 1;
                }
                if (data.Items[i].Question_Type == "Call_Rating")
                {
                    callRatingMap.set(data.Items[i].Question, data.Items[i].Question_Type);
                    if (data.Items[i].Response == '1')
                    {
                        rating_1 = rating_1 + 1;
                    }
                    if (data.Items[i].Response == '2')
                    {
                        rating_2 = rating_2 + 1;
                    }
                    if (data.Items[i].Response == '3')
                    {
                        rating_3 = rating_3 + 1;
                    }
                    if (data.Items[i].Response == '4')
                    {
                        rating_4 = rating_4 + 1;
                    }
                    if (data.Items[i].Response == '5')
                    {
                        rating_5 = rating_5 + 1;
                    }
                    total_rating = total_rating + 1;
                }
                if (data.Items[i].Question_Type == "Comment")
                {
                    comments.push(data.Items[i]);
                }
                data_length = data_length + 1;
            }
            var opting_yes_count = 0;
            optingMap.forEach(function(value, key) {
                var opting_yes_count = 0;
                var opting_no_count = 0;
                for(var i = 0; i < data.Items.length; i++)
                {
                    if(data.Items[i].Question_Type == "Opting_Survey" && data.Items[i].Question == key)
                    {
                        if(data.Items[i].Response == "Yes")
                        {
                            opting_yes_count += 1;
                        }
                        if(data.Items[i].Response == "No")
                        {
                            opting_no_count += 1;
                        }
                    }
                }
                var count = {
                    yes : opting_yes_count,
                    no :  opting_no_count
                };
                optingMap.set(key, count);
            });

            callRatingMap.forEach(function(value, key) {
                var call_rating_1 = 0;
                var call_rating_2 = 0;
                var call_rating_3 = 0;
                var call_rating_4 = 0;
                var call_rating_5 = 0;
                var total_ratings = 0;
                for(var i = 0; i < data.Items.length; i++)
                {
                    if(data.Items[i].Question_Type == "Call_Rating" && data.Items[i].Question == key)
                    {
                        if(data.Items[i].Response == '1')
                        {
                            call_rating_1 += 1;
                            total_ratings += 1
                        }
                        if(data.Items[i].Response == '2')
                        {
                            call_rating_2 += 1;
                            total_ratings += 1;
                        }
                        if(data.Items[i].Response == '3')
                        {
                            call_rating_3 += 1;
                            total_ratings += 1;
                        }
                        if(data.Items[i].Response == '4')
                        {
                            call_rating_4 += 1;
                            total_ratings += 1;
                        }
                        if(data.Items[i].Response == '5')
                        {
                            call_rating_5 += 1;
                            total_ratings += 1;
                        }
                    }
                }
                var average_rating = (call_rating_1*1 + call_rating_2*2 + call_rating_3*3 + call_rating_4*4 + call_rating_5*5) / total_ratings;
                var count = {
                    rating_1 : call_rating_1,
                    rating_2 : call_rating_2,
                    rating_3 : call_rating_3,
                    rating_4 : call_rating_4,
                    rating_5 : call_rating_5,
                    total_ratings : total_ratings,
                    average : average_rating
                };
                callRatingMap.set(key, count);
            });

                var yes_percentage = ( yes_count / total_participation ) * 100;
                var no_percentage = ( no_count / total_participation ) * 100;
                var rating_1_percentage = ( rating_1 / total_rating ) * 100;
                var rating_2_percentage = ( rating_2 / total_rating ) * 100;
                var rating_3_percentage = ( rating_3 / total_rating ) * 100;
                var rating_4_percentage = ( rating_4 / total_rating ) * 100;
                var rating_5_percentage = ( rating_5 / total_rating ) * 100;
                var average_rating = ( (rating_1*1) + (rating_2*2) + (rating_3*3) + (rating_4*4) + (rating_5*5) ) / total_rating;
                //var data_length = data.Items.length;

            var paramsQuery1 = {
            TableName: 'SurveyQuestions',
            KeyConditionExpression: "Survey_Name = :varString",
            IndexName: "Survey_Name-index",
            ExpressionAttributeValues: {
            ":varString": survey_name
            }
            };
            var question_type = [];
            docClient.query(paramsQuery1, function(err, data) {
                    if(err) {console.log('DB Lookup Failed', err); }
                    else
                    {
                        for (var i = 0 ; i < data.Items.length; i++)
                        {
                            question_type.push(data.Items[i].Question_Type);
                        }
                        console.log(question_type);
                        console.log("Yes Count: ", yes_count);
                        console.log("No Count: " , no_count);
                        console.log("Rating 1 count: " , rating_1);
                        console.log("Rating 2 count: ", rating_2);
                        console.log("Data Length: ", data_length);
                        console.log("Rating 3 count: ", rating_3);
                        console.log("Rating 4 count: ", rating_4);
                        console.log("Rating 5 count: ", rating_5);
                        console.log("Total Participation: ", total_participation);
                        console.log("Total Rating: ", total_rating);
                        console.log("Opting Set: ", opting);
                        for(var x in opting.Set)
                        {
                            console.log("Question: ", x);
                        }
                        console.log(optingMap);
                        optingMap.forEach(function(value, key) {
                            console.log(key + " : " + value);
                            console.log(value.yes);
                            console.log(value.no);
                        });
                        callRatingMap.forEach(function(value, key) {
                            console.log(key + " : " + value);
                            console.log(value.rating_1);
                            console.log(value.rating_2);
                            console.log(value.rating_3);
                            console.log(value.rating_4);
                            console.log(value.rating_5);
                        });
                        //var array = opting.toArray();
                        //console.log("Set Array: ", array);
                        console.log(question_type);
                        res.render('report/report', { callRatingMap : callRatingMap, optingMap: optingMap, survey: survey_name, yes_count, no_count, rating_1, rating_2, rating_3, rating_4, rating_5, yes_percentage, no_percentage, rating_1_percentage, rating_2_percentage, rating_3_percentage, rating_4_percentage, rating_5_percentage, queue, comments, average_rating, question_type, total_rating, total_participation, data_length, from_date, to_date } );
                    }
                    });
            //res.render('report/report', { survey: survey_name, yes_count, no_count, rating_1, rating_2, rating_3, rating_4, rating_5, yes_percentage, no_percentage, rating_1_percentage, rating_2_percentage, rating_3_percentage, rating_4_percentage, rating_5_percentage, queue, comments} );
        }
    });
    /*var paramsQuery = {
       TableName: 'Questions',
       KeyConditionExpression: "Survey_Name = :varString",
       IndexName: "Survey_Name-index",
       ExpressionAttributeValues: {
       ":varString": survey_name
       }
    };

    var paramsQuery1 = {
       TableName: 'SurveyQuestions',
       KeyConditionExpression: "Survey_Name = :varString",
       IndexName: "Survey_Name-index",
       ExpressionAttributeValues: {
       ":varString": survey_name
       }
    };

    docClient.query(paramsQuery, function(err, data) {
        if(err) { console.log('DB Lookup Failed', err) }
        else{
                console.log("Data: " , data.Items)
                    var question_type = [];
                    docClient.query(paramsQuery1, function(err, data) {
                    if(err) {console.log('DB Lookup Failed', err); }
                    else
                    {
                        for (var i = 0 ; i < data.Items.length; i++)
                        {
                            question_type.push(data.Items[i].Question_Type);
                        }
                        console.log(question_type);
                        res.render('report/report', { survey: survey_name, query_data: data.Items, question_type: question_type} );
                    }
                    });
                //console.log(question_type);
                //res.render('report/report', { survey: survey_name, query_data: data.Items, question_type: question_type} );
        }
    });*/
})

module.exports = router