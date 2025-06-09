import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  CalendarMonth,
  Close,
  PersonRemoveOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Modal,
  CircularProgress,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Avatar,
  ListItemText,
  DialogActions,
  Button,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Friend from "components/Friend";
import { setFriendRequestTo, setFriends } from "state";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette, breakpoints } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const lightBlue = palette.primary.main;
  const loggedUser = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));
  const isMd = useMediaQuery(breakpoints.only("md"));
  const [openFrnds, setOpenFrnds] = useState(false);
  // const friends2 = useSelector((state) => state.user.friends);
  const friends2 = useSelector((state) => state.user.friends);
  const [gettingFriends, setGettingFriends] = useState(false);
  const [patchingFriend, setPatchingFriend] = useState(false);
  const dispatch = useDispatch();

  const getFriends = async () => {
    try {
      setGettingFriends(true);
      const response = await fetch(
        `https://socialpedia-server-main-v2.onrender.com/users/${userId}/friends`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.log(error);
    } finally {
      setGettingFriends(false);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const dispatch = useDispatch();
  const isFriend = (friendId) =>
    friends2.find((friend) => friend._id === friendId);
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  // const sentFriendReq =
  //   friendReqs?.includes(_id) ||
  //   (chkFriendReq && chkFriendReq.includes(friendId));

  const handleOpenFrnds = () => setOpenFrnds(true);
  const handleCloseFrnds = () => setOpenFrnds(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUser = async () => {
    const response = await fetch(
      `https://socialpedia-server-main-v2.onrender.com/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
    // console.log(userId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return <CircularProgress />;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    createdAt,
  } = user;

  const formatJoinDate = (isoDateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(isoDateString);
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `Joined ${month} ${year}`;
  };

  // const patchFriend = async (friendId) => {
  //   try {
  //     setPatchingFriend(true);
  //     const response = await fetch(
  //       `https://socialpedia-server-main-v2.onrender.com/users/${userId}/${friendId}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       dispatch(setFriends({ friends: data }));
  //     } else {
  //       throw new Error("Failed to update friends list");
  //     }
  //   } catch (error) {
  //     console.error("Error updating friends list:", error);
  //   } finally {
  //     setPatchingFriend(false);
  //   }
  // };

  // const sendRequest = async (friendId) => {
  //   try {
  //     const response = await fetch(
  //       `https://socialpedia-server-main-v2.onrender.com/users/${userId}/friends/${friendId}/request`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       // console.log(data);
  //       dispatch(setFriendRequestTo(data._id));
  //     } else {
  //       throw new Error("Failed to send friend request");
  //     }
  //   } catch (error) {
  //     console.error("Error sending friend request:", error);
  //   }
  // };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      {user ? (
        <>
          <FlexBetween
            gap="0.5rem"
            pb="1.1rem"
            // onClick={() => navigate(`/profile/${userId}`)}
          >
            <FlexBetween gap="1rem">
              <Box
                onClick={handleOpen}
                sx={{ "&:hover": { cursor: "pointer" } }}
              >
                <UserImage image={picturePath} />
              </Box>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="enlarged-user-image"
                aria-describedby="enlarged-user-image-description"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "40%",
                    height: "60%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    objectFit: "contain",
                  }}
                >
                  {/* <UserImage
                image={picturePath}
                style={{ width: "100%", height: "100%" }}
              /> */}
                  <UserImage image={picturePath} size="400px" />
                </Box>
              </Modal>

              {/* ----------------------------------------------------- */}
              <Box>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(`/profile/${userId}`)}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography
                  color={isSm || isXs ? lightBlue : medium}
                  onClick={isSm || isXs ? handleOpenFrnds : undefined}
                >
                  {Array.isArray(friends) && friends2.length} friends
                </Typography>
                {/* Friends list modal */}
                <Dialog
                  open={openFrnds}
                  onClose={handleCloseFrnds}
                  fullWidth
                  maxWidth="xs"
                >
                  <DialogTitle>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">Friends</Typography>
                      <IconButton onClick={handleCloseFrnds}>
                        <Close />
                      </IconButton>
                    </Box>
                  </DialogTitle>

                  <Divider />

                  <DialogContent>
                    {Array.isArray(friends2) && friends2.length > 0 ? (
                      // <List>
                      //   {Array.isArray(friends2) &&
                      //     friends2?.map((friend) => (
                      //       <ListItem
                      //         key={friend?._id}
                      //         sx={{
                      //           display: "flex",
                      //           alignItems: "center",
                      //           justifyContent: "center",
                      //           bottom: "1rem",
                      //         }}
                      //       >
                      //         <Avatar
                      //           sx={{ mr: 2, width: 40, height: 40 }}
                      //           src={friend?.picturePath}
                      //           alt={`${friend?.firstName}'s profile`}
                      //         >
                      //           {!friend?.picturePath &&
                      //             friend?.firstName?.charAt(0)}
                      //         </Avatar>

                      //         <ListItemText
                      //           primary={friend?.firstName}
                      //           secondary={friend?.occupation}
                      //           sx={{ alignSelf: "center" }}
                      //         />

                      //         {isFriend(friend?._id) ? (
                      //           <Tooltip
                      //             title={
                      //               <Typography fontSize={13}>
                      //                 Remove Friend
                      //               </Typography>
                      //             }
                      //             arrow
                      //           >
                      //             <IconButton
                      //               onClick={() => patchFriend(friend._id)}
                      //               sx={{
                      //                 backgroundColor: primaryLight,
                      //                 p: "0.6rem",
                      //                 "&:hover": {
                      //                   backgroundColor: "error.light",
                      //                 },
                      //               }}
                      //             >
                      //               <PersonRemoveOutlined
                      //                 sx={{ color: primaryDark }}
                      //               />
                      //             </IconButton>
                      //           </Tooltip>
                      //         ) : (
                      //           <Tooltip
                      //             title={
                      //               <Typography fontSize={13}>
                      //                 Add Friend
                      //               </Typography>
                      //             }
                      //             arrow
                      //           >
                      //             <IconButton
                      //               onClick={() => sendRequest(friend._id)}
                      //               sx={{
                      //                 backgroundColor: primaryLight,
                      //                 p: "0.6rem",
                      //                 "&:hover": {
                      //                   backgroundColor: "success.light",
                      //                 },
                      //               }}
                      //             >
                      //               <PersonAddOutlined
                      //                 sx={{ color: primaryDark }}
                      //               />
                      //             </IconButton>
                      //           </Tooltip>
                      //         )}
                      //       </ListItem>
                      //     ))}
                      // </List>
                      <Box display="flex" flexDirection="column" gap="1.5rem">
                        {Array.isArray(friends2) &&
                          friends2?.map((friend, index) => (
                            <Friend
                              // key={friend._id}
                              key={`${friend?._id}-${index}`}
                              friendId={friend?._id}
                              name={`${friend?.firstName} ${friend?.lastName}`}
                              subtitle={friend?.occupation}
                              // userPicturePath={friend.picturePath}
                              userPicturePath={
                                friend?.picturePath
                                  ? friend?.picturePath
                                  : "p1.jpeg"
                              }
                            />
                          ))}
                      </Box>
                    ) : (
                      <Typography
                        color="textSecondary"
                        align="center"
                        sx={{ py: 3 }}
                      >
                        No friends yet.
                      </Typography>
                    )}
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={handleCloseFrnds} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </FlexBetween>
            {loggedUser._id === userId && (
              <Tooltip
                title={<Typography fontSize={13}>Edit</Typography>}
                arrow
              >
                <IconButton
                  onClick={() => {
                    navigate("/profile/edit");
                  }}
                  sx={{ border: "2px solid #3f51b5" }}
                >
                  <ManageAccountsOutlined sx={{ fontSize: "25px" }} />
                </IconButton>
              </Tooltip>
            )}
          </FlexBetween>

          <Divider />

          {/* Second Row */}
          <Box p="1rem 0">
            <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
              <LocationOnOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{location}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
              <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{occupation}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="1rem">
              <CalendarMonth fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>
                {formatJoinDate(createdAt)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Third Row */}
          <Box p="1rem 0">
            <FlexBetween mb="0.5rem">
              <Typography color={medium}>Who's viewed your profile</Typography>
              <Typography color={main} fontWeight="500">
                {viewedProfile}
              </Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography color={medium}>Impressions of your post</Typography>
              <Typography color={main} fontWeight="500">
                {impressions}
              </Typography>
            </FlexBetween>
          </Box>

          <Divider />

          {/* Fourth Row */}
          <Box p="1rem 0">
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
              Social Profiles
            </Typography>

            <FlexBetween gap="1rem">
              <FlexBetween gap="1rem">
                <img src="../assets/twitter.png" alt="twitter" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    Twitter
                  </Typography>
                  <Typography color={medium}>Social Networking</Typography>
                </Box>
              </FlexBetween>

              <EditOutlined sx={{ color: main }} />
            </FlexBetween>

            <FlexBetween gap="1rem" mb="0.5rem">
              <FlexBetween gap="1rem">
                <img src="../assets/linkedin.png" alt="linkedin" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    Linkein
                  </Typography>
                  <Typography color={medium}>Network Platform</Typography>
                </Box>
              </FlexBetween>
              <EditOutlined sx={{ color: main }} />
            </FlexBetween>
          </Box>
        </>
      ) : (
        <CircularProgress />
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
