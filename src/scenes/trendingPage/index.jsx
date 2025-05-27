import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendsListWidget from "scenes/widgets/FriendListWidget";
import UnknownPeopleWidget from "scenes/widgets/UnknownPeopleWidget";
import "../homePage/homepageStyles.css"; // Import the CSS file
import HashtagsWidget from "scenes/widgets/HashtagsWidget";
import PostsByHashtagWidget from "scenes/widgets/PostsByHashtagWidget";

const TrendingPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box className="homepage">
      <Box
        sx={{
          position: "fixed",
          top: "0",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        mt="5rem"
      >
        <Box flexBasis={isNonMobileScreens ? "20%" : undefined}>
          {/* <UserWidget userId={_id} picturePath={picturePath} />
          <br />
          <UnknownPeopleWidget userId={_id} /> */}
          <HashtagsWidget />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* <MyPostWidget picturePath={picturePath} userId={_id} /> */}
          <PostsByHashtagWidget />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendsListWidget userId={_id} />
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        backgroundColor="#333"
        color="#fff"
        textAlign="center"
        padding="0.5rem"
        bottom="0"
        width="100%"
      >
        <p>&copy; 2024 Amitoj Singh. All rights reserved.</p>
      </Box>
    </Box>
  );
};

export default TrendingPage;
