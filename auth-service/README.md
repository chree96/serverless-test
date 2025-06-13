# auth-service
This project provides a modern, ES6-compatible Lambda Authorizer, ready to be integrated with the Serverless Framework and Auth0. The service is based on the official Serverless example for custom authorizers with Auth0.

## Features
- Test front-end application
- Private endpoint to test authentication protection
- Public endpoint to test open accessibility
- ES6-friendly codebase

## Getting Started
### 1. Clone the repository (or generate a serverless project)
```sh
sls create --name auth-service --template-url https://github.com/codingly-io/serverless-auth0-authorizer
cd auth-service
```

### 2. Install dependencies
```sh
npm install
```

### 3. Create the secret.pem file
This file must contain your Auth0 public certificate, which is required to verify JWT tokens. Create a secret.pem file in the root directory of the project and paste your public certificate inside.

### 4. Deploy the stack
To test both the public and private endpoints, deploy the stack:

```sh
sls deploy -v
```

### 5. Final Test
To confirm everything is working, send a POST request (using curl, Postman, etc.) to the private endpoint with a test token obtained from Auth0. Make sure to include the token in the headers like this:

Code
"Authorization": "Bearer YOUR_TOKEN"
If everything is set up correctly, you should receive a valid response.

### Bonus: Cross-stack Authorization
This is especially useful in a microservices architecture. For example, you can centralize authentication in this service and use it as an authorizer for other Lambda functions in the same AWS account.

To do so, just specify the ARN of the authorizer function in the configuration of your other functions:

YAML
functions:
  someFunction:
    handler: src/handlers/someFunction.handler
    events:
      - http:
          method: POST
          path: /something
          authorizer: arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:sls-auth-service-draft-dev-auth

If the setup is correct, all requests to the specified Lambda will be authorized using this service. JWT claims will be available in event.requestContext.authorizer.
