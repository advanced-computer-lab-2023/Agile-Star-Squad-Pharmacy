import styles from './InputField.module.css';

const InputField = (props) => {
    return (
        <div className={styles.container}>
            <div>
                <input className={styles.inputField} style={props.style} type={props.type} id={props.id} onChange={props.onChange} defaultValue={props.value} placeholder={props.placeholder} />
            </div>
        </div>
    );
}

export default InputField;