import React, { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, Select, MenuItem } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const getInitialValues = () => {
  return {
    //companyID: '',
    workflowType: ''
  };
};

const PendingView = ({ onCancel, onSubmit }) => {
  const UserSchema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
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

  const { handleSubmit, isSubmitting, getFieldProps, touched, errors } = formik;

  const [workflowLevels, setWorkflowLevels] = useState([
    { optionNumber: 1, levels: [{ level: 1, group: '', noOfAuthorizers: '', authorizationLevel: '' }] }
  ]);

  const addWorkflowLevel = () => {
    setWorkflowLevels([
      ...workflowLevels,
      { optionNumber: workflowLevels.length + 1, levels: [{ level: 1, group: '', noOfAuthorizers: '', authorizationLevel: '' }] }
    ]);
  };

  const addAuthorizerOption = (optionIndex) => {
    const newWorkflowLevels = [...workflowLevels];
    const option = newWorkflowLevels[optionIndex];
    option.levels.push({
      level: ` ${option.levels.length + 1}`,
      group: '',
      noOfAuthorizers: '',
      authorizationLevel: ''
    });
    setWorkflowLevels(newWorkflowLevels);
  };

  const handleGroupChange = (e, optionIndex, levelIndex) => {
    const newWorkflowLevels = [...workflowLevels];
    newWorkflowLevels[optionIndex].levels[levelIndex].group = e.target.value;
    setWorkflowLevels(newWorkflowLevels);
  };

  const handleAuthorizationLevelChange = (e, optionIndex, levelIndex) => {
    const newWorkflowLevels = [...workflowLevels];
    newWorkflowLevels[optionIndex].levels[levelIndex].authorizationLevel = e.target.value;
    setWorkflowLevels(newWorkflowLevels);
  };

  const handleNoOfAuthorizersChange = (e, optionIndex, levelIndex) => {
    const newWorkflowLevels = [...workflowLevels];
    newWorkflowLevels[optionIndex].levels[levelIndex].noOfAuthorizers = e.target.value;
    setWorkflowLevels(newWorkflowLevels);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>Approve/Reject</DialogTitle>
          <Divider />
          <DialogContent sx={{}}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <Typography>
                        Company ID
                        <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}></div>
                      </Typography>
                      <Typography>GOODHOPE ASIA HOLDINGS LTD - 4100007686</Typography>
                    </Stack>
                  </Grid>

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
                      <Typography>ACTIVE</Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <Typography>
                        Approval Status
                        <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}></div>
                      </Typography>
                      <Typography>MODIFY PENDING</Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="rejectReason">Reject Reason</InputLabel>
                      <TextField
                        fullWidth
                        id="rejectReason"
                        placeholder="Enter Reject Reason"
                        {...getFieldProps('rejectReason')}
                        error={Boolean(touched.rejectReason && errors.rejectReason)}
                        helperText={touched.rejectReason && errors.rejectReason}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />

          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Authorizer Options
                </Typography>
                {workflowLevels.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Option Number</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell>No of Authorizers</TableCell>
                            <TableCell>Sequential/Parallel</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {option.levels.map((level, index) => (
                            <TableRow key={index}>
                              <TableCell>{index === 0 ? option.optionNumber : ''}</TableCell>
                              <TableCell>{level.level}</TableCell>
                              <TableCell>
                                <Select value={level.group} onChange={(e) => handleGroupChange(e, optionIndex, index)}>
                                  <MenuItem value="group1">Group 1</MenuItem>
                                  <MenuItem value="group2">Group 2</MenuItem>
                                </Select>
                              </TableCell>

                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  sx={{ width: '45px' }}
                                  value={level.noOfAuthorizers}
                                  onChange={(e) => handleNoOfAuthorizersChange(e, optionIndex, index)}
                                />
                              </TableCell>

                              <TableCell>
                                <Select
                                  value={level.authorizationLevel}
                                  onChange={(e) => handleAuthorizationLevelChange(e, optionIndex, index)}
                                >
                                  <MenuItem value="sequential">Sequential With Next Level</MenuItem>
                                  <MenuItem value="parallel">Parallel With Next Level</MenuItem>
                                </Select>
                              </TableCell>

                              <TableCell>{/* Add your logic for Sequential/Parallel here */}</TableCell>
                              <Button onClick={() => addAuthorizerOption(optionIndex)}>Add Level</Button>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ))}
              </Grid>
            </Grid>
            <Button onClick={addWorkflowLevel}>Add Option</Button>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Back
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting} onClick={formik.handleSubmit}>
                    Approve
                  </Button>

                  <Button type="submit" variant="contained" disabled={isSubmitting} onClick={formik.handleSubmit}>
                    Reject
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

PendingView.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
};

export default PendingView;
