import React, { useRef, useState } from 'react'
import { PaperAirplaneIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = ({ chatId, other }) => {
    // const [file, setfile] = useState();
    const [sfile, setsfile] = useState();
    const user = useSelector(t => t.auth.user)
    const [loading, setloading] = useState(false);
    const filepicker = useRef()


    const uploadImage = (file) => {
        setloading(true)

        const uploadTask = uploadBytesResumable(ref(storage, 'images/' + Date() + file.name), file, { contentType: file.type });

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');

            },
            (error) => console.log(error), () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setsfile(downloadURL)
                    setloading(false)
                    filepicker.current.value = ''
                });
            }
        );

    }





    const send = async (e) => {
        e.preventDefault()
        if (!loading) {
            let snarr = []
            for (let i = 0; i < 10; i++) {
                let alf = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 'l', 't', 'u', 'b', 'w', 's', 'y', 'n', 'z', 'G', 'H', 'L', 'S', 'W', 'T', 'P', 'Q', 'X']

                let x = Math.floor(Math.random() * 36)
                let l = Math.floor(Math.random() * 9)

                snarr.push(alf[x])
                snarr.push(l)
            }

            if (sfile) {


                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: snarr.join(''),
                        text: e.target.text.value,
                        img: sfile,
                        senderId: user.uid,
                        date: Timestamp.now()
                    })
                });







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
            await updateDoc(doc(db, 'userChats', user.uid), {
                [chatId + '.lastMessage']: { text: e.target.text.value },
                [chatId + '.date']: serverTimestamp(),
            })

            await updateDoc(doc(db, 'userChats', other.uid), {
                [chatId + '.lastMessage']: { text: e.target.text.value },
                [chatId + '.date']: serverTimestamp(),
            })
            await updateDoc(doc(db, 'notifications', other.uid), {
                messages:arrayUnion({
                    text: e.target.text.value,
                    senderId: user.uid,
                    senderImage:user.image,
                    senderName:user.name,
                    date: Timestamp.now()
                })
            })


            e.target.text.value = ''
            setsfile('')
        }
    }




    return (<form onSubmit={e => { send(e) }} className=' w-full py-1 bg-slate-100 flex items-center flex-col'>


        {sfile && <div className=' relative w-fit overflow-scroll max-h-80 scroller'>

            <XMarkIcon className=' w-7 absolute right-1 top-1 text-black cursor-pointer  border-2 rounded-md bg-slate-300/30' onClick={() => setsfile()} />
            <img src={sfile} className='  border-b-[1px] border-slate-700   ' alt="" />

        </div>}


        <div className=' flex items-center w-full'>

            <input name='text' placeholder='Send message...' required type="text" className=' border-none outline-none bg-slate-100 text-black w-[90%] py-3 px-2' />

            <label htmlFor="upload-photo" >
                <div>
                    <PhotoIcon className=' w-7 hover:bg-slate-300 rounded-md text-slate-800 cursor-pointer' />
                    <input type="file" ref={filepicker} className=' hidden' id="upload-photo" accept='image/*' name="upload-photo" onChange={(e) => uploadImage(e.target.files[0])} />
                </div>
            </label>


            <button className='px-2 py-1 mx-2 rounded-md font-semibold hover:bg-green-700 bg-green-600 flex items-center justify-center' >






                {loading ? <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 24.00 24.00"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                    strokeWidth="0.00024000000000000003"
                    className="spin"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g id="SVGRepo_iconCarrier">

                        <path
                            opacity="0.2"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            fill="#000000"
                        />
                        <path
                            d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                            fill="#eee"
                        />
                    </g>
                </svg> : <>send <PaperAirplaneIcon className=' w-6 ml-1  -rotate-45 hover:rotate-0 transition-all ' /></>}



            </button>

        </div>

    </form>)
}

export default Input