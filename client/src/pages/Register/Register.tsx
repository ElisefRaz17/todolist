import {
  Alert,
  Button,
  Card,
  CardContent,
  Paper,
  Snackbar,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useContext, useState } from "react";
import axios from "axios";
import "./register.css";
import SvgIcon from "../../SVGIcon";
import { AuthContext } from "../../App";

const Container = styled(Paper)(({ theme }) => ({
  backgroundColor: "inherit",
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:'none'
}));
const CustomCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#2B59C3",
}));
const CustomText = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#86BBD8", // Default border color
    },
    "&:hover fieldset": {
      borderColor: "#86BBD8", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#86BBD8", // Border color on focus
    },
  },
}));
function Register() {
  const [newUser, setNewUser] = useState({
    username: "",
    password: ""
  });
  const { setCredentialsState } = useContext(AuthContext)
  const [error, setError] = useState<any>(null);
  const [openError, setOpenError] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post(`${process.env['REACT_APP_BACKEND_PORT']}/api/auth/register`, newUser)
      .then((result) => console.log(result))
      .catch((err) => {
        setError(err);
        console.log(err);
      });
      setCredentialsState({username: newUser.username, password: newUser.password})
  };
  const handleClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };

  return (
    <>
      <Container>
        <CustomCard>
          <CardContent>
            <Typography variant="h4" color="white">
              Sign Up
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <form onSubmit={handleSubmit} className="register-form" aria-label="Sign Up Form">
                <CustomText
                  label="Username"
                  name="username"
                  aria-label="Username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e: any) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                ></CustomText>
                <CustomText
                  label="Password"
                  name="password"
                  aria-label="Password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e: any) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                ></CustomText>
                <Button type="submit" variant="contained" aria-label="Register Button">
                  Register User
                </Button>
              </form>
              <SvgIcon />
              <a href="https://storyset.com/work" hidden>
                Work illustrations by Storyset
              </a>
              {/* <a href="https://storyset.com/work">Work illustrations by Storyset</a>
            <a href="https://storyset.com/work">Work illustrations by Storyset</a> */}
            </div>
          </CardContent>
        </CustomCard>
      </Container>
      {error && (
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert variant="filled" severity="error" sx={{ zIndex: 10 }}>
            {error.response.data["message"]}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default Register;
