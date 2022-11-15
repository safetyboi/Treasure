
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { login, clearSessionErrors } from '../../store/session';
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })); 
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign in</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="errors">{errors?.email}</div>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3">
              <Form.Control 
                type="email"
                placeholder="Email address"
                value={email}
                onChange={update('email')} />
            </FloatingLabel>

            <div className="errors">{errors?.password}</div>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="mb-3">
              <Form.Control 
                type="password"
                placeholder="Password"
                value={password}
                onChange={update('password')} />
            </FloatingLabel>

            <Button type="submit">Log in</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* <form className="session-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
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
      </form> */}
    </>
    
  );
}

export default LoginForm;