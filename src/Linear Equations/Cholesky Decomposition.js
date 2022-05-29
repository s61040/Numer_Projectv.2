import Container from "react-bootstrap/Container";
import Navbarbg from "../component/navbar";
import { lusolve, format } from "mathjs";
import React, { Component } from "react";
import axios from "axios";
import { Input, Card, Button } from "antd";

import { InputGroup, FormControl, Navbar, Nav } from "react-bootstrap";
const InputStyle = {
  background: "#1890ff",
  color: "white",
  fontWeight: "bold",
  fontSize: "24px",
};
var api;
var A = [],
  B = [],
  matrixA = [],
  matrixB = [],
  output = [],
  decompose;
class Cholesky extends Component {
  constructor() {
    super();
    this.state = {
      row: 0,
      column: 0,
      showDimentionForm: true,
      showMatrixForm: false,
      showOutputCard: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.cholesky = this.cholesky.bind(this);
  }

  cholesky(n) {
    this.initMatrix();
    var x = new Array(n);
    var y = new Array(n)

    if (matrixA[0][0] === 0) {
        for (var i = 0; i < n; i++) {
            var temp = A[0][i];
            matrixA[0][i] = B[i][i];
            matrixB[0][i] = temp;
        }
    }
    var matrixL = new Array(n);
    for (i = 0; i < n; i++) {
        matrixL[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            matrixL[i][j] = 0;
        }
        x[i] = 0;
        y[i] = 0;
    }
    matrixL[0][0] = Math.sqrt(matrixA[0][0]);
    for (var k = 1; k < n; k++) {

        for (i = 0; i < k; i++) {
            var sum = 0;
            if (i !== 0) {
                for (j = 0; j < i; j++) {
                    sum += matrixL[i][j] * matrixL[k][j];
                }
            }
            matrixL[k][i] = (matrixA[i][k] - sum) / matrixL[i][i];
        }
        sum = 0;
        for (j = 0; j < k; j++) {
            sum += matrixL[k][j] * matrixL[k][j];
        }
        matrixL[k][k] = Math.sqrt(matrixA[k][k] - sum);
    }
    ;
    y[0] = matrixB[0] / matrixL[0][0];
    for (i = 1; i < n; i++) {
        sum = 0;
        for (j = 0; j < i; j++) {
            sum += matrixL[i][j] * y[j];
        }
        y[i] = (matrixB[i] - sum) / matrixL[i][i];
    }

    x[n - 1] = y[n - 1] / matrixL[n - 1][n - 1];
    for (i = this.state.row - 2; i >= 0; i--) {
        sum = 0;
        for (j = i + 1; j < this.state.row; j++) {
            sum += matrixL[j][i] * x[j];
        }
        x[i] = (y[i] - sum) / matrixL[i][i];
    }

    decompose = lusolve(A, B)
    for (var i = 0; i < decompose.length; i++) {
        output.push(<h5>X<sub>{i}</sub>&nbsp;=&nbsp;&nbsp;{Math.round(decompose[i])}</h5>);
        //output.push(<br />)
    }

    this.setState({
        showOutputCard: true
    });
}
summation(L, k) {
    var sum = 0
    for (var i = 0; i < parseInt(this.state.row); i++) {
        for (var j = 0; j < i - 2; j++) {
            sum += L[i][j] * L[k][j]
        }
    }
    return sum
}
printFraction(value) {
    return format(value, { fraction: 'ratio' })
}

createMatrix(row, column) {
    output = []
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) {
            matrixA.push(<Input style={{
                width: "55px",
                height: "30px",
                fontSize: "18px",
                
            }}
                id={"a" + (i + 1) + "" + (j + 1)} key={"a" + (i + 1) + "" + (j + 1)} placeholder={"a" + (i + 1) + "" + (j + 1)} />)
        }
        matrixA.push(<br />)
        matrixB.push(<Input style={{
            width: "55px",
            height: "30px",
            fontSize: "18px",
            
        }}
            id={"b" + (i + 1)} key={"b" + (i + 1)} placeholder={"b" + (i + 1)} />)


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
  this.cholesky(this.state.row);
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
    this.cholesky(this.state.row);
}


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
  this.cholesky(this.state.row);
}


  render() {
    let { row, column } = this.state;
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Cholesky Decomposition</Navbar.Brand>
          </Container>
        </Navbar>
        <body style={{ background: "#ffffff" }}>
          <div style={{ display: "flex" }}>
            <Container style={{ backgroud: "#ffffff" }}>
              <div style={{ textAlign: "center" }}>
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
                        }}
                        onClick={() => this.createMatrix(row, column)}
                      >
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
                            onClick={() => this.cholesky(this.state.row)}>
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
                          title={"Result"}
                          bordered={true}
                          style={{
                            width: "100%",
                            background: "while",
                            color: "#000000",
                          }}
                          onChange={this.handleChange}
                        >
                          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                            {output}
                          </p>
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
export default Cholesky;
