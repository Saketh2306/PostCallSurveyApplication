const express = require('express')
const router = express.Router()
const aws = require('aws-sdk')
var HashMap = require('hashmap')
let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIA4QBLLSYMKH4BY4FS", "secretAccessKey": "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"
};
aws.config.update(awsConfig);
const docClient = new aws.DynamoDB.DocumentClient()

router.get('/', (req, res) => {
})

router.post('/:id', (req, res) => {
    var question_id = req.params.id;
    console.log("Question ID: ", question_id);
    var question = req.body.question;
    var question_type = req.body.questiontype;
    console.log("Question: ", question);
    console.log("Question Type: " , question_type);
    var low = req.body.low;
    var high = req.body.high;
    var paramsQuery = {
        TableName: 'SurveyQuestions',
        Key: {
            "ID": question_id
        },
        UpdateExpression: "set Question = :q, Question_Type = :qt, low = :l, high = :h",
        ExpressionAttributeValues: {
            ":q": question,
            ":qt": question_type,
            ":l": low,
            ":h": high
        },
      ReturnValues: "UPDATED_NEW"
    };

    docClient.update(paramsQuery, function(err, data){
        if(err) { console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2)); }
        else{
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

        }
    })

    var paramsQuery1 = {
       TableName: 'SurveyQuestions',
       KeyConditionExpression: "ID = :varString",
       ExpressionAttributeValues: {
       ":varString": question_id
       }
    }
    docClient.query(paramsQuery1, function(err, data) {
        if(err)
        {
            console.log("DBLookup Failed", err);
        }
        else{
            if(data.Items.length == 1)
            {
                var survey_name = data.Items[0].Survey_Name;
                var paramsQuery2 = {
                   TableName: 'SurveyQuestions',
                   KeyConditionExpression: "Survey_Name = :varString",
                   IndexName: "Survey_Name-index",
                   ExpressionAttributeValues: {
                   ":varString": survey_name
                   }
                };
                var survey_records = [];
                var hashMap = new HashMap();
                var IDMap = new HashMap();
                docClient.query(paramsQuery2, function(err, data) {
                    if(err){
                        console.log("DBLookup failed", err);
                    }
                    else{
                        for (var i = 0; i < data.Items.length; i++)
                        {
                            survey_records.push(data.Items[i]);
                            hashMap.set(data.Items[i].Priority, data.Items[i].Question);
                            IDMap.set(data.Items[i].Priority, data.Items[i].ID);
                        }
                        console.log(survey_records);
                        res.render('edit/display', { survey_name: survey_name, survey_records: survey_records, map: hashMap, maps: IDMap})
                    }
                })
            }
        }
    })
})

module.exports = router