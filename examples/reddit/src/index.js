import React from "react";
import { render } from "react-dom";
import { createStore } from "./redux-jetpack";
import { Provider } from "react-redux";
import App from "./components/App";

const initialState = {
  selectedReddit: "reactjs",
  postsByReddit: {}
};

render(
  <Provider store={createStore(initialState)}>
    <App />
  </Provider>,
  document.getElementById("root")
);
