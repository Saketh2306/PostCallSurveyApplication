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
    var records = [];
    var params = {
        ProjectionExpression: "Survey_Name",
        TableName: "SurveyTable"
    };
    docClient.scan(params, function(err, data) {
       if(err) { console.log("DBScan error", err) }
       else{
            for (var i = 0; i < data.Items.length; i++){
                records.push(data.Items[i].Survey_Name);
                }
            }
       var queues = [];
       var params = {
            ProjectionExpression: "Queue_Name",
            TableName: "Queue"
       };
       docClient.scan(params, function(err, data) {
            if (err) { console.log("DBScan Error", err); }
            else {
                for (var i = 0; i < data.Items.length; i++){
                    queues.push(data.Items[i].Queue_Name);
                }
            }
            console.log("Queues", queues)
            console.log("Records", records)
        res.render('queue/queue', { records, queues });
       });
    });
})

router.post('/', (req, res) => {
    var survey_name = req.body.survey_type;
    if (survey_name == "Molina")
    {
        survey_name = "Molina HealthCare";
    }
    var select_value = req.body.select_type;
    if (select_value == '1')
    {
        var queue1 = req.body.queue1;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue1", queue1);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue1[0],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
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
             res.render('home/home', { records });
         });
    }
    else if (select_value == '2')
    {
        var queue1 = req.body.queue1;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue1", queue1);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue1[1],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var queue2 = req.body.queue2;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue2", queue2);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue2[0],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
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
             res.render('home/home', { records });
         });
    }
    else if(select_value == '3')
    {
        var queue1 = req.body.queue1;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue1", queue1);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue1[2],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var queue2 = req.body.queue2;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue2", queue2);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue2[1],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var queue3 = req.body.queue3;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue3", queue3);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue3[0],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
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
             res.render('home/home', { records });
         });
    }
    else
    {
        var queue1 = req.body.queue1;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue1", queue1);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue1[3],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var queue2 = req.body.queue2;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue2", queue2);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue2[2],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var queue3 = req.body.queue3;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue3", queue3);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue3[1],
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
        docClient.put(params, function(err, data) {
            if (err) {
             console.error("Unable to add an item", JSON.stringify(err, null, 2));
            }
            else
            {
             console.log("Added the item: ", JSON.stringify(data, null, 2));
            }
        });

        var queue4 = req.body.queue4;
        var date = new Date();
        var timestamp = Date.now();
        var queue_id = timestamp.toString();
        console.log("Queue4", queue4);
        var params = {
        TableName: 'SurveyQueues',
        Item: {
          "ID": queue_id,
          "Queue_Name": queue4,
          "Survey_Name": survey_name,
          "Survey_State": "Active"
        }
      };
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
             res.render('home/home', { records });
         });
    }
})

module.exports = router