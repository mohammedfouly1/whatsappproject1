import { TextField, Button, IconButton } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import { useRouter } from 'next/router';
import Alert from '@material-ui/lab/Alert';
import { useState, useRef } from 'react';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import { useDispatch } from 'react-redux';
import { login } from '../Context/Authcontext';
import styles from '../styles/LoginForm.module.css';
import { toggleTheme } from '../redux/features/themeSlice';

export default function LoginForm(props) {
  const { setSignupFormState, setLoginFormState, loginFormState } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  // Inputs
  const passwordRef = useRef();
  const emailRef = useRef();

  // state
  const [errorState, setErrorState] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    setLoading(true);
    try {
      e.preventDefault();
      const userData = await login(emailRef.current.value, passwordRef.current.value);
      router.push('/');
    } catch (er) {
      setErrorState(er.message);
    }
    setLoading(false);
  }

  return (
    <Grow in={loginFormState}>
      <div className={styles.LoginFormContainer}>
        <form className={styles.LoginForm} onSubmit={handleSubmit}>
          <TextField
            inputRef={emailRef}
            label="Email"
            type="text"
            variant="outlined"
          />
          <TextField inputRef={passwordRef} label="Password" type="password" variant="outlined" />
          <Button className={styles.LoginButton} type="submit">
            {loading ? <CircularProgress size={25} /> : 'LOGIN' }
          </Button>
          {errorState && <Alert severity="error">{errorState}</Alert>}
          <span>
            No Account?
            <Button
              variant="text"
              color="primary"
              onClick={() => { setLoginFormState((v) => !v); setSignupFormState((v) => !v); }}
            >
              SIGNUP
            </Button>
          </span>
          <IconButton onClick={() => { dispatch(toggleTheme()); }}>
            <Brightness6Icon style={{ color: 'var(--icon-Color)' }} />
          </IconButton>
        </form>
      </div>
    </Grow>
  );
}
