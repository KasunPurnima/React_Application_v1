import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress, Grid, Snackbar, Stack, Button, Dialog, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MainCard from 'components/MainCard';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import { OutlinedInput, Tooltip, IconButton } from '@mui/material';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Typography from '@mui/material/Typography';
import AddWorkflowForm from './AddWorkflowForm';
import PendingView from './PendingView';
import ExistingView from './ExistingView';
import OwnRequestDetailView from './OwnRequestDetailView';

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

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const AddExistingPendingWorkflow = () => {
  const ownRequestData = [
    {
      companyId: '410000158',
      type: 'User Groups',
      account: '123456789',
      minAmount: 100,
      maxAmount: 500,
      action: 'UPDATE',
      reqCreateDate: '22/02/2022',
      approvalStatus: 'APPROVED',
      id: 1
    },
    {
      companyId: '410000158',
      type: 'User Groups',
      account: '123456789',
      minAmount: 100,
      maxAmount: 2000,
      action: 'UPDATE',
      reqCreateDate: '20/02/2022',
      approvalStatus: 'PENDING',
      id: 2
    }
  ];

  const [rows] = useState([]);
  const [pendingRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [ownRequestRows] = useState(ownRequestData);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isPendingViewOpen, setIsPendingViewOpen] = useState(false);
  const [isExistingViewOpen, setIsExistingViewOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState(true);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const handleOpenDetailView = (rowData) => {
    setSelectedRowData(rowData);
    setIsDetailViewOpen(true);
  };

  const columns = [
    { field: 'type', headerName: 'Workflow Type', flex: 1 },
    { field: 'account', headerName: 'Account Number', flex: 1 },
    { field: 'minAmount', headerName: 'Minimum Amount', flex: 1 },
    { field: 'maxAmount', headerName: 'Maximum Amount', flex: 1 },
    { field: 'status', headerName: 'Workflow Status', flex: 1 },
    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Approvals">
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
                  // handleDelete(params.row);
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

  const pendingColumns = [
    { field: 'companyId', headerName: 'Company ID', flex: 1 },
    { field: 'type', headerName: 'Workflow Type', flex: 1 },
    { field: 'account', headerName: 'Account Number', flex: 1 },
    { field: 'minAmount', headerName: 'Minimum Amount', flex: 1 },
    { field: 'maxAmount', headerName: 'Maximum Amount', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Approvals">
              <IconButton
                color=""
                onClick={(e) => {
                  setSelectedRowData(params.row);
                  setIsPendingViewOpen(true);
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
                  // handleDelete(params.row);
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
    { field: 'minAmount', headerName: 'Minimum Amount', flex: 1 },
    { field: 'maxAmount', headerName: 'Maximum Amount', flex: 1 },
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
                  handleOpenDetailView(params.row);
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

  const [open, setOpen] = useState(false);
  const [snackbarContent] = useState({
    severity: '',
    description: ''
  });

  // const handleClick = ({ severity, description }) => {
  //   setSnackbarContent({
  //     severity: severity,
  //     description: description
  //   });
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [loading] = useState(false);

  // const fetchData = async (queryParams = {}) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get('http://10.30.2.111:9081/workflow2/v3/workflow/existing', {
  //       headers: {
  //         adminUserId: 'nable'
  //       },
  //       params: {
  //         search: queryParams.search || globalFilter
  //       }
  //     });

  //     const mappedData = response.data.workflowselectionList.map((item, index) => ({
  //       type: item.type,
  //       account: item.account,
  //       minAmount: item.minAmount,
  //       maxAmount: item.maxAmount,
  //       status: item.status,
  //       approvalStatus: item.approvalStatus,
  //       id: index
  //     }));

  //     setRows(mappedData);
  //   } catch (err) {
  //     if (!err.response) {
  //       handleClick({
  //         severity: 'error',
  //         description: 'Something went wrong...'
  //       });
  //       return;
  //     }
  //     handleClick({
  //       severity: 'error',
  //       description: err.response.data.description
  //     });
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchPendingData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get('http://10.30.2.111:9081/workflow2/v3/workflow/pendingwithmaster', {
  //       headers: {
  //         adminUserId: 'nable',
  //         groupID: 'nable'
  //       }
  //     });

  //     const mappedData = response.data.pendingWorkFlows.map((item, index) => ({
  //       companyId: item.tempWorkFlowDTO.requestPayload.companyId,
  //       type: item.tempWorkFlowDTO.requestPayload.type,
  //       account: item.tempWorkFlowDTO.requestPayload.account,
  //       minAmount: item.tempWorkFlowDTO.requestPayload.minAmount,
  //       maxAmount: item.tempWorkFlowDTO.requestPayload.maxAmount,
  //       approvalStatus: item.tempWorkFlowDTO.requestPayload.approvalStatus,
  //       status: item.tempWorkFlowDTO.requestPayload.status,
  //       id: index
  //     }));

  //     setPendingRows(mappedData);
  //   } catch (err) {
  //     if (!err.response) {
  //       handleClick({
  //         severity: 'error',
  //         description: 'Something went wrong...'
  //       });
  //       return;
  //     }
  //     handleClick({
  //       severity: 'error',
  //       description: err.response.data.description
  //     });
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    //fetchData({ page, per_page: pageSize });
    //fetchPendingData();
  }, [globalFilter, pageSize, page]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <MainCard>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<PlusOutlined />}
                  onClick={handleOpenDialog}
                  style={{ backgroundColor: '#8BC34A', color: 'white' }}
                >
                  Add New Workflow
                </Button>
              </Stack>
            </Stack>

            {isDialogOpen ? (
              <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
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
                  components={{ Toolbar: GridToolbar }}
                  pageSize={10}
                  autoHeight
                  autoWidth
                  sx={{ mt: 3 }}
                  onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                  }}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                  }}
                  rowCount={10}
                />

                <Typography variant="h6" gutterBottom>
                  Pending Workflows
                </Typography>

                <DataGrid
                  rows={pendingRows}
                  columns={pendingColumns}
                  pagination
                  components={{ Toolbar: GridToolbar }}
                  pageSize={10}
                  autoHeight
                  autoWidth
                  sx={{ mt: 3 }}
                  onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                  }}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                  }}
                  rowCount={10}
                />

                <Typography variant="h6" gutterBottom>
                  Own Requests
                </Typography>

                <DataGrid
                  rows={ownRequestRows}
                  columns={OwnRequestColumns}
                  pagination
                  components={{ Toolbar: GridToolbar }}
                  pageSize={10}
                  autoHeight
                  autoWidth
                  sx={{ mt: 3 }}
                  onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                  }}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                  }}
                  rowCount={10}
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

      {isPendingViewOpen == true && (
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
      )}

      {isExistingViewOpen == true && (
        <Dialog
          //maxWidth="sm"
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          TransitionComponent={Slide}
          keepMounted
          //fullWidth
          onClose={() => setIsExistingViewOpen(false)}
          open={isExistingViewOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <ExistingView rowData={selectedRowData} />
        </Dialog>
      )}

      {isDetailViewOpen && (
        <Dialog
          //maxWidth="sm"
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          TransitionComponent={Slide}
          keepMounted
          //fullWidth
          onClose={() => setIsDetailViewOpen(false)}
          open={isDetailViewOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <OwnRequestDetailView rowData={selectedRowData} />
        </Dialog>
      )}
    </>
  );
};

export default AddExistingPendingWorkflow;
