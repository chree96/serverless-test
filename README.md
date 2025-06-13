# serverless-test
## Project Overview
The project demonstrates how to set up and organize multiple serverless services, with a focus on authentication (via Auth0) and a structured approach to deploying serverless microservices on AWS. It includes best practices for project structure, plugin usage, and secure authentication integration for a scalable serverless architecture.

## Included Services:

### auction-service:
This service is based on the Codingly.io base Serverless Framework template. It provides a consistent folder structure and integrates useful plugins such as serverless-pseudo-parameters (for CloudFormation support) and serverless-bundle (for easy ES6/TypeScript bundling).

### auth-service:
This service implements a modern Lambda Authorizer designed for use with Auth0 and the Serverless Framework. It provides both public and private endpoints for testing, supports ES6, and includes comprehensive setup instructions. Notably, it describes how to set up cross-stack authorization, allowing other microservices in the AWS account to leverage this authorizer by referencing its Lambda ARN.

### notification-service
This service handles notifications within the serverless architecture.
