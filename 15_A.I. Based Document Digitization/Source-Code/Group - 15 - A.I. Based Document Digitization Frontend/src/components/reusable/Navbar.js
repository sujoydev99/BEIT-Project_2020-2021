import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Menu } from "antd";
import { DashboardOutlined, AlignCenterOutlined, FileTextFilled,PicLeftOutlined,RadarChartOutlined  } from "@ant-design/icons";

const NavItems = [
  {
    name: "Overview",
    path: "/overview",
    logo: <RadarChartOutlined />,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    logo: <DashboardOutlined />,
  },
  {
    name: "Upload",
    path: "/upload",
    logo: <FileTextFilled />,
  },
  {
    name: "Annotate",
    path: "/annotate",
    logo: <PicLeftOutlined />,
  },
  {
    name: "Conntributions",
    path: "/contributions",
    logo: <AlignCenterOutlined />,
  },
 
];

const Navbar = () => {
  const match = useRouteMatch();
  return (
    <Menu
      defaultSelectedKeys={["/"]}
      mode='inline'
      theme='dark'
      selectedKeys={[match.url]}
    >
      {NavItems &&
        NavItems.map((navItem) => (
          <Menu.Item key={navItem.path} icon={navItem.logo}>
            <Link to={navItem.path}>{navItem.name}</Link>
          </Menu.Item>
        ))}
    </Menu>
  );
};
export default Navbar;
