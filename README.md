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
```

For more examples, see [the tests](https://github.com/jeswin/redux-jetpack/blob/master/src/test/test.tsx)  