import "mocha";
import "should";
import * as jetpack from "../redux-jetpack";

const initialState = {
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
});
