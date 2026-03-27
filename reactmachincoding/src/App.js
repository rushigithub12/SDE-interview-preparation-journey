import logo from "./logo.svg";
import "./App.css";
import Accordian from "./components/accordian/Accordian";
import AutoCompleteWrapper from "./components/autoComplete/component/AutoCompleteWrapper";
import Calculator from "./components/calculator/Calculator";
import { CalculatorEval } from "./components/calculator/CalculatorEval";
import Carousel from "./components/corousel/Carousel";

function App() {
  return (
    <div className="App">
      {/* <Accordian /> */}
      {/* <AutoCompleteWrapper /> */}
      {/* <Calculator /> */}
      {/* <CalculatorEval /> */}
      <Carousel />
    </div>
  );
}

export default App;
