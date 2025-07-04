import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  VideoCameraBackOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  TextField,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const MyPostWidget = ({ picturePath, userId }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [isVideo, setIsVideo] = useState(false); //new
  const [video, setVideo] = useState(null); //new
  const [post, setPost] = useState("");
  const { palette, breakpoints } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const navigate = useNavigate();
  const [createPostBtnClicked, setCreatePostBtnClicked] = useState(false);
  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));
  const isMd = useMediaQuery(breakpoints.only("md"));

  const size = isXs ? "48px" : isSm ? "55px" : "60px";

  const handlePost = async () => {
    try {
      setCreatePostBtnClicked(true);
      // Replace newline characters with the appropriate sequence for the backend

      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        // formData.append("picturePath", image.name);
      }
      if (video) {
        formData.append("video", video);
        // formData.append("videoPath", video.name);
      }
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/posts`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) {
        console.log("kutta");
        throw new Error("Network response was not ok");
      }

      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);
      setVideo(null);
      setIsImage(false);
      setIsVideo(false);
      setPost("");
      setCreatePostBtnClicked(false);
    } catch (err) {
      console.error("Error during uploading post:", err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Prevent the default behavior of the Enter key
      e.preventDefault();

      // Append a newline character to the current post value
      setPost((prevPost) => prevPost + "\n");
    }
  };

  return (
    <WidgetWrapper mb="1.5rem">
      <FlexBetween gap="1rem">
        <Box
          sx={{ "&:hover": { cursor: "pointer" } }}
          onClick={() => {
            navigate(`/profile/${userId}`);
          }}
        >
          <UserImage image={picturePath} size={size} />
        </Box>
        <TextField
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          variant="standard"
          onKeyDown={handleKeyDown}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            // padding: "1rem 2rem",
            padding: {
              xs: "0.7rem 1.2rem", // Mobile: smaller padding
              sm: "0.75rem 1.5rem", // Tablet
              md: "1rem 2rem", // Laptop/Desktop (default)
            },
          }}
          multiline
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {isVideo && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp4"
            multiple={false}
            onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!video ? (
                    <p>Add Video Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{video.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {video && (
                  <IconButton
                    onClick={() => setVideo(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ marginY: "1.15rem" }} />

      <FlexBetween>
        <FlexBetween
          gap="0.25rem"
          onClick={() => {
            setIsImage(!isImage);
            setIsVideo(false);
          }}
        >
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween
          gap="0.25rem"
          onClick={() => {
            setIsVideo(!isVideo);
            setIsImage(false);
          }}
        >
          <VideoCameraBackOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Video
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            {/* <FlexBetween gap="0.25rem"></FlexBetween> */}

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post || createPostBtnClicked}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "0.5rem",
          }}
        >
          {createPostBtnClicked && (
            <ClipLoader color={palette.neutral.dark} size={17} />
          )}
          {!createPostBtnClicked && <>POST</>}
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
