const PrescriptionPDF = (props) => {
  const classes = {
    wrapper: {
      fontFamily: 'Helvetica',
      marginLeft: '30px',
    },

    header: {
      fontSize: '32px',
      fontWeight: '600',
      marginBottom: '10px',
      textAlign: 'start',
    },

    tableWrapper: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      padding: '24px',
      paddingBottom: '40px',
      background: '#F7F9FB',
      shadow: '0px 4px 29px 0px rgba(0, 0, 0, 0.25)',
    },

    table: {
      backgroundColor: 'white',
      flex: '1',
      marginInline: '20px',
      borderRadius: '14px',
      boxShadow: '0px 0px 4px 1px rgba(0, 0, 0, 0.13)',
    },

    tableHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#96B7C7',
      color: 'white',
      fontSize: '12px',
      fontWeight: '700',
      height: '40px',
      borderRadius: '14px 14px 0 0',
      paddingInline: '10px',
    },

    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      color: 'black',
      fontSize: '14px',
      height: '40px',
      paddingInline: '10px',
      borderBottom: '1px solid #E7E7E7',
    },

    statusPill: {
      fontSize: '10px',
      paddingBlock: '4.5px',
      borderRadius: '9px',
    },
    statusFilled: {
      color: '#00AFB9',
      backgroundColor: '#CFEDEA',
    },
    statusUnfilled: {
      color: '#F07167',
      backgroundColor: '#FFE9E2',
    },
  };

  const getTiles = () => {
    return (
      <div>
        {props.prescriptions.map((presc) => {
          return (
            <div style={classes.tableRow}>
              <div style={{ flex: 2, textAlign: 'center' }}>{presc.name}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{presc.dosage}</div>
              <div style={{ flex: 2, textAlign: 'center' }}>
                {presc.frequency}
              </div>
              <div style={{ flex: 2, textAlign: 'center' }}>{presc.doctor}</div>
              <div style={{ flex: 2, textAlign: 'center' }}>{presc.date}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{presc.status}</div>
              <div style={{ flex: 2, fontSize: '12px', textAlign: 'center' }}>
                {presc.id}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={classes.wrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={classes.header}>PRESCRIPTIONS</div>
        <div style={{ fontSize: '20px' }}>Certified by Clinic Platform</div>
      </div>
      <div style={classes.tableWrapper}>
        <div style={classes.table}>
          <div style={classes.tableHeader}>
            <div style={{ flex: 2, textAlign: 'center' }}>Medicine</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Dosage</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Frequency</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Doctor</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Issue Date</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Status</div>
            <div style={{ flex: 2, textAlign: 'center' }}>Prescription ID</div>
          </div>
          {getTiles()}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPDF;
