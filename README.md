This project is maintained at https://www.gitlab.com/jeswin/redux-jetpack

# redux-jetpack

Helpers for Boilerplate-free Redux

Based on ["Implementing Redux is tedious. But it doesn’t have to be."](https://medium.com/@jeswin/implementing-redux-is-tedious-but-it-doesnt-have-to-be-33702a1fb1dd)

### Install

```
npm install redux-jetpack
```

### Usage

Here is an example.

```js
  /*
    This is the shape of your store's state
  */

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

  /* Create the store */
  const store = jetpack.createStore(initialState);

  /* Your component */
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

  /* Connect the component to the store */
  const Wrapped = jetpack.connect(MyComponent, (state: State) => state.user);

  /* Wrap component in redux's Provider, you're ready to go. */
  const App = (
    <Provider store={store.reduxStore}>
      <Wrapped id={10} location="blr" />
    </Provider>
  );

  /* Enzyme test */
  const doc = mount(App) as any;
  doc
    .render()
    .find("h1")
    .should.have.text("Hello jeswin (blr, 10)");
```

For more examples, see [the tests](https://github.com/jeswin/redux-jetpack/blob/master/src/test/test.tsx)
