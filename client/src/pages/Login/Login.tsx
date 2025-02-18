import { Button, Card, CardContent, Paper, TextField, Typography, styled } from '@mui/material'
import React,{useState,useContext} from 'react'
import { AuthContext } from '../../App';
import { Form, useNavigate } from 'react-router-dom';

const Container = styled(Paper)(({theme})=>({
  backgroundColor: "#86BBD8",
  display: "flex",
  width: "100%",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
}))
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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogin = () => {
        if (username === "user" && password === "password") {
            login();
            navigate('/');
          } else {
            alert("Invalid credentials");
          }
    }
  return (
    <Container>
        <CustomCard>
            <CardContent >
                <Typography variant="h3" color="white">Login</Typography>
                <form>
                    <CustomText type='text' placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <CustomText type='password' placeholder='Password' value={password}onChange={(e)=>setPassword(e.target.value)}/>
                    <Button disableRipple type='submit' onClick={handleLogin} variant='contained'>Login</Button>
                </form>
            </CardContent>
        </CustomCard>
    </Container>
  )
}

export default Login