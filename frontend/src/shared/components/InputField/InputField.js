import './InputField.css';

const InputField = (props) => {
    return (
        <div className="inputRow">
            <label className="inputLabel">{props.label}</label>
            <div className="input-field">
                <input type="text" id="search-term" onChange={props.onChange} defaultValue={props.value} placeholder={props.placeholder} />
            </div>
        </div>
    );
}

export default InputField;