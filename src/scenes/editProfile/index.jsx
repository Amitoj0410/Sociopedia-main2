// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Box, Typography } from "@mui/material";
// import Form from "./Form"; // Assuming Form component is in the same directory
// import { useTheme } from "@mui/material";
// // import { setLogin } from "./"; // Update the path accordingly
// import { setLogin } from "state";
// import Navbar from "scenes/navbar";

// const EditProfilePage = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const token = useSelector((state) => state.token);
//   const handleEditProfile = async (values, onSubmitProps) => {
//     // Assuming you have an API endpoint for updating user profile
//     const updatedUserResponse = await fetch(
//       `http://localhost:3001/auth/${user._id}/editProfile`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(values),
//       }
//     );

//     const updatedUser = await updatedUserResponse.json();

//     if (!updatedUser.msg) {
//       dispatch(setLogin({ user: updatedUser.user, token }));
//       // Redirect or update state as needed after successful profile update
//       console.log("Profile Updated");
//     } else {
//       console.error("Error: Profile not updated");
//     }

//     onSubmitProps.resetForm();
//   };

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         width="100%"
//         backgroundColor={theme.palette.background.alt}
//         p="1rem 6%"
//         textAlign="center"
//       >
//         <Typography variant="h3" gutterBottom sx={{ mb: "2rem" }}>
//           Edit Profile
//         </Typography>
//         <Form
//           initialValues={{
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             location: user.location,
//             occupation: user.occupation,
//             picture: "", // You may want to set the initial picture path here
//           }}
//           onSubmit={handleEditProfile}
//           isEditProfile
//         />
//       </Box>
//     </Box>
//   );
// };

// export default EditProfilePage;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Container, Paper } from "@mui/material";
import Form from "./Form"; // Assuming Form component is in the same directory
import { useTheme } from "@mui/material";
import { setLogin } from "state";
import Navbar from "scenes/navbar";

const EditProfilePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleEditProfile = async (values, onSubmitProps) => {
    try {
      const updatedUserResponse = await fetch(
        `http://localhost:3001/auth/${user._id}/editProfile`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      const updatedUser = await updatedUserResponse.json();

      if (!updatedUser.msg) {
        dispatch(setLogin({ user: updatedUser.user, token }));
        // console.log("Profile Updated");
      }
      onSubmitProps.resetForm();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
            Edit Profile
          </Typography>
          <Form
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              location: user.location,
              occupation: user.occupation,
              picture: "", // You may want to set the initial picture path here
            }}
            onSubmit={handleEditProfile}
            isEditProfile
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfilePage;
