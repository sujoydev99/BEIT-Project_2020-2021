import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  message,
  Image,
} from "antd";
import ReactJson from "react-json-view";

import { uploadDoc } from "../../actions/docActions";
const Upload = ({ uploadDoc, error, loading, auth,doc }) => {
  useEffect(() => {
    if (error.message) message.error(error.message);
  }, [error]);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl]= useState(null);
  const fileChangedHandler = (e) => {
    
    setFile(e.target.files[0]);
    let fr =new FileReader()
    setFileUrl(URL.createObjectURL(e.target.files[0]))
    console.log(fileUrl);
  };
  const uploadHandler = (e) => {
    if(!file){
      message.error("please select a pdf/image file")
      return
    }
    let form = new FormData();
    form.append("file", file);
    uploadDoc(form);
  };
  const loadingIcon = <LoadingOutlined style={{ fontSize: 44 }} spin />;
  return (
    <div style={{ padding: "20px" }}>
      <input type="file" onChange={fileChangedHandler} id="file"className="inputFile" accept="image/*,application/pdf"/>
     
      <Button onClick={uploadHandler} type='primary'>Upload!</Button>
      <br/>
      <br/>
      <br/>
      <Image width={"100px"} src={fileUrl}/>
      {loading===true?loadingIcon:null}
      <br/>
      <br/>
      <br/>
      {Object.keys(doc).length>0?(
      <Card className="customCard" title="Extracted Data">
            <ReactJson src={doc} />
            <p>{doc!=={}}</p>
      </Card>):null}
      
    </div>
  );
};

Upload.propTypes = {
  uploadDoc: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  loading: state.loading,
  doc:state.doc.doc
});

export default connect(mapStateToProps, {
  uploadDoc,
})(withRouter(Upload));
