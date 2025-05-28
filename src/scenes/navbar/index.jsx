import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  FormControl,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  Tooltip,
  Button,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
// import { makeStyles } from "@mui/"
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu as MenuIcon,
  Close,
  SearchOutlined,
  CloseOutlined,
  Tag,
  TagSharp,
  AccountCircleRounded,
  LogoutRounded,
  LogoutSharp,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  setLogout,
  setSearchType,
  setFriends,
  removeNotification,
  setNotifications,
} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { setSearchValue } from "state";
import UserImage from "components/UserImage";
import { SnackbarProvider, useSnackbar } from "notistack";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  // console.log(notifications);
  const searchValue = useSelector((state) => state.searchValue);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1093px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const primary = theme.palette.primary.main;
  const alt = theme.palette.background.alt;
  const main = theme.palette.neutral.main;
  const medium = theme.palette.neutral.medium;
  const [searchInput, setSearchInput] = useState("");
  const [searchedPeople, setSearchedPeople] = useState([]);
  const fullName = `${user.firstName} ${user.lastName}`;
  const fullNameInitial = `${user.firstName.charAt[0]}`;
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();
  const [acceptingRequest, setAcceptingRequest] = useState(false);
  const [decliningRequest, setDecliningRequest] = useState(false);
  const [removingNotification, setRemovingNotification] = useState(false);

  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));

  // ? New Code - 25 MAy 2025
  const [searching, setSearching] = useState(false);

  const handleOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl2(null);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/notifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const newNotifications = await response.json();
        dispatch(setNotifications(newNotifications));
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 5000); // Fetch notifications every 5 seconds
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [notifications]);

  // const handleSearchChange = (e) => {
  //   setSearchInput(e.target.value);
  // };

  // const handleSearchKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  // const handleSearch = () => {
  //   if (searchInput.trim().length > 0) {
  //     dispatch(setSearchValue(searchInput.trim()));
  //     dispatch(setSearchType("people"));
  //     navigate("/search");
  //   }
  // };

  const searchOnChange = async (e) => {
    setSearching(true);
    try {
      const value = e.target.value;
      setSearchInput(value);

      if (value.length > 0) {
        dispatch(setSearchValue(value));
        dispatch(setSearchType("people"));

        const response = await fetch(
          `https://socialpedia-serverr.onrender.com/users/search?firstName=${value}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const users = await response.json();
        setSearchedPeople(users); // Update to use users directly
        // console.log(users);
      } else {
        setSearchedPeople([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.length > 0) {
      dispatch(setSearchValue(searchInput));
      dispatch(setSearchType("people"));
      navigate("/search");
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const acceptRequest = async (userId, friendId, notificationId) => {
    try {
      setAcceptingRequest(true);
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends/${friendId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedFriends = await response.json();
        dispatch(setFriends({ friends: updatedFriends }));

        // Remove notification from backend
        const removeResponse = await fetch(
          `http://localhost:3001/users/${userId}/removeNotification/${notificationId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!removeResponse.ok) {
          console.error("Failed to remove notification from backend");
        }
      } else {
        console.error("Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setAcceptingRequest(false);
    }
  };

  const declineRequest = async (userId, friendId, notificationId) => {
    try {
      setDecliningRequest(true);
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends/${friendId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedFriends = await response.json();
        dispatch(setFriends({ friends: updatedFriends }));

        // Remove notification from backend
        const removeResponse = await fetch(
          `http://localhost:3001/users/${userId}/removeNotification/${notificationId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!removeResponse.ok) {
          console.error("Failed to remove notification from backend");
        }
      } else {
        console.error("Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setDecliningRequest(false);
    }
  };

  // useEffect(() => {}, [notifications]);

  const removeNotif = async (userId, notificationId) => {
    try {
      setRemovingNotification(true);
      const removeResponse = await fetch(
        `http://localhost:3001/users/${userId}/removeNotification/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!removeResponse.ok) {
        console.error("Failed to remove notification from backend");
      }
    } catch (error) {
      console.error("Error removing notification:", error);
    } finally {
      setRemovingNotification(false);
    }
  };

  return (
    <FlexBetween padding="0.8rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Sociopedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween gap={1}>
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="0.2rem"
              padding="0 1rem"
              position="relative"
            >
              <InputBase
                placeholder="Search..."
                value={searchInput}
                onChange={searchOnChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                sx={{
                  fontSize: "16px",
                  padding: "8px",
                  height: "40px",
                  width: "200px",
                }}
              />
              <IconButton
                onClick={() => {
                  setSearchedPeople([]);
                  setSearchInput("");
                }}
              >
                <CloseOutlined />
              </IconButton>
              {/* {searchedPeople.length > 0 && (
              )} */}

              <Box
                position="absolute"
                top="100%"
                left="0"
                width="100%"
                backgroundColor={neutralLight}
                boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                borderRadius="9px"
                zIndex="1000"
                mt={1}
                display={searching ? "flex" : "none"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CircularProgress size={30} sx={{ my: "8px" }} />
              </Box>
              <Box
                position="absolute"
                top="100%"
                left="0"
                width="100%"
                backgroundColor={neutralLight}
                boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                borderRadius="9px"
                zIndex="1000"
                mt={1}
                display={
                  !searching && searchInput.length > 0 ? "block" : "none"
                }
              >
                {searchedPeople.length > 0 ? (
                  <List>
                    {searchedPeople.map((person) => (
                      <ListItem
                        key={person._id}
                        onClick={() => navigate(`/profile/${person?._id}`)}
                        sx={{
                          "&:hover": {
                            backgroundColor: primaryLight,
                            cursor: "pointer",
                          },
                        }}
                      >
                        <FlexBetween gap={1}>
                          <UserImage image={person.picturePath} size="40px" />
                          <Box>
                            <Typography color={main} variant="h5">
                              {`${person.firstName} ${person.lastName}`}
                            </Typography>
                            <Typography color={medium}>
                              {person.occupation}
                            </Typography>
                          </Box>
                        </FlexBetween>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <List
                    sx={{
                      my: "5px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    No results found
                  </List>
                )}
              </Box>
            </FlexBetween>
            <FlexBetween>
              <IconButton
                onClick={handleSearch}
                sx={{ border: "1px solid grey" }}
              >
                <SearchOutlined />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <Button
            variant="outlined"
            color={"error"}
            onClick={() => navigate("/trending")}
          >
            Trending
          </Button>
          <Tooltip title={<Typography fontSize={13}>Mode</Typography>} arrow>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "30px" }} />
              ) : (
                <LightMode sx={{ fontSize: "30px" }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip
            title={<Typography fontSize={13}>Notifications</Typography>}
            arrow
          >
            <IconButton
              onClick={handleNotificationClick}
              aria-controls={open ? "notification-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Badge
                badgeContent={
                  notifications.length > 0 ? notifications.length : null
                }
                color="secondary"
              >
                <Notifications sx={{ fontSize: "30px" }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            id="notification-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 1,
              sx: {
                mt: 1.5,
                "& .MuiList-root": {
                  minWidth: "20ch",
                },
              },
            }}
          >
            {notifications?.length === 0 ? (
              <MenuItem disabled>No notifications</MenuItem>
            ) : (
              notifications.map((notification) => (
                <React.Fragment key={notification._id}>
                  <MenuItem
                    onClick={() => {
                      navigate(`/profile/${notification.fromUser._id}`);
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <Avatar
                          src={notification.fromUser.picturePath}
                          sx={{ width: 50, height: 50 }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Box>
                          <Typography variant="subtitle1">
                            {`${notification.fromUser.firstName} ${notification.fromUser.lastName}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {notification.type === "friend_request" &&
                              notification.fromUser.occupation}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {notification.type === "friend_request" &&
                              notification.fromUser.location}
                          </Typography>
                          {notification.type === "friend_request" && (
                            <Typography variant="body2" color="primary" mt={1}>
                              Friend Request
                            </Typography>
                          )}
                          {notification.type === "post_liked" && (
                            <>
                              <Typography
                                variant="body2"
                                color="primary"
                                mt={1}
                              >
                                Liked your post
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {notification.post.description}
                              </Typography>
                            </>
                          )}
                          {notification.type === "post_commented" && (
                            <>
                              <Typography
                                variant="body2"
                                color="primary"
                                mt={1}
                              >
                                Commented on your post:
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Comment: </strong>
                                {Array.isArray(notification?.post?.comments) &&
                                  notification?.post?.comments?.find(
                                    (comment) =>
                                      comment.id === notification.commentId
                                  )?.body}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Post: </strong>
                                {notification.post.description}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Grid>
                      {notification.type === "friend_request" && (
                        <Grid item>
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                            ml={2}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                acceptRequest(
                                  user._id,
                                  notification.fromUser._id,
                                  notification._id
                                );
                                dispatch(removeNotification(notification._id));
                                enqueueSnackbar("Friend Request Accepted", {
                                  variant: "success",
                                });
                              }}
                              disabled={acceptingRequest}
                            >
                              {acceptingRequest ? (
                                <CircularProgress
                                  size={isXs || isSm ? 20 : 30}
                                />
                              ) : (
                                <>Accept</>
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                declineRequest(
                                  user._id,
                                  notification.fromUser._id,
                                  notification._id
                                );
                                dispatch(removeNotification(notification._id));
                                enqueueSnackbar("Friend Request Declined", {
                                  variant: "warning",
                                });
                              }}
                            >
                              Decline
                            </Button>
                          </Box>
                        </Grid>
                      )}
                      {notification.type !== "friend_request" && (
                        <>
                          {notification?.post?.picturePath && (
                            <Grid item>
                              <Box>
                                <img
                                  src={notification?.post?.picturePath} // URL of the image to display
                                  alt="Notification"
                                  style={{
                                    width: "60px", // Adjusted size for larger image
                                    height: "60px", // Adjusted size for larger image
                                    borderRadius: "8px", // Rounded corners
                                    objectFit: "cover", // Ensure image covers the specified dimensions
                                  }}
                                />
                              </Box>
                            </Grid>
                          )}
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeNotification(notification._id));
                              // Remove from backend as well
                              removeNotif(user._id, notification._id);
                              enqueueSnackbar("Notification Removed", {
                                variant: "info",
                              });
                            }}
                            sx={{
                              border: "1px solid #ccc", // Light gray border
                              borderRadius: "50%", // Rounded corners
                              padding: "4px", // Adding some padding for better spacing
                              "&:hover": {
                                borderColor: "#888", // Darker gray on hover
                              },
                              ml: "10px",
                              mt: "5px",
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      )}
                    </Grid>
                  </MenuItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </Menu>
          <Tooltip title={<Typography fontSize={13}>About</Typography>} arrow>
            <IconButton>
              <Help sx={{ fontSize: "30px" }} />
            </IconButton>
          </Tooltip>
          <Box>
            <IconButton onClick={handleOpen}>
              <Avatar
                alt={fullName}
                src={fullNameInitial}
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "primary.main",
                  color: "white",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl2}
              open={Boolean(anchorEl2)}
              onClose={handleClose}
            >
              {/* <MenuItem disabled>
                  <Typography>{fullName}</Typography>
                </MenuItem> */}
              <MenuItem
                onClick={() => {
                  navigate("/profile/edit");
                  handleClose();
                }}
              >
                <AccountCircleRounded sx={{ mr: "5px" }} />
                <Typography>Edit Profile</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/");
                  handleClose();
                }}
              >
                <LogoutSharp sx={{ mr: "5px" }} />
                <Typography>Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Badge
            badgeContent={
              notifications.length > 0 ? notifications.length : null
            }
            color="secondary"
          >
            <MenuIcon />
          </Badge>
        </IconButton>
      )}
      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton onClick={() => navigate("/trending")}>
              <TagSharp sx={{ fontSize: "30px" }} />
            </IconButton>
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "30px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "30px" }} />
              ) : (
                <LightMode sx={{ fontSize: "30px" }} />
              )}
            </IconButton>
            <IconButton>
              <Message sx={{ fontSize: "30px" }} />
            </IconButton>
            <IconButton
              onClick={handleNotificationClick}
              aria-controls={open ? "notification-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Badge
                badgeContent={
                  notifications.length > 0 ? notifications.length : null
                }
                color="secondary"
              >
                <Notifications sx={{ fontSize: "30px" }} />
              </Badge>
            </IconButton>
            <Dialog
              open={Boolean(anchorEl)}
              onClose={handleNotificationClose}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  height: "70vh",
                  mt: 6,
                  overflow: "hidden",
                },
              }}
            >
              <DialogTitle>
                Notifications
                <IconButton
                  aria-label="close"
                  onClick={handleNotificationClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 0, overflowY: "auto" }}>
                {notifications?.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body1">No notifications</Typography>
                  </Box>
                ) : (
                  <List>
                    {notifications.map((notification) => (
                      <React.Fragment key={notification._id}>
                        <ListItem
                          button
                          onClick={() => {
                            navigate(`/profile/${notification.fromUser._id}`);
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                            py: 2,
                            px: 2,
                          }}
                        >
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                              <Avatar
                                src={notification.fromUser.picturePath}
                                sx={{ width: 50, height: 50 }}
                              />
                            </Grid>
                            <Grid item xs>
                              <Box>
                                <Typography variant="subtitle1">
                                  {`${notification.fromUser.firstName} ${notification.fromUser.lastName}`}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {notification.type === "friend_request" &&
                                    notification.fromUser.occupation}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {notification.type === "friend_request" &&
                                    notification.fromUser.location}
                                </Typography>
                                {notification.type === "friend_request" && (
                                  <Typography
                                    variant="body2"
                                    color="primary"
                                    mt={1}
                                  >
                                    Friend Request
                                  </Typography>
                                )}
                                {notification.type === "post_liked" && (
                                  <>
                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      mt={1}
                                    >
                                      Liked your post
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {notification.post.description}
                                    </Typography>
                                  </>
                                )}
                                {notification.type === "post_commented" && (
                                  <>
                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      mt={1}
                                    >
                                      Commented on your post
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      <strong>Comment: </strong>
                                      {Array.isArray(
                                        notification?.post?.comments
                                      ) &&
                                        notification?.post?.comments?.find(
                                          (comment) =>
                                            comment.id ===
                                            notification.commentId
                                        )?.body}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      <strong>Post: </strong>
                                      {notification.post.description}
                                    </Typography>
                                  </>
                                )}
                              </Box>
                            </Grid>
                            {notification.type === "friend_request" && (
                              <Grid item>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={1}
                                  ml={2}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acceptRequest(
                                        user._id,
                                        notification.fromUser._id,
                                        notification._id
                                      );
                                      dispatch(
                                        removeNotification(notification._id)
                                      );
                                      enqueueSnackbar(
                                        "Friend Request Accepted",
                                        {
                                          variant: "success",
                                        }
                                      );
                                    }}
                                    disabled={acceptingRequest}
                                  >
                                    {acceptingRequest ? (
                                      <CircularProgress
                                        size={isXs || isSm ? 20 : 30}
                                      />
                                    ) : (
                                      <>Accept</>
                                    )}
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      declineRequest(
                                        user._id,
                                        notification.fromUser._id,
                                        notification._id
                                      );
                                      dispatch(
                                        removeNotification(notification._id)
                                      );
                                      enqueueSnackbar(
                                        "Friend Request Declined",
                                        {
                                          variant: "warning",
                                        }
                                      );
                                    }}
                                  >
                                    Decline
                                  </Button>
                                </Box>
                              </Grid>
                            )}
                            {notification.type !== "friend_request" && (
                              <>
                                {notification?.post?.picturePath && (
                                  <Grid item>
                                    <Box>
                                      <img
                                        src={notification?.post?.picturePath}
                                        alt="Notification"
                                        style={{
                                          width: "60px",
                                          height: "60px",
                                          borderRadius: "8px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                )}
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      removeNotification(notification._id)
                                    );
                                    removeNotif(user._id, notification._id);
                                    enqueueSnackbar("Notification Removed", {
                                      variant: "info",
                                    });
                                  }}
                                  sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "50%",
                                    padding: "4px",
                                    "&:hover": {
                                      borderColor: "#888",
                                    },
                                    ml: "10px",
                                    mt: "5px",
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </>
                            )}
                          </Grid>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </DialogContent>
            </Dialog>

            <IconButton>
              <Help sx={{ fontSize: "30px" }} />
            </IconButton>
            {/* <FormControl variant="standard">
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/profile/edit");
                  }}
                >
                  <AccountCircleRounded sx={{ mr: "5px" }} />
                  <Typography>Edit Profile</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                  }}
                >
                  <LogoutSharp sx={{ mr: "5px" }} />
                  <Typography>Log Out</Typography>
                </MenuItem>
              </Select>
            </FormControl> */}
            <Box>
              <IconButton onClick={handleOpen}>
                <Avatar
                  alt={fullName}
                  src={fullNameInitial}
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleClose}
              >
                {/* <MenuItem disabled>
                  <Typography>{fullName}</Typography>
                </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    navigate("/profile/edit");
                    handleClose();
                  }}
                >
                  <AccountCircleRounded sx={{ mr: "5px" }} />
                  <Typography>Edit Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                    handleClose();
                  }}
                >
                  <LogoutSharp sx={{ mr: "5px" }} />
                  <Typography>Log Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase
                placeholder="Search..."
                value={searchInput}
                onChange={searchOnChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <IconButton onClick={handleSearch}>
                <Search />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
