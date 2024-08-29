'use client'
import {useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'
import {CollectionReference, doc, getDoc, setDoc, collection} from 'firebase/firestore'
import {db} from '@/firebase'
import {useRouter} from 'next/navigation'
import {Container, Grid, Card, CardContent, Typography, CardActionArea} from '@mui/material'
import { purple } from '@mui/material/colors'

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if(!user) return
            const docRef = doc(db, 'users', user.id)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if(!isLoaded || !isSignedIn) 
        return <></>

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant='h4' sx={{ fontWeight: '600', color: '#4a148c', textAlign: 'center' }} >
                Saved Flashcards
            </Typography>
            <Grid container spacing={3} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{
                            backgroundColor: purple[50],
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
                            }
                        }}>
                            <CardActionArea
                                onClick={() => {
                                    handleCardClick(flashcard.name)
                                }}
                                sx={{
                                    padding: 2,
                                    textAlign: 'center',
                                }}
                            >
                                <CardContent>
                                    <Typography variant='h6' sx={{ color: purple[700] }}>
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
