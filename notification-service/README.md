# notification-service
The notification-service is a microservice within the serverless-test project, responsible for handling email notifications in a serverless AWS environment.

## Overview
This service is designed to receive notification requests (such as auction results) from other microservices via AWS SQS, and to send emails using Amazon Simple Email Service (SES). It is commonly used in conjunction with services like auction-service, which send messages to a queue when a user needs to be notified.

## Features
Asynchronous Email Delivery: Listens to an SQS queue for email notification messages.
AWS SES Integration: Sends transactional emails using Amazon SES.
Microservice Integration: Works alongside other microservices—such as auction-service—to provide user notifications (e.g., auction won/lost).

## How It Works
Another service (e.g., auction-service) sends a message to the SQS queue with the email details (recipient, subject, body).
notification-service receives the event, extracts the email data, and sends the email via SES.

### Example SQS Message Payload
``` sh
{
  "subject": "Auction Result",
  "recipient": "user@example.com",
  "body": "Congratulations! You won the auction."
}
```

### Example: Email Sending Logic 
``` sh
const ses = new AWS.SES({ region: "eu-west-1" });

async function sendMail(event) {
  const email = JSON.parse(event.Records[0].body);
  const params = {
    Source: "your_verified_sender@example.com",
    Destination: { ToAddresses: [email.recipient] },
    Message: {
      Body: { Text: { Data: email.body } },
      Subject: { Data: email.subject }
    }
  };
  await ses.sendEmail(params).promise();
}
```

## Getting started
### 1. Install dependencies
``` sh
npm install
```

### 2. Configure AWS credentials with SES and SQS permissions.

### 3. Deploy the stack using the Serverless Framework:
``` sh
sls deploy
```

## Usage 
This service is intended to be triggered by SQS events. Other services should send messages to the configured SQS queue with the required email details.
