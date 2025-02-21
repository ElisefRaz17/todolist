import {
  Button,
  Card,
  CardContent,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { AuthContext, useAuth } from "../../App";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import "./login.css"

const Container = styled(Paper)(({ theme }) => ({
  backgroundColor: "#86BBD8",
  display: "flex",
  width: "100%",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
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
function generateToken(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()
  const navigate = useNavigate();

  
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      const token = generateToken();
      localStorage.setItem("token", token);
      if (response.status === 200) {
        login(token);
        navigate("/");
      }
    } catch (error) {
      console.log("Login failed: ", error);
    }
  };
  return (
    <Container>
      <CustomCard>
        <CardContent>
          <Typography variant="h3" color="white">
            Login
          </Typography>
          <form className="login-form">
            <CustomText
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <CustomText
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disableRipple
              type="submit"
              onClick={handleLogin}
              variant="contained"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </CustomCard>
    </Container>
  );
}

export default Login;
