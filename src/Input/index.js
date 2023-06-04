import React from "react";

import "./style.css";

export const Input = ({ children, color = "black", ...props }) => (
  <input className={`Input Input_${color}`} {...props}>
    {children}
  </input>
);
