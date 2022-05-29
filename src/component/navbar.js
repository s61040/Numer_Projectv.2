import { Navbar,Container,Nav,NavDropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bisection from '../Root of Equation/Bisection';


export default function Navbarbg() {
    return (
        <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Numer-metod</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/.">Home</Nav.Link>

              <NavDropdown title="Root of Equation" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Bisection">Bisection</NavDropdown.Item>
                <NavDropdown.Item href="Falseposition">False-position</NavDropdown.Item>
                <NavDropdown.Item href="Onepoint">One-point</NavDropdown.Item>
                <NavDropdown.Item href="NewtonRapson">Newton-rapson</NavDropdown.Item>
                <NavDropdown.Item href="Secant">Secant</NavDropdown.Item>
                <NavDropdown.Divider />
              </NavDropdown>
              <NavDropdown title="Linear Equations" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Cramer">Cramer</NavDropdown.Item>
                <NavDropdown.Item href="GaussElimination">Gauss Elimination Method</NavDropdown.Item>
                <NavDropdown.Item href="GaussJordan">Gauss-Jordan Method</NavDropdown.Item>
                <NavDropdown.Item href="LU-Decomposion">LU-Decomposion</NavDropdown.Item>
                <NavDropdown.Item href="CholeskyDecomposition">Cholesky Decomposition</NavDropdown.Item>
                <NavDropdown.Item href="JacobiIteration">Jacobi Iteration Method</NavDropdown.Item>
                <NavDropdown.Divider />
              </NavDropdown>
             
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
