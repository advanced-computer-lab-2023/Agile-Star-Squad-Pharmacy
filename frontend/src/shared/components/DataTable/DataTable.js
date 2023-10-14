import { DataGrid } from '@mui/x-data-grid';
import './DataTable.css';

const DataTable = (params) => {

    const onRowClick = (rowParams) => {
        if (params.onRowClick != null) {    
            params.onRowClick(rowParams.row);
        }
    };

    return (
        <div className='center'>
            <div className='dataGrid'>
                <DataGrid
                    columns={params.columns}
                    rows={params.rows}
                    onRowClick={onRowClick}
                    rowSelection={false}
                    hideFooter={true}
                    disableColumnMenu={true}
                    disableColumnSelector={true}
                    disableColumnFilter={true} />
            </div>
        </div>
    );
};

export default DataTable;