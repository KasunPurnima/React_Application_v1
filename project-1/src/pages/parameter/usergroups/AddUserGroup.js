import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { forwardRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, IconButton, OutlinedInput, Snackbar, Stack, Tooltip, Button, Dialog, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MainCard from 'components/MainCard';
import { DeleteTwoTone, EditTwoTone, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddUserForm from './AddUserForm';
import ApproverDetailsTable from './ApproverDetailsTable';
import OwnRequest from './OwnRequestTable';

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

const PendingRequestsTable = () => {
  const [pendingRequests] = useState([
    { companyId: 'C001', groupName: 'Group 1', groupId: 'G001', approvalStatus: 'Pending', id: 1 },
    { companyId: 'C002', groupName: 'Group 2', groupId: 'G002', approvalStatus: 'Pending', id: 2 }
  ]);

  const columns = [
    { field: 'companyId', headerName: 'Company Id', flex: 1 },
    { field: 'groupName', headerName: 'Group Name', flex: 1 },
    { field: 'groupId', headerName: 'Group Id', flex: 1 },
    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    {
      renderCell: () => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Edit">
              <IconButton
                color="error"
                onClick={(e) => {
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

  return <DataGrid rows={pendingRequests} columns={columns} pagination pageSize={10} autoHeight autoWidth sx={{ mt: 3 }} />;
};

const OwnRequestsTable = ({ setSelectedRowData, setIsOwnRequestDialogOpen }) => {
  const [ownRequests] = useState([
    {
      companyId: 'C003',
      groupName: 'Group 3',
      groupId: 'G003',
      recordStatus: 'Active',
      approvalStatus: 'Approved',
      action: 'CREATE',
      requestCreatedDate: '12-12-2023',
      id: 3
    },
    {
      companyId: 'C003',
      groupName: 'Group 3',
      groupId: 'G003',
      recordStatus: 'Active',
      approvalStatus: 'Approved',
      action: 'CREATE',
      requestCreatedDate: '12-12-2023',
      id: 4
    }
  ]);

  const columns = [
    { field: 'companyId', headerName: 'Company Id', flex: 1 },
    { field: 'groupName', headerName: 'Group Name', flex: 1 },
    { field: 'groupId', headerName: 'Group Id', flex: 1 },
    { field: 'recordStatus', headerName: 'Record Status', flex: 1 },
    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    { field: 'action', headerName: 'Action', flex: 1 },
    { field: 'requestCreatedDate', headerName: 'Request Created Date', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Requests">
              <IconButton
                color=""
                onClick={(e) => {
                  setSelectedRowData(params.row);
                  setIsOwnRequestDialogOpen(true);
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

  return <DataGrid rows={ownRequests} columns={columns} pagination pageSize={10} autoHeight autoWidth sx={{ mt: 3 }} />;
};

const AddUserGroup = () => {
  const [rows, setRows] = useState([]);
  const [pendingRequests] = useState([
    { companyId: 'C001', groupName: 'Group 1', groupId: 'G001', approvalStatus: 'Pending', id: 1 },
    { companyId: 'C002', groupName: 'Group 2', groupId: 'G002', approvalStatus: 'Pending', id: 2 }
  ]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isViewApprovalsOpen, setIsViewApprovalsOpen] = useState(false);
  const [isOwnRequestDialogOpen, setIsOwnRequestDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const columns = [
    { field: 'companyId', headerName: 'Company Id', flex: 1 },
    { field: 'groupName', headerName: 'Group Name', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'createdDate', headerName: 'Created Date', flex: 1 },
    { field: 'groupId', headerName: 'Group Id', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Approvals">
              <IconButton
                color=""
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRowData(params.row);
                  setIsViewApprovalsOpen(true);
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

  console.log('isViewApprovalsOpen:', isViewApprovalsOpen);

  const [loading, setLoading] = useState(false);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [page, setpage] = useState(0);
  const [perPage, setPerPage] = useState(100);

  const fetchData = async (queryParams = {}) => {
    try {
      setLoading(true);
      setpage(queryParams.page || 0);
      setPerPage(queryParams.per_page || 10);

      /*
      const response = await axios.get(`http://10.30.2.111:9081/workflow2/v3/v4/groups/existing`, {
        headers: {
          adminUserId: 'nble'
        },
        params: {
          page: queryParams.page || 0,
          per_page: queryParams.per_page || 10,
          sort: queryParams.sort || 'groupId',
          direction: queryParams.direction || 'ASC',
          search: queryParams.search || ''
        }
      });

      const mappedData = response.data.result.map((item, index) => ({
        companyId: item.companyId,
        groupName: item.groupName,
        status: item.status,
        createdDate: item.createdDate,
        groupId: item.groupId,
        id: index
      }));

      setTotalDataCount(response.data.pagination.total);
      setRows(mappedData);
      */

      const existingGroups = [
        { companyId: 'C004', groupName: 'Group 4', status: 'Active', createdDate: '01-01-2023', groupId: 'G004', id: 5 },
        { companyId: 'C005', groupName: 'Group 5', status: 'Inactive', createdDate: '02-01-2023', groupId: 'G005', id: 6 }
      ];

      const mappedData = existingGroups.map((item, index) => ({
        companyId: item.companyId,
        groupName: item.groupName,
        status: item.status,
        createdDate: item.createdDate,
        groupId: item.groupId,
        id: index
      }));

      setTotalDataCount(existingGroups.length);
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

              <Stack direction="row" alignItems="center" spacing={1}>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenDialog}>
                  Add New Group
                </Button>
              </Stack>
            </Stack>

            {isDialogOpen ? (
              <Dialog
                maxWidth="sm"
                TransitionComponent={Slide}
                keepMounted
                fullWidth
                onClose={handleCloseDialog}
                open={isDialogOpen}
                sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                aria-describedby="alert-dialog-slide-description"
              >
                <AddUserForm onCancel={handleCloseDialog} />
              </Dialog>
            ) : loading ? (
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
                  components={{ Toolbar: GridToolbar }}
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
                  pageSizeOptions={[5, 10, 15]}
                  paginationMode="server"
                />
              </>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <Grid item md={12}>
        <MainCard title="Pending Requests">
          <GlobalFilter preGlobalFilteredRows={pendingRequests} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

          <PendingRequestsTable />
        </MainCard>
      </Grid>

      <Grid item md={12}>
        <MainCard title="Own Requests">
          <OwnRequestsTable setIsOwnRequestDialogOpen={setIsOwnRequestDialogOpen} setSelectedRowData={setSelectedRowData} />
        </MainCard>
      </Grid>

      {open && (
        <>
          <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarContent.severity || 'success'} sx={{ width: '100%' }}>
              {snackbarContent.description || ''}
            </Alert>
          </Snackbar>

          {/* {isViewApprovalsOpen && (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={snackbarContent.severity || 'success'} sx={{ width: '100%' }}>
                {snackbarContent.description || ''}
              </Alert>
            </Snackbar>
          )} */}
        </>
      )}

      {isViewApprovalsOpen == true && (
        <Dialog
          maxWidth="sm"
          TransitionComponent={Slide}
          keepMounted
          fullWidth
          onClose={() => setIsViewApprovalsOpen(false)}
          open={isViewApprovalsOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <ApproverDetailsTable rowData={selectedRowData} />
        </Dialog>
      )}

      {isOwnRequestDialogOpen == true && (
        <Dialog
          maxWidth="sm"
          TransitionComponent={Slide}
          keepMounted
          fullWidth
          onClose={() => setIsOwnRequestDialogOpen(false)}
          open={isOwnRequestDialogOpen}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <OwnRequest rowData={selectedRowData} />
        </Dialog>
      )}
    </>
  );
};

export default AddUserGroup;
