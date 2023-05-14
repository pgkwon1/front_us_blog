import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";

import Link from "next/link";
import { useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";

export default function Header() {
  const { login_state } = useSelector((state: IRootState) => state.userReducer);
  const menuList = [
    {
      menuName: "Home",
      icon: null,
      href: "/",
    },
    {
      menuName: "기술",
      icon: <CodeIcon />,
      href: "/post/category/기술",
    },
    {
      menuName: "직장",
      icon: <BusinessIcon />,
      href: "/post/category/직장",
    },
    {
      menuName: "잡담",
      icon: <CoffeeIcon />,
      href: "/post/category/잡담",
    },
  ];
  let addMenu;
  if (login_state === 1) {
    addMenu = {
      menuName: "Logout",
      icon: null,
      href: "/member/logout",
    };
  } else {
    addMenu = {
      menuName: "Login",
      icon: null,
      href: "/member/login",
    };
  }
  menuList.push(addMenu);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#fff" }}>
        <Toolbar sx={{ gap: "1rem" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {menuList.map((menu, index) => {
            return (
              <Link key={index} href={menu.href}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {menu.menuName} {menu.icon !== null ? menu.icon : ""}
                </Typography>
              </Link>
            );
          })}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
