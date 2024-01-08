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
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import { Form, FormikProvider, useFormik } from 'formik';
//import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const getInitialValues = () => {
  return {
    companyId: 'nable',
    workflowType: '',
    debitAccount: '',
    minimumAmount: '',
    maximumAmount: ''
  };
};

const AddForm = ({ onBack, onSubmit }) => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [succesMessage, setSuccesMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  //const [setAuthorizerOptionsData] = useState([]);

  // const UserSchema = Yup.object().shape({
  //   companyName: Yup.string().required('Company Name is required'),
  //   workflowType: Yup.string().required('Workflow Type is required'),
  //   debitAccount: Yup.string().required('Debit Account is required'),
  //   minimumAmount: Yup.number().required('Minimum Amount is required'),
  //   maximumAmount: Yup.number()
  //     .required('Maximum Amount is required')
  //     .moreThan(Yup.ref('minimumAmount'), 'Maximum Amount must be greater than Minimum Amount')
  // });
  const handleSnackbarClose = () => {
    setSuccesMessage(null);
    setErrorMessage(null);
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    //validationSchema: UserSchema,
    onSubmit: async (values) => {
      console.log('onSubmit called with values:', values);
      try {
        const workFlowSelectionDTO = {
          account: values.debitAccount,
          companyId: 'nable',
          maxAmount: parseFloat(values.maximumAmount),
          minAmount: parseFloat(values.minimumAmount),
          type: values.workflowType,
          workFlowOptions: workflowLevels.map((option) => ({
            option: option.optionNumber,
            workFlowLevels: option.levels.map((level) => ({
              explan: level.authorizationLevel,
              gravity: parseInt(level.noOfAuthorizers),
              groupName: level.group,
              level: level.level,
              ruleOrder: 1
            }))
          }))
        };

        console.log('Before API call');
        const response = await axios.post('http://10.30.2.111:9081/workflow2/v3/workflow/create/client', workFlowSelectionDTO, {
          headers: {
            adminBranchOrCustomerCompany: 'nable',
            adminUserId: 'nable',
            clientFlag: 'true',
            'request-id': 123456
          }
        });

        console.log('API Response:', response);

        // if (response.data.statusCodeValue == 202) {
        //   setSuccesMessage('Workflow created successfully!');
        //   setErrorMessage(null);
        //   onSubmit(response.data);
        // } else {
        //   setErrorMessage('Error creating workflow');
        //   setSuccesMessage(null);
        // }
        // } catch (error) {
        //   console.error(error);
        //   setErrorMessage('An error occurred while creating the workflow.');
        //   setSuccesMessage(null);
        //   // }
      } catch (error) {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.returnMessage === 'Actions restricted , workflow values overlap with :2123'
        ) {
          setSuccesMessage('Workflow created successfully!');
          setErrorMessage(null);
          if (typeof onSubmit === 'function') {
            onSubmit(error.response.data);
          }
          onSubmit(error.response.data);
        } else {
          setErrorMessage('An error occurred while creating the workflow.');
          setSuccesMessage(null);
        }
      }
      // } catch (error) {
      //   console.error(error);
      //   if (
      //     error.response &&
      //     error.response.data &&
      //     error.response.data.returnMessage === 'Actions restricted , workflow values overlap with :2123'
      //   ) {
      //     setSuccesMessage('Workflow created successfully!');
      //     setErrorMessage(null);
      //     if (typeof onSubmit === 'function') {
      //       onSubmit(error.response.data);
      //     }
      //   } else {
      //     setErrorMessage('An error occurred while creating the workflow.');
      //     setSuccesMessage(null);
      //   }
      // }
    }
  });

  const { errors, touched, getFieldProps } = formik;

  const [successMessage] = useState();

  useEffect(() => {
    // const fetchAuthorizerOptions = async () => {
    //   try {
    //     const response = await axios.get('your_authorizer_options_api_endpoint');
    //     setAuthorizerOptionsData(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    //fetchAuthorizerOptions();

    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://10.30.2.111:9081/workflow2/v3/groups/existing/client', {
          headers: {
            adminUserId: 'nable'
          }
        });

        const groupData = response.data.groupDTO;

        if (Array.isArray(groupData)) {
          setGroupOptions(groupData);
        } else {
          console.error('API response does not contain an array of groups:', groupData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, []);

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

  const removeAuthorizerOption = (optionIndex, levelIndex) => {
    const newWorkflowLevels = [...workflowLevels];
    newWorkflowLevels[optionIndex].levels.splice(levelIndex, 1);
    setWorkflowLevels(newWorkflowLevels);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          <DialogTitle style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#616161' }}>Workflow Creation</DialogTitle>
          <Divider />
          <DialogContent sx={{}}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <Typography sx={{ color: 'black', fontWeight: 'bold' }}>Company ID</Typography>
                      <Typography>nable</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Stack spacing={1.25}>
                  <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="debitAccount">
                    Debit Account
                  </InputLabel>
                  <Select
                    fullWidth
                    id="debitAccount"
                    {...getFieldProps('debitAccount')}
                    value={formik.values.debitAccount}
                    error={Boolean(touched.debitAccount && errors.debitAccount)}
                  >
                    <MenuItem value="account01">8119008115</MenuItem>
                    <MenuItem value="account02">022210000066</MenuItem>
                    <MenuItem value="106257485695">106257485695</MenuItem>
                    <MenuItem value="account04">000150180503</MenuItem>
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Stack spacing={1.25}>
                  <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="debitAccount">
                    Workflow Type
                  </InputLabel>
                  <Select
                    fullWidth
                    id="workflowType"
                    {...getFieldProps('workflowType')}
                    error={Boolean(touched.workflowType && errors.workflowType)}
                  >
                    <MenuItem value="userGroups">User Groups</MenuItem>
                    <MenuItem value="workflow">Workflow</MenuItem>
                    <MenuItem value="OWN_TRANSFER">OWN_TRANSFER</MenuItem>
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Stack spacing={1.25}>
                  <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="debitAccount">
                    Minimum Amount
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="minimumAmount"
                    type="number"
                    placeholder="Enter Minimum Amount"
                    {...getFieldProps('minimumAmount')}
                    error={Boolean(touched.minimumAmount && errors.minimumAmount)}
                    helperText={touched.minimumAmount && errors.minimumAmount}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Stack spacing={1.25}>
                  <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="debitAccount">
                    Maximum Amount
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="maximumAmount"
                    type="number"
                    placeholder="Enter Maximum Amount"
                    {...getFieldProps('maximumAmount')}
                    error={Boolean(touched.maximumAmount && errors.maximumAmount)}
                    helperText={touched.maximumAmount && errors.maximumAmount}
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0d47a1', marginBottom: '16px' }}
                >
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
                                {/* <Select value={level.group} onChange={(e) => handleGroupChange(e, optionIndex, index)}>
                                  {groupOptions.map((group) => (
                                    <MenuItem key={group.groupId} value={group.groupId}>
                                      {group.groupName}
                                    </MenuItem>
                                  ))}
                                </Select> */}

                                <Select value={level.group} onChange={(e) => handleGroupChange(e, optionIndex, index)}>
                                  {Array.isArray(groupOptions) &&
                                    groupOptions.map((group) => (
                                      <MenuItem key={group.groupId} value={group.groupId}>
                                        {group.groupName}
                                      </MenuItem>
                                    ))}
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
                                  <MenuItem value="P">P</MenuItem>
                                </Select>
                              </TableCell>

                              <TableCell>{/* Add your logic for Sequential/Parallel here */}</TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => addAuthorizerOption(optionIndex)}
                                sx={{ marginTop: '10px', fontWeight: 'bold' }}
                              >
                                Add Level
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => removeAuthorizerOption(optionIndex, index)}
                                sx={{
                                  backgroundColor: '#f50057',
                                  fontWeight: 'bold',
                                  '&:hover': { backgroundColor: '#f50057' },
                                  marginTop: '10px',
                                  marginLeft: '8px'
                                }}
                              >
                                Remove Level
                              </Button>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ))}
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={addWorkflowLevel}
              sx={{ backgroundColor: '#4caf50', fontWeight: 'bold', '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Add Option
            </Button>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    color="error"
                    onClick={onBack}
                    sx={{
                      backgroundColor: '#121858',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      '&:hover': { backgroundColor: '#121858' }
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    //disabled={isSubmitting}
                    onClick={() => {
                      console.log('Button Clicked');
                      formik.handleSubmit();
                    }}
                    sx={{ backgroundColor: '#e65100', fontWeight: 'bold', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    Create Workflow
                  </Button>

                  {successMessage && <div>{successMessage}</div>}
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>

          <Snackbar open={Boolean(succesMessage)} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <MuiAlert elevation={6} variant="filled" severity="success">
              {succesMessage}
            </MuiAlert>
          </Snackbar>

          <Snackbar open={Boolean(errorMessage)} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <MuiAlert elevation={6} variant="filled" severity="error">
              {errorMessage}
            </MuiAlert>
          </Snackbar>
        </Form>
      </FormikProvider>
    </>
  );
};

AddForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
};

export default AddForm;
