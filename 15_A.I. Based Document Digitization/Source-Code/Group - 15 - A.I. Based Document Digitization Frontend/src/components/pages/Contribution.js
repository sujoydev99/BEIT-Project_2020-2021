import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import { Button, Card, message, Row, Col, Divider, Tooltip, Image } from "antd";
import { editDoc, getDoc } from "../../actions/docActions";
import { getContribution } from "../../actions/contributionActions";

const Doc = ({ getContribution, error, contribution, loading, auth }) => {
  const [json, setJson] = useState({});
  const { id } = useParams();
  useEffect(() => {
    getContribution(id);
  }, [id]);
  useEffect(() => {
    if (error.data) message.error(error.data.message);
  }, [error]);

  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <Col span={11}>
          <Card className="customCard">
            <Image
              width={"100%"}
              src={`http://localhost:3000/staticRetrain/${contribution.fileName}`}
            />
          </Card>
        </Col>
        <Col style={{ height: "80vh" }}>
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>

        <Col span={11}>
          <Card className="customCard">
            <ReactJson src={contribution.annotation} />
          </Card>
         
          <br />
        </Col>
      </Row>
    </div>
  );
};

Doc.propTypes = {
  getContribution: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  contribution: state.contribution.contribution,
  loading: state.loading,
});

export default connect(mapStateToProps, {
  getContribution,
})(withRouter(Doc));
