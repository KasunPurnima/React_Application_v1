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

// ==============================|| AuthorizationLevelsPage ||============================== //

const AuthorizationLevelsPage = () => {
  // Table data
  const [rows, setRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');

  // Define table columns
  const columns = [
    { field: 'signature', headerName: 'Signature', flex: 1 },
    { field: 'approvalId', headerName: 'Approval Id', flex: 1 },
    { field: 'requestType', headerName: 'Request Type', flex: 1 }
  ];

  // Snackbar
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
      const response = await axios.get(`http://10.30.2.111:9081/workflow2/v3/workflow/pendingwithmaster`, {
        headers: {
          adminUserId: 'nble'
        },
        params: {
          per_page: queryParams.per_page || ''
        }
      });

      const mappedData = response.data.result.map((item, index) => ({
        signature: item.signature,
        approvalId: item.approvalId,
        requestType: item.requestType,
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

export default AuthorizationLevelsPage;
