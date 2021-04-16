const express = require('express')
const aws = require('aws-sdk')
const router = express.Router()
var HashMap = require('hashmap')

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
            }
            console.log(records);
    res.render('edit/edit', { records });
    });
})

router.get('/:id', (req, res) => {
    var question_id = req.params.id;
    var paramsQuery = {
       TableName: 'SurveyQuestions',
       KeyConditionExpression: "ID = :varString",
       ExpressionAttributeValues: {
       ":varString": question_id
       }
    }
    docClient.query(paramsQuery, function(err, data) {
        if(err)
        {
            console.log("DBLookup Failed", err);
        }
        else{
            if(data.Items.length == 1)
            {
                var question = data.Items[0].Question;
                var question_type = data.Items[0].Question_Type;
                res.render('edit/save', { question_id: question_id, question: question, question_type: question_type } );
            }
        }
    })
})

router.put('/edit/:id', (req, res) => {
    res.send("Inside PUT");
    var question = req.body.question;
    var question_type = req.body.questiontype;
    console.log(question);
    console.log(question_type);
})

router.post('/', (req, res) => {
    var survey_name = req.body.select_type;
    if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
    var paramsQuery = {
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
    docClient.query(paramsQuery, function(err, data) {
        if(err){
            console.log("DBLookup failed", err);
        }
        else{
            console.log(data.Items);
            for (var i = 0; i < data.Items.length; i++)
            {
                survey_records.push(data.Items[i]);
                hashMap.set(data.Items[i].Priority, data.Items[i].Question);
                IDMap.set(data.Items[i].Priority, data.Items[i].ID);
            }
            console.log(survey_records);
            hashMap.forEach(function(value, key) {
                console.log(key + " : " + value);
            });
            IDMap.forEach(function(value, key) {
                            console.log(key + " : " + value);
                        });
            var i = 1;
            console.log(survey_records);
             res.render('edit/display', { survey_name: survey_name, survey_records: survey_records, map: hashMap, maps: IDMap});
        }
    })
})

router.get('/add/:surveyname', (req, res) => {
    /*var survey_name = req.params.surveyname;
    console.log("Add survey : ", survey_name);
    res.render('edit/add.ejs', { survey_name: survey_name} );*/
        var survey_name = req.params.surveyname;
        console.log("Survey Name: ", survey_name);
        if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
        var paramsQuery = {
           TableName: 'SurveyQuestions',
           KeyConditionExpression: "Survey_Name = :varString",
           IndexName: "Survey_Name-index",
           ExpressionAttributeValues: {
           ":varString": survey_name
           }
        };
        var length = 0;
        docClient.query(paramsQuery, function(err, data) {
            if(err){
                console.log("DBLookup failed", err);
            }
            else{
                for (var i = 0; i < data.Items.length; i++)
                {
                    length++;
                }
                res.render('edit/add.ejs', { survey_name: survey_name, priority: length + 1});
            }
        })
})

router.post('/update/:surveyname', (req, res) => {
    console.log("Req body - > ", req.body);
    console.log(req.body.textArea);
    if((new Set(req.body.questiontype)).size !== req.body.questiontype.length)
    {
        var survey_name = req.params.surveyname;
        console.log("Survey Name: ", survey_name);
        if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
        var paramsQuery = {
           TableName: 'SurveyQuestions',
           KeyConditionExpression: "Survey_Name = :varString",
           IndexName: "Survey_Name-index",
           ExpressionAttributeValues: {
           ":varString": survey_name
           }
        };
        var survey_records = [];
        var map = new HashMap();
        docClient.query(paramsQuery, function(err, data) {
            if(err){
                console.log("DBLookup failed", err);
            }
            else{
                for (var i = 0; i < data.Items.length; i++)
                {
                    survey_records.push(data.Items[i]);
                    map.set(data.Items.Priority, data.Items.Question);
                }
                console.log(survey_records);
                var message = "Please select different values for priorities";
                 res.render('edit/update', { survey_name: survey_name, survey_records: survey_records, questionMap : map, error : message});
            }
        })
    }
    else
    {
        for(var i = 0; i < req.body.questionId.length; i++)
        {
            var paramsQuery = {
                TableName: 'SurveyQuestions',
                Key: {
                    "ID": req.body.questionId[i]
                },
                UpdateExpression: "set Priority = :q",
                ExpressionAttributeValues: {
                    ":q": req.body.questiontype[i]
                },
              ReturnValues: "UPDATED_NEW"
            };
            docClient.update(paramsQuery, function(err, data){
                if(err) { console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2)); }
                else{
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

                }
            })
        }
        sleep(1000).then(() => {
            var survey_name = req.params.surveyname;
            console.log("Survey Name: ", survey_name);
            if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
            var paramsQuery = {
               TableName: 'SurveyQuestions',
               KeyConditionExpression: "Survey_Name = :varString",
               IndexName: "Survey_Name-index",
               ExpressionAttributeValues: {
               ":varString": survey_name
               }
            };
            var survey_records = [];
            var map = new HashMap();
            var IDMap = new HashMap();
            docClient.query(paramsQuery, function(err, data) {
                if(err){
                    console.log("DBLookup failed", err);
                }
                else{
                    for (var i = 0; i < data.Items.length; i++)
                    {
                        survey_records.push(data.Items[i]);
                        map.set(data.Items[i].Priority, data.Items[i].Question);
                        IDMap.set(data.Items[i].Priority, data.Items[i].ID);
                    }
                    console.log(survey_records);
                    var message = "null";
                     res.render('edit/display', { survey_name: survey_name, survey_records: survey_records, map : map, maps: IDMap, error : message});
                }
            })
        });
    }
    console.log(req.body.questiontype);
    console.log(req.body.questiontype[0]);
    //var question1 = req.body.1;
    //console.log(question1);
})

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

router.get('/update/:surveyname', (req, res) => {
    var survey_name = req.params.surveyname;
    console.log("Req Body - >  ", req.body);
    console.log("Survey Name: ", survey_name);
    if (survey_name == 'Molina') { survey_name = 'Molina HealthCare'; }
    var paramsQuery = {
       TableName: 'SurveyQuestions',
       KeyConditionExpression: "Survey_Name = :varString",
       IndexName: "Survey_Name-index",
       ExpressionAttributeValues: {
       ":varString": survey_name
       }
    };
    var survey_records = [];
    var map = new HashMap();
    var IDMap = new HashMap();
    docClient.query(paramsQuery, function(err, data) {
        if(err){
            console.log("DBLookup failed", err);
        }
        else{
            for (var i = 0; i < data.Items.length; i++)
            {
                survey_records.push(data.Items[i]);
                map.set(data.Items[i].Priority, data.Items[i].Question);
                IDMap.set(data.Items[i].Priority, data.Items[i].ID);
            }
            console.log(survey_records);
            var message = null;
             res.render('edit/update', { survey_name: survey_name, survey_records: survey_records, map : map, maps: IDMap, error: message});
        }
    })
})

router.post('/add/:surveyname', (req, res) => {
    console.log(req.body);
    var question = req.body.question;
    var question_type = req.body.questiontype;
    var survey_name = req.params.surveyname;
    var priority = req.body.priority;
    var date = new Date().toISOString().split('T')[0];
    var timestamp = Date.now();
    var question_id = timestamp.toString();
    console.log("Question: " , question);
    console.log("Question Type: " , question_type);
    console.log("Survey Name: " , survey_name);
    console.log("Priority: ", priority);
    console.log("Date: " , date);
    console.log("Time Stamp: " , question_id);
    var params = {
    TableName: 'SurveyQuestions',
    Item: {
      "ID": question_id,
      "CreateDate": date,
      "Question": question,
      "Question_Type": question_type,
      "Survey_Name": survey_name,
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
    sleep(1000).then(() => {
    var paramsQuery2 = {
        TableName: 'SurveyQuestions',
        KeyConditionExpression: "Survey_Name = :varString",
        IndexName: "Survey_Name-index",
        ExpressionAttributeValues: {
        ":varString": survey_name
        }
    };
    var survey_records = [];
    var map = new HashMap();
    var IDMap = new HashMap();
    docClient.query(paramsQuery2, function(err, data) {
    if(err){
      console.log("DBLookup failed", err);
    }
    else{
        for (var i = 0; i < data.Items.length; i++)
        {
            survey_records.push(data.Items[i]);
            map.set(data.Items[i].Priority, data.Items[i].Question);
            IDMap.set(data.Items[i].Priority, data.Items[i].ID);
        }
        console.log(survey_records);
        res.render('edit/display', { survey_name: survey_name, survey_records: survey_records, map: map, maps: IDMap});
    }
  })
  });
})

router.get('/remove/:id', (req, res) => {
    var question_id = req.params.id;
    console.log("Removing ID : " , question_id);
    var paramsQuery = {
    TableName: 'SurveyQuestions',
    Key: {
        "ID": question_id
    },
    ConditionExpression: "ID = :val",
    ExpressionAttributeValues: {
        ":val" : question_id
    }
    };
    docClient.delete(paramsQuery, function(err, data) {
    if (err) {console.log("Unable to delete item", err);}
    else{
        console.log("Deleted Item sucesfully", JSON.stringify(data, null, 2));
    }
    });

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
                var tempMap = new HashMap();
                var IDMap = new HashMap();
                docClient.query(paramsQuery2, function(err, data) {
                    if(err){
                        console.log("DBLookup failed", err);
                    }
                    else{
                        for (var i = 0; i < data.Items.length; i++)
                        {
                            survey_records.push(data.Items[i]);
                            tempMap.set(data.Items[i].Question, data.Items[i].Priority);
                            hashMap.set(data.Items[i].Priority, data.Items[i].Question);
                            IDMap.set(data.Items[i].Priority, data.Items[i].ID);
                        }
                        console.log(survey_records);
                        console.log("Temp Map: ", tempMap);
                        console.log(hashMap);
                        console.log(IDMap);
                        res.render('edit/display', { survey_name: survey_name, survey_records: survey_records, map: hashMap, maps: IDMap})
                    }
                })
            }
        }
    })
})

module.exports = router