import Container from "react-bootstrap/Container";
import Navbarbg from "../component/navbar";
import React, { Component } from "react";
import { Input, Typography, Button, Card } from "antd";
import { range, compile, evaluate, simplify, parse, abs } from "mathjs";
import { Routes, Route, Link } from "react-router-dom";
import { InputGroup, FormControl, Navbar, Nav  } from "react-bootstrap";
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};


var A = [], B = [], matrixA = [], matrixB = [], x, epsilon, dataInTable = [], count = 1, matrixX = []
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    }
];
class Jacobi extends Component {

    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm: true,
            showMatrixForm: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.jacobi = this.jacobi.bind(this);

    }


    jacobi(n) {
        this.initMatrix();
        var temp;
        var xold;
        epsilon = new Array(n);
        do {
            temp = [];
            xold = JSON.parse(JSON.stringify(x));
            for (var i = 0; i < n; i++) {
                var sum = 0;
                for (var j = 0; j < n; j++) {
                    if (i !== j) { 
                        sum = sum + A[i][j] * x[j];
                    }
                }
                temp[i] = (B[i] - sum) / A[i][i]; 

            }
            x = JSON.parse(JSON.stringify(temp));
        } while (this.error(x, xold)); 

        this.setState({
            showOutputCard: true
        });

    }
    error(xnew, xold) {
        for (var i = 0; i < xnew.length; i++) {
            epsilon[i] = Math.abs((xnew[i] - xold[i]) / xnew[i])
        }
        this.appendTable(x, epsilon);
        for (i = 0; i < epsilon.length; i++) {
            if (epsilon[i] > 0.000001) {
                return true;
            }
        }
        return false;
    }
    createMatrix(row, column) {
        A = []
        B = []
        matrixA = []
        matrixB = []
        matrixX = []
        x = []
        dataInTable = []
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "55px",
                    height: "30px",
                    fontSize: "18px",
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }
            matrixA.push(<br />)
            matrixB.push(<Input style={{
                width: "55px",
                height: "30px",
                fontSize: "18px",
            }}

            id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
            matrixB.push(<br />)
            matrixX.push(<Input style={{
                width: "55px",
                height: "30px",
                fontSize: "18px",
            }}
            id={"x" + i} key={"x" + i} placeholder={"x" + i} />)
            matrixX.push(<br />)

        }

        this.setState({
            showDimentionForm: true,
            showMatrixForm: true,
        })

    }
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            for (var j = 0; j < this.state.column; j++) {
                A[i][j] = (parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
            x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
        }
    }

    initialSchema(n) {
        for (var i = 1; i <= n; i++) {
            columns.push({
                title: "X" + i,
                dataIndex: "x" + i,
                key: "x" + i
            })
        }
        for (i = 1; i <= n; i++) {
            columns.push({
                title: "Error" + i,
                dataIndex: "error" + i,
                key: "error" + i
            })
        }
    }

    appendTable(x, error) {
        var tag = ''
        tag += '{"iteration": ' + count++ + ',';
        for (var i = 0; i < x.length; i++) {
            tag += '"x' + (i + 1) + '": ' + x[i].toFixed(8) + ', "error' + (i + 1) + '": ' + error[i].toFixed(8);
            if (i !== x.length - 1) {
                tag += ','
            }
        }
        tag += '}';
        dataInTable.push(JSON.parse(tag));
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


  /*   async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:7000/database/jacobi",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            row: api.row,
            column: api.column
        });
        matrixA = [];
        matrixB = [];
        matrixX = [];
        await this.createMatrix(api.row, api.column);
        await this.initialSchema(this.state.row);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =
                    api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
            document.getElementById("x" + i).value = api.matrixX[i - 1];
        }
        this.jacobi(parseInt(this.state.row));
    } */


    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:8000/jacobi",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            row: api.row,
            column: api.column
        });
        matrixA = [];
        matrixB = [];
        matrixX = [];
        await this.createMatrix(api.row, api.column);
        await this.initialSchema(this.state.row);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =
                    api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
            document.getElementById("x" + i).value = api.matrixX[i - 1];
        }
        this.jacobi(parseInt(this.state.row));
    }

    render() {
      let { row, column } = this.state;
      return (
          <div>
              <div>
                  <Navbar bg="primary" variant="dark">
                      <Container>
                          <Navbar.Brand href="#home">Jacobi Iteration</Navbar.Brand>
                      </Container>
                  </Navbar>
                  <Container>
                      <div style={{ textAlign: 'center' }}>
                          {this.state.showDimentionForm &&
                              <div>
                                  <Container>
                                      <h1><b><u>Jacobi Iteration</u></b></h1>
                                      <br></br>
                                      <InputGroup className="mb-3">
                                          <InputGroup.Text id="basic-addon1">
                                              ROW
                                          </InputGroup.Text>
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
                                      <Button type="submit"
                                          variant="success"
                                          size="lg" block
                                          style={{
                                              width: "555px",
                                              height: "40px"
                                          }}
                                          onClick={
                                              () => this.createMatrix(row, column)
                                          }>
                                          CreateMatrix
                                      </Button>
                                      <ul>  </ul>
                                      <Button type="submit"
                                          variant="success"
                                          size="lg" block
                                          style={{
                                              width: "555px",
                                              height: "40px"
                                          }}
                                          onClick={() => this.dataapi()}>
                                          API
                                      </Button>
                                  </Container>
                              </div>
                          }
                              <Container>
                                  <Container style={{ display: "flex" }}>
                                      {this.state.showMatrixForm &&
                                          <Container>
                                              <div style={{ display: "" }}>
                                                  <br />
                                                  <div >
                                                      <br />
                                                      <h5 >Matrix [A]</h5>{matrixA}<br />
                                                  </div>

                                                  <div style={{ display: "" }}>
                                                      <br />
                                                      <h5 >Vector [B]</h5>{matrixB}<br />
                                                  </div>
                                                  <br />
                                              </div>
                                              <Container>
                                                  <br />
                                                  <Button
                                                      size="large"
                                                      id="matrix_button"
                                                      style={{ width: 150, color: "black" }}
                                                      onClick={() => this.jacobi(this.state.row)}>
                                                      คำนวณ
                                              </Button>
                                              </Container>
                                          </Container>
                                      }
                                      <Container>
                                          <br />
                                          <br />
                                          {this.state.showOutputCard &&
                                              <Card
                                                  title={"Result"}
                                                  bordered={true}
                                                  style={{ width: "100%", background: "while", color: "#000000" }}
                                                  onChange={this.handleChange}>
                                                  <p style={{ fontSize: "24px", fontWeight: "bold" }}> </p>
                                              </Card>
                                          }
                                      </Container>
                                  </Container>
                              </Container>
                           </div>

                  </Container>

              </div>
          </div>
      );
  }
}
export default Jacobi;
