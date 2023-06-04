import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Link from "next/link";
import { useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";

export default function Header() {
  const { login_state } = useSelector((state: IRootState) => state.userReducer);

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
          <Link href={"/"}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              HOME
            </Typography>
          </Link>
          {login_state ? (
            <Link href={"/member/logout"}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                LOGOUT
              </Typography>
            </Link>
          ) : (
            <Link href={"/member/login"}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                LOGIN
              </Typography>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
