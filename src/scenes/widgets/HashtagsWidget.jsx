import { Box, Typography, Divider, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "components/WidgetWrapper";
import { setHashtagPosts } from "state";

const HashtagsWidget = () => {
  const [hashtags, setHashtags] = useState(null);
  const [hashtagCounts, setHashtagCounts] = useState({});
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const dispatch = useDispatch();
  const hashtagPosts = useSelector((state) => state.hashtagPosts);

  const getHashtags = async () => {
    try {
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/hashtags`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch hashtags");
      }
      const data = await response.json();
      setHashtags(data);
      // console.log("Fetched hashtags:", data); // Debug
      // Fetch the number of posts for each hashtag
      data.forEach(async (singleTag) => {
        const count = await getNumberOfPostsByHashtags(singleTag.tag);
        setHashtagCounts((prevCounts) => ({
          ...prevCounts,
          [singleTag.tag]: count,
        }));
      });
    } catch (error) {
      console.error("Error fetching hashtags:", error.message);
    }
  };

  const getPostsByHashtags = async (tag) => {
    try {
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/hashtags/${tag}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts by hashtag");
      }
      const data = await response.json();
      dispatch(setHashtagPosts(data));
      // console.log(`Fetched posts for hashtag ${tag}:`, data); // Log to verify fetched data
    } catch (error) {
      console.error("Error fetching posts by hashtag:", error.message);
    }
  };

  const getNumberOfPostsByHashtags = async (tag) => {
    try {
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/hashtags/${tag}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts by hashtag");
      }
      const data = await response.json();
      return data.length;
    } catch (error) {
      console.error("Error fetching posts by hashtag:", error.message);
      return 0; // return 0 or an appropriate fallback value in case of an error
    }
  };

  useEffect(() => {
    getHashtags();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hashtags) {
    return null;
  }

  return (
    <WidgetWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          m: "0 0 10px 0", // Fixed margin
        }}
      >
        <Typography color={dark} variant="h4" fontWeight="500">
          Trending
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">
          <ol style={{ paddingLeft: "1rem" }}>
            {Array.isArray(hashtags) &&
              hashtags.length > 0 &&
              hashtags.map((singleTag) => (
                <li
                  key={singleTag._id}
                  style={{
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    color: dark,
                  }}
                  onClick={() => getPostsByHashtags(singleTag.tag)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = palette.primary.main)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = dark)}
                >
                  {`${singleTag.tag} (${hashtagCounts[singleTag.tag] || 0})`}
                </li>
              ))}
          </ol>
        </Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default HashtagsWidget;
