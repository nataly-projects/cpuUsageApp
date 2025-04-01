import React, { useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import Form from "./components/Form";
import Chart from "./components/Chart";

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataFetched = (cpuData) => {
    setData(cpuData);
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
      data?.cpuData?.length > 0 ?(
        <Chart data={data} />
      ) : (
        data?.warningMessage && (
        <Typography 
          variant="body1" 
          color="textSecondary" 
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {data?.warningMessage }
        </Typography>
        )
      )}
    </Container>
  );
};

export default App;