import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';

// material-ui
import {
  Box,
  CircularProgress,
  Grid,
  Button,
  //IconButton,
  OutlinedInput,
  Snackbar,
  Stack
  // Tooltip
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// project import
import MainCard from 'components/MainCard';

// assets
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

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

// ==============================|| PaginationApiTestPage ||============================== //

const PaginationApiTestPage = () => {
  //table
  const [rows, setRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'workflowSelectionId', headerName: 'WorkflowSelectionId', flex: 1 },
    { field: 'approvalStatus', headerName: 'ApprovalStatus', flex: 1 },
    { field: 'companyId', headerName: 'CompanyId', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'currentRequestDate', headerName: 'CurrentRequestDate', flex: 1 },
    { field: 'account', headerName: 'Account', flex: 1 }
  ];

  //snack bar
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
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [page, setpage] = useState(0);
  const [perPage, setPerPage] = useState(100);

  const fetchData = async (queryParams = {}) => {
    // const fetchData = async () => {
    try {
      setLoading(true);
      setpage(queryParams.page || 0);
      setPerPage(queryParams.per_page || 10);
      const response = await axios.get(`http://10.30.2.111:9081/workflow2/v3/v4/existing/client`, {
        headers: {
          adminUserId: 'nble'
        },
        params: {
          page: queryParams.page || 0,
          per_page: queryParams.per_page || 10,
          sort: queryParams.sort || 'workflowSelectionId',
          direction: queryParams.direction || 'ASC',
          search: queryParams.search || ''
        }
      });
      const mappedData = response.data.result.map((item, index) => ({
        id: index,
        ...item
      }));

      setTotalDataCount(response.data.pagination.total);
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
    fetchData({ search: globalFilter });
  }, [globalFilter]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <MainCard>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

              <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleClick}>
                Add New Currency
              </Button>
            </Stack>
            {loading ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              </>
            ) : (
              <>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pagination
                  pageSize={perPage}
                  rowCount={totalDataCount}
                  autoHeight
                  autoWidth
                  sx={{ mt: 3 }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: page, pageSize: perPage }
                    }
                  }}
                  onPaginationModelChange={(e) => {
                    console.log(e);
                    fetchData({ page: e.page, per_page: e.pageSize });
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  paginationMode="server"
                />
              </>
            )}
          </MainCard>
        </Grid>
      </Grid>
      {/* snackbar model */}
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

export default PaginationApiTestPage;
