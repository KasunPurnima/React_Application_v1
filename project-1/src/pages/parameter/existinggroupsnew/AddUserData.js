import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';

// material-ui
import {
  Box,
  CircularProgress,
  Grid,
  // IconButton,
  OutlinedInput,
  Snackbar,
  Stack
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';

// project import
import MainCard from 'components/MainCard';

// assets
import { SearchOutlined } from '@ant-design/icons';

// ==============================|| Components ||============================== //
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, ...other }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  let debounceTimeout;

  const onChange = (value) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setGlobalFilter(value || undefined);
    }, 200);
  };

  return (
    <OutlinedInput
      value={value || ''}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
      id="start-adornment-email"
      startAdornment={<SearchOutlined />}
      {...other}
    />
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddUserData = () => {
  // Table data
  const [rows, setRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');

  // Define table columns
  const columns = [
    { field: 'userId', headerName: 'User ID', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'uid', headerName: 'UID', flex: 1 }
  ];

  const [open, setOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState({
    severity: '',
    description: ''
  });

  const handleClick = ({ severity, description }) => {
    setSnackbarContent({
      severity: severity,
      description: description
    });
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // API calls
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`////http://localhost:9081/v3/workflow/create/admin///`, {
        headers: {},
        params: {
          search: globalFilter || ''
        }
      });

      const mappedData = response.data.result.map((item, index) => ({
        username: item.username,
        status: item.status,
        userid: item.level,
        uid: item.uid,
        id: index
      }));

      setRows(mappedData);
    } catch (err) {
      if (!err.response) {
        handleClick({
          severity: 'error',
          description: 'Something went wrong ...'
        });
        return;
      }
      handleClick({
        severity: 'error',
        description: err.response.data.description
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalFilter]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <MainCard>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            </Stack>
            {loading ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              </>
            ) : (
              <>
                <DataGrid rows={rows} columns={columns} autoHeight autoWidth sx={{ mt: 3 }} />
              </>
            )}
          </MainCard>
        </Grid>
      </Grid>

      {open && (
        <>
          <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarContent.severity || 'success'} sx={{ width: '100%' }}>
              {snackbarContent.description || ''}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default AddUserData;
