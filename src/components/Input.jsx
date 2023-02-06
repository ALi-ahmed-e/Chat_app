import React, { useState } from 'react'
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = ({ chatId, other }) => {
    const [file, setfile] = useState();
    const user = useSelector(t => t.auth.user)


    const send = async (e) => {
        e.preventDefault()

        let snarr = []
        for (let i = 0; i < 10; i++) {
            let alf = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 'l', 't', 'u', 'b', 'w', 's', 'y', 'n', 'z', 'G', 'H', 'L', 'S', 'W', 'T', 'P', 'Q', 'X']

            let x = Math.floor(Math.random() * 36)
            let l = Math.floor(Math.random() * 9)

            snarr.push(alf[x])
            snarr.push(l)
        }

        if (file) {



            const storageRef = ref(storage, 'images/' + Date() + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');

                },
                (error) => console.log(error), () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", chatId), {
                            messages: arrayUnion({
                                id: snarr.join(''),
                                text: e.target.text.value,
                                img: downloadURL,
                                senderId: user.uid,
                                date: Timestamp.now()
                            })
                        });
                    });
                }
            );






        } else {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    id: snarr.join(''),
                    text: e.target.text.value,
                    senderId: user.uid,
                    date: Timestamp.now()
                })
            });
        }
        await updateDoc(doc(db,'userChats',user.uid),{
           [chatId+'.lastMessage']: {text:e.target.text.value},
           [chatId+'.date']:serverTimestamp(),
        })

        await updateDoc(doc(db,'userChats',other.uid),{
           [chatId+'.lastMessage']: {text:e.target.text.value},
           [chatId+'.date']:serverTimestamp(),
        })

        e.target.text.value = ''
        setfile('')
    }




    return (<form onSubmit={e => send(e)} className=' w-full h-[70px] bg-slate-100 flex items-center'>

        <input name='text' placeholder='Send message...' type="text" className=' border-none outline-none bg-slate-100 text-black w-[90%] py-3 px-2' />

        <label htmlFor="upload-photo" >
            <div>
                <PhotoIcon className=' w-7 hover:bg-slate-300 rounded-md text-slate-800 cursor-pointer' />
                <input type="file" className=' hidden' id="upload-photo" name="upload-photo" onChange={(e) => setfile(e.target.files[0])} />
            </div>
        </label>


        <button className='px-2 py-1 mx-2 rounded-md font-semibold hover:bg-green-700 bg-green-600 flex items-center justify-center'>send <PaperAirplaneIcon className=' w-6 ml-1  -rotate-45 hover:rotate-0 transition-all ' /></button>

    </form>)
}

export default Input