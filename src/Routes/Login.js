import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthProvider";

import axios from '../api/axios';

const LOGIN_URL = '/login';


const Login = () => {

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pass]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(
                                            LOGIN_URL, 
                                            JSON.stringify
                                            (
                                                {user, pass},
                                                {
                                                    headers: {'Content-Type': 'application/json'},
                                                    withCredentials: true
                                                }
                                            )
                                        );
            console.log(JSONstringify(res?.data));
            //console.log(JSONstringify(res));

            const accessToken = res?.data?.accessToken;
            const roles = res?.data?.roles;

            setAuth({user, pass, roles, accessToken});
            setUser('');
            setPass('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) 
            {
                setErrMsg('There was a problem connecting to the server.');
            } else if (err?.response?.status === 400) {
                setErrMsg('Missing username or password.');
            } else if (err?.response?.status === 401) {
                setErrMsg('Invalid username or password.');
            } else {
                setErrMsg('Login failed.');
            }

            errRef.current.focus();
        }

        setUser('');
        setPass('');
        setSuccess(true);
    }


    return (

        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <br/>
                    <p>You have successfully logged in.</p>
                    <br/>
                    <p>
                        <a href="#">Go to Homepage</a>
                    </p>
                </section>
            ) : (


            <section>
                <p ref={errRef} className={errMsg ? "error" : "offscreen"} aria-live="assertive="assertive>{errMsg}</p>
                <h1>Admin Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input 
                    type="text" 
                    id="username" 
                    ref={userRef}
                    value={user}
                    autoComplete="off" 
                    onChange={(e) => setUser(e.target.value)}
                    required
                    />

                    <br />
                
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password"
                        value={pass} 
                        onChange={(e) => setPass(e.target.value)}
                        required
                    />

                    <br/>

                    <button type="submit">Sign In</button>
                </form>
            </section>
            )}
        </>
    )
}

export default Login