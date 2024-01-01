import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  OutlinedInput,
  Snackbar,
  Stack,
  Tooltip,
  Button,
  Dialog,
  Typography
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MainCard from 'components/MainCard';
import { DeleteTwoTone, SearchOutlined, PlusOutlined, EditTwoTone } from '@ant-design/icons';
import { DataGrid } from '@mui/x-data-grid';
import AddNewBranch from './AddNewBranch';

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BranchList = () => {
  const [rows, setRows] = useState([]);
  const [pendingRows, setPendingRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbarContent] = useState({
    severity: '',
    description: ''
  });
  const [loading] = useState(false);
  const [totalDataCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(100);
  const [addBranchDialogOpen, setAddBranchDialogOpen] = useState(false);

  const columns = [
    { field: 'branchId', headerName: 'Branch ID', flex: 1 },
    { field: 'branchcode', headerName: 'Branch Code', flex: 1 },
    { field: 'companyId', headerName: 'CompanyId', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      renderCell: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton color="error" onClick={(e) => e.stopPropagation()}>
              <EditTwoTone />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={(e) => e.stopPropagation()}>
              <DeleteTwoTone />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  const pendingColumns = [
    { field: 'branchId', headerName: 'Branch ID', flex: 1 },
    { field: 'branchcode', headerName: 'Branch Code', flex: 1 },
    { field: 'companyId', headerName: 'CompanyId', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      renderCell: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton color="error" onClick={(e) => e.stopPropagation()}>
              <EditTwoTone />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={(e) => e.stopPropagation()}>
              <DeleteTwoTone />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  useEffect(() => {
    const hardcodedData = [
      { id: 1, branchId: 101, branchcode: 'B101', companyId: 'C1', status: 'Active' },
      { id: 2, branchId: 102, branchcode: 'B102', companyId: 'C2', status: 'Inactive' }
    ];

    const pendingData = [
      { id: 1, branchId: 201, branchcode: 'B201', companyId: 'C1', status: 'Pending Approval' },
      { id: 2, branchId: 202, branchcode: 'B202', companyId: 'C2', status: 'Pending Approval' }
    ];

    setRows(hardcodedData);
    setPendingRows(pendingData);
  }, [globalFilter]);

  const handleAddNewBranchClick = () => {
    setAddBranchDialogOpen(true);
  };

  const handleAddBranchDialogClose = () => {
    setAddBranchDialogOpen(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <MainCard>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <GlobalFilter preGlobalFilteredRows={rows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddNewBranchClick}>
                Add New Branch
              </Button>
            </Stack>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Existing Branches
                </Typography>
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
                    setPage(e.page);
                    setPerPage(e.pageSize);
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  paginationMode="client"
                />
                <Typography variant="h6" gutterBottom>
                  Pending Branches
                </Typography>
                <DataGrid
                  rows={pendingRows}
                  columns={pendingColumns}
                  pagination
                  pageSize={perPage}
                  autoHeight
                  autoWidth
                  sx={{ mt: 3 }}
                  pageSizeOptions={[5, 10, 20]}
                  paginationMode="client"
                />
              </>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <Dialog open={addBranchDialogOpen} onClose={handleAddBranchDialogClose}>
        <AddNewBranch
          onCancel={handleAddBranchDialogClose}
          addUser={(values) => {
            console.log('Add new branch:', values);
          }}
        />
      </Dialog>

      {open && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert severity={snackbarContent.severity || 'success'} sx={{ width: '100%' }}>
            {snackbarContent.description || ''}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default BranchList;
