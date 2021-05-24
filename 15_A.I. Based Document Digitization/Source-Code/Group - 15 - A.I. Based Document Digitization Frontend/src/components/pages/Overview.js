import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Card, message, Row, Col} from "antd";
import { getOverview } from "../../actions/overviewActions";
import ReactApexChart from "react-apexcharts";

const Overview = ({ getOverview, error, loading, auth, overview }) => {
  useEffect(() => {
    getOverview();
  }, []);
  useEffect(() => {
    if (error.data) message.error(error.data.message);
  }, [error]);
  useEffect(() => {
    
    let arr = []
    if(overview.totalUploadExtractions){
    arr.push(overview.totalUploadExtractions);
    arr.push(overview.contributionCount);
    // arr.push(overview.contributionUnapproved);
    // arr.push(overview.contributionApproved);
    setSeries(arr);
    console.log(arr);}
  }, [overview]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col>
          {<Card title="Extractions">{overview.totalUploadExtractions}</Card>}
        </Col>
        <Col>
          {<Card title="Contributions">{overview.contributionCount}</Card>}
        </Col>
        {/* <Col>
          {<Card title="Unapproved">{overview.contributionUnapproved}</Card>}
        </Col>
        <Col>
          {<Card title="Approved">{overview.contributionApproved}</Card>}
        </Col> */}
      </Row>
      <br/>
      <Row gutter={16} style={{justifyContent:"center"}}>
        <Col>
          {
            <Card title="Activity">
              {series.length > 0 ? (
                <ReactApexChart
                  options={{
                    chart: {
                      height: 350,
                      type: "radialBar",
                    },
                    plotOptions: {
                      radialBar: {
                        dataLabels: {
                          name: {
                            fontSize: "22px",
                          },
                          value: {
                            fontSize: "16px",
                          },
                          total: {
                            show: true,
                            label: "Total",
                            formatter: function (w) {
                              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                              return series.reduce((a, b) => a + b, 0);
                            },
                          },
                        },
                      },
                    },
                    labels: [
                      "Extractions",
                      "Contributions",
                      // "Unpproved",
                      // "Approved",
                    ],
                  }}
                  series={
                    series.length > 0
                      ? series
                      : [0, 0, 0, 0]
                  }
                  type="radialBar"
                  height={350}
                />
              ) : null}
            </Card>
          }
        </Col>
      </Row>
    </div>
  );
};

Overview.propTypes = {
  getOverview: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  overview: state.overview.overview,
  loading: state.loading,
});

export default connect(mapStateToProps, {
  getOverview,
})(withRouter(Overview));
