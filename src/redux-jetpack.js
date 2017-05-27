import React, { Component } from "react";
import { createStore as reduxCreateStore } from "redux";
import { connect as reduxConnect } from "react-redux";

let store;

export function createStore(initialState) {
  const args = [].slice.call(arguments).slice(1);
  store = reduxCreateStore.apply(
    undefined,
    [
      reducer,
      initialState,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    ].concat(args)
  );
  return store;
}

function reducer(state, action) {
  return action && action.__replaceState ? action.state : state;
}

export function getState(selector) {
  return selector ? selector(store.getState()) : store.getState();
}

export function updateState(property, update, actionType) {
  const state = store.getState();
  const newState = { ...state, [property]: update(state[property]) };
  store.dispatch({
    type: actionType || "REPLACE_STATE",
    __replaceState: true,
    state: newState
  });
}

export function replaceState(newState) {
  store.dispatch({
    type: "REPLACE_STATE",
    __replaceState: true,
    state: newState
  });
}


export function connect(ActualComponent, mapStateToProps = state => state) {
  class Container extends Component {
    render() {
      return <ActualComponent {...this.props} />;
    }
  }

  const connector = reduxConnect(mapStateToProps);
  return connector(Container);
}
