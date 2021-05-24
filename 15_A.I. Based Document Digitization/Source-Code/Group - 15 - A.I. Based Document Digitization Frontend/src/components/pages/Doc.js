import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter, useParams } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import { JsonEditor } from "react-json-edit";

import { EditOutlined, SaveOutlined,DeleteOutlined  } from "@ant-design/icons";
import {
  Button,
  Card,
  message,
  Row,
  Col,
  Divider,
  Tooltip,
  Image,
} from "antd";
import { editDoc, getDoc } from "../../actions/docActions";

const Doc = ({ getDoc, editDoc, error, doc, loading, auth }) => {
  const [edit, setEdit] = useState(false);
  const [json, setJson] = useState({});
  const { id } = useParams();
  useEffect(() => {
    getDoc(id);
  }, [id]);
  useEffect(() => {
    if (error.data) message.error(error.data.message);
  }, [error]);
  const callback = (changes) => {
    setJson(changes)
  };
  const saveData = (meta) => {
    console.log(meta);
    editDoc(id, meta)
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <Col span={11}>
          <Card className="customCard">
            <Image
              width={"100%"}
              src={`http://localhost:3000/static/${doc.fileName}`}
            />
          </Card>
        </Col>
        <Col style={{ height: "80vh" }}>
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>

        <Col span={11}>
          <Card className="customCard">
            <ReactJson src={doc} />
            <br />
            <Tooltip title="Edit Extracted JSON meta data">
              <Button
                type="primary"
                shape="circle"
                onClick={() => {
                  setEdit(!edit);
                  setJson(doc)
                }}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
          </Card>
          <br />

          {edit === true ? (
            <Card className="customCard" title="Edit Data">
              <JsonEditor value={doc.metaData} propagateChanges={callback} />
              <br />
              <div style={{display:"flex", justifyContent:"space-evenly"}}>
                
              <Tooltip title="Save Edited Data">
                <Button type="primary" shape="circle" onClick={() => {
                  saveData(json)
                }}>
                  <SaveOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Undo All Changes">
                <Button type="danger" shape="circle" onClick={() => {
                  setEdit(!edit);
                  setJson({})
                }}>
                  <SaveOutlined />
                </Button>
              </Tooltip>
              </div>
            </Card>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

Doc.propTypes = {
  getDoc: PropTypes.func.isRequired,
  editDoc: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  doc: state.doc.doc,
  loading: state.loading,
});

export default connect(mapStateToProps, {
  getDoc,editDoc
})(withRouter(Doc));
