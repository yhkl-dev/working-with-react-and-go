import React, { Component } from 'react';
import reactDom from 'react-dom';
import AppFooter from './AppFooter';
import AppContent from './AppContent';
import AppHeader from './AppHeader';
import AppFooterFunctionalComponents from './AppFooterFunctionalComponent';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.handlePostChange = this.handlePostChange.bind(this);
    this.state = { posts: [] };
  }

  handlePostChange(posts) {
    this.setState({ posts: posts })
  }
  render() {
    const myProps = {
      title: "My Cool App!",
      subject: "My Subject",
      favouriteColor: "red",
    }
    return (
      <div className="app">
        <AppHeader {...myProps} posts={this.state.posts} handlePostChange={this.handlePostChange} />
        <AppContent handlePostChange={this.handlePostChange} posts={this.state.posts} />
        <AppFooterFunctionalComponents myProperty="hello world!" />
      </div>
    );
  }
}

reactDom.render(<App />, document.getElementById('root'));