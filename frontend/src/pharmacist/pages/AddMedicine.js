import React, { useState, useCallback } from 'react';
import Dropzone from 'react-dropzone';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import Modal from '../../shared/components/Modal/Modal';
import styles from '../components/AddMedicine.module.css';
import axios from 'axios';
import uploadImg from "../../assets/patientAccount/upload.png"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import storage from '../..';
import Select from 'react-select'

const AddMedicine = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [sales, setSales] = useState(0);
  const [files, setFiles] = useState([]);
  const [medicinalUse, setMedicinalUse] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleActiveIngredientsChange = (event) => {
    setIngredients(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }
  // const handleDescriptionChange = (event) => {
  //   this.setState({
  //     description: event.target.value,
  //   });
  // };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSalesChange = (event) => {
    setSales(event.target.value);
  };

  const handleSave = async () => {
    // Check if any of the required fields is empty
    if (!name || !ingredients || !price || !quantity || !sales || files.length == 0) {
      alert('Please fill in all the fields before saving.');
      return;
    }

    let downloadUrl;
    const imageRef = ref(storage, `${files[0].name}`);
    await uploadBytesResumable(imageRef, files[0]).then(async (snapshot) => {
      downloadUrl = await getDownloadURL(snapshot.ref);
    });

    const response = await axios
      .post(
        'http://localhost:4000/medicine',
        {
          name,
          activeIngredient: ingredients,
          description,
          price,
          quantity,
          sales,
          medicinalUse: medicinalUse.label,
          image: downloadUrl
        },
        { withCredentials: true }
      )
      .then(() => {
        alert('Medicine added successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return <Modal>
    <div className={styles.titleContainer}>
      <h2 className={styles.addMedicineText}>Add Medicine</h2>
    </div>
    <div>
      <label className={styles.label}>Medicine Name</label>
      <input
        className={styles.input}
        type="text"
        onChange={handleNameChange}
        required
      />
    </div>
    <div>
      <label className={styles.label}>Description &nbsp;</label>
      <input
        className={styles.input}
        type="text"
        onChange={handleDescriptionChange}
        required
      />
    </div>
    <div>
      <label className={styles.label}>Active Ingredients &nbsp;</label>
      <input
        className={styles.input}
        type="text"
        onChange={handleActiveIngredientsChange}
        required
      />
    </div>
    <div className={styles.inlineContainer}>
      <div className={styles.inlineItem}>
        <label className={styles.label}>Sale Price</label>
        <input
          className={styles.input}
          type="text"
          onChange={handlePriceChange}
          required
        />
      </div>
      <div className={styles.inlineItem}>
        <label className={styles.label}>Profit (L.E.)</label>
        <input
          className={styles.input}
          type="text"
          onChange={handleSalesChange}
          required
        />
      </div>
      <div className={styles.inlineItem}>
        <label className={styles.label}>Quantity</label>
        <input
          className={styles.input}
          type="text"
          onChange={handleQuantityChange}
          required
        />
      </div>
    </div>
    <label>Medicinal Use</label>
    <Select
    className='mb-3 mt-1'
      value={medicinalUse}
      styles={customStyles}
      options={medicinalUses}
      onChange={(value) => setMedicinalUse(value)}
      required />
    <label className={styles.label}>Image</label>
    <MyDropzone files={files} setFiles={setFiles} maxFiles={1} />
    <div className={styles.saveButtonContainer2}>
      <button onClick={handleSave} className={styles.saveButton}>
        SAVE
      </button>
    </div>
  </Modal>
    ;
};

export default AddMedicine;


const MyDropzone = (props) => {
  const files = props.files;
  const setFiles = props.setFiles;
  const onDrop = useCallback((acceptedFiles) => {
    if (files.length + acceptedFiles.length > props.maxFiles) {
      props.toast(`Upload a maximum of ${props.maxFiles} files`);
      return;
    }
    if (acceptedFiles?.length) {
      console.log(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        }),
      );
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      ]);
    }
  });

  const rejectFile = () => {
    props.toast(`Only .PNG, .JPG and .PDF files are accepted`);
    return;
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  return (
    <div className={styles.myDropzone}>
      <Dropzone
        onDrop={onDrop}
        onDropRejected={rejectFile}
        accept={{
          'image/png': ['png'],
          'image/jpeg': ['jpg'],
          'application/pdf': ['pdf'],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="h-100">
            <div className="h-100" {...getRootProps()}>
              <input {...getInputProps()} />
              {files.length > 0 && (
                <aside style={thumbsContainer}>{thumbs}</aside>
              )}
              {files.length == 0 && (
                <div className='d-flex flex-column align-items-center'>
                  <img height={50} src={uploadImg} />
                  <div className="mt-3">Drag & drop files or Browse</div>
                  <div className={styles.dropzoneSubtitle}>
                    Supported formats: JPEG, PNG, PDF
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

const medicinalUses = [
  { label: "Fever" },
  { label: "Headache" },
  { label: "Eyes" },
  { label: "Cough" },
  { label: "Nutrition" },
  { label: "Baby Products" },
  { label: "Pain Relief" },
  { label: "Stomach" },
  { label: "Insomnia" },
  { label: "First Aid" },
]

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: '100%',
  height: '100%',
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  marginInline: 'auto',
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  height: '100%',
  marginTop: 8,
};




const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderBottom: '1px solid #E2E4E5',
    textAlign: 'start'
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