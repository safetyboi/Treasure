import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signup, clearSessionErrors, updateUserImage } from '../../store/session';
import UploadImages from '../AWSTest/ImageUploader';
import Footer from '../NavBar/Footer';
import './SessionForm.scss';
import { useHistory } from 'react-router-dom';

function SignupForm () {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  let imageFile
  const history = useHistory()
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const updateImage = async (e) => {
    // console.log(e.target.files[0])
    // const file = e.target.files[0];
    imageFile = e.target.files[0]
    
    // const formData = new FormData();
    // formData.append("images", file);

    // await jwtFetch("/api/events/postImages", {
    //     method: "POST",
    //     body: formData,
    //   })
    //     .then((res) => res.json())
    //     .then((data) => console.log(data));   
  };


  const update = field => {
    let setState;

    switch (field) {
      case 'email':
        setState = setEmail;
        break;
      case 'username':
        setState = setUsername;
        break;
      case 'password':
        setState = setPassword;
        break;
      case 'password2':
        setState = setPassword2;
        break;
      default:
        throw Error('Unknown field in Signup Form');
    }

    return e => setState(e.currentTarget.value);
  }

  const usernameSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("images", imageFile);

    const user = {
      email,
      username,
      password
    };

    dispatch(signup(user)) 
    .then((newUser) => {
      if (newUser.currentUser) {
        dispatch(updateUserImage(newUser, formData) )
      }
    })
    .then(() => {
      setTimeout(function(){
        history.push('./profile')
     }, 2000);
    })
  }

  return (
    <section className='signup_page'>
      <div className='session_wrapper flex-col justify-center align-center'>
      <h2 className='text-center'>Sign Up</h2>
        <div className='session_content flex-row align-center'>
          <form className="session-form flex-col" 
            onSubmit={usernameSubmit} encType="multipart/form-data">
            <label>
              <span>Email</span>
              <input type="email"
                value={email}
                onChange={update('email')}
                placeholder="Email"
              />
            </label>
            <div className="errors">{errors?.email}</div>
            <label>
              <span>Username</span>
              <input type="text"
                value={username}
                onChange={update('username')}
                placeholder="Username"
              />
            </label>
            <div className="errors">{errors?.username}</div>
            <label>
              <span>Password</span>
              <input type="password"
                value={password}
                onChange={update('password')}
                placeholder="Password"
              />
            </label>
            <div className="errors">{errors?.password}</div>
            <label>
              <span>Confirm Password</span>
              <input type="password"
                value={password2}
                onChange={update('password2')}
                placeholder="Confirm Password"
              />
            </label>
            <div className="errors">
              {password !== password2 && 'Confirm Password field must match'}
            </div>
            <input type="file" onChange={updateImage} multiple />
            <input
              type="submit"
              value="Sign Up"
              disabled={!email || !username || !password || password !== password2}
            />
          </form>
          
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default SignupForm;

