import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import instance from '../lib/axios.js';

// component for registration form
class Registration extends React.Component {
    constructor (props){
        super(props);
        this.state={};
        this.handleChange= this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state.error = false;
    }
    handleChange (e) {
        this[e.target.name]=e.target.value;
    }
    handleClick (e) {
        let self=this;
        e.preventDefault();
        instance.post('/register',{
            first:self.first,
            last:self.last,
            email:self.email,
            password:self.password
        }).then(json=>{
            if(json.data.loggedIn){
                self.setState({userId:json.data.userId});
                console.log(self.state);
                location.replace(location.origin+'/');
            } else {
                self.setState({error:true});
            }
        }).catch(err=>{
            console.log('error in handleClick function in Registartion class: ', err.message);
        });
    }
    render () {
        return (
            <div>
                {this.state.error && <div className="error"> Something went wrong, please try again </div>}
                <h3> Register to our musicians community </h3>
                <div className="align">
                    <input type="text" name="first" placeholder="First Name" onChange = {this.handleChange} />
                    <input type="text" name="last" placeholder="Last Name" onChange = {this.handleChange}/>
                    <input type="email" name="email" placeholder="Email Address" onChange = {this.handleChange}/>
                    <input type="password" name="password" placeholder="Password" onChange = {this.handleChange}/>
                    <button onClick= {this.handleClick}> Register </button>

                    <p> Have you already registered? <Link to="/login" >Click here to log in </Link> </p>
                </div>
            </div>
        );
    }
}

// component for login form
class Login extends React.Component {
    constructor (props){
        super(props);
        this.state = {error:false};
        this.handleChange= this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange (e) {
        this[e.target.name]=e.target.value;
    }
    handleClick (e) {
        let self= this;
        e.preventDefault();
        instance.post('/login',{
            email:self.email,
            password:self.password
        }).then(json=>{
            if(json.data.loggedIn){
                self.setState({userId:json.data.userId});
                console.log(self.state);
                location.replace(location.origin+'/');
            } else {
                self.setState({error:true});
            }
        }).catch(err=>{
            console.log('error in handleClick function in Login class: ', err.message);
        });
    }

    render () {
        return (
            <div>
                {this.state.error && <div className="error"> Something went wrong, please try again </div>}
                <h3> Log in into our musicians community </h3>
                <div className="align">
                    <input type="email" name="email" placeholder="Email Address" onChange = {this.handleChange}/>
                    <input type="password" name="password" placeholder="Password" onChange = {this.handleChange}/>
                    <button onClick= {this.handleClick}> Login </button>

                    <p> Have not registered yet? <Link to="/" >Click here to register </Link> </p>
                </div>
            </div>
        );
    }

}


//default export component for non-logged-in users

export default function Welcome () {
    return (
        <div>
            <h1> Welcome to TuneBook </h1>
            <h2> Made by Musicians for Musicians </h2>
            <div className="center largeImg">
                <img src="../public/logo.png" alt="logo" />
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
