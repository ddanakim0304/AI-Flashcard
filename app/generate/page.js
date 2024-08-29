'use client'

import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {Container, Box, Typography, TextField, Button, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, CardActionArea, CardContent} from '@mui/material'
import { styled } from '@mui/system'
import {doc, collection, getDoc, setDoc, writeBatch} from 'firebase/firestore'
import {db} from '@/firebase'

// Styled components for consistency
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: '#f3e5f5',
    borderRadius: '16px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
}));

const NormalButton = styled(Button)({
    background: '#9551c6',
    color: '#FFF',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    borderRadius: '30px',
});

const GradientButton = styled(Button)({
    background: 'linear-gradient(90deg, #6a0dad 0%, #b19cd9 100%)',
    color: '#FFF',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    borderRadius: '30px',
});

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const[flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFlashcards(data);
                } else if (data.flashcards) {
                    setFlashcards(data.flashcards);
                } else {
                    console.error("Unexpected API response format");
                }
            })
    }

    const handleCardClick = (id) => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setOpen(false)
    }

const saveFlashcards = async () => {
        if (!isLoaded || !isSignedIn) {
            alert('User is not signed in')
            return
        }

        if (!name) {
            alert('Please enter a name for the flashcard set')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(db, 'users', user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('A flashcard set with this name already exists')
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDoceRef = doc(colRef)
            batch.set(cardDoceRef, flashcard)
        })
        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return(
        <Container maxWidth='md'>
            <Box sx={{
                mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Typography variant='h4' sx={{ fontWeight: '600', color: '#4a148c', textAlign: 'center' }} gutterBottom>
                    Programming Language Function Flashcards
                </Typography>
                <Paper sx={{p: 2, width: '100%'}}>
                    <TextField 
                        value = {text} 
                        label='Enter programming language name here'
                        onChange = {(e) => setText(e.target.value)} 
                        fullWidth 
                        multiline
                        rows={4}
                        variant='outlined'
                        sx={{mb: 2}}
                    />
                    <GradientButton
                        variant='contained' 
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Generate
                    </GradientButton>
                </Paper>
            </Box>
            
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: '600', color: '#4a148c' }} gutterBottom>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" sx={{ color: '#4a148c' }}>
                                                            {flashcard.question ? flashcard.question : "No question content"}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" sx={{ color: '#6a1b9a' }}>
                                                            {flashcard.answer ? flashcard.answer : "No back content"}
                                                        </Typography>   
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <NormalButton variant="contained" onClick={handleOpen}>
                            Save Flashcards
                        </NormalButton>
                    </Box>
                </Box>
            )} 

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <NormalButton
                    variant="contained"
                    onClick={() => router.push('/flashcards')}
                >
                    View Saved Flashcards
                </NormalButton>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for the flashcard set
                        <TextField
                        autoFocus
                        margin='dense'
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant='outlined'
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <NormalButton onClick={saveFlashcards}>Save</NormalButton>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
