import React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, Select, MenuItem } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';
import Typography from '@mui/material/Typography';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const getInitialValues = () => {
  return {
    workflowType: ''
  };
};

const ExistingView = ({ onSubmit }) => {
  const UserSchema = Yup.object().shape({
    workflowType: Yup.string().required('Workflow Type is required')
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://10.30.2.111:9081/workflow2/v3/workflow/create/admin', values, {
          headers: {
            adminBranchOrCustomerCompany: 'nable',
            adminUserId: 'nable',
            'request-id': 123
          }
        });

        await onSubmit(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  const authorizerOptionsData = [
    { optionNumber: 1, level: 1, group: 'CustomGroup1234', noOfAuthorizers: 2, sequential: 'Sequential with Next Level' },
    { optionNumber: 1, level: 2, group: 'OneUser', noOfAuthorizers: 1, sequential: 'Sequential with Next Level' },
    { optionNumber: 2, level: 1, group: 'AddedNewGroup', noOfAuthorizers: 2, sequential: 'Sequential with Next Level' },
    { optionNumber: 2, level: 2, group: 'Different', noOfAuthorizers: 3, sequential: 'Parallel with Next Level' }
  ];

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>Update Workflow</DialogTitle>
          <Divider />
          <DialogContent sx={{}}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="workflowType">Workflow Type</InputLabel>
                      <Select
                        fullWidth
                        id="workflowType"
                        {...getFieldProps('workflowType')}
                        error={Boolean(formik.touched.workflowType && formik.errors.workflowType)}
                      >
                        <MenuItem value="ownTransfer">User Groups</MenuItem>
                        <MenuItem value="scheduleTransfer">Instructions</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <Typography>
                        Workflow Status
                        <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}></div>
                      </Typography>
                      <Typography>INACTIVE</Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <Typography>
                        Approval Status
                        <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}></div>
                      </Typography>
                      <Typography>NEW PENDING</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Button type="submit" variant="contained" disabled={isSubmitting} onClick={formik.handleSubmit}>
            Add an Option
          </Button>
          <Divider />

          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Authorizer Options
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Option Number</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell> Group</TableCell>
                        <TableCell>No of Authorizers</TableCell>
                        <TableCell>Sequential/Parallel</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {authorizerOptionsData.map((row, index) => (
                        <TableRow key={index}>
                          {index === 0 || authorizerOptionsData[index - 1].optionNumber !== row.optionNumber ? (
                            <TableCell>{row.optionNumber}</TableCell>
                          ) : (
                            <TableCell></TableCell>
                          )}
                          <TableCell>{row.level}</TableCell>
                          <TableCell>{row.group}</TableCell>
                          <TableCell>{row.noOfAuthorizers}</TableCell>
                          <TableCell>{row.sequential}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* <Button color="error" onClick={onCancel}>
                    Back
                  </Button> */}
                  <Button type="submit" variant="contained" disabled={isSubmitting} onClick={formik.handleSubmit}>
                    Back
                  </Button>

                  {/* <Button type="submit" variant="contained" disabled={isSubmitting} onClick={formik.handleSubmit}>
                    Reject
                  </Button> */}
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

ExistingView.propTypes = {
  //onCancel: PropTypes.func,
  onSubmit: PropTypes.func
};

export default ExistingView;
