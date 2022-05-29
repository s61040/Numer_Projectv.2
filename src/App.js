import { Routes, Route , Link } from "react-router-dom";
import Navbarbg from './component/navbar';
import Home from "./component/Home";
import Bisection from "./Root of Equation/Bisection";
import Falseposition from "./Root of Equation/Falseposition";
import Onepoint from "./Root of Equation/Onepoint";
import NewtonRapson from "./Root of Equation/NewtonRapson";
import Secant from "./Root of Equation/Secant";
import GaussElimination from "./Linear Equations/Gauss Elimination";
import Cholesky from "./Linear Equations/Cholesky Decomposition";
import Cramer from "./Linear Equations/Cramer";
import GaussJordan from "./Linear Equations/Gauss Jordan";
import LUDecomposion from "./Linear Equations/LU-Decomposion";
import Jacobi from "./Linear Equations/Jacobi Iteration";

function App() {
  return (
    <div className="App">
      <Navbarbg></Navbarbg>


      <Routes>
        
        <Route path="*" element={ <Error/> } />
        
      
        <Route path="/Bisection" element={ <Bisection/> } />
        <Route path="/Falseposition" element={ <Falseposition/> } />
        <Route path="/Onepoint" element={ <Onepoint/> } />
        <Route path="/NewtonRapson" element={ <NewtonRapson/> } />
        <Route path="/Secant" element={ <Secant/> } />



     -----------------------------------------------------------------------
     <Route path="/GaussElimination" element={ <GaussElimination/> } />
     <Route path="/CholeskyDecomposition" element={ <Cholesky/> } />
     <Route path="/Cramer" element={ <Cramer/> } />
     <Route path="/GaussJordan" element={ <GaussJordan/> } />
     <Route path="/LU-Decomposion" element={ <LUDecomposion/> } />
     <Route path="/JacobiIteration" element={ <Jacobi/> } />
        
      </Routes>
      
    </div>

  );

  function Error() {
    return (
     <div>
       <nav>
         <ul>
           <Link to = "/">Home</Link>
         </ul>
       </nav>
     </div>
      );
  }
}

export default App;
