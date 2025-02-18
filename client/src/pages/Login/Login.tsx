import { Button, Card, CardContent, Paper, TextField, Typography } from '@mui/material'
import React,{useState,useContext} from 'react'
import { AuthContext } from '../../App';
import { Form, useNavigate } from 'react-router-dom';

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
    <Paper>
        <Card sx={{width:345}}>
            <CardContent >
                <Typography variant="h3">Login</Typography>
                <form>
                    <TextField type='text' placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <TextField type='password' placeholder='Password' value={password}onChange={(e)=>setPassword(e.target.value)}/>
                    <Button disableRipple type='submit' onClick={handleLogin} variant='contained'>Login</Button>
                </form>
            </CardContent>
        </Card>
    </Paper>
  )
}

export default Login