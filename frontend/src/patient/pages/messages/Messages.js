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


  // get users chat ids
  // get the chats
  const isPatient = userCtx.role == "patient";
  let app;
  let mongodb;
  let collection;


  useEffect(() => {
    fetchChatIds();
  }, []);

  const fetchChatIds = async () => {
    app = new Realm.App({ id: "application-1-kfjsh" })
    const user = await app.logIn(Realm.Credentials.anonymous());
    mongodb = app.currentUser.mongoClient("mongodb-atlas");
    collection = mongodb.db("pharmacy").collection("chats");
    setCollection(collection);

    fetch(`http://localhost:4000/patients/${userCtx.userId}/chat`, {
      credentials: 'include',
    }).then(async (response) => {
      const json = await response.json();
      setupChats(json.chat);
    });
  }

  const setupChats = async (chatId) => {
    const initialChat = await collection.findOne({ "_id": new ObjectId(chatId) });
    setChats(chats => [...chats, initialChat]);
    listenToChat(chatId);
    setSelectedChat(initialChat);
  }

  const listenToChat = async (chatId) => {
    for await (const change of collection.watch({ "_id": new ObjectId(chatId) })) {
      console.log("we alive");
      const newChat = change.fullDocument;
      setChats(chats => [newChat]);
    }
  }

  const getRoom = () => {
    if (!selectedChat) {
      return <div className={`px-4 ${styles.Room}`}></div>
    }
    return <div className={`px-4 ${styles.Room}`}>
      {
        selectedChat.messages.map(msgObject => {
          if ((isPatient && msgObject.senderId == userCtx.userId) || (!isPatient && msgObject.senderId == userCtx.userId)) {
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
    return "Chat with a Pharmacist"
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
          <div className={`col-12 pt-4 ${styles.chatCol}`}>
            <div className={styles.chosenChat}>
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
              <h2 className={styles.messages}>
                {getRoomName()}</h2>
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
