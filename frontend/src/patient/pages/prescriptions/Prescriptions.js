import { useEffect, useState, useRef, useContext } from 'react';
import classes from './Prescriptions.module.css';
import NavBar from '../../../shared/components/NavBar/NavBar';
import jsPDF from 'jspdf';
import PrescriptionPDF from './PrescriptionPDF';
import PrescriptionTile from './PrescriptionTile';
import Calendar from 'react-calendar';
import Select from 'react-select';
import UserContext from '../../../user-store/user-context';
import axios from 'axios';

const Prescriptions = () => {
  const dummy_presc = [
    {
      id: 1,
      name: 'Cataflam',
      dosage: '3',
      frequency: 'After each meal',
      doctor: 'Habiiba',
      date: '28/12/2002',
      status: 'Filled',
    },
    {
      id: 2,
      name: 'Cataflam',
      dosage: '3',
      frequency: 'Before breakfast',
      doctor: 'Habiiba',
      date: '28/12/2002',
      status: 'Unfilled',
    },
    {
      id: 3,
      name: 'Cataflam',
      dosage: '3',
      frequency: 'Daily',
      doctor: 'Habiiba',
      date: '28/12/2002',
      status: 'Filled',
    },
  ];

  const userCtx = useContext(UserContext);
  const [filterIndex, setFilterIndex] = useState(0);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDoctorsMenu, setShowDoctorsMenu] = useState(false);
  const [pickedDate, setPickedDate] = useState(null);
  const [pickedDoctor, setPickedDoctor] = useState('Doctor');
  const [statusFilter, setStatusFilter] = useState(-1);

  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [prescriptionDoctors, setPrescriptionDoctors] = useState([]);

  const pdfRef = useRef(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      let username;
      let prescriptionsJson;
      const prescDoctors = new Set();
      await axios
        .get(`http://localhost:4000/patients/${userCtx.userId}`)
        .then((response) => {
          username = response.data.data.patient.username;
          fetch(
            `http://localhost:3000/patients/prescriptions/${username}`
          ).then(async (response) => {
            if (!response.ok) {
              console.log('error', response);
              return;
            }
            const json = await response.json();
            prescriptionsJson = json.data.prescriptions;
            setPrescriptions((_) => {
              const prescriptions = [];
              prescriptionsJson.forEach((prescription) => {
                prescDoctors.add(prescription.doctorName);
                prescription.items.forEach((item) => {
                  prescriptions.push({
                    id: prescription.id,
                    date: formatDate(new Date(prescription.dateOfCreation)),
                    status: prescription.status,
                    doctor: prescription.doctorName,
                    ...item,
                  });
                });
              });
              return prescriptions;
            });
            setFilteredPrescriptions((_) => {
              const prescriptions = [];
              console.log('prescriptionsJson', prescriptionsJson);
              prescriptionsJson.forEach((prescription) => {
                prescription.items.forEach((item) => {
                  prescriptions.push({
                    id: prescription.id,
                    date: formatDate(new Date(prescription.dateOfCreation)),
                    status: prescription.status,
                    doctor: prescription.doctorName,
                    ...item,
                  });
                });
              });
              return prescriptions;
            });
          });
          setTimeout(() => {
            setPrescriptionDoctors(Array.from(prescDoctors));
          }, 10);
        });
    };
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (pickedDate != null) {
      const newPrescriptions = prescriptions.filter((presc) => {
        return presc.date == formatDate(pickedDate);
      });
      setFilteredPrescriptions(filterByStatus(newPrescriptions));
    }
  }, [pickedDate]);

  useEffect(() => {
    if (pickedDoctor != 'Doctor') {
      const newPrescriptions = prescriptions.filter(
        (presc) => presc.doctor === pickedDoctor
      );
      setFilteredPrescriptions(filterByStatus(newPrescriptions));
    }
  }, [pickedDoctor]);

  useEffect(() => {
    let newPrescriptions = prescriptions;
    if (pickedDate != null) {
      newPrescriptions = prescriptions.filter((presc) => {
        return presc.date == formatDate(pickedDate);
      });
    } else if (pickedDoctor != 'Doctor') {
      newPrescriptions = prescriptions.filter(
        (presc) => presc.doctor === pickedDoctor
      );
    }
    setFilteredPrescriptions(filterByStatus(newPrescriptions));
  }, [statusFilter]);

  const filterByStatus = (prescriptions) => {
    return prescriptions.filter((presc) => {
      if (statusFilter === -1) return true;
      if (statusFilter === 0 && presc.status === 'Unfilled') return true;
      if (statusFilter === 1 && presc.status === 'Filled') return true;
      return false;
    });
  };

  const getTiles = () => {
    return (
      <div>
        {filteredPrescriptions.map((presc) => (
          <PrescriptionTile
            setSelectedPrescriptions={setSelectedPrescriptions}
            presc={presc}
          />
        ))}
      </div>
    );
  };

  const downloadPrescriptions = () => {
    console.log(selectedPrescriptions);
    if (selectedPrescriptions.length == 0) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      format: [1450, 780],
      unit: 'px',
    });
    doc.setFont('Helvetica', 'normal');

    doc.html(pdfRef.current, {
      async callback(doc) {
        doc.save('Clinic Prescription');
      },
    });
  };

  const handleFilterChange = (index) => {
    setFilterIndex(index);
    if (index == 0) {
      setFilteredPrescriptions(filterByStatus(prescriptions));
      setPickedDate(null);
    }
    if (index == 1) {
      setPickedDate(null);
      setShowDoctorsMenu((val) => !val);
    } else {
      setShowDoctorsMenu(false);
      setPickedDoctor('Doctor');
    }
    if (index == 2) {
      setShowCalendar((val) => !val);
    } else {
      setShowCalendar(false);
    }
  };

  const handleStatusChange = (index) => {
    let newIndex = index;
    if (statusFilter === index) {
      newIndex = -1;
    }
    setStatusFilter(newIndex);
  };

  const handlePickDate = (value) => {
    setShowCalendar(false);
    setPickedDate(value);
  };

  const handlePickDoctor = (option) => {
    setPickedDoctor(option['label']);
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <NavBar />
      <div className={classes.wrapper}>
        <div className={classes.header}>PRESCRIPTIONS</div>
        <div className={classes.tableWrapper}>
          <div className={classes.tableOptions}>
            <div
              className={
                filterIndex == 0 ? classes.optionEnabled : classes.option
              }
              onClick={() => handleFilterChange(0)}
            >
              All Prescriptions
            </div>
            <div
              className={`${
                filterIndex == 1 ? classes.optionEnabled : classes.option
              } position-relative`}
              onClick={() => handleFilterChange(1)}
            >
              {pickedDoctor}
              <Select
                options={prescriptionDoctors.map((doc) => {
                  return { label: doc };
                })}
                styles={customStyles}
                menuIsOpen={showDoctorsMenu}
                onChange={(option) => handlePickDoctor(option)}
              />
            </div>
            <div
              className={`${
                filterIndex == 2 ? classes.optionEnabled : classes.option
              } position-relative`}
            >
              <div onClick={() => handleFilterChange(2)}>
                {pickedDate == null ? 'Date' : formatDate(pickedDate)}
              </div>
              {showCalendar && (
                <div className={classes.calendarContainer}>
                  <Calendar
                    className={classes.calendar}
                    value={pickedDate}
                    onChange={(value) => handlePickDate(value)}
                  />
                </div>
              )}
            </div>
            <div className="me-3">|</div>
            <div
              className={`${classes.filledButton} ${
                statusFilter === 1 ? classes.filledEnabled : ''
              }`}
              onClick={() => handleStatusChange(1)}
            >
              Filled
            </div>
            <div
              className={`${classes.unfilledButton} ${
                statusFilter === 0 ? classes.unfilledEnabled : ''
              }`}
              onClick={() => handleStatusChange(0)}
            >
              Unfilled
            </div>
            <div style={{ flex: 1 }}></div>
            <div
              onClick={() => {}}
              className={`${classes.downloadButton} ${
                selectedPrescriptions.length != 0 ? classes.downloadEnabled : ''
              }`}
              style={{ marginRight: '10px' }}
            >
              Add to Cart
            </div>
            <div
              onClick={downloadPrescriptions}
              className={`${classes.downloadButton} ${
                selectedPrescriptions.length != 0 ? classes.downloadEnabled : ''
              }`}
            >
              Download PDF
            </div>
          </div>
          <div className={classes.table}>
            <div className={classes.tableHeader}>
              <div style={{ flex: 2 }}>Medicine</div>
              <div style={{ flex: 1 }}>Dosage</div>
              <div style={{ flex: 2 }}>Frequency</div>
              <div style={{ flex: 2 }}>Doctor</div>
              <div style={{ flex: 2 }}>Issue Date</div>
              <div style={{ flex: 1 }}>Status</div>
            </div>
            {getTiles()}
          </div>
        </div>
        <div style={{ marginTop: '400px' }}>
          <div ref={pdfRef}>
            <PrescriptionPDF prescriptions={selectedPrescriptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;

const formatDate = (date) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
  return formattedDate;
};

const customStyles = {
  control: () => ({
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    position: 'absolute',
    borderRadius: '20px',
    minWidth: '120px',
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
  menuList: (base) => ({
    ...base,
    maxHeight: '180px',
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
