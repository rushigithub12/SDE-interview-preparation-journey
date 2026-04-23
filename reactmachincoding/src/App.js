import logo from "./logo.svg";
import "./App.css";
import Accordian from "./components/accordian/Accordian";
import AutoCompleteWrapper from "./components/autoComplete/component/AutoCompleteWrapper";
import Calculator from "./components/calculator/Calculator";
import { CalculatorEval } from "./components/calculator/CalculatorEval";
import Carousel from "./components/corousel/Carousel";
import LocalStorageDemo from "./components/storage/LocalStorageDemo";
import CountDownTimer from "./components/countDowntimer/CountDownTimer";
import RandomUserCard from "./components/randomUserCard/RandomUserCard";
import DragNDropComponent from "./components/dragndrop/DragNDropComponent";
import DropdownWrapper from "./components/dropdown/DropdownWrapper";
import Dropdown2 from "./components/dropdown/Dropdown2";
import Directory from "./components/file-directory/Directory";
import FormValidationWrapper from "./components/formValidation/FormValidationWrapper";
import GridLightsComponent from "./components/grid-lights/GridLightsComponent";
import JobBoardCard from "./components/jobBoard/JobBoardCard";

function App() {
  return (
    <div className="App">
      {/* <Accordian /> */}
      {/* <AutoCompleteWrapper /> */}
      {/* <Calculator /> */}
      {/* <CalculatorEval /> */}
      {/* <Carousel /> */}
      {/* <LocalStorageDemo /> */}
      {/* <CountDownTimer /> */}
      {/* <RandomUserCard /> */}
      {/* <DragNDropComponent /> */}
      {/* <DropdownWrapper />
      <Dropdown2 /> */}
      {/* <Directory /> */}
      {/* <FormValidationWrapper /> */}
      {/* <GridLightsComponent /> */}
      <JobBoardCard />
    </div>
  );
}

export default App;
