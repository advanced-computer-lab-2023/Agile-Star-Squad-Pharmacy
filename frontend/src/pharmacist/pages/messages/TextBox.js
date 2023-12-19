import styles from './Messages.module.css';

const TextBox = (props) => {
  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        placeholder="Type your message here ..."
        className={styles.textBox}
      />
      <button onClick={() =>  props.onKeyDown(null)} className={styles.sendButton}>
        <svg
          style={{ fill: 'var(--colors-back-ground-blue-white-text, #F8F9FD)' }}
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
        >
          <path
            d="M12.4545 7.07153L0.454543 13.9997L0.454544 0.14333L12.4545 7.07153Z"
            fill="#F8F9FD"
          />
        </svg>
      </button>
    </div>
  );
};

export default TextBox;
