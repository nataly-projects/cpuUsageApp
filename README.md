# AWS Instance CPU Usage App

This application allows users to monitor the CPU usage of AWS EC2 instances by providing an IP address, time period, and sampling period. 
The app consists of a React-based client and an Express.js server that communicates with AWS CloudWatch to fetch the required metrics.

## Features

- **Frontend**: A user-friendly React interface for entering input parameters and visualizing CPU usage data in a chart.
- **Backend**: An Express.js server that interacts with AWS CloudWatch and EC2 APIs to retrieve CPU usage metrics.
- **Chart Visualization**: Displays CPU usage data in a responsive line chart using Recharts.
- **Validation**: Ensures all required fields are filled before submitting the form.
- **Auto-Adjustment of Period Values**: The backend automatically adjusts invalid period values to the closest valid period based on AWS CloudWatch constraints and notifies the user.
- **AWS Error Handling**: Handles errors returned by AWS services and provides meaningful feedback to the user.

## Prerequisites

- Node.js installed on your machine.
- AWS credentials with permissions to access EC2 and CloudWatch services.

## Installation

### Clone the Repository

Clone the repository:
```bash
git clone https://github.com/nataly-projects/cpuUsageApp.git
```
```bash
cd ./cpuUsageApp
```
### Server Setup
1. Navigate to the server directory:
```bash
cd ./server
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file in the server directory and configure your AWS credentials:
    - AWS_ACCESS_KEY_ID=your-access-key-id
    - AWS_SECRET_ACCESS_KEY=your-secret-access-key
    - AWS_REGION=your-region
    - AWS_IP=your-ec2-instance-ip
4. Start the server:
```bash
npm start
```
- The server will run on http://localhost:5001.

### Client Setup
1. Navigate to the client directory:
```bash
cd ./client
```
2. Install dependencies:
 ```bash
 npm install
```
3. Create a .env file in the client directory and configure the API URL:
    - REACT_APP_API_URL=http://localhost:5001/api
4. Start the client:
```bash
npm start
```
- The client will run on http://localhost:3000.

## Usage

1. Open the client application in your browser at `http://localhost:3000`.
2. Enter the required details:
    - **IP Address**: The public or private IP address of the EC2 instance.
    - **Period (seconds)**: The sampling period for the CPU usage data.
    - **Time Period**: The time range for which you want to fetch the data.
3. Click the "Load" button to fetch and display the CPU usage data in a chart.

## Example Input
- IP Address: 18.220.15.99  
- Period (seconds): 60  
- Time Period: 1h  
https://github.com/nataly-projects/cpuUsageApp/issues/2#issue-2964330085

## Example Output
Below is an example of the CPU usage graph displayed by the application:
https://github.com/nataly-projects/cpuUsageApp/issues/3#issue-2964332891

Below is an example of the CPU usage with warning graph displayed by the application:
https://github.com/nataly-projects/cpuUsageApp/issues/4#issue-2964334351

## Technologies Used

- **Frontend**: React, Material-UI, Recharts, Axios
- **Backend**: Node.js, Express.js, AWS SDK
- **Environment Management**: dotenv

## AWS SDK Usage
The backend interacts with AWS CloudWatch to retrieve CPU usage metrics using the AWS SDK for JavaScript.

#### Retrieving the Instance ID
Since CloudWatch requires the InstanceId and not the IP address, we first need to find the EC2 instance associated with the provided IP. This is done using the EC2Client from @aws-sdk/client-ec2. The backend sends a request to AWS to describe instances and filter the results based on the given IP. Once the matching instance is found, we extract its InstanceId.

📌 [AWS Docs: DescribeInstancesCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ec2/command/DescribeInstancesCommand/)


#### Fetching CPU Usage Metrics
Once we have the InstanceId, we use GetMetricStatisticsCommand from @aws-sdk/client-cloudwatch to retrieve CPU utilization data for that instance. This command fetches CPU usage statistics within the specified time period and returns the data points needed for visualization.

📌 [AWS Docs: GetMetricStatisticsCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudwatch/command/GetMetricStatisticsCommand/)

#### Adjusting Period Values
AWS CloudWatch enforces specific constraints on the period parameter depending on the requested time period. The backend includes logic to automatically adjust invalid period values to the closest valid value based on these constraints. If an adjustment is made, a warning message is displayed to the user indicating the change.


