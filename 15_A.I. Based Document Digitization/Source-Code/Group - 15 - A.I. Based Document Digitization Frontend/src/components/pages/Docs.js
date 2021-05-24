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
import { getDocs } from "../../actions/docActions";
const Docs = ({ getDocs, error, docs, loading}) => {

  const [headers, setHeaders] = useState([
    { title: 'Sr. No', dataIndex: 'key', key: 'key' , width:70},
    { title: 'Filename', dataIndex: 'fileName', key: 'fileName' },
    { title: 'Total Amount', dataIndex: 'amt', key: 'amt', width:100 },
    { title: 'Date', dataIndex: 'timestamp', key: 'timestamp', width:250 },    
    {
      title: 'Action',
      key: '_id',
      dataIndex: '_id',
      width: 100,
      render: _id => <Link className='login-form-forgot' to={`/fetch/${_id}`}>
      View
    </Link>,
    },
  
  ]);

  useEffect(() => {
    getDocs();
  }, []);
  useEffect(() => {
    if (error.data) message.error(error.data.message);
  }, [error]);

  
  return (
    <div style={{padding:"20px"}}
      >
  <Table style={{fontSize:"30pt"}}
    columns={headers}
    expandable={{
      expandedRowRender: record => <ReactJson src={record} />
      ,
      rowExpandable: record => record.name !== 'Not Expandable',
    }}
    scroll={{ y: "65vh" }}
    dataSource={docs}
    sticky  
  />,

    </div>
  );
};

Docs.propTypes = {
  getDocs: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  docs: state.doc.docs,
  loading:state.loading
});

export default connect(mapStateToProps, {
  getDocs,
})(withRouter(Docs));
