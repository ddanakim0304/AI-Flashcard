'use client'

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid, Paper } from "@mui/material";
import Head from "next/head";
import Link from 'next/link';
import { styled } from '@mui/system';

const GradientAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, #6a0dad 0%, #b19cd9 100%)',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
});

const FeatureBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '16px',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f3e5f5',
}));

export default function Home() {

  const handleSubmit = async () => {
    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
        },
      });

      const checkoutSessionJson = await checkoutSession.json();

      if (checkoutSession.status !== 200) {
        console.error(checkoutSessionJson.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id
      });

      if (error) {
        console.error(error.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Container maxWidth="100v">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <GradientAppBar position="static">
        <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.1em' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button sx={{ color: '#FFF', mx: 1, fontWeight: '500' }} href="/sign-in">Login</Button>
            <Button sx={{ color: '#FFF', mx: 1, fontWeight: '500' }} href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </GradientAppBar>

      <Box 
        sx={{
          textAlign: 'center',
          my: 6
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: '600', color: '#4a148c' }} gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: '400', color: '#6a1b9a', mb: 3 }}>
          The easiest way to create flashcards from your text
        </Typography>
        <Link href="/generate" passHref>
          <Button variant="contained" color="primary" sx={{
            background: 'linear-gradient(90deg, #6a0dad 0%, #b19cd9 100%)',
            color: '#FFF', px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px'
          }}>
            Get Started
          </Button>
        </Link>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: '600', textAlign: 'center', mb: 4, color: '#4a148c' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureBox>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: '500', color: '#4a148c' }}>
                Easy Text Input
              </Typography>
              <Typography sx={{ color: '#6a1b9a' }}>
                Simply paste your text and we&apos;ll extract the flashcards for you.
              </Typography>
            </FeatureBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureBox>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: '500', color: '#4a148c' }}>
                Smart Flashcards
              </Typography>
              <Typography sx={{ color: '#6a1b9a' }}>
                Our AI will break down your text into concise flashcards, perfect for studying on the go.
              </Typography>
            </FeatureBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureBox>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: '500', color: '#4a148c' }}>
                Accessible Anywhere
              </Typography>
              <Typography sx={{ color: '#6a1b9a' }}>
                Access your flashcards from anywhere, on any device.
              </Typography>
            </FeatureBox>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: '600', mb: 4, color: '#4a148c' }}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 4,
              background: '#ede7f6',
              borderRadius: 3,
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h5" sx={{ fontWeight: '500', mb: 1, color: '#4a148c' }}>Basic</Typography>
              <Typography variant="h6" sx={{ color: '#6a1b9a', mb: 3 }}>$5 /month</Typography>
              <Typography sx={{ color: '#4a148c', mb: 3 }}>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{
                background: 'linear-gradient(90deg, #6a0dad 0%, #b19cd9 100%)',
                color: '#FFF', px: 4, py: 1, borderRadius: '30px'
              }}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 4,
              background: '#ede7f6',
              borderRadius: 3,
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h5" sx={{ fontWeight: '500', mb: 1, color: '#4a148c' }}>Pro</Typography>
              <Typography variant="h6" sx={{ color: '#6a1b9a', mb: 3 }}>$10 /month</Typography>
              <Typography sx={{ color: '#4a148c', mb: 3 }}>
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{
                background: 'linear-gradient(90deg, #6a0dad 0%, #b19cd9 100%)',
                color: '#FFF', px: 4, py: 1, borderRadius: '30px'
              }} onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
