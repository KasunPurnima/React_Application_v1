//import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import AddWorkflowForm from './AddWorkflowForm';
//import PendingView from './PendingView';
import ExistingView from './ExistingView';
import Swal from 'sweetalert2';

// material-ui
import {
  Box,
  CircularProgress,
  Grid,
  Button,
  Dialog,
  //IconButton,
  OutlinedInput,
  Snackbar,
  Stack,
  Slide
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

const AddExistingPendingWorkflow = () => {
  //table
  const [rows, setRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');
  const [ownRequestRows, setOwnRequestRows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExistingViewOpen, setIsExistingViewOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const closeExistingView = () => {
    setIsExistingViewOpen(false);
  };

  // const handleDelete = async (workflowSelectionId) => {
  //   try {
  //     await axios.post('http://10.30.2.111:9081/workflow2/v3/workflow/delete/client', null, {
  //       headers: {
  //         adminBranchOrCustomerCompany: 'nable',
  //         clientFlag: true,
  //         id: workflowSelectionId,
  //         'request-id': '123',
  //         userId: 'nable'
  //       }
  //     });

  //     fetchData();

  //     handleClick({
  //       severity: 'success',
  //       description: 'Record deleted successfully'
  //     });
  //   } catch (error) {
  //     handleClick({
  //       severity: 'error',
  //       description: 'Failed to delete record'
  //     });
  //     console.error(error);
  //   }
  // };

  const handleDelete = async (workflowSelectionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.post('http://10.30.2.111:9081/workflow2/v3/workflow/delete/client', null, {
          headers: {
            adminBranchOrCustomerCompany: 'nable',
            clientFlag: true,
            id: workflowSelectionId,
            'request-id': '123',
            userId: 'nable'
          }
        });

        fetchData();

        handleClick({
          severity: 'success',
          description: 'Record deleted successfully'
        });
      } catch (error) {
        handleClick({
          severity: 'error',
          description: 'Failed to delete record'
        });
        console.error(error);
      }
    }
  };

  const columns = [
    { field: 'type', headerName: 'Workflow Type', flex: 1 },
    { field: 'account', headerName: 'Account Number', flex: 1 },
    {
      field: 'minAmount',
      headerName: 'Minimum Amount',
      flex: 1,
      valueFormatter: (params) => {
        return params.value?.toLocaleString();
      }
    },
    {
      field: 'maxAmount',
      headerName: 'Maximum Amount',
      flex: 1,
      valueFormatter: (params) => {
        return params.value?.toLocaleString();
      }
    },
    { field: 'status', headerName: 'Workflow Status', flex: 1 },
    { field: 'workflowSelectionId', headerName: 'Workflow Selection Id', flex: 1 },
    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Workflow Details">
              <IconButton
                color=""
                onClick={(e) => {
                  setSelectedRowData(params.row);
                  setIsExistingViewOpen(true);
                  e.stopPropagation();
                }}
              >
                <EditTwoTone />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e) => {
                  handleDelete(params.row.workflowSelectionId);
                  e.stopPropagation();
                }}
              >
                <DeleteTwoTone />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const OwnRequestColumns = [
    { field: 'companyId', headerName: 'Company ID', flex: 1 },
    { field: 'type', headerName: 'Workflow Type', flex: 1 },
    { field: 'account', headerName: 'Account Number', flex: 1 },
    {
      field: 'minAmount',
      headerName: 'Minimum Amount',
      flex: 1,
      valueFormatter: (params) => {
        return params.value?.toLocaleString();
      }
    },
    {
      field: 'maxAmount',
      headerName: 'Maximum Amount',
      flex: 1,
      valueFormatter: (params) => {
        return params.value?.toLocaleString();
      }
    },
    { field: 'workflowSelectionId', headerName: 'Workflow Selection Id', flex: 1 },
    { field: 'action', headerName: 'Action', flex: 1 },
    { field: 'reqCreateDate', headerName: 'Request Created Date', flex: 1 },

    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Requests">
              <IconButton
                color="error"
                onClick={(e) => {
                  setSelectedRowData(params.row);
                  setIsExistingViewOpen(true);
                  e.stopPropagation();
                }}
              >
                <EditTwoTone />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DeleteTwoTone />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    }
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
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://10.30.2.111:9081/workflow2/v3/v4/existing/client`, {
        headers: {
          adminUserId: userId
        },
        params: {
          page: queryParams.page || 0,
          per_page: queryParams.per_page || 10,
          sort: queryParams.sort || 'workflowSelectionId',
          direction: queryParams.direction || 'ASC',
          search: queryParams.search || ''
        }
      });

      const fetchedData = response.data.result;
      const mappedData = fetchedData.map((item, index) => ({
        type: item.type,
        account: item.account,
        minAmount: item.minAmount,
        maxAmount: item.maxAmount,
        status: item.status,
        approvalStatus: item.approvalStatus,
        workflowSelectionId: item.workflowSelectionId,
        id: index
      }));
      setRows(mappedData);
      const ownRequestData = fetchedData.map((item, index) => ({
        companyId: item.companyId,
        type: item.type,
        account: item.account,
        minAmount: item.minAmount,
        maxAmount: item.maxAmount,
        action: item.action,
        reqCreateDate: item.currentRequestDate,
        approvalStatus: item.approvalStatus,
        workflowSelectionId: item.workflowSelectionId,
        id: index
      }));
      setOwnRequestRows(ownRequestData);
      setTotalDataCount(response.data.pagination.total);
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
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                <Button
                  variant="contained"
                  startIcon={<PlusOutlined />}
                  onClick={handleOpenDialog}
                  style={{ backgroundColor: '#2979ff', color: 'white' }}
                >
                  Add New Workflow
                </Button>
              </Stack>
            </Stack>

            {isDialogOpen ? (
              <Dialog
                // fullWidth={fullWidth}
                // maxWidth={maxWidth}
                fullScreen
                //maxWidth="md"
                TransitionComponent={Slide}
                keepMounted
                //fullWidth
                onClose={handleCloseDialog}
                open={isDialogOpen}
                sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                aria-describedby="alert-dialog-slide-description"
              >
                <AddWorkflowForm open={isDialogOpen} onClose={handleCloseDialog} />
              </Dialog>
            ) : loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: '1.0rem', fontWeight: 'bold', color: '#757575', marginBottom: '6px' }}
                >
                  Existing Workflows
                </Typography>

                <DataGrid
                  rows={rows}
                  columns={columns}
                  pagination
                  pageSize={perPage}
                  rowCount={totalDataCount}
                  components={{ Toolbar: GridToolbar }}
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

                {/* <Typography variant="h6" gutterBottom>
                  Pending Workflows
                </Typography> */}

                {/* <DataGrid
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
                /> */}

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: '1.0rem', fontWeight: 'bold', color: '#757575', marginBottom: '6px' }}
                >
                  Own Requests
                </Typography>
                <DataGrid
                  rows={ownRequestRows}
                  columns={OwnRequestColumns}
                  pagination
                  pageSize={perPage}
                  rowCount={totalDataCount}
                  components={{ Toolbar: GridToolbar }}
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
      {/* Snackbar model */}
      {open && (
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackbarContent.severity || 'success'} sx={{ width: '100%' }}>
            {snackbarContent.description || ''}
          </Alert>
        </Snackbar>
      )}

      {/* {isPendingViewOpen == true && (
        <Dialog
          //maxWidth="sm"
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          TransitionComponent={Slide}
          keepMounted
          //fullWidth
          onClose={() => setIsPendingViewOpen(false)}
          open={isPendingViewOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <PendingView rowData={selectedRowData} />
        </Dialog>
      )} */}

      {isExistingViewOpen == true && (
        <Dialog
          //fullWidth={fullWidth}
          //maxWidth="md"
          fullScreen
          // fullWidth={fullWidth}
          // maxWidth={maxWidth}
          TransitionComponent={Slide}
          keepMounted
          //onClose={() => setIsExistingViewOpen(false)}
          onClose={closeExistingView}
          open={isExistingViewOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <ExistingView workflowSelectionId={selectedRowData.workflowSelectionId} onClose={closeExistingView} />
        </Dialog>
      )}
    </>
  );
};

export default AddExistingPendingWorkflow;
