"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
class JetPackStore {
    constructor(reduxStore) {
        this.reduxStore = reduxStore;
    }
    getState() {
        return this.reduxStore.getState();
    }
    getStateFragment(property) {
        const state = this.reduxStore.getState();
        return state[property];
    }
    updateState(property, updater, actionName) {
        const state = this.reduxStore.getState();
        const updatedState = Object.assign({}, state, { [property]: updater(state[property]) });
        this.reduxStore.dispatch({
            type: actionName,
            state: updatedState,
            __replaceState: true
        });
    }
    replaceState(updatedState) {
        this.reduxStore.dispatch({
            type: "REPLACE_STATE",
            state: updatedState,
            __replaceState: true
        });
    }
}
exports.JetPackStore = JetPackStore;
function reducer(state, action) {
    return typeof action !== "undefined" && action.__replaceState
        ? action.state
        : state;
}
function createStore(initialState) {
    const args = [].slice.call(arguments).slice(1);
    const store = redux_1.createStore.apply(undefined, [
        reducer,
        initialState,
        typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : undefined
    ].concat(args));
    return new JetPackStore(store);
}
exports.createStore = createStore;
function connect(ActualComponent, mapStateToProps) {
    class Container extends react_1.Component {
        render() {
            return react_1.default.createElement(ActualComponent, Object.assign({}, this.props));
        }
    }
    const connector = react_redux_1.connect(mapStateToProps);
    return connector(Container);
}
exports.connect = connect;