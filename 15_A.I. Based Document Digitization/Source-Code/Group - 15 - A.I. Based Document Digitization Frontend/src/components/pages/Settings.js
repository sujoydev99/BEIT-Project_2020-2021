import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { Form, Input, Button, Card, message } from "antd";

import { setPassword } from "../../actions/settingsActions";
import changePasswordValidation from "../../validation/changePasswordValidation";
const Settings = ({
  setPassword,
  error,
  loading,
  auth,
  changepasswordStatus,
}) => {
  const [errors, setErrors] = useState({});

  const [credentials, setCredentials] = useState({
    oldpassword: "",
    password1: "",
    password2: "",
  });

  useEffect(() => {
    if (error.message) message.error(error.message);
  }, [error]);
  useEffect(() => {
    if (changepasswordStatus.status && credentials.oldpassword !== "")
      message.success(changepasswordStatus.status);
  }, [changepasswordStatus]);

  const onChange = (e) => {
    let { id, value } = e.target;

    setCredentials((state) => {
      return { ...state, [id]: value };
    });
  };

  const clickChangePassword = async () => {
    let { errors, isValid } = await changePasswordValidation(credentials);
    console.log(isValid);
    if (isValid) {
      setErrors({});
      await setPassword(credentials);
    } else {
      setErrors(errors);
      console.log(errors);
    }
  };

  return (
    <div className='loggedInBG' style={{ display: "block" }}>
      <Card
        className='customCard'
        title='Change Password'
        style={{ padding: "20px", maxWidth: "600px" }}
      >
        <Form name='changepassword_form'>
          <Form.Item
            name='Old Password'
            hasFeedback
            rules={[
              {
                required: true,
                message: errors.oldpassword,
              },
            ]}
            help={errors.olddpassword}
            validateStatus={!errors.oldpassword ? "success" : "error"}
          >
            <Input.Password
              onChange={onChange}
              id='oldpassword'
              value={credentials.oldpassword}
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='oldpassword'
            />
          </Form.Item>
          <Form.Item
            name='password1'
            hasFeedback
            rules={[
              {
                required: true,
                message: errors.password1,
              },
            ]}
            help={errors.password1}
            validateStatus={!errors.password1 ? "success" : "error"}
          >
            <Input.Password
              onChange={onChange}
              id='password1'
              value={credentials.password1}
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='New Password'
            />
          </Form.Item>
          <Form.Item
            name='password2'
            hasFeedback
            rules={[
              {
                required: true,
                message: errors.password2,
              },
            ]}
            help={errors.password2}
            validateStatus={!errors.password2 ? "success" : "error"}
          >
            <Input.Password
              onChange={onChange}
              id='password2'
              value={credentials.password2}
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='Confirm New Password'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              onClick={clickChangePassword}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

Settings.propTypes = {
  setPassword: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  changepasswordStatus: state.settings,
});

export default connect(mapStateToProps, {
  setPassword,
})(withRouter(Settings));
