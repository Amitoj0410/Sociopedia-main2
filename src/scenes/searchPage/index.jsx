import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import SearchFilterWidget from "scenes/widgets/SearchFilterWidget";
import { useSelector } from "react-redux";
import LoadSearchResults from "scenes/widgets/LoadSearchResults";
import AdvertWidget from "scenes/widgets/AdvertWidget";

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const searchType = useSelector((state) => state.searchType);
  const searchValue = useSelector((state) => state.searchValue);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "15%" : undefined}>
          <SearchFilterWidget />
        </Box>
        <Box flexBasis={isNonMobileScreens ? "46%" : undefined}>
          <LoadSearchResults type={searchType} value={searchValue} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="22%">
            <AdvertWidget />
            {/* <Box m="2rem 0" /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
