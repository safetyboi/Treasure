
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, clearSessionErrors } from '../../store/session';
import Footer from '../NavBar/Footer';
import './SessionForm.scss';


function LoginForm () {
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors.session);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    const setState = field === 'email' ? setEmail : setPassword;
    return e => setState(e.currentTarget.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })); 
  }

  return (
    <section className='login_page'>
      <div className='session_wrapper login flex-col justify-center'>
        <h2 className='text-center'>Log In</h2>
        <div className='session_content flex-row justify-center align-center'>
          <form className="session-form flex-col" 
            onSubmit={handleSubmit}>
            <div className="errors">{errors?.email}</div>
            <label>
              <span>Email</span>
              <input type="text"
                value={email}
                onChange={update('email')}
                placeholder="Email"
              />
            </label>
            <div className="errors">{errors?.password}</div>
            <label>
              <span>Password</span>
              <input type="password"
                value={password}
                onChange={update('password')}
                placeholder="Password"
              />
            </label>
            <input
              type="submit"
              value="Log In"
              disabled={!email || !password}
            />
          </form>
          <div className='border'></div>
          <div className='create_account_wrapper'>
            <p>New to Treasure?</p>
            <Link to={'/signup'}>Create an account</Link>
        </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default LoginForm;