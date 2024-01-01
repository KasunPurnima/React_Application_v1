import React, { useState, useEffect } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';
import TablePagination from '@mui/material/TablePagination';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const getInitialValues = () => {
  return {
    companyId: '',
    groupName: ''
  };
};

const AddUserForm = ({ onCancel, addUser }) => {
  const UserSchema = Yup.object().shape({
    companyId: Yup.string().required('Company Name is required'),
    groupName: Yup.string().required('Group Name is required')
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: UserSchema,
    onSubmit: ({ setSubmitting, resetForm }) => {
      try {
        addUser({
          //companyId: values.companyId,
          // groupName: values.groupName
        });
        resetForm();
        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const [selectedUserData, setSelectedUserData] = useState([]);

  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const displayedData = userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const [selectedRows, setSelectedRows] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://10.30.2.111:9081/comp/v1/user', {
        headers: {
          adminUserId: 'nable',
          'request-id': 1234
        }
      });

      const mappedData = response.data.userListResponses.map((item, index) => ({
        userId: item.userId,
        userName: item.userName,
        id: index
      }));
      setUserData(mappedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRowSelect = (event, userId) => {
    const selectedIndex = selectedRows.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, userId];
    } else {
      newSelected = [...selectedRows];
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedRows(newSelected);

    const updatedUserData = userData.filter((user) => newSelected.includes(user.userId));
    setSelectedUserData(updatedUserData);
  };

  const handleCreateGroup = async () => {
    try {
      const companyId = formik.values.companyId;
      const groupName = formik.values.groupName;

      const requestBody = {
        companyId: companyId,
        groupName: groupName,
        users: selectedUserData.map((user) => ({
          userId: user.userId,
          userName: user.userName
        }))
      };

      const headers = {
        adminBranchOrCustomerCompany: 'nable',
        adminUserId: 'nable',
        'request-id': 1234
      };

      const response = await axios.post('http://10.30.2.111:9081/workflow2/v3/groups/admin', requestBody, {
        headers
      });

      if (response.data.statusCode === 'success.') {
        handleSnackbarOpen();
        setSuccessMessage('Group successfully created');
      } else {
        setSuccessMessage('Error creating the groups');
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage('Error creating the group');
    }
  };

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>Create User Group</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5, maxWidth: '400px', maxHeight: '400px', overflow: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="companyId">Company ID</InputLabel>
                      <TextField
                        fullWidth
                        id="companyId"
                        placeholder="Enter Company ID"
                        {...getFieldProps('companyId')}
                        error={Boolean(touched.companyId && errors.companyId)}
                        helperText={touched.companyId && errors.companyId}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="groupName">Group Name</InputLabel>
                      <TextField
                        fullWidth
                        id="groupName"
                        placeholder="Enter Group Name"
                        {...getFieldProps('groupName')}
                        error={Boolean(touched.groupName && errors.groupName)}
                        helperText={touched.groupName && errors.groupName}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>User Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <Checkbox checked={selectedRows.includes(user.userId)} onChange={(event) => handleRowSelect(event, user.userId)} />
                    </TableCell>
                    <TableCell sx={{ height: '40px', fontSize: '14px' }}>{user.userId}</TableCell>
                    <TableCell sx={{ height: '40px', fontSize: '14px' }}>{user.userName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Username</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedUserData.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[3, 10, 15, 20]}
            component="div"
            count={userData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 5));
              setPage(0);
            }}
          />

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
              {successMessage}
            </MuiAlert>
          </Snackbar>

          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleCreateGroup} variant="contained" disabled={isSubmitting}>
                    Create
                  </Button>
                  {successMessage && <div>{successMessage}</div>}
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

AddUserForm.propTypes = {
  onCancel: PropTypes.func,
  addUser: PropTypes.func
};

export default AddUserForm;
