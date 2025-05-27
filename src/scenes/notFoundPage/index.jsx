import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "scenes/navbar";

const NotFoundPage = () => {
  return (
    <Box>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
      >
        <Typography variant="h1" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          The page you are looking for might be in another universe.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="error"
          size="large"
        >
          Go back home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
