import React from "react";
import "./Sidebar.css";
import logo from "./logos/GlobalWeather_transparent.png";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
const Sidebar0 = () => {
  return (
    <div className="sidebar">
      <Sidebar>
        <img src={logo} width={250} height={250} />
        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: "#13395e",
                color: "#b6c8d9",
              },
            },
          }}
        >
          <MenuItem component={<Link to={"/"} />}> Home </MenuItem>
          <MenuItem component={<Link to={"/airquality"} />}>
            {" "}
            Air Quality{" "}
          </MenuItem>

          <MenuItem component={<Link to={"/realtime"} />}>RealTime </MenuItem>
          <MenuItem component={<Link to={"/maps"} />}>Maps </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Sidebar0;
