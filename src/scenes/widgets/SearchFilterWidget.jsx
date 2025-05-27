import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  useMediaQuery,
  Divider,
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { setSearchType } from "state";

const SearchFilterWidget = () => {
  const searchType = useSelector((state) => state.searchType);
  // const [selectedBtn, setSelectedBtn] = useState(searchType);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  // const { palette } = useTheme();
  const dispatch = useDispatch();

  const handlePeopleClick = () => {
    // setSelectedBtn("people");
    dispatch(setSearchType("people"));
  };

  const handlePostsClick = () => {
    // setSelectedBtn("posts");
    dispatch(setSearchType("posts"));
  };

  return (
    <WidgetWrapper sx={{ mb: "1.5rem" }}>
      <FlexBetween
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem",
          p: "0.1rem",
        }}
      >
        <Box>
          <Typography variant="h4">Search Filters</Typography>
          <Divider />
        </Box>
        <ButtonGroup
          orientation={isNonMobileScreens ? "vertical" : "horizontal"}
          sx={{ gap: "1rem" }}
        >
          <Button
            onClick={handlePeopleClick}
            variant={searchType === "people" ? "contained" : "outlined"}
          >
            People
          </Button>
          {/* <Divider /> */}
          <Button
            onClick={handlePostsClick}
            variant={searchType === "posts" ? "contained" : "outlined"}
          >
            Posts
          </Button>
        </ButtonGroup>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default SearchFilterWidget;
