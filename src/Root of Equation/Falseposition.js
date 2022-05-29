// import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import React, { Component } from "react";
import { Input, Typography, Button, Table } from "antd";
import { range, compile, evaluate, simplify, parse, abs } from "mathjs";

import { Routes, Route, Link } from "react-router-dom";
import { InputGroup, FormControl, Nav, Navbar } from "react-bootstrap";
import Plot from "react-plotly.js";

import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";

const axios = require("axios");

const columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
  {
    title: "XL",
    dataIndex: "xl",
    key: "xl",
  },
  {
    title: "XR",
    dataIndex: "xr",
    key: "xr",
  },
  {
    title: "XM",
    dataIndex: "xm",
    key: "xm",
  },
  {
    title: "Error",
    dataIndex: "error",
    key: "error",
  },
];

var dataTable = [];
var dataGraph = [];
var api;

class Falseposition extends React.Component {
  constructor() {
    super();
    this.state = {
      fxr: [],
      fxl: [],
      fx: "",
      xl: 0,
      xr: 0,
      showTable: false,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  func(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope);
  }

  error(xo, xm) {
    return Math.abs((xm - xo) / xm);
  }

  createTable(xl, xr, xm, error) {
    dataTable = [];
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        iteration: i,
        xl: xl[i],
        xr: xr[i],
        xm: xm[i],
        error: error[i],
      });
    }
  }

  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(this.state);
  };

  async ex() {
    await axios.get ( 'http://localhost:8000/falseposition')
    .then((response) => {
      console.log("response: ", response.data);
      api = response.data;
    });
    await this.setState({
      fx: api.fx,
      xl: api.xl,
      xr: api.xr,
    });
  }

 /*  async ex() {
    await axios({method: "get",url: "http://localhost:7000/database/falseposition",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
        fx:api.fx,
        xl:api.xl,
        xr:api.xr
        })
    } */


  onSubmit() {
    var fx1 = this.state.fx;
    var xl1 = this.state.xl;
    var xr1 = this.state.xr;
    var xo = 0;
    var xm = 0;
    var i = 0;
    var error = 1;
    var data = [];
    data["xl"] = [];
    data["xr"] = [];
    data["xm"] = [];
    data["error"] = [];
    data["iteration"] = [];

    while (error >= 0.000001) {
      xm =
        (parseFloat(xl1) * this.func(xr1) - parseFloat(xr1) * this.func(xl1)) /
        (this.func(xr1) - this.func(xl1));
      console.log(xm);

      if (this.func(xm) == 0) {
        break;
      } else if (this.func(xm) * this.func(xr1) < 0) {
        this.state.fxl = this.func(xl1);
        xl1 = xm;
        this.state.xl1 = xm;
      } else {
        this.state.fxr = this.func(xr1);
        xr1 = xm;
        this.state.xr1 = xm;
      }

      error = this.error(xo, xm);

      data["iteration"][i] = i;
      data["xl"][i] = parseFloat(xl1).toFixed(6);
      data["xr"][i] = parseFloat(xr1).toFixed(6);
      data["xm"][i] = parseFloat(xm).toFixed(6);
      data["error"][i] = error.toFixed(6);
      xo = xm;
      i++;
    }
    console.log(this.state);

    this.createTable(data["xl"], data["xr"], data["xm"], data["error"]);
    this.setState({ showTable: true, showGrap: true });
    this.Graph(data["xl"], data["xr"]);
  }

  Graph(xl, xr) {
    dataGraph = [
      {
        type: "scatter",
        x: xl,
        marker: {
          color: "#a32f0f",
        },
        name: "Xl",
      },
      {
        type: "scatter",
        x: xr,
        marker: {
          color: "#3c753c",
        },
        name: "Xr",
      },
    ];
  }

  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Bisection</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container>
          <h1>
            <b>
              <u>Falseposition</u>
            </b>
          </h1>
          <br></br>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Equation</InputGroup.Text>
            <FormControl
              placeholder="Input your Function"
              name="fx"
              style={{ width: 250 }}
              onChange={this.onInputChange}
              value={this.state.fx}
            />
          </InputGroup>
          {/*-----------------------------------------------------------------------------------------------------------    */}

          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">XL</InputGroup.Text>
            <FormControl
              placeholder="Input your XL"
              name="xl"
              style={{ width: 200 }}
              onChange={this.onInputChange}
              value={this.state.xl}
            />
            <ul></ul>
            {/*-----------------------------------------------------------------------------------------------------------    */}
            <InputGroup.Text id="basic-addon1">XR</InputGroup.Text>
            <FormControl
              placeholder="Input your XR"
              name="xr"
              style={{ width: 200 }}
              onChange={this.onInputChange}
              value={this.state.xr}
            />
          </InputGroup>
        </Container>
        {/*-----------------------------------------------------------------------------------------------------------    */}
        <Container style={{ display: "flex" }}>
          <Button
            type="submit"
            variant="success"
            size="lg"
            block
            style={{
              width: "555px",
              height: "40px",
            }}
            onClick={this.onSubmit}
          >
            CAL
          </Button>
          <ul> </ul>
          <Button
            type="submit"
            variant="success"
            size="lg"
            block
            style={{
              width: "555px",
              height: "40px",
            }}
            onClick={() => this.ex()}
          >
            API
          </Button>
        </Container>
        <Container>
          {this.state.showTable === true ? (
            <div>
              <h2 className="mt-4"></h2>

              <Plot
                data={dataGraph}
                layout={{ width: 1250, height: 500, title: "Secant" }}
              />
              <Table
                pagination={{ defaultPageSize: 99999 }}
                columns={columns}
                dataSource={dataTable}
                size="middle"
              />
            </div>
          ) : (
            ""
          )}
        </Container>
      </div>
    );
  }
}
export default Falseposition;
