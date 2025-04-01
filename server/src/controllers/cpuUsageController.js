const { CloudWatchClient, GetMetricStatisticsCommand } = require("@aws-sdk/client-cloudwatch");
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
const { convertTimePeriodToMs, validateAndAdjustPeriod } = require('../utils/utils');
require('dotenv').config();

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });
const cloudwatchClient = new CloudWatchClient({ region: process.env.AWS_REGION });

const getInstanceIdByIp = async (ipAddress) => {
  try {
    const command = new DescribeInstancesCommand({});
    const data = await ec2Client.send(command);
    
    const instance = data?.Reservations.flatMap(reservation => reservation.Instances)
      .find(instance =>
        instance.PublicIpAddress === ipAddress || instance.PrivateIpAddress === ipAddress
    );

    if (!instance) {
      throw new Error("Instance ID not found for the given IP.");
    }

    return instance.InstanceId;
  } catch (error) {
    console.error("Error getting instance ID:", error);
    throw new Error(`Failed to get instance ID: ${error.message}`);
  }
};

const getCpuUsageFromAws = async (ipAddress, startTime, endTime, period) => {
  try {
    const instanceId = await getInstanceIdByIp(ipAddress);
    if (!instanceId) {
      throw new Error("Could not find Instance ID for the given IP.");
    }

    const params = {
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      Period: period,
      Statistics: ["Average"],
      Dimensions: [
        {
          Name: "InstanceId",
          Value: instanceId,
        },
      ],
      StartTime: startTime,
      EndTime: endTime,
    };

    const command = new GetMetricStatisticsCommand(params);
    const data = await cloudwatchClient.send(command);
    return data.Datapoints || [];
  } catch (error) {
    console.error("Error fetching CPU usage:", error);
    throw new Error(`Failed to fetch CPU usage: ${error.message}`);
  }
};

const getCpuUsageData = async (req, res) => {
  try {
    const { ipAddress, timePeriod, period } = req.query;

    if (!ipAddress || !timePeriod || !period) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const endTime = new Date();
    const startTime = new Date(endTime - convertTimePeriodToMs(timePeriod));
    const timeDiff = (endTime - startTime) / 1000;
    const { period: adjustedPeriod, warningMessage } = validateAndAdjustPeriod(parseInt(period), timeDiff);

    const cpuData = await getCpuUsageFromAws(ipAddress, startTime, endTime, adjustedPeriod);

    if (!cpuData || cpuData.length === 0) {
      return res.status(200).json({ cpuData: [], warningMessage: "No CPU usage data available for the given time range." });
    }
    res.status(200).json({cpuData, warningMessage});
  } catch (error) {
    res.status(500).json({ message: `Error fetching CPU usage data ${error.message}` });
  }
}

module.exports = { getCpuUsageData };
