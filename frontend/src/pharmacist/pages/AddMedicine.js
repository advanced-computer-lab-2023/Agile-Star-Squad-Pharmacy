import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import Modal from '../../shared/components/Modal/Modal';
import styles from '../components/AddMedicine.module.css';
import axios from 'axios';
import uploadImg from '../../assets/patientAccount/upload.png';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import storage from '../..';
import Select from 'react-select';
// import { toastMe } from '../../shared/util/functions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastMeError, toastMeSuccess } from '../../shared/util/functions';
import ConfirmationModal from '../../shared/components/ConfirmationModal/ConfirmationModal';

const AddMedicine = (props) => {
  const [name, setName] = useState();
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [sales, setSales] = useState(0);
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [medicinalUse, setMedicinalUse] = useState('');
  const isAdd = props.medicine == null;

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (props.medicine != null) {
      console.log(props.medicine.name);
      const medicine = props.medicine;
      setName(medicine.name);
      setDescription(medicine.description);
      setIngredients(medicine.activeIngredient);
      setPrice(medicine.price);
      setQuantity(medicine.quantity);
      setSales(medicine.profit);
      setMedicinalUse({ label: medicine.medicinalUse });
      setImageUrl(medicine.image);
      setFiles([{ name: medicine.image, preview: medicine.image }]);
    }
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleActiveIngredientsChange = (event) => {
    setIngredients(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSalesChange = (event) => {
    setSales(event.target.value);
  };

  const handleArchive = async () => {
    const id = props.medicine.id;
    const response = await axios
      .patch(`http://localhost:4000/medicine/archive/${id}`, {
        withCredentials: true,
      })
      .then(() => props.exit())
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSave = async () => {
    // Check if any of the required fields is empty
    if (!name || !ingredients || !price || !quantity || !sales || files.length == 0) {
      toastMeError('Please fill in all the fields before saving.');
      return;
    }
    const data = {
      name,
      activeIngredient: ingredients,
      description,
      price,
      quantity,
      profit: sales,
      medicinalUse: medicinalUse.label,
    };

    if (!files[0].name.includes('http')) {
      let downloadUrl;
      const imageRef = ref(storage, `${files[0].name}`);
      await uploadBytesResumable(imageRef, files[0]).then(async (snapshot) => {
        downloadUrl = await getDownloadURL(snapshot.ref);
      });
      data['image'] = downloadUrl;
    }

    let toastMsg;
    if (!isAdd) {
      await axios
        .patch(`http://localhost:4000/medicine/${props.medicine.id}`, data, {
          withCredentials: true,
        })
        .catch((err) => {
          console.error(err);
        });
      toastMsg = 'Updated medicine successfully';
    } else {
      const response = await axios
        .post('http://localhost:4000/medicine', data, { withCredentials: true })
        .then(() => {
          //alert('Medicine added successfully');
        })
        .catch((err) => {
          console.error(err);
        });
      toastMsg = 'Added medicine successfully';
    }
    if (data.image == null) {
      data.image = files[0].name;
    }
    toastMeSuccess(toastMsg);
    props.exit(data);
  };

  return ReactDOM.createPortal(
    <Modal exit={props.exit}>
      {showArchiveModal && (
        <ConfirmationModal
          exit={() => setShowArchiveModal(false)}
          confirm={() => {
            handleArchive();
            setShowArchiveModal(false);
          }}
          text="Archive Medicine"
        />
      )}
      {showSaveModal && (
        <ConfirmationModal
          exit={() => setShowSaveModal(false)}
          confirm={() => {
            handleSave();
            setShowSaveModal(false);
          }}
          text="Save Medicine"
        />
      )}
      <div className={styles.titleContainer}>
        <h2 className={styles.addMedicineText}>
          {isAdd ? 'Add' : 'Edit'} Medicine
        </h2>
      </div>
      <div>
        <label className={styles.label}>Medicine Name</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        <label className={styles.label}>Description &nbsp;</label>
        <input
          className={styles.input}
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          required
        />
      </div>
      <div>
        <label className={styles.label}>Active Ingredients &nbsp;</label>
        <input
          className={styles.input}
          type="text"
          value={ingredients}
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
            value={price}
            onChange={handlePriceChange}
            required
          />
        </div>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Profit (L.E.)</label>
          <input
            className={styles.input}
            type="text"
            value={sales}
            onChange={handleSalesChange}
            required
          />
        </div>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Quantity</label>
          <input
            className={styles.input}
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            required
          />
        </div>
      </div>
      <label>Medicinal Use</label>
      <Select
        className="mb-3 mt-1"
        value={medicinalUse}
        styles={customStyles}
        options={medicinalUses}
        onChange={(value) => setMedicinalUse(value)}
        required
      />
      <label className={styles.label}>Image</label>
      <MyDropzone files={files} setFiles={setFiles} maxFiles={1} />
      <div className={styles.archiveContainer}>
        <button
          onClick={() => setShowArchiveModal(true)}
          className={styles.archiveButton}
        >
          ARCHIVE
        </button>
      </div>
      <div className={styles.saveButtonContainer2}>
        <button
          onClick={() => {
            handleSave();
          }}
          className={styles.saveButton}
        >
          SAVE
        </button>
      </div>
    </Modal>,
    document.getElementById('backdrop-root')
  );
};

export default AddMedicine;

const MyDropzone = (props) => {
  const files = props.files;
  const setFiles = props.setFiles;
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > props.maxFiles) {
      props.toast(`Upload a maximum of ${props.maxFiles} files`);
      return;
    }
    if (acceptedFiles?.length) {
      console.log(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
      setFiles((prevFiles) => [
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
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
          'image/jpeg': ['jpeg', 'jpg'],
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
                <div className="d-flex flex-column align-items-center">
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
  { label: 'Fever' },
  { label: 'Headache' },
  { label: 'Eyes' },
  { label: 'Cough' },
  { label: 'Nutrition' },
  { label: 'Baby Products' },
  { label: 'Pain Relief' },
  { label: 'Stomach' },
  { label: 'Insomnia' },
  { label: 'First Aid' },
];

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
    fontWeight: state.isFocused ? '500' : '400',
    color: state.isFocused ? 'black' : '#666666',
    textAlign: 'left',
    backgroundColor: 'transparent',
  }),
  value: (provided) => ({
    ...provided,
    borderRadius: '20px',
    backgroundColor: 'transparent',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
  }),
  menuList: (base) => ({
    ...base,

    '::-webkit-scrollbar': {
      width: '3px',
      height: '0px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  }),
};
