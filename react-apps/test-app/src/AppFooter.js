import React, { Component, Fragment } from 'react';
import './AppFooter.css'


export default class AppFooter extends Component {
  render() {
    const currentYear = new Date().getFullYear();
    return (
      <Fragment>
        <hr />
        <p className="footer">CopyRight &copy; 2020 - {currentYear} YHKL</p>
      </Fragment>
    );
  }
}