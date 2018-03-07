import "mocha";
import "should";
import * as jetpack from "../";
import * as React from "react";
import { Provider } from "react-redux";
import "should-enzyme";
import { mount } from "enzyme";
import "./dom";

let Enzyme = require("enzyme");
let Adapter = require("enzyme-adapter-react-16");
Enzyme.configure({ adapter: new Adapter() });

type State = {
  networks: { type: string; count: number }[];
  user: {
    name: string;
  };
};

const initialState: State = {
  networks: [
    { type: "ssb", count: 1000 },
    { type: "ipfs", count: 100 },
    { type: "dat", count: 10 }
  ],
  user: {
    name: "jeswin"
  }
};

describe("redux-jetpack", async () => {
  it("Gets state", async () => {
    const store = jetpack.createStore(initialState);
    const state = store.getState();
    state.should.deepEqual({
      networks: [
        { type: "ssb", count: 1000 },
        { type: "ipfs", count: 100 },
        { type: "dat", count: 10 }
      ],
      user: {
        name: "jeswin"
      }
    });
  });

  it("Gets state fragment", async () => {
    const store = jetpack.createStore(initialState);
    const state = store.getStateFragment("user");
    state.should.deepEqual({
      name: "jeswin"
    });
  });

  it("Updates the state", async () => {
    const store = jetpack.createStore(initialState);
    store.updateState("user", state => ({ name: "linus" }), "CHANGE_NAME");
    const state = store.getState();
    state.user.name.should.equal("linus");
  });

  it("Replaces the state", async () => {
    const store = jetpack.createStore(initialState);
    store.replaceState({
      networks: [{ type: "torrent", count: 1000000 }],
      user: { name: "kim" }
    });
    const state = store.getState();
    state.should.deepEqual({
      networks: [{ type: "torrent", count: 1000000 }],
      user: { name: "kim" }
    });
  });

  it("Connects state to a component", async () => {
    const store = jetpack.createStore(initialState);

    const MyComponent = (props: {
      id: number;
      location: string;
      name: string;
    }) => (
      <div>
        <h1>
          Hello {props.name} ({props.location}, {props.id})
        </h1>
      </div>
    );
    const Wrapped = jetpack.connect(MyComponent, (state: State) => state.user);

    const App = (
      <Provider store={store.reduxStore}>
        <Wrapped id={10} location="blr" />
      </Provider>
    );

    const doc = mount(App) as any;
    doc
      .render()
      .find("h1")
      .should.have.text("Hello jeswin (blr, 10)");
  });
});
