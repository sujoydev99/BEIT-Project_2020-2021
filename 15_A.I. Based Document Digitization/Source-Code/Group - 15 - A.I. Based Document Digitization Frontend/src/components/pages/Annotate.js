import React from "react";
// import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Select,
  Card,
  message,
  Image,
  Row,
  Col,
  Tag,
  Form,
  Input,
} from "antd";
import { TokenAnnotator, TextAnnotator } from "react-text-annotate";
import {
  getLabels,
  getTextExtract,
  sendAnnotation,
} from "../../actions/extractActions";
import ReactJson from "react-json-view";
const { Option } = Select;

class Annotate extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      tag: [],
      fileUrl: null,
      file: null,
      labels: [],
      data: {
        content: "",
      },
      newTag: "",
      colors: {},
      tagError:false
    };
  }

  componentDidMount() {
    this.props.getLabels();
    setTimeout(() => {
      this.setState({ ...this.state, labels: this.props.lblData });
      for (let i = 0; i < this.props.lblData.length; i++) {
        let color = this.getRandomColor();
        this.setState({
          ...this.state,
          colors: { ...this.state.colors, [this.props.lblData[i]]: color },
        });
      }
    }, 1000);
  }

  handleChange = (value) => {
    this.setState({ value });
  };

  selectHandler = (e) => {
    this.setState({ tag: e });
  };
  addLabelHandler = (e) => {
    if(this.state.newTag===""){
      this.setState({ ...this.state, tagError: true });
      return
    }
    let k = this.state.labels;
    k.push(this.state.newTag);
    let color = this.getRandomColor();
    this.setState({
      ...this.state,
      labels: k, newTag: "", tagError:false,
      colors: { ...this.state.colors, [this.state.newTag]: color },
    });
  };
  fileChangedHandler = (e) => {
    this.setState({ file: e.target.files[0] });
    let fr = new FileReader();
    this.setState({ fileUrl: URL.createObjectURL(e.target.files[0]) });
  };
  saveTrainingData = () => {
    let postBody = {
      content: this.state.data.content,
      annotation: [],
    };
    let annoList = [];
    for (let i = 0; i < this.state.value.length; i++) {
      let anno = this.state.value[i];
      annoList.push({
        label: [anno.tag],
        points: [{ start: anno.start, end: anno.end, text: anno.text }],
      });
    }
    postBody.annotation = annoList;
    this.props.sendAnnotation(postBody, this.state.data._id["$oid"]);
  };
  uploadHandler = (e) => {
    if (!this.state.file) {
      message.error("please select a pdf/image file");
      console.log(this.state);
      return;
    }
    let form = new FormData();
    form.append("file", this.state.file);

    this.props.getTextExtract(form);
    setTimeout(() => {
      console.log(this.props.data.content);
      this.setState({ ...this.state, data: this.props.data });
    }, 4000);
  };
  getRandomColor = () => {
    var letters = "aBCDEF1234567890".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <Row gutter={[16,16]}>
          <Col span={24}>
            {" "}
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Col span={12}>
                {" "}
                <Card title="Upload file To get raw text" style={{}}>
                  <input
                    type="file"
                    onChange={this.fileChangedHandler}
                    id="file"
                    className="inputFile"
                    accept="image/*,application/pdf"
                  />
                  
                  <Button onClick={this.uploadHandler} type="primary">
                    Get Text{" "}
                  </Button>
                  <br />
                  <br />
                  <Form
                    name="login_form"
                    className="login-form"
                    initialValues={{
                      remember: true,
                    }}
                  >
                    <Form.Item
                      name="label"
                      hasFeedback
                      rules={[
                        {
                          message: "Add an entity!!",
                        },
                      ]}
                      help="Add an entity!!"
                      validateStatus={!this.state.tagError ? "success" : "error"}
                    >
                      <Input
                        onChange={(e) => {
                          let { id, value } = e.target;
                          this.setState({ ...this.state, newTag: value });
                        }}
                        value={this.state.newTag}
                        id="newTag"
                        placeholder="custom entity label"
                        vali
                      />
                    </Form.Item>
                      <Button onClick={this.addLabelHandler} type="primary">
                        Add
                      </Button>
                  </Form>
                  <br />
                  <br />
                  <Select
                    style={{ width: 200 }}
                    onChange={this.selectHandler}
                    defaultValue="choose or create a label"
                  >
                    {this.state.labels.map((i, index) => (
                      <Option defaultValue="select a label" value={i}>
                        <Tag color={this.state.colors[i]}>{i}</Tag>
                        {/* {i} */}
                      </Option>
                    ))}
                  </Select>
                  <br />
                  <br />
                  <TextAnnotator
                    style={{
                      maxWidth: 500,
                      lineHeight: 1.5,
                    }}
                    content={this.state.data.content}
                    value={this.state.value}
                    onChange={this.handleChange}
                    getSpan={(span) => ({
                      ...span,
                      tag: this.state.tag,
                      color: this.state.colors[this.state.tag],
                    })}
                  />
                </Card>
              </Col>
              <Col
                span={12}
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <Image width={"150px"} src={this.state.fileUrl} />
                {this.state.loading === true ? (
                  <LoadingOutlined style={{ fontSize: 44 }} spin />
                ) : null}
              </Col>
            </Row>
          </Col>

          <br />
          <br />
          <br />
          <Col span={24}>
            <Card title="Your Data">
              <ReactJson src={this.state.value} />
            </Card>
          </Col>
          <br />
          <br />
          <br />
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <Button onClick={this.saveTrainingData} type="primary">
              Save Training Data
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
Annotate.propTypes = {
  getTextExtract: PropTypes.func.isRequired,
  getLabels: PropTypes.func.isRequired,
  sendAnnotation: PropTypes.func.isRequired,
};
const mapStateToProps = function (state) {
  return {
    auth: state.auth,
    error: state.error,
    loading: state.loading,
    lblData: state.content.labels,
    data: state.content.content,
  };
};

export default connect(mapStateToProps, {
  getLabels,
  getTextExtract,
  sendAnnotation,
})(Annotate);
