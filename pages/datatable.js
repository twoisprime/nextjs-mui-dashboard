import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { esES as xdgES} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '@components/dashboard/Dashboard';
import { sessionRoute, sessionOptions } from '@lib/session'
import { withIronSessionSsr } from 'iron-session/next';


export const getServerSideProps = withIronSessionSsr(sessionRoute, sessionOptions)

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function useCustomers() {
    const { data, error } = useSWR(`/api/customers/`, fetcher)
  
    return {
      customers: data,
      isLoading: !error && !data,
      isError: error
    }
};

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

export default function Datatable() {
  const router = useRouter();
  const { locale } = router;

  let localeText = null;
  if (locale === 'es') {
    localeText = xdgES.components.MuiDataGrid.defaultProps.localeText;
  }

  const { customers, isLoading, isError } = useCustomers();

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 700, width: '100%' }}>
              <DataGrid
                localeText={localeText}
                rows={[]}
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
  // if (isError) return <Error />
  // return <img src={user.avatar} />

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 700, width: '100%' }}>
            <DataGrid
              localeText={localeText}
              rows={customers}
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

Datatable.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}