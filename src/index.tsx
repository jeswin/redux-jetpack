import * as React from "react";
import { Component } from "react";
import { createStore as reduxCreateStore, Store } from "redux";
import { connect as reduxConnect, DispatchProp } from "react-redux";

type PropertySelector<TState, TProperty> = (state: TState) => TProperty;

export interface State {
  [key: string]: any;
}

export interface ReduxStore<TState> {
  getState(): TState;
  dispatch(action: ReplaceAction<TState>): void;
}

export interface ReplaceAction<TState extends State> {
  type: string;
  state: TState;
  __replaceState: boolean;
}

export class JetPackStore<TState> {
  reduxStore: Store<TState>;

  constructor(reduxStore: Store<TState>) {
    this.reduxStore = reduxStore;
  }

  getState(): TState {
    return this.reduxStore.getState();
  }

  getStateFragment<PropertyKey extends keyof TState>(
    property: PropertyKey
  ): TState[PropertyKey] {
    const state = this.reduxStore.getState();
    return state[property];
  }

  updateState<PropertyKey extends keyof TState>(
    property: PropertyKey,
    updater: (state: TState[PropertyKey]) => TState[PropertyKey],
    actionName: string
  ) {
    const state = this.reduxStore.getState();
    const updatedState = {
      ...(state as any),
      [property]: updater(state[property])
    };
    this.reduxStore.dispatch({
      type: actionName,
      state: updatedState,
      __replaceState: true
    });
  }

  replaceState(updatedState: TState) {
    this.reduxStore.dispatch({
      type: "REPLACE_STATE",
      state: updatedState,
      __replaceState: true
    });
  }
}

function reducer<TState>(state: TState, action: ReplaceAction<TState>) {
  return typeof action !== "undefined" && action.__replaceState
    ? action.state
    : state;
}

export function createStore<TState>(initialState: TState) {
  const args = [].slice.call(arguments).slice(1);
  const store = reduxCreateStore.apply(
    undefined,
    [
      reducer,
      initialState,
      typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
        : undefined
    ].concat(args)
  );
  return new JetPackStore<TState>(store);
}

export function connect<TActualComponentProps, TState, TStateFragment>(
  ActualComponent:
    | React.ComponentClass<TActualComponentProps>
    | React.StatelessComponent<TActualComponentProps>,
  mapStateToProps: (state: TState) => TStateFragment
): React.ComponentClass<Partial<TActualComponentProps>> {
  class Container extends Component<any, any> {
    render() {
      return <ActualComponent {...this.props} />;
    }
  }

  const connector = reduxConnect(mapStateToProps);
  return connector(Container) as any;
}