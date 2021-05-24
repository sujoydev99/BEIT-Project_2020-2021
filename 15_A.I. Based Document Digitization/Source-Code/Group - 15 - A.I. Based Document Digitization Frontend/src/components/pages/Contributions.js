import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactJson from 'react-json-view'

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Spin,
  Modal,
  Table
} from "antd";
const {getContributions}=require('../../actions/contributionActions')
const Contributions = ({getContributions , error, contributions, loading}) => {

  const [headers, setHeaders] = useState([
    { title: 'Sr. No', dataIndex: 'key', key: 'key' , width:70},
    { title: 'Filename', dataIndex: 'fileName', key: 'fileName' },
    { title: 'Date', dataIndex: 'timestamp', key: 'timestamp', width:250 },    
    {
      title: 'Action',
      key: '_id',
      dataIndex: '_id',
      width: 100,
      render: _id => <Link className='login-form-forgot' to={`/contribution/${_id}`}>
      View
    </Link>,
    },
  
  ]);

  useEffect(() => {
    getContributions();
  }, []);
  useEffect(() => {
    if (error.data) message.error(error.data.message);
  }, [error]);

  
  return (
    <div style={{padding:"20px"}}
      >
  <Table style={{fontSize:"30pt"}}
    columns={headers}
    scroll={{ y: "65vh" }}
    dataSource={contributions}
    sticky  
  />,

    </div>
  );
};

Contributions.propTypes = {
  getContributions: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  contributions: state.contribution.contributions,
  loading:state.loading
});

export default connect(mapStateToProps, {
  getContributions,
})(withRouter(Contributions));
