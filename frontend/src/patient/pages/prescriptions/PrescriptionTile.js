import { useEffect, useState } from 'react';
import classes from './Prescriptions.module.css';
import { Checkbox } from '@mui/material';

const PrescriptionTile = (props) => {
  const presc = props.presc;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      props.setSelectedPrescriptions((val) => [...val, presc]);
    } else {
      props.setSelectedPrescriptions((val) => {
        const result = [...val];
        return result.filter((p) => p.id != presc.id);
      });
    }
  }, [checked]);

  const toggleCheck = () => {
    setChecked((val) => !val);
  };
  return (
    <div onClick={toggleCheck} className={classes.tableRow}>
      <div className={classes.checkbox}>
        <Checkbox checked={checked} size="small" />
      </div>
      <div style={{ flex: 2 }}>{presc.name}</div>
      <div style={{ flex: 1 }}>{presc.dosage}</div>
      <div style={{ flex: 2 }}>{presc.frequency}</div>
      <div style={{ flex: 2 }}>{presc.doctor}</div>
      <div style={{ flex: 2 }}>{presc.date}</div>
      <div
        style={{ flex: 1 }}
        className={`${classes.statusPill} ${
          presc.status == 'Filled'
            ? classes.statusFilled
            : classes.statusUnfilled
        }`}
      >
        {presc.status}
      </div>
    </div>
  );
};
export default PrescriptionTile;
