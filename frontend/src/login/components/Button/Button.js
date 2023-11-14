import styles from './Button.module.css';

const Button = (props) => {
  return (
    <div>
      <button className={styles.submitButton} style={props.style} onClick={props.onClick}>{props.name}</button>
    </div>
  );
};

export default Button;
