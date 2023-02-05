import './App.css';
import { useReducer } from "react";
import DigitButton from './DigitButton';
import DigitButtonBL from './DigitButtonBL';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  EVALUATE: "evaluate",
  POSNEG_TOGGLE: "posneg-toggle"
};

const reducer = (state, { type, payload }) => {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      } else if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: `0${payload.digit}`
        };
      } else if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      } else if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }else if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand: "0",
        previousOperand: null,
        operation: null
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        };
      } else if (state.currentOperand == null) {
        return state;
      } else if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
        overwrite: true
      }
    case ACTIONS.POSNEG_TOGGLE:
      if (state.currentOperand === "0" || state.currentOperand == null) {
        return state;
      }
      if (parseFloat(state.currentOperand) < 0) {
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: state.currentOperand.split("-")[1]
        }
      }
      return {
        ...state,
        previousOperand: state.previousOperand,
        operation: state.operation,
        currentOperand: `-${state.currentOperand}`
      }
  };
};

function evaluate({ previousOperand, currentOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) {
    return "";
  }
  let computation = "";
  switch(operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
     break;
    case "÷":
      computation = prev / current;
      break;
    case "×":
      computation = prev * current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

function formatOperand(operand) {
  if (operand == null) {
    return
  }
  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(reducer, {});
  return (
    <div className="container">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <button onClick={() =>dispatch({type: ACTIONS.POSNEG_TOGGLE})}>+/-</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="×" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButtonBL digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two bottom-right" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
    </div>
  );
};

export default App;
