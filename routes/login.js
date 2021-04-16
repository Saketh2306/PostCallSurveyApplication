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
    res.render('login/login')
})

router.post('/', (req, res) => {
    let username = req.body.email;
    let password = req.body.password;
    var message;
    var records = [];
    console.log("Entered email address: ", username);
    console.log("Entered password: ", password);
    var paramsQuery = {
    	TableName: 'users',
      	KeyConditionExpression: "email = :varString",
      	ExpressionAttributeValues: {
       		":varString": username
      	}
     };
     docClient.query(paramsQuery, function(err, data) {
        if(err)
        {
            console.log('DB lookup failed with err', err);
        }
        else
        {
            if(data.Items.length === 1)
            {
                let record = data.Items[0];
                if (username == record.email)
                {
                    if(password == record.password)
                    {
                        message = 'Successfully logged in';
                        console.log(message);
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
                            var queues = [];
                            var params1 = {
                                ProjectionExpression: "Queue_Name",
                                TableName: "Queue"
                            };
                            docClient.scan(params1, function(err, data) {
                                if(err) { console.log("DBScan error", err)}
                                else{
                                    for (var i = 0; i < data.Items.length; i++)
                                    {
                                        queues.push(data.Items[i].Queue_Name);
                                    }
                                }
                                res.render('home/home', { error: message, firstname: record.first_name, lastname: record.last_name, records, queues });
                            });
                            //res.render('home/home', { error: message, firstname: record.first_name, lastname: record.last_name, records });
                        });
                    }
                    else
                    {
                        message = 'The password you have entered is invalid, Please try again';
                        console.log(message);
                        res.render('login/login', { error: message });
                    }
                }
            }
            else
            {
                message = 'There is no member with the given email address, Please try again';
                console.log(message);
                res.render('login/login', { error: message });
            }
        }
     })
})

module.exports = router