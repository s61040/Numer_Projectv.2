import Container from "react-bootstrap/Container";
import Navbarbg from "../component/navbar";
import React, { Component } from "react";
import { Input, Typography, Button, Table } from "antd";
import { det } from "mathjs";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { InputGroup, FormControl, Navbar, Card } from "react-bootstrap";
var api;

var A = [],
  B = [],
  answer = [],
  matrixA = [],
  matrixB = [];
class Cramer extends React.Component {
  constructor() {
    super();
    this.state = {
      row: parseInt(0),
      column: parseInt(0),
      showDimentionForm: true,
      showMatrixForm: false,
      showOutputCard: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.cramer = this.cramer.bind(this);
  }
  cramer() {
    this.initMatrix();
    var counter = 0;
    while (counter != this.state.row) {
      var transformMatrix = JSON.parse(JSON.stringify(A));
      for (var i = 0; i < this.state.row; i++) {
        for (var j = 0; j < this.state.column; j++) {
          if (j === counter) {
            transformMatrix[i][j] = B[i];
            break;
          }
        }
      }
      counter++;
      answer.push(
        <h5>
          X<sub>{counter}</sub>=&nbsp;&nbsp;
          {Math.round(det(transformMatrix)) / Math.round(det(A))}
        </h5>
      );
    }
    this.setState({
      showOutputCard: true,
    });
  }
  createMatrix(row, column) {
    for (var i = 1; i <= row; i++) {
      for (var j = 1; j <= column; j++) {
        matrixA.push(
          <Input
            style={{
              width: "55px",
              height: "30px",
              fontSize: "18px",
            }}
            id={"a" + i + "" + j}
            key={"a" + i + "" + j}
            placeholder={"a" + i + "" + j}
          />
        );
      }

      matrixA.push(<br />);
      matrixB.push(
        <Input
          style={{
            width: "55px",
            height: "30px",
            fontSize: "18px",
          }}
          id={"b" + i}
          key={"b" + i}
          placeholder={"b" + i}
        />
      );
    }

    this.setState({
      showDimentionForm: true,
      showMatrixForm: true,
    });
  }
  initMatrix() {
    for (var i = 0; i < this.state.row; i++) {
      A[i] = [];
      for (var j = 0; j < this.state.column; j++) {
        A[i][j] = parseFloat(
          document.getElementById("a" + (i + 1) + "" + (j + 1)).value
        );
      }
      B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }


  /* async dataapi() {
    await axios({
        method: "get",
        url: "http://localhost:7000/database/cramer",
    }).then((response) => {
        console.log("response: ", response.data);
        api = response.data;
    });
    await this.setState({
        row: api.row,
        column: api.column,
    });
    await this.createMatrix(api.row, api.column);
    for (let i = 1; i <= api.row; i++) {
        for (let j = 1; j <= api.column; j++) {
            document.getElementById("a" + i + "" + j).value =
                api.matrixA[i - 1][j - 1];
        }
        document.getElementById("b" + i).value = api.matrixB[i - 1];
    }
    this.cramer();
} */



  async dataapi() {
    await axios
      .get("http://localhost:8000/cramer")
      .then((response) => {
        console.log("response: ", response.data);
        api = response.data;
      });
    await this.setState({
      row: api.row,
      column: api.column,
    });
    await this.createMatrix(api.row, api.column);
    for (let i = 1; i <= api.row; i++) {
      for (let j = 1; j <= api.column; j++) {
        document.getElementById("a" + i + "" + j).value =
          api.matrixA[i - 1][j - 1];
      }
      document.getElementById("b" + i).value = api.matrixB[i - 1];
    }
    this.cramer();
  }

  render() {
    let { row, column } = this.state;
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Cramer</Navbar.Brand>
          </Container>
        </Navbar>
        <body style={{ background: '#ffffff' }}>
          <div style={{ display: "flex" }}>
            <Container style={{ backgroud: '#ffffff' }}>
              <div style={{ textAlign: 'center' }}>
                {this.state.showDimentionForm && (
                  <div>
                    <Container>
                      <br></br>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">ROW</InputGroup.Text>
                        <FormControl
                          placeholder="Input your Row"
                          name="row"
                          style={{ width: 250 }}
                          onChange={this.handleChange}
                          value={this.state.row}
                        />
                      </InputGroup>
                      {/*-----------------------------------------------------------------------------------------------------------    */}

                      <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">
                          Columns
                        </InputGroup.Text>
                        <FormControl
                          placeholder="Input your Row"
                          name="column"
                          style={{ width: 250 }}
                          onChange={this.handleChange}
                          value={this.state.column}
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
                        }}onClick={
                          () => this.createMatrix(row, column)
                      }>
                        CreateMatrix
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
                        onClick={() => this.dataapi()}>
                        API
                      </Button>
                    </Container>
                  </div>
                )}
                <Container>
                  <Container style={{ display: "flex" }}>
                    {this.state.showMatrixForm && (
                      <Container>
                        <div style={{ display: "" }}>
                          <br />
                          <div>
                            <br />
                            <h5>Mattrix [A]</h5>
                            {matrixA}
                            <br />
                          </div>

                          <div style={{ display: "" }}>
                            <br />
                            <h5>Vector [B]</h5>
                            {matrixB}
                            <br />
                          </div>
                          <br />
                        </div>
                        <Container>
                          <br />
                          <Button
                            size="large"
                            id="matrix_button"
                            style={{ width: 150, color: "black" }}
                            onClick={() => this.cramer()}
                          >
                            คำนวณ
                          </Button>
                        </Container>
                      </Container>
                    )}
                    <Container>
                      <br />
                      <br />
                      {this.state.showOutputCard && (
                        <Card
                          title = {"Result"}
                          bordered={true}
                          style = {{
                            width: "100%",
                            background: "while",
                            color: "#000000",
                          }}
                          onChange={this.handleChange}>
                          <p style={{ fontSize: "24px", fontWeight: "bold" }}> {answer} </p>
                        </Card>
                      )}
                    </Container>
                  </Container>
                </Container>
              </div>
            </Container>
          </div>
        </body>
      </div>
    );
  }
}
export default Cramer;
