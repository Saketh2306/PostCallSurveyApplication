const express = require('express')
const aws = require('aws-sdk')
const router = express.Router()

let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIA4QBLLSYMKH4BY4FS", "secretAccessKey": "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"
};
aws.config.update(awsConfig);
const docClient = new aws.DynamoDB.DocumentClient()

router.get('/', (req, res) => {

    res.render('create/create')
})

router.post('/', (req, res) => {
    console.log(req.body);
    var select_value = req.body.select_type;
    var questions = [];
    var question_type = [];
    if (select_value == '1')
    {
        var surveyname = req.body.surveyname;
        var question1 = req.body.question1[0];
        var questiontype1 = req.body.questiontype1[0];
        var priority = req.body.priority1[0];
        var date = new Date().toISOString().split('T')[0];
        var timestamp = Date.now();
        var question_id = timestamp.toString();
        var params = {
        TableName: 'SurveyTable',
        Item: {
          "Survey_ID": question_id,
          "CreateDate": date,
          "Survey_Name": surveyname
        }
      };
        console.log("Adding a new item: ");
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var params = {
        TableName: 'SurveyQuestions',
        Item: {
          "ID": question_id,
          "CreateDate": date,
          "Question": question1,
          "Question_Type": questiontype1,
          "Survey_Name": surveyname,
          "Priority": priority
        }
      };
        console.log("Adding a new item: ");
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

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
    }

    else if (select_value == '2')
    {
        var surveyname = req.body.surveyname;
        var question1 = req.body.question1[1];
        console.log('Question 1: ', question1);
        var questiontype1 = req.body.questiontype1[1];
        console.log('Question Type 1: ', questiontype1)
        var priority1 = req.body.priority1[1];
        var question2 = req.body.question2[0];
        console.log('Question 2: ', question2);
        var questiontype2 = req.body.questiontype2[0];
        console.log('Question Type 2: ', questiontype2);
        var priority2 = req.body.priority2[0];
        var questionrank = [ question1, question2 ];
        var questiontyperank = [ questiontype1, questiontype2 ];
        var date = new Date().toISOString().split('T')[0];
        var timestamp = Date.now();
        var question_id = timestamp.toString();
            var params = {
            TableName: 'SurveyTable',
            Item: {
              "Survey_ID": question_id,
              "CreateDate": date,
              "Survey_Name": surveyname
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

            var params = {
            TableName: 'SurveyQuestions',
            Item: {
              "ID": question_id,
              "CreateDate": date,
              "Question": question1,
              "Question_Type": questiontype1,
              "Survey_Name": surveyname,
              "Priority": priority1
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

            var date = new Date().toISOString();
            var timestamp = Date.now();
            var question_id = timestamp.toString();

            var params = {
            TableName: 'SurveyQuestions',
            Item: {
              "ID": question_id,
              "CreateDate": date,
              "Question": question2,
              "Question_Type": questiontype2,
              "Survey_Name": surveyname,
              "Priority": priority2
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

         var records = [];
         var params = {
             ProjectionExpression: "Survey_Name",
             TableName: "SurveyTable"
         };
         docClient.scan(params, function(err, data) {
             if(err) { console.log("DBScan error", err)}
             else{
                  for (var i = 0; i < data.Items.length; i++)
                  {
                    records.push(data.Items[i].Survey_Name);
                    }
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

             }
             console.log(records);
             //res.render('home/home', { records : records });
         });
    }

    else if (select_value == '3')
    {
        var surveyname = req.body.surveyname;
        var question1 = req.body.question1[2];
        var questiontype1 = req.body.questiontype1[2];
        var priority1 = req.body.priority1[2];
        var question2 = req.body.question2[1];
        var questiontype2 = req.body.questiontype2[1];
        var priority2 = req.body.priority2[1];
        var question3 = req.body.question3[0];
        var questiontype3 = req.body.questiontype3[0];
        var priority3 = req.body.priority3[0];
        var questionrank = [question1, question2, question3];
        var questiontyperank = [questiontype1, questiontype2, questiontype3];
        var date = new Date().toISOString();
        var timestamp = Date.now();
        var question_id = timestamp.toString();

            var params = {
            TableName: 'SurveyTable',
            Item: {
              "Survey_ID": question_id,
              "CreateDate": date,
              "Survey_Name": surveyname
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

            var params = {
            TableName: 'SurveyQuestions',
            Item: {
              "ID": question_id,
              "CreateDate": date,
              "Question": questionrank[0],
              "Question_Type": questiontyperank[0],
              "Survey_Name": surveyname,
              "Priority": priority1
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

            var date = new Date().toISOString();
            var timestamp = Date.now();
            var question_id = timestamp.toString();

            var params = {
            TableName: 'SurveyQuestions',
            Item: {
              "ID": question_id,
              "CreateDate": date,
              "Question": questionrank[1],
              "Question_Type": questiontyperank[1],
              "Survey_Name": surveyname,
              "Priority": priority2
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

            var date = new Date().toISOString();
            var timestamp = Date.now();
            var question_id = timestamp.toString();

            var params = {
            TableName: 'SurveyQuestions',
            Item: {
              "ID": question_id,
              "CreateDate": date,
              "Question": questionrank[2],
              "Question_Type": questiontyperank[2],
              "Survey_Name": surveyname,
              "Priority": priority3
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });

         var records = [];
         var params = {
             ProjectionExpression: "Survey_Name",
             TableName: "SurveyTable"
         };
         docClient.scan(params, function(err, data) {
             if(err) { console.log("DBScan error", err)}
             else{
                  for (var i = 0; i < data.Items.length; i++)
                  records.push(data.Items[i].Survey_Name);
             }
             console.log(records);
             res.render('home/home', { records : records });
         });

    }

    else if (select_value == '4')
    {
        var surveyname = req.body.surveyname;
        var question1 = req.body.question1[3];
        var questiontype1 = req.body.questiontype1[3];
        var question2 = req.body.question2[2];
        var questiontype2 = req.body.questiontype2[2];
        var question3 = req.body.question3[1];
        var questiontype3 = req.body.questiontype3[1];
        var question4 = req.body.question4[0];
        var questiontype4 = req.body.questiontype4[0];
        var questionrank = [question1, question2, question3, question4];
        var questiontyperank = [questiontype1, questiontype2, questiontype3, questiontype4];
        var date = new Date().toISOString();
        var timestamp = Date.now();
        var question_id = timestamp.toString();
            var params = {
            TableName: 'SurveyTable',
            Item: {
              "Survey_ID": question_id,
              "CreateDate": date,
              "Survey_Name": surveyname
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });
    }

    else
    {
        var surveyname = req.body.surveyname;
        var question1 = req.body.question1[4];
        var questiontype1 = req.body.questiontype1[4];
        var question2 = req.body.question2[3];
        var questiontype2 = req.body.questiontype2[3];
        var question3 = req.body.question3[2];
        var questiontype3 = req.body.questiontype3[2];
        var question4 = req.body.question4[1];
        var questiontype4 = req.body.questiontype4[1];
        var question5 = req.body.question5;
        var questiontype5 = req.body.questiontype5;
        var questionrank = [question1, question2, question3, question4, question5];
        var questiontyperank = [questiontype1, questiontype2, questiontype3, questiontype4, questiontype5];
        var date = new Date();
        var timestamp = Date.now();
        var question_id = timestamp.toString();
            var params = {
            TableName: 'SurveyTable',
            Item: {
              "Survey_ID": question_id,
              "CreateDate": date,
              "Survey_Name": surveyname
            }
          };
            console.log("Adding a new item: ");
            docClient.put(params, function(err, data) {
                if (err) {
                 console.error("Unable to add an item", JSON.stringify(err, null, 2));
                }
                else
                {
                 console.log("Added the item: ", JSON.stringify(data, null, 2));
                }
            });
    }
})

module.exports = router