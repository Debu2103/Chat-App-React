import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, VStack, Input, HStack } from "@chakra-ui/react"
import { BiPaperPlane } from "react-icons/bi"
import { app } from './firebase';
import Message from './Components/Message';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot,query,orderBy } from "firebase/firestore"

const auth = getAuth(app);
const db = getFirestore(app);
const messagesCollection = collection(db, "Messages");

function App() {
  const [user, setUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([])
  const q = query(collection(db,"Messages"),orderBy("createdAt", "asc"))
  const divforScroll = useRef(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      setUser(userData);
    });

   const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() }; // <-- Invoke data() as a function
        })
      );
    });
    return () => {
      unsubscribe();
      unsubscribeForMessage()
    };
  }, []);

  const loginHandler = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOutHandler = () => {
    signOut(auth);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(messagesCollection, {
        text: messageInput,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp()
      });
      setMessageInput("");
      divforScroll.current.scrollIntoView({behavior:"smooth"})
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Error storing message');
    }
  }

  return (
    <Box bg="red.50">
      {user ? (
        <Container h="100vh" bg="white">
          <VStack h="full" paddingY={4}>
            <Button colorScheme="red" w="full" onClick={logOutHandler}>
              Logout
            </Button>

            <VStack h="full" w="full" overflowY="auto">
              {
                messages.map(item => (
                  <Message
                    key={item.id}
                    user={item.uid === user.uid ? "me" : "other"}
                    text={item.text} uri={item.uri} />
                ))
              }
              <div ref={divforScroll}></div>
            </VStack>

            <form style={{ width: "100%" }} onSubmit={handleOnSubmit}>
              <HStack>
                <Input
                  placeholder="Type your message here"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button colorScheme="blue" w="full" type="submit">
                  <BiPaperPlane />
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <Container justifyContent="center">
          <VStack>
            <Button colorScheme="green" onClick={loginHandler}>
              Sign In
            </Button>
          </VStack>
        </Container>
      )}
    </Box>
  );
}

export default App;
