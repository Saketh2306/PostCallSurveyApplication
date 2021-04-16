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
        res.render('activate/activate', { records, queues });
       });
    });
})

router.post('/update/:surveyname', (req, res) => {
    var survey_name = req.params.surveyname;
    var queue_id = {}
    queue_id = req.query;
    console.log(queue_id.ID);
    console.log(queue_id.queue);
    console.log(JSON.stringify(req.query));
    console.log(survey_name);
    console.log(queue_id);
    var change = req.body.queue;
    console.log(change);
    if (change == 1)
    {
        var state = "Active";
    }
    if (change == 0)
    {
        var state = "Inactive";
    }
    console.log("State", state);
    var paramsQuery = {
        TableName: 'SurveyQueues',
        Key: {
            "ID": queue_id.ID
        },
        UpdateExpression: "set Survey_State = :q",
        ExpressionAttributeValues: {
            ":q": state,
        },
      ReturnValues: "UPDATED_NEW"
    };

    docClient.update(paramsQuery, function(err, data){
        if(err) { console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2)); }
        else{
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

        }
    })

  sleep(1000).then(() => {
    var paramsQuery = {
       TableName: 'SurveyQueues',
       KeyConditionExpression: "Survey_Name = :varString",
       IndexName: "Survey_Name-index",
       ExpressionAttributeValues: {
       ":varString": survey_name
       }
    };
    var survey_records = [];
    docClient.query(paramsQuery, function(err, data) {
        if(err){
            console.log("DBLookup failed", err);
        }
        else{
            for (var i = 0; i < data.Items.length; i++)
            {
                survey_records.push(data.Items[i]);
            }
            console.log(survey_records);
             res.render('display/activedisplay', { survey_name: survey_name, survey_records: survey_records})
        }
    })
  });

})

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

router.post('/', (req, res) => {
    var survey_name = req.body.select_type;
    if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
    var paramsQuery = {
       TableName: 'SurveyQueues',
       KeyConditionExpression: "Survey_Name = :varString",
       IndexName: "Survey_Name-index",
       ExpressionAttributeValues: {
       ":varString": survey_name
       }
    };
    var survey_records = [];
    docClient.query(paramsQuery, function(err, data) {
        if(err){
            console.log("DBLookup failed", err);
        }
        else{
            for (var i = 0; i < data.Items.length; i++)
            {
                survey_records.push(data.Items[i]);
            }
            console.log(survey_records);
             res.render('display/activedisplay', { survey_name: survey_name, survey_records: survey_records})
        }
    })
})

module.exports = router