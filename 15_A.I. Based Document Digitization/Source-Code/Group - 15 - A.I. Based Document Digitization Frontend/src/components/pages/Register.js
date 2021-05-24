import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message,notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import LoginLayout from "../reusable/loginNav";
import { registerUser } from "../../actions/authActions";
import registerValidation from "../../validation/registerValidation";
const Register = ({ registerUser, error, history, auth }) => {
  const [errors, setErrors] = useState({});

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword:""
  });
  useEffect(() => {
    if (error.data) message.error(error.data.message);
    if(auth.isAuthenticated === true){
      history.push('/dashboard')
    }
  }, [error,auth]);

  const onChange = (e) => {
    let { id, value } = e.target;

    setCredentials((state) => {
      return { ...state, [id]: value };
    });
  };

  const click = async () => {
    let { errors, isValid } = await registerValidation(credentials);
    console.log(isValid);
    if (isValid) {
      setErrors({});
      registerUser(credentials, history);
    } else {
      setErrors(errors);
      console.log(errors);
    }
  };

  return (
    <LoginLayout>
      <Card
        className='customCard centeredCard'
        title='Login'
        style={{ minWidth: "300px" }}
      >
        <Form
          name='login_form'
          className='login-form'
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name='email'
            hasFeedback
            rules={[
              {
                required: true,
                message: errors.email,
              },
            ]}
            help={errors.email}
            validateStatus={!errors.email ? "success" : "error"}
          >
            <Input
              onChange={onChange}
              id='email'
              value={credentials.email}
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>
          <Form.Item
            name='password'
            hasFeedback
            rules={[
              {
                required: true,
                message: errors.password,
              },
            ]}
            help={errors.password}
            validateStatus={!errors.password ? "success" : "error"}
          >
            <Input.Password
              onChange={onChange}
              id='password'
              value={credentials.password}
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            hasFeedback
            rules={[
              {
                required: true,
                message: errors.confirmPassword,
              },
            ]}
            help={errors.confirmPassword}
            validateStatus={!errors.confirmPassword ? "success" : "error"}
          >
            <Input.Password
              onChange={onChange}
              id='confirmPassword'
              value={credentials.confirmPassword}
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='Confirm Password'
            />
          </Form.Item>
          <br />
          <br />

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
                onClick={click}
              >
                Register
              </Button>
              <Link className='login-form-forgot' to='/'>
                Login Instead
              </Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </LoginLayout>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

export default connect(mapStateToProps, {
  registerUser,
})(withRouter(Register));
