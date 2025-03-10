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
import { useNavigate } from "react-router-dom";
import "./login.css"

const Container = styled(Paper)(({ theme }) => ({
  backgroundColor: "inherit",
  display: "flex",
  width: "100%",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:"none"
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


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()
  const navigate = useNavigate();
  const { credentialsState,setCredentialsState } = useContext(AuthContext)

  
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env['REACT_APP_BACKEND_PORT']}/auth/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,password})
      });
      const data = await response.json()
      if(response.ok){
        localStorage.setItem("token",data.token)
        localStorage.setItem("User",JSON.stringify({username:username,password:password}))

      }else{
        console.log(response.status)
      }

      setCredentialsState({username:username,password:password})
  
      localStorage.setItem("User",JSON.stringify({username:username,password:password}))
      if (response.status === 200) {
        login(data.token);
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
