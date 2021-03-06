import React,{Fragment,useState,useEffect} from 'react';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth'
const Login = React.forwardRef(({login,isAuthenticated},refs) => {


    let textInput = React.createRef();
    useEffect(()=>{
      textInput.current.focus();
    },[])
    const [formData,setFormData] = useState({
        email:"",
        password:"",
    });
    const {email,password}=formData;
    const onChange = (e) =>{
       // console.log({...formData})
        setFormData({...formData,[e.target.name]:e.target.value})
        
    }
    const onSubmit = e =>{
        e.preventDefault();
      // console.log("SUCCESS");
        login(email,password);
    };

    // Redirect if login
    if(isAuthenticated){
      return <Redirect to="/dashboard"></Redirect>
    }
    return (
        <Fragment> <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign In Your Account</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input ref ={textInput}type="email" placeholder="Email Address" name="email"   value={email} onChange = {e => onChange(e)} required/>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password} onChange = {e => onChange(e)} required
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p></Fragment>
    )
});

login.propTypes = {
  login:PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}


const mapStatetoProps = state => ({
  isAuthenticated : state.auth.isAuthenticated
})
export default connect(mapStatetoProps,{login})(Login);
