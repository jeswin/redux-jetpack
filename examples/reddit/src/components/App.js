import React, { Component } from "react";
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from "../actions";
import Picker from "./Picker";
import Posts from "./Posts";
import { connect } from "../redux-jetpack";

const initialState = {
  selectedReddit: "reactjs",
  postsByReddit: {}
};

class App extends Component {
  componentDidMount() {
    fetchPostsIfNeeded(this.props.selectedReddit);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { selectedReddit } = nextProps;
      fetchPostsIfNeeded(selectedReddit);
    }
  }

  handleChange = nextReddit => {
    selectReddit(nextReddit);
  };

  handleRefreshClick = e => {
    e.preventDefault();
    invalidateReddit(this.props.selectedReddit);
    fetchPostsIfNeeded(this.props.selectedReddit);
  };

  render() {
    const { selectedReddit, postsByReddit } = this.props;

    const {
      isFetching,
      lastUpdated,
      items: posts
    } = postsByReddit[selectedReddit] || {
      isFetching: true,
      items: []
    };

    const isEmpty = !posts || posts.length === 0;
    return (
      <div>
        <Picker
          value={selectedReddit}
          onChange={this.handleChange}
          options={["reactjs", "frontend"]}
        />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {" "}
            </span>}
          {!isFetching &&
            <a href="#" onClick={this.handleRefreshClick}>
              Refresh
            </a>}
        </p>
        {isEmpty
          ? isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>}
      </div>
    );
  }
}

export default connect(App);
