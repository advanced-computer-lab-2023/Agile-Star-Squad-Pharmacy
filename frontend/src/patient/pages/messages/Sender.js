import styles from './Messages.module.css';

const Sender = (props) => {
  const date = formatDate(props.timestamp);

  return (
    <div>
      <div className={styles.senderBox}>
        <div className={styles.senderText}>
          {props.msg}
        </div>
      </div>
      <div className={`${styles.timestamp} ms-2 mt-1 text-start`}>{date}</div>
    </div>
  );
};

export default Sender;


const formatDate = (date) => {
  const now = new Date();
  const messageDate = new Date(date);

  const optionsToday = { hour: 'numeric', minute: 'numeric' };
  const optionsOtherDays = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' };

  // Check if the message date is today
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return messageDate.toLocaleString(undefined, optionsToday);
  } else {
    return messageDate.toLocaleString(undefined, optionsOtherDays);
  }
};