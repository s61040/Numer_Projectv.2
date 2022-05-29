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
    title: "X0",
    dataIndex: "x1",
    key: "x1",
  },
  {
    title: "X",
    dataIndex: "x2",
    key: "x2",
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

class Onepoint extends React.Component {
  constructor() {
    super();
    this.state = {
      size: "large",
      fx: "",
      x1: 0,
      x2: 0,
      x0: 0,
      showTable: false,
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  Graph(x2) {
    dataGraph = [
      {
        type: "scatter",
        x: x2,
        marker: {
          color: "#3c753c",
        },
        name: "X1",
      },
    ];
  }

  func(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope);
  }

  error(xm, x0) {
    return Math.abs(xm - x0);
  }

  createTable(x2, x1, error) {
    dataTable = [];
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        iteration: i,
        x2: x2[i],
        x1: x1[i],
        error: error[i],
      });
    }
    console.log(x1);
  }

  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(this.state);
  };


  async ex() {
    await axios.get ( 'http://localhost:8000/onepoint')
    .then((response) => {
      console.log("response: ", response.data);
      api = response.data;
    });
    await this.setState({
      fx: api.fx,
      x1: api.x1,
    });
  }

  /* async ex() {
    await axios({method: "get",url: "http://localhost:7000/database/onepoint",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
        fx:api.fx,
        x1:api.x1,
        })
    } */

  onSubmit() {
    var fx = this.state.fx;
    var x1 = this.state.x1;
    var x2 = 0;
    var xm = 0;
    var check = 0;
    var x0 = 0;
    var i = 0;
    var error = 1;
    var data = [];
    data["x1"] = [];
    data["x2"] = [];
    data["error"] = [];
    data["iteration"] = [];

    check = this.func(x1);
    while (abs(check) >= 0.000001) {
      check = (this.func(x1) - parseFloat(x1)) / this.func(x1);
      x2 = x1;
      x1 = this.func(x1);
      error = this.error(x1, x2);
      data["iteration"][i] = i;
      data["x1"][i] = parseFloat(x1).toFixed(6);
      data["x2"][i] = parseFloat(x2).toFixed(6);
      data["error"][i] = error.toFixed(6);

      i++;
    }
    console.log(this.state);
    this.createTable(data["x2"], data["x1"], data["error"]);
    this.setState({ showTable: true, showGrap: true });
    this.Graph(data["x2"]);
  }

  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Onepoint</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container>
          <h1>
            <b>
              <u>OnePoint</u>
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
            <InputGroup.Text id="basic-addon1">Xi-1</InputGroup.Text>
            <FormControl
              size="large"
              placeholder="Input your Xl"
              name="x1"
              style={{ width: 200 }}
              onChange={this.onInputChange}
              value={this.state.x1}
            />
            <ul></ul>
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
              <Plot
                data={dataGraph}
                layout={{ width: 1250, height: 500, title: "BISECTION" }}
              />
              <Table columns={columns} dataSource={dataTable} size="middle" />
            </div>
          ) : (
            ""
          )}
        </Container>
      </div>
    );
  }
}
export default Onepoint;
