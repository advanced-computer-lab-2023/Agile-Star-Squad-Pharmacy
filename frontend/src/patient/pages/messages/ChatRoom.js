import styles from './Messages.module.css';
import profilePic from './images/Rectangle1.png';

const ChatRoom = (props) => {
  return (
    <div onClick={props.onClick} >
      <button className={styles.chatRoom}>
        <img src={profilePic} alt="myPic" />
        <div className={styles.chatInfo}>
          <h6>{props.name}</h6>
          <p className={styles.lastMessage}>
            {props.message}
          </p>
        </div>
      </button>
    </div>
  );
};

export default ChatRoom;
