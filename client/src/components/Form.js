import React, { useState } from "react";
import { Box, Button, TextField, Typography, Select, Paper, MenuItem, FormControl, Alert, FormHelperText } from "@mui/material";
import axios from "axios";
import { fields } from "../utils/utils";


const Form = ({ onDataFetched, onLoading }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");

  const BASE_API_URL = process.env.REACT_APP_API_URL;

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });
    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    if (onLoading) {
      onLoading();
    }

    try {
      const response = await axios.get(`${BASE_API_URL}/cpu-usage`, {
        params: {...formData},
      });      
      onDataFetched(response.data);
      setValidationErrors({});
    } catch (error) {
      onDataFetched(null);
      console.error("Error fetching CPU usage:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred while fetching data. Please try again."
      );
    }
  };
  

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };


  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: '50%' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {fields.map((field) => (
          <Box key={field.name} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="h6">{field.label}{field.required && ' *'}</Typography>
            {field.type === "select" ? (
              <FormControl 
                sx={{ width: '50%' }} 
                variant="outlined" 
                error={!!validationErrors[field.name]}    
              >
                <Select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{validationErrors[field.name] || " "}</FormHelperText> 
              </FormControl>
            ) : (
              <Box sx={{ width: '50%' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  error={!!validationErrors[field.name]}
                  helperText={validationErrors[field.name]}
                  required={field.required}
                />
              </Box>
            )}
          </Box>
        ))}

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          sx={{ width: 'fit-content', padding: '10px 20px' }} >
          Load
        </Button>
      </Box>
    </Paper> 
  );

};

export default Form;
