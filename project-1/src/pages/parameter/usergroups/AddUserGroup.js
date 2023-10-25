import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';

// material-ui
import { Box, CircularProgress, Grid, IconButton, OutlinedInput, Snackbar, Stack, Tooltip, Button, Dialog, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// project import
import MainCard from 'components/MainCard';

// assets
import { DeleteTwoTone, EditTwoTone, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddUserForm from './AddUserForm';

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

const AddUserGroup = () => {
  //table
  const [rows, setRows] = useState([]);
  const preGlobalFilteredRows = rows || [];
  const [globalFilter, setGlobalFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'companyId', headerName: 'Company Id', flex: 1 },
    { field: 'groupName', headerName: 'Group Name', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    //{ field: 'approvalStatus', headerName: 'Approval Status', flex: 1 },
    { field: 'groupId', headerName: 'Group Id', flex: 1 },
    {
      //   field: 'actions',
      //   headerName: 'Actions',
      //   flex: 1,
      //   sortable: false,
      //   filterable: false,
      renderCell: () => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Edit">
              <IconButton
                color=""
                onClick={(e) => {
                  // handleEdit(params.row);
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
    try {
      setLoading(true);
      setpage(queryParams.page || 0);
      setPerPage(queryParams.per_page || 10);
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
        //approvalStatus: item.approvalStatus,
        groupId: item.groupId,
        id: index
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

  // const handleAddNewUser = async ({ companyId, groupName }) => {
  //   try {
  //     axios.post(
  //       `http://10.30.2.111:9081/workflow2/v3/v4/groups/existing`,
  //       {
  //         companyId: companyId,
  //         groupName: groupName
  //       },
  //       {
  //         headers: {
  //           adminUserId: 'nble'
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   fetchData({ search: globalFilter });
  // };

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

export default AddUserGroup;
