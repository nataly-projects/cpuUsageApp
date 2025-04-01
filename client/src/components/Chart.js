import React from "react";
import { Card, CardContent, Alert } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const Chart = ({ data, isLoading }) => {
  const formattedData = (!data?.cpuData || data?.cpuData?.length === 0) ? 
  [] : 
  data?.cpuData?.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)).map(item => {
    return {
      ...item,
      Timestamp: new Date(item.Timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  });

  return (
    <Card sx={{ mt: 4, p: 2, bgcolor: 'white' }}>
      {data?.warningMessage && 
      <CardContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {data?.warningMessage}
        </Alert>
      </CardContent>
      }
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
          <XAxis
              dataKey="Timestamp"
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
              label={{ value: "Time", position: "bottom", offset: 0 }}
          />
          <YAxis
              domain={[0, 3.5]}
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
              label={{ value: "Percentage", angle: -90, position: "insideLeft" }}
              tickCount={8}
          />
          <Tooltip />
          <Legend
              align="right"
              verticalAlign="top"
              iconType="rect"
              wrapperStyle={{ paddingBottom: '20px' }}
          />
          <Line
              name="Metric Data"
              type="monotone"
              dataKey="Average"
              stroke="#ff4081"
              strokeWidth={2}
              dot={{ stroke: '#ff4081', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
