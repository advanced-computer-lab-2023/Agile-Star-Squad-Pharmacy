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
        index = result.findIndex(chat => chat.patient._id.toString() == newChat.patient._id.toString())
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
      console.log(selectedChat.patient);
      const newSelectedChat = chats.find(chat => {
        console.log(chat);
        return chat.patient._id.toString() == selectedChat.patient._id.toString()});
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
            <div className='d-flex justify-content-around mt-4 px-5'>
              <div className={styles.tabText}>Patient</div>
              <div className={styles.tabText}>Doctor</div>
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
