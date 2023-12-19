import styles from './Messages.module.css';
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import ChatRoom from './ChatRoom';
import Sender from './Sender';
import Receiver from './Receiver';
import TextBox from './TextBox';
import * as Realm from "realm-web";
import { ObjectId } from "bson";
import UserContext from '../../../user-store/user-context';
import Select from "react-select"


const Messages = () => {
  const userCtx = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [doctorChats, setDoctorChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [textbox, setTextbox] = useState("");
  const [collection1, setCollection] = useState();
  const [collectionProf1, setCollectionProf] = useState();
  const [tab, setTab] = useState(0);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const messagesEndRef = React.createRef()

  const app = new Realm.App({ id: "application-1-kfjsh" })
  // get users chat ids
  // get the chats

  let user, mongodb, collection;
  let collectionProf;

  useEffect(() => {

    fetchChatIds();
  }, []);

  useEffect(() => {
    if (selectedDoctor == undefined) return
    let exists = false;
    for (const chat of doctorChats) {
      console.log(selectedDoctor._id);
      if (selectedDoctor._id.toString() == chat.doctor._id.toString()) {
        exists = true;
        setSelectedChat(chat);
      }
    }
    if (!exists) {
      createProfessionalChat(userCtx.userId, selectedDoctor.id)
    }
  }, [selectedDoctor]);

  const createProfessionalChat = async (id, doctorId) => {
    const chatResponse = await fetch(`http://localhost:4000/pharmacist/${id}/${doctorId}/chats`, {
      credentials: 'include',
    })
    const chat = (await chatResponse.json()).chat;
    console.log(`chat id added: ${chat._id.toString()}`)
    listenToDoctorChat(chat._id.toString());
    setSelectedChat(chat);
    setDoctorChats(chats => [...chats, chat]);
  }

  const fetchChatIds = async () => {
    user = await app.logIn(Realm.Credentials.anonymous());
    mongodb = app.currentUser.mongoClient("mongodb-atlas");
    collection = mongodb.db("pharmacy").collection("chats");
    collectionProf = mongodb.db("pharmacy").collection("professionalchats");
    setCollection(collection);
    setCollectionProf(collectionProf);

    fetch(`http://localhost:3000/doctors`, { credentials: "include" }).then(async response => {
      const json = await response.json();
      const doctors = json.data.doctors.map(doc => { return { label: doc.name, id: doc._id.toString(), ...doc } })
      setDoctorOptions(doctors);
    });

    fetch(`http://localhost:4000/pharmacist/${userCtx.userId}/chats`, {
      credentials: 'include',
    }).then(async (response) => {
      const json = await response.json();
      setupChats(json.chats);
      setupDoctorChats(json.doctorChats);
    });
  }

  const setupDoctorChats = async (chatIds) => {
    for (const chatId of chatIds) {
      const initialChat = await collectionProf.findOne({ "_id": new ObjectId(chatId) });
      setDoctorChats(chats => [...chats, initialChat]);

      listenToDoctorChat(chatId);
    }
  }

  const listenToDoctorChat = async (chatId) => {
    if (collectionProf == null) {
      collectionProf = collectionProf1;
    }
    for await (const change of collectionProf.watch({ "_id": new ObjectId(chatId) })) {
      const newChat = change.fullDocument;
      setDoctorChats(chats => {
        const result = [...chats]
        let index;
        index = result.findIndex(chat => chat.doctor._id.toString() == newChat.doctor._id.toString())
        result[index] = newChat;
        return result;
      });
    }
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
    if (tab == 0) {
      return <div className={styles.myMessages}>
        {chats.map(chat => {
          // we want name, and message
          const message = chat.lastMessage.message;
          const name = chat.patient.name;
          const id = chat.patient.id;
          const isPatient = chat.lastMessage.senderId == chat.patient._id;

          return <ChatRoom isPatient={isPatient} onClick={() => handleChatChange(chat)} key={chat._id} name={name} message={message} />
        })}
      </div>
    } else {
      return <div className={styles.myMessages}>
        <Select
          className='mb-3 mt-1 mx-5'
          value={selectedDoctor}
          styles={customStyles}
          options={doctorOptions}
          onChange={(value) => setSelectedDoctor(value)}
          required />
        <div>
          {doctorChats.map(chat => {
            // we want name, and message
            const message = chat.lastMessage.message;
            const name = chat.doctor.name;
            const id = chat.doctor.id;
            const isPharmacist = chat.lastMessage.senderId == chat.doctor.id;

            return <ChatRoom isPatient={isPharmacist} onClick={() => handleChatChange(chat)} key={chat._id} name={name} message={message} />
          })}
        </div>

      </div>
    }

  }

  const getRoom = () => {
    if (!selectedChat) {
      return <div className={`px-4 ${styles.Room}`}></div>
    }
    return <div className={`px-4 ${styles.Room}`}>
      {
        selectedChat.messages.map(msgObject => {
          if ((selectedChat.patient != null && msgObject.senderId != selectedChat.patient._id) || (selectedChat.patient == null && msgObject.senderId != selectedChat.doctor._id)) {
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
    if (selectedChat.patient == null) {
      return selectedChat.doctor.name;
    }
    return selectedChat.patient.name;
  }

  const onSubmit = async (event) => {
    console.log("beginning submit..")
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
    if (selectedChat.patient == null) {
      console.log(collectionProf1)
      const newColl = await collectionProf1.findOneAndUpdate({ _id: selectedChat._id }, { $set: { messages: [...selectedChat.messages, message], lastMessage: message } });
      console.log(newColl)
    } else {
      console.log("sending patient!")
      collection1.findOneAndUpdate({ _id: selectedChat._id }, { $set: { messages: [...selectedChat.messages, message], lastMessage: message } });
    }
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
        return chat.patient._id.toString() == selectedChat.patient._id.toString()
      });
      setSelectedChat(newSelectedChat);
    }
  }, [chats]);

  useEffect(() => {
    if (selectedChat != null) {
      const newSelectedChat = doctorChats.find(chat => {
        return chat.doctor._id.toString() == selectedChat.doctor._id.toString()
      });
      setSelectedChat(newSelectedChat);
    }
  }, [doctorChats]);

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
              <div className={`${styles.tabText} ${tab == 0 ? styles.tabActive : ""}`} onClick={() => { setTab(0) }}>Patients</div>
              <div className={`${styles.tabText} ${tab == 1 ? styles.tabActive : ""}`} onClick={() => { setTab(1) }}>Doctors</div>
            </div>
            {getChatRooms()}
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
    </div >
  );
};

export default Messages;


const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderBottom: '1px solid #E2E4E5',
    textAlign: 'start',
  }),

  placeholder: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#000' : '#888',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    transition: 'transform 0.3s',
    transform: 'rotate(0deg)',
    borderLeft: 'none',
  }),
  indicatorSeparator: () => ({}),
  menu: (provided) => ({
    ...provided,
    borderRadius: '20px',
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: state.isFocused ? "500" : "400",
    color: state.isFocused ? "black" : "#666666",
    textAlign: "left",
    backgroundColor: "transparent"
  }),
  value: (provided) => ({
    ...provided,
    borderRadius: '20px',
    backgroundColor: 'transparent'
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: "transparent"
  }),
  menuList: (base) => ({
    ...base,

    "::-webkit-scrollbar": {
      width: "3px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent"
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: '3px',
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555"
    }
  })
};