import * as React from "react";
import { Component } from "react";
import {
  createStore as reduxCreateStore,
  Store,
  StoreEnhancer,
  AnyAction
} from "redux";
import { connect as reduxConnect, DispatchProp } from "react-redux";

type PropertySelector<TStoreState, TProperty> = (state: TStoreState) => TProperty;

export interface State {
  [key: string]: any;
}

export interface ReduxStore<TStoreState> {
  getState(): TStoreState;
  dispatch(action: ReplaceAction<TStoreState>): void;
}

export interface ReplaceAction<TStoreState extends State> {
  type: string;
  state: TStoreState;
  __replaceState: boolean;
}

export class JetPackStore<TStoreState> {
  reduxStore: Store<TStoreState>;

  constructor(reduxStore: Store<TStoreState>) {
    this.reduxStore = reduxStore;
  }

  getState(): TStoreState {
    return this.reduxStore.getState();
  }

  getStateFragment<PropertyKey extends keyof TStoreState>(
    property: PropertyKey
  ): TStoreState[PropertyKey] {
    const state = this.reduxStore.getState();
    return state[property];
  }

  updateState<PropertyKey extends keyof TStoreState>(
    property: PropertyKey,
    updater: (state: TStoreState[PropertyKey]) => TStoreState[PropertyKey],
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

  replaceState(updatedState: TStoreState) {
    this.reduxStore.dispatch({
      type: "REPLACE_STATE",
      state: updatedState,
      __replaceState: true
    });
  }
}

export function createStore<TStoreState>(
  initialState: TStoreState,
  enhancer?: StoreEnhancer
): JetPackStore<TStoreState> {
  function reducer<TStoreState>(state: TStoreState, action: AnyAction) {
    return typeof action !== "undefined" && action.__replaceState
      ? action.state
      : state;
  }

  const store: Store = reduxCreateStore.apply(undefined, [
    reducer,
    initialState,
    enhancer
  ]);

  return new JetPackStore<TStoreState>(store);
}

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export function connect<
  TActualComponentProps,
  TActualComponentState,
  TStoreState,
  TApplicableState
>(
  ActualComponent:
    | React.ComponentClass<TActualComponentProps, TActualComponentState>
    | React.StatelessComponent<TActualComponentProps>,
  mapStateToProps: (state: TStoreState) => TApplicableState
): React.ComponentClass<
  Without<TActualComponentProps, keyof TApplicableState>
> {
  class Container extends Component<any, any> {
    render() {
      return <ActualComponent {...this.props as any} />;
    }
  }

  const connector = reduxConnect(mapStateToProps);
  return connector(Container) as any;
}
