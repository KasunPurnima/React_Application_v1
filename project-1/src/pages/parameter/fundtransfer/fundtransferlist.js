import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddFundTransfer from './AddFundTransfer';
//import ExistingView from '../existingpendingworkflow/ExistingView';
import { Box, CircularProgress, Grid, Button, Dialog, OutlinedInput, Snackbar, Stack, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MainCard from 'components/MainCard';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AuditTrailView from './AuditTrailView';

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

const FundtransferList = () => {
  const [rows, setRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');
  //const [ownRequestRows, setOwnRequestRows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExistingViewOpen, setIsExistingViewOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  //const [SelectedRowData,setSelectedRowData] = useState(null);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const closeExistingView = () => {
    setIsExistingViewOpen(false);
  };

  const columns = [
    { field: 'transferId', headerName: 'Transer ID', flex: 1 },
    { field: 'transferType', headerName: 'Transfer Type', flex: 1 },
    { field: 'amount', headerName: 'Amount (LKR)', flex: 1 },
    { field: 'companyRef', headerName: 'Company Reference', flex: 1 },
    { field: 'createdUser', headerName: 'Created User', flex: 1 },
    { field: 'createdDate', headerName: 'Created Date', flex: 1 },
    { field: 'wfStatus', headerName: 'Status', flex: 1 },
    { field: 'wfValue', headerName: 'Workflow Value', flex: 1 },
    {
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Transfer Details">
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

  const [loading, setLoading] = useState(false);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const [perPage] = useState(100);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `http://10.30.2.111:9081/transfer/transfer/v2/single/own`,
        {
          transferDetailRequest: {
            transferType: 'OWN'
          }
        },
        {
          headers: {
            companyId: 'nable',
            userId: 'nable',
            'request-id': '123'
          }
        }
      );
      const fetchedData = response.data.singleTransferDetailList;
      const mappedData = fetchedData.map((item, index) => ({
        id: index,
        transferId: item.transferId,
        transferType: item.transferType,

        amount: item.amount,
        companyRef: item.companyRef,
        createdUser: item.createdUser,
        createdDate: item.createdDate,
        wfStatus: item.wfStatus,
        wfValue: item.wfValue
      }));
      setRows(mappedData.reverse());

      setTotalDataCount(response.data.pagination.total);
    } catch (err) {
      if (!err.response) {
        // handleClick({
        //   severity: 'error',
        //   description: 'Something went wrong ...'
        // });
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
                  Add New Transfer
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
                <AddFundTransfer open={isDialogOpen} onClose={handleCloseDialog} />
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
                  Own Transfers
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
                      paginationModel: { pageSize: 10 }
                    }
                  }}
                  onPaginationModelChange={(e) => {
                    console.log(e);
                    fetchData({ page: e.page, per_page: e.pageSize });
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  //paginationMode="server"
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
          <AuditTrailView transferId={selectedRowData.transferId} wfValue={selectedRowData.wfValue} onClose={closeExistingView} />
        </Dialog>
      )}
    </>
  );
};

export default FundtransferList;
