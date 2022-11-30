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
  const [imageFile, setImageFile] = useState('');
  const history = useHistory()
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const updateImage = async (e) => {
    setImageFile(e.target.files[0])
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

    if (imageFile) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(imageFile.name)) {
        alert('Invalid file type, please upload a .jpeg, .jpg, or, .png');
        return;
      }
    }

    const formData = new FormData();
    formData.append("images", imageFile);

    const user = {
      email,
      username,
      password
    };

    dispatch(signup(user))
    .then((newUser) => {
      console.log(newUser, 'before patch thunk')
      if (newUser.currentUser) {
        console.log('here')
        dispatch(updateUserImage(newUser.currentUser._id, formData) )
      }
    })

    setTimeout(function(){
      history.push('./profile')
    }, 1000);
    
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
              id='file2'
              value="Sign Up"
              accept=".jpg, .jpeg, .png"
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


