import { SignIn } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { styled } from '@mui/system';

export default function SignInPage() {

  return (
    <Container maxWidth="100vw" disableGutters>
      <AppBar position="static" sx={{ backgroundColor: "#6a0dad" }}>
      <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.1em' }}>
            <Button color="inherit" href="/">
            Programming Flashcards
            </Button>
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Login
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4">Sign In</Typography>
        <SignIn />
      </Box>
    </Container>
  );
}
