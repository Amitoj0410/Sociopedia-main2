import { Box } from "@mui/material";
import { styled } from "@mui/system";

const SpecialWidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.1rem 1.1rem 0.5rem 1.1rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  //   ":hover": { cursor: "pointer" },
}));

export default SpecialWidgetWrapper;
