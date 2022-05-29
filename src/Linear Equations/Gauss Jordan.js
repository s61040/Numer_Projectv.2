import Container from "react-bootstrap/Container";
import Navbarbg from "../component/navbar";
import React, { Component } from "react";
import { Input, Typography, Button, Table ,Card} from "antd";
import { range, compile, evaluate, simplify, parse, abs } from "mathjs";
import { Routes, Route, Link } from "react-router-dom";
import { InputGroup, FormControl, Navbar, Nav } from "react-bootstrap";
import 'antd/dist/antd.css';
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};

var A = [], B = [], matrixA = [], matrixB = [], output = []
class GaussJordan extends Component {

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
        this.jordan = this.jordan.bind(this);

    }

    jordan(n) {
        this.initMatrix();
        if (A[0][0] === 0) { 
            var tempRow = JSON.parse(JSON.stringify(A[0]));
            var tempColumn = B[0];
            A[0] = A[1];
            A[1] = tempRow;
            B[0] = B[1];
            B[1] = tempColumn;
        }
        //Forward eliminate
        for (var k = 0; k < n; k++) {
            for (var i = k + 1; i < n; i++) {
                var factor = A[i][k] / A[k][k];
                for (var j = k; j < n; j++) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                }
                B[i] = B[i] - factor * B[k];
                //B[i] = parseFloat(B[i]).toFixed(0);

            }
        }
        //Backward Substitution
        for (k = n - 1; k >= 0; k--) {
            for (i = k; i >= 0; i--) {

                if (i === k) {
                    factor = 1 / A[i][k];

                    for (j = 0; j < n; j++) {
                        A[i][j] = A[i][j] * factor;
                    }
                    B[i] = B[i] * factor;
                    B[i].toFixed(0);

                }
                else {
                    factor = A[i][k] / A[k][k];
                    for (j = 0; j < n; j++) {
                        A[i][j] = A[i][j] - factor * A[k][j];
                    }
                    B[i] = B[i] - factor * B[k];
                    B[i].toFixed(0);
                }
            }
        }
        for (i = 0; i < n; i++) {
            // output.push("x" + (i + 1) + " = " + B[i]);
            output.push(<h5>X<sub>{i}</sub>&nbsp;=&nbsp;&nbsp;{B[i]}</h5>);
            // if(i < n){
            //     output.push(<br></br>)
            // }
        }
        this.setState({
            showOutputCard: true
        });


    }
    createMatrix(row, column) {
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
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    /* async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:7000/database/gauss",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
          row: api.row,
          column: api.column,
        });
        matrixA = [];
        matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
          for (let j = 1; j <= api.column; j++) {
            document.getElementById("a" + i + "" + j).value =
              api.matrixA[i - 1][j - 1];
          }
          document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.jordan(api.row);
      } */



    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:8000/gauss",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
          row: api.row,
          column: api.column,
        });
        matrixA = [];
        matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
          for (let j = 1; j <= api.column; j++) {
            document.getElementById("a" + i + "" + j).value =
              api.matrixA[i - 1][j - 1];
          }
          document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.jordan(api.row);
      } 
      render() {
        let { row, column } = this.state;
        return (
            <div>
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Container>
                            <Navbar.Brand href="#home">Gauss Elimination</Navbar.Brand>
                        </Container>
                    </Navbar>
                    <Container>
                        <div style={{ textAlign: 'center' }}>
                            {this.state.showDimentionForm &&
                                <div>
                                    <Container>
                                        <h1><b><u>Gauss Elimination</u></b></h1>
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
                                                        onClick={() => this.jordan(this.state.row)}>
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
                                                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{output}</p>
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
export default GaussJordan;
