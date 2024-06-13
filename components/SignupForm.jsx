import { TextField, Button } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import { useRef, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { useRouter } from 'next/router';
import styles from '../styles/SignupForm.module.css';
import { signup } from '../Context/Authcontext';

export default function SignupForm(props) {
  const { setSignupFormState, setLoginFormState, signupFormState } = props;
  const router = useRouter();
  // Inputs
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const emailRef = useRef();

  // state
  const [errorState, setErrorState] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    setLoading(true);
    try {
      e.preventDefault();
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        setErrorState('Passwords are not matching');
      } else {
        const userData = await signup(emailRef.current.value, passwordRef.current.value);
        router.push('/');
      }
    } catch (er) {
      setErrorState(er.message);
    }
    setLoading(false);
  }

  return (
    <Grow in={signupFormState}>
      <div className="SignupFormContainer">
        <form className={styles.SignupForm} onSubmit={handleSubmit}>
          <TextField inputRef={emailRef} label="Email" type="text" variant="outlined" />
          <TextField inputRef={passwordRef} label="Password" type="password" variant="outlined" />
          <TextField inputRef={passwordConfirmRef} label="Confirm Password" type="password" variant="outlined" />
          <Button className={styles.SignupButton} type="submit">
            {loading ? <CircularProgress size={25} /> : 'SIGNUP' }
          </Button>
          {errorState && <Alert severity="error">{errorState}</Alert>}
          <span>
            Already have a Account?
            <Button
              variant="text"
              color="primary"
              onClick={() => { setLoginFormState((v) => !v); setSignupFormState((v) => !v); }}
            >
              LOGIN
            </Button>
          </span>
        </form>
      </div>
    </Grow>
  );
}
