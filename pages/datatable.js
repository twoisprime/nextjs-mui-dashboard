import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { esES as xdgES} from '@mui/x-data-grid';
import { useRouter } from 'next/router'


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    // width: 150,
    flex: 0.7,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    // width: 150,
    flex: 0.7,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    // width: 110,
    flex: 0.4,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    // width: 160,
    flex: 1,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'actions',
    type: 'actions',
    flex: 0.3,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        // onClick={deleteUser(params.id)}
      />,
      <GridActionsCellItem
        icon={<SecurityIcon />}
        label="Toggle Admin"
        // onClick={toggleAdmin(params.id)}
        // showInMenu
      />,
      <GridActionsCellItem
        icon={<FileCopyIcon />}
        label="Duplicate User"
        // onClick={duplicateUser(params.id)}
        showInMenu
      />,
    ],
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function Datatable() {

  const router = useRouter();
  const { locale } = router;

  let localeText = null;
  if (locale === 'es') {
    localeText = xdgES.components.MuiDataGrid.defaultProps.localeText;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 700, width: '100%' }}>
            <DataGrid
              localeText={localeText}
              rows={rows}
              columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              // checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
