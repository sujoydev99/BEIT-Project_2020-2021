import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Button } from "antd";
import logo from "../../assets/logo.png";
import Navbar from "../reusable/Navbar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { logoutUser } from "../../actions/authActions";

const LoggedInLayout = ({ children, logoutUser, auth }) => {
  const { Sider, Header, Content, Footer } = Layout;
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 600 ? true : false
  );
  const [color, setColor] = useState(false);

  const toggle = () => {
    // document.body.requestFullscreen();
    setCollapsed(!collapsed);
  };
  const Logout = () => {
    logoutUser();
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          left: "0",
          position: "fixed",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt='logonav'
            className='logonav'
            style={
              collapsed
                ? { height: "10px", width: "auto" }
                : { height: "31px", width: "auto" }
            }
          />
        </div>

        <Navbar />
      </Sider>
      <Layout
        style={
          collapsed === true
            ? { marginLeft: "80px", transition: ".4s ease-in-out" }
            : { marginLeft: "200px", transitio: ".4s ease-in-out" }
        }
      >
        <Header className='loggedinnav'>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              onMouseOver: () => setColor(true),
              onMouseOut: () => setColor(false),
              style: {
                color: color ? "#1890ff" : null,
                cursor: "pointer",
                transition: "0.3s",
              },
              onClick: toggle,
            }
          )}
          <p style={{ margin: "auto" }}>{auth.user.name}</p>
          <Button
            type='primary'
            id='endTest'
            className='endTest'
            onClick={Logout}
          >
            Logout
          </Button>
        </Header>

        <Content style={{ display: "flex", justifyContent: "center" }}>
          {children}
        </Content>
        <Footer style={{ alignSelf: "center", textAlign:"center" }}>
        Made with &#x1F9E0; by <br />
         Sujoy Dev, Priya Naik, Rashmi Shetty
        <br />
        Information Technology Dept.
        <br/>
        A. P. Shah Institute Of Technology 
      </Footer>
      </Layout>
    </Layout>
  );
};

LoggedInLayout.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  // error: state.error,
  // tests: state.test.tests,
});

export default connect(mapStateToProps, {
  logoutUser,
})(withRouter(LoggedInLayout));
