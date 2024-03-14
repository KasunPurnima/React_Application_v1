import React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const AddNewBranch = ({ onCancel, addUser }) => {
  const UserSchema = Yup.object().shape({
    companyId: Yup.string().required('Company ID is required'),
    branchId: Yup.string().required('Branch ID is required'),
    branchName: Yup.string().required('Branch Name is required')
  });

  const formik = useFormik({
    initialValues: {
      companyId: '',
      branchId: '',
      branchName: ''
    },
    validationSchema: UserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        addUser(values);
        resetForm();
        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>Create New Branch</DialogTitle>
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
                        //placeholder="Enter Company ID"
                        {...getFieldProps('companyId')}
                        error={Boolean(touched.companyId && errors.companyId)}
                        helperText={touched.companyId && errors.companyId}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="branchId">Branch ID</InputLabel>
                      <TextField
                        fullWidth
                        id="branchId"
                        placeholder="Enter Branch ID"
                        {...getFieldProps('branchId')}
                        error={Boolean(touched.branchId && errors.branchId)}
                        helperText={touched.branchId && errors.branchId}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="branchName">Branch Name</InputLabel>
                      <TextField
                        fullWidth
                        id="branchName"
                        placeholder="Enter Branch Name"
                        {...getFieldProps('branchName')}
                        error={Boolean(touched.branchName && errors.branchName)}
                        helperText={touched.branchName && errors.branchName}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />

          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Button color="error" onClick={onCancel}>
                  Back
                </Button>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    Create
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

AddNewBranch.propTypes = {
  onCancel: PropTypes.func,
  addUser: PropTypes.func
};

export default AddNewBranch;
