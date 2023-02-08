import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../../firebase";



export const signIn = createAsyncThunk('auth/singin', async ({ email, password, serviceProvider }, { rejectWithValue, dispatch }) => {

    try {


        const chekormakefireStoreUser = async (user) => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                localStorage.setItem('user', JSON.stringify(docSnap.data()))

                window.location.reload()
                return docSnap.data()

            } else {
                const data = {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    image: user.photoURL ? user.photoURL : 'https://www.pngmart.com/files/22/User-Avatar-Profile-Download-PNG-Isolated-Image.png',
                    theme:'system',
                    chats:[],
                    friends:[],
                    bio:'',
                }
                await setDoc(doc(db, "users", user.uid), data);
                await setDoc(doc(db, "userChats", user.uid), {});
                await setDoc(doc(db, "notifications", user.uid), {
                    messages:[]
                });
                localStorage.setItem('user', JSON.stringify(data))

                window.location.reload()
                return data
            }
        }

        if (serviceProvider == 'emailandpassword') {


            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    chekormakefireStoreUser(user)

                })
                .catch((error) => {
                    console.log(error)
                    dispatch(loading(false))
                });

        } else {
            signInWithPopup(auth, provider).then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken; 
                const user = result.user;
                chekormakefireStoreUser(user)

            }).catch((error) => {
                const email = error.customData.email;
                const credential = provider.credentialFromError(error);
                dispatch(loading(false))
            });
        }

    } catch (error) {
        dispatch(loading(false))
        return (rejectWithValue(error.message))
    }


})


export const register = createAsyncThunk('auth/register', async ({ email, password, name, serviceProvider }, { rejectWithValue, dispatch }) => {

    try {
        const makefireStoreUser = async (user) => {


            const data = {
                name: user.displayName ? user.displayName : name,
                email: user.email,
                uid: user.uid,
                image: user.photoURL ? user.photoURL : 'https://www.pngmart.com/files/22/User-Avatar-Profile-Download-PNG-Isolated-Image.png',
                theme:'system',
                chats:[],
                friends:[],
                bio:'',
            }
            await setDoc(doc(db, "users", user.uid), data);
            await setDoc(doc(db, "userChats", user.uid), {});
            await setDoc(doc(db, "notifications", user.uid), {
                messages:[]
            });            localStorage.setItem('user', JSON.stringify(data))
            window.location.reload()
            return data

        }

        if (serviceProvider == 'emailandpassword') {


            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    makefireStoreUser(user)

                })
                .catch((error) => {
                    dispatch(loading(false))
                    console.log(error)
                });

        } else {
            signInWithPopup(auth, provider).then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken; 
                const user = result.user;
                makefireStoreUser(user)
            }).catch((error) => {
                const email = error.customData.email;
                const credential = provider.credentialFromError(error);
                dispatch(loading(false))
            });
        }
    } catch (error) {
        dispatch(loading(false))
        return rejectWithValue(error.message)
    }




})




const AuthSlice = createSlice({
    name: 'Auth',
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        isLoading: false,
        error: null
    },
    reducers: {
        loading(state, action) {
            state.isLoading = !state.isLoading

        },
        changeuser(state,action){
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        //sign in
        builder.addCase(signIn.fulfilled, (state, action) => {


            state.user = action.payload

        })
        builder.addCase(signIn.rejected, (state, action) => {

            state.isLoading = false
            state.error = action.payload
        })
        //register
        builder.addCase(register.fulfilled, (state, action) => {


            state.user = action.payload

        })
        builder.addCase(register.rejected, (state, action) => {

            state.isLoading = false
            state.error = action.payload
        })
    }



})
export default AuthSlice.reducer
export const { loading,changeuser } = AuthSlice.actions