import styles from './Messages.module.css';

const Receiver = (props) => {
  const date = formatDate(props.timestamp);
  return (
    <div>
      <div className={styles.receiverBox}>
        <div className={styles.receiverText}>
            {props.msg}
        </div>
      </div>
      <div className={`${styles.timestamp} me-2 mt-1 text-end`}>{date}</div>
    </div>
  );
};

export default Receiver;

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