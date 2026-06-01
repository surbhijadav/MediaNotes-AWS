const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  accessKeyId: "test",
  secretAccessKey: "test"
});

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const note = {
    id: uuidv4(),
    title: body.title,
    content: body.content,
    createdAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: "NotesTable",
    Item: note
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(note)
  };
};