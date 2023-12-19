import styles from './Messages.module.css';
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import ChatRoom from './ChatRoom';
import Sender from './Sender';
import Receiver from './Receiver';
import TextBox from './TextBox';
import * as Realm from "realm-web";
import { ObjectId } from "bson";
import UserContext from '../../../user-store/user-context';


const Messages = () => {
  const userCtx = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [textbox, setTextbox] = useState("");
  const [collection1, setCollection] = useState();
  const messagesEndRef = React.createRef()

  const app = new Realm.App({ id: "application-1-kfjsh" })
  // get users chat ids
  // get the chats

  let user, mongodb, collection;

  useEffect(() => {

    fetchChatIds();
  }, []);

  const fetchChatIds = async () => {
    user = await app.logIn(Realm.Credentials.anonymous());
    mongodb = app.currentUser.mongoClient("mongodb-atlas");
    collection = mongodb.db("pharmacy").collection("chats");
    setCollection(collection);

    fetch(`http://localhost:4000/pharmacist/chats`, {
      credentials: 'include',
    }).then(async (response) => {
      const json = await response.json();
      console.log(json)
      setupChats(json.chats);
    });
  }

  const setupChats = async (chatIds) => {
    for (const chatId of chatIds) {
      const initialChat = await collection.findOne({ "_id": new ObjectId(chatId) });
      setChats(chats => [...chats, initialChat]);

      listenToChat(chatId);
    }
  }

  const listenToChat = async (chatId) => {
    for await (const change of collection.watch({ "_id": new ObjectId(chatId) })) {
      const newChat = change.fullDocument;
      setChats(chats => {
        const result = [...chats]
        let index;
        index = result.findIndex(chat => chat.patient.id == newChat.patient.id)
        result[index] = newChat;
        return result;
      });
    }
  }

  const handleChatChange = (chat) => {
    setSelectedChat(chat);
  }

  const getChatRooms = () => {
    return chats.map(chat => {
      // we want name, and message
      const message = chat.lastMessage.message;
      const name = chat.patient.name;
      const id = chat.patient.id;
      const isPatient = chat.lastMessage.senderId == chat.patient._id;

      return <ChatRoom isPatient={isPatient} onClick={() => handleChatChange(chat)} key={chat._id} name={name} message={message} />
    });
  }

  const getRoom = () => {
    if (!selectedChat) {
      return <div className={`px-4 ${styles.Room}`}></div>
    }
    return <div className={`px-4 ${styles.Room}`}>
      {
        selectedChat.messages.map(msgObject => {
          if (msgObject.senderId != selectedChat.patient._id) {
            return <div className={styles.RoomRight}>
              <Receiver key={msgObject} msg={msgObject.message} timestamp={msgObject.timestamp} />
            </div>
          } else {
            return <div className={styles.RoomLeft}>
              <Sender key={msgObject} msg={msgObject.message} timestamp={msgObject.timestamp} />
            </div>
          }
        })
      }
      <div ref={messagesEndRef} />
    </div>
  }

  const getRoomName = () => {
    if (!selectedChat) {
      return "Select Chat"
    }
    return selectedChat.patient.name;
  }

  const onSubmit = (event) => {
    if (event != null && event.key != "Enter") {
      return;
    }
    const message = {
      message: textbox,
      timestamp: Date.now(),
      senderId: userCtx.userId
    }
    setSelectedChat(val => {
      const chat = { ...val };
      chat.messages.push(message);
      chat.lastMessage = message;
      return chat;
    });
    console.log(collection1.findOneAndUpdate({ _id: selectedChat._id }, { $set: { messages: [...selectedChat.messages, message], lastMessage: message } }))
    setTextbox("")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat])

  useEffect(() => {
    if (selectedChat != null) {
      const newSelectedChat = chats.find(chat => chat.patient.id == selectedChat.patient.id);
      setSelectedChat(newSelectedChat);
    }
  }, [chats]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <div className="container m-0">
        <div className={`row ${styles.row}`}>
          <div className={`col-4 pt-4 ${styles.messageCol}`}>
            <div className='d-flex ms-4 align-items-center'>
              <a style={{ all: "unset" }} href="/">
                <div className={styles.backButton}>
                  <svg
                    className={styles.backArrow}
                    xmlns="http://www.w3.org/2000/svg"
                    height="7"
                    viewBox="0 0 23 14"
                    fill="none"
                  >
                    <path
                      d="M1.59583 1.53345L11.9077 11.9807L22.2571 1.57064"
                      stroke="#3D64FD"
                      // strokeOpacity="0.6"
                      strokeWidth="3.04827"
                    />
                  </svg>
                  Back To Pharmacy</div>
              </a>
              <div className={styles.messages}>Messages</div>
            </div>

            <div className={styles.searchChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="36"
                viewBox="0 0 35 36"
                fill="none"
              >
                <g filter="url(#filter0_d_969_2522)">
                  <path
                    d="M20.3802 16.7389H19.8506L19.6629 16.549C20.0819 16.0382 20.388 15.4367 20.5596 14.7873C20.7311 14.1379 20.7637 13.4567 20.655 12.7926C20.34 10.837 18.7848 9.27536 16.9078 9.03618C16.248 8.94858 15.5778 9.02055 14.9485 9.24658C14.3192 9.47261 13.7475 9.84671 13.2772 10.3403C12.8069 10.8338 12.4504 11.4337 12.235 12.0941C12.0196 12.7544 11.951 13.4578 12.0345 14.1502C12.2624 16.1199 13.7506 17.7519 15.6141 18.0825C16.247 18.1965 16.8961 18.1622 17.5149 17.9823C18.1337 17.8023 18.707 17.481 19.1937 17.0414L19.3747 17.2383V17.7941L22.2236 20.7837C22.4985 21.0721 22.9476 21.0721 23.2224 20.7837C23.4973 20.4953 23.4973 20.024 23.2224 19.7356L20.3802 16.7389ZM16.3582 16.7389C14.689 16.7389 13.3416 15.325 13.3416 13.5734C13.3416 11.8218 14.689 10.4079 16.3582 10.4079C18.0273 10.4079 19.3747 11.8218 19.3747 13.5734C19.3747 15.325 18.0273 16.7389 16.3582 16.7389Z"
                    fill="#3D64FD"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_969_2522"
                    x="-5.29412"
                    y="-5.47059"
                    width="46.5882"
                    height="46.5882"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="2.82353" />
                    <feGaussianBlur stdDeviation="5.64706" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.32 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_969_2522"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_969_2522"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchText}
              />
            </div>
            <div className={styles.myMessages}>
              {getChatRooms()}
            </div>
          </div>
          <div className={`col-8 pt-4 ${styles.chatCol}`}>
            <div className={styles.chosenChat}>
              <h2 className={styles.messages}>{getRoomName()}</h2>
            </div>
            {getRoom()}
            {selectedChat != null && <div className={styles.typingSpace}>
              <TextBox value={textbox} onKeyDown={(event) => onSubmit(event)} onChange={(e) => { setTextbox(e.target.value) }} />
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
