import React, { useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import Form from "./components/Form";
import Chart from "./components/Chart";

const App = () => {
  const [cpuData, setCpuData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataFetched = (data) => {
    setCpuData(data);
    setIsLoading(false);
  };

  const handleLoading = () => {
    setIsLoading(true); 
  };

  return (
    <Container sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h5" gutterBottom sx={{mb: 2}}>
          Aws Instance CPU Usage
      </Typography>
      <Form onDataFetched={handleDataFetched} onLoading={handleLoading} />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) 
      :
      cpuData?.cpuData?.length > 0 ?(
        <Chart data={cpuData} />
      ) : (
        cpuData?.warningMessage && (
        <Typography 
          variant="body1" 
          color="textSecondary" 
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {cpuData?.warningMessage }
        </Typography>
        )
      )}
    </Container>
  );
};

export default App;