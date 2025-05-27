import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Import the CSS file

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        // backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          sx={{
            "&:hover": {
              cursor: "pointer",
              color: theme.palette.primary.light,
            },
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          Sociopedia
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="0.25rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        className="form-container"
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Sociopedia, the Social Media for Sociopaths!
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
