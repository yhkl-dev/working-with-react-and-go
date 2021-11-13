import React, { Fragment } from "react";
import './AppFooter.css'

export default function AppFooterFunctionalComponents(props) {
  const currentYear = new Date().getFullYear();
  return (
    <Fragment>
      <hr />
      <p className="footer">CopyRight &copy; 2020 - {currentYear} YHKL {props.myProperty}</p>
    </Fragment>
  );
}