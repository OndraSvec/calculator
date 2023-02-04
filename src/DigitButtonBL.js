import { ACTIONS } from "./App";
import "./App.css";

export default function DigitButtonBL({dispatch, digit}) {
    return (
        <button className="bottom-left" onClick={() => dispatch({type: ACTIONS.ADD_DIGIT, payload: { digit }})}>
            {digit}
        </button>
    )
}