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
import PropTypes from 'prop-types';
import axios from 'axios';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
//import Swal from 'sweetalert2';

const getInitialValues = () => {
  return {
    companyId: 'nable',
    workflowType: '',
    debitAccount: '',
    minimumAmount: '',
    maximumAmount: ''
  };
};

const AddForm = ({ onClose, onSubmit }) => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [succesMessage, setSuccesMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [workflowType, setWorkflowType] = useState('');
  //const [setAuthorizerOptionsData] = useState([]);

  // const history = useHistory();
  const handleSnackbarClose = () => {
    setSuccesMessage(null);
    setErrorMessage(null);
  };
  const handleClose = () => {
    onClose();
  };
  // const handleClose = () => {
  //   setSuccesMessage(null);
  //   setErrorMessage(null);
  // };

  // const handleSuccess = () => {
  //   setSuccesMessage('Workflow created successfully');
  //   setErrorMessage(null);

  //   const userConfirmed = window.confirm('Workflow created successfully. Do you want to proceed to the next page?');

  //   if (userConfirmed) {
  //     history.push('/AddExistingPendingWorkflow');
  //   }
  // };

  // const authorizationLevelMapping = {
  //   'Sequential With Next Level': 'S',
  //   'Parallel With Next Level': 'P'
  // };

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
              explan: level.authorizationLevel === 'Sequential With Next Level' ? 'S' : 'P',
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

        if (response.data.statusCodeValue === 202) {
          // Swal.fire({
          //   title: 'Workflow Successfully Added!',
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // }).then(() => {
          //   window.location.reload();
          // });

          //handleSuccess();
          setSuccesMessage('Workflow created successfully');
          setErrorMessage(null);
          if (typeof onSubmit === 'function') {
            onSubmit(values);
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setErrorMessage('Error creating workflow. Please try again.');
        }
      } catch (error) {
        console.error('API Error:', error);
        setErrorMessage('Error creating workflow. Please try again.');
      }
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

  const handleGroupChange = (e, optionIndex, levelIndex, newValue) => {
    const newWorkflowLevels = [...workflowLevels];
    newWorkflowLevels[optionIndex].levels[levelIndex].group = newValue?.groupId || '';
    setWorkflowLevels(newWorkflowLevels);
  };

  // const handleAuthorizationLevelChange = (e, optionIndex, levelIndex, newValue) => {
  //   const newWorkflowLevels = [...workflowLevels];
  //   newWorkflowLevels[optionIndex].levels[levelIndex].authorizationLevel = authorizationLevelMapping[newValue] || '';
  //   setWorkflowLevels(newWorkflowLevels);
  // };

  // const handleAuthorizationLevelChange = (e, optionIndex, levelIndex, newValue) => {
  //   const newWorkflowLevels = [...workflowLevels];
  //   newWorkflowLevels[optionIndex].levels[levelIndex].authorizationLevel = newValue || '';
  //   setWorkflowLevels(newWorkflowLevels);
  // };

  const handleAuthorizationLevelChange = (e, optionIndex, levelIndex, newValue) => {
    const newWorkflowLevels = [...workflowLevels];
    newWorkflowLevels[optionIndex].levels[levelIndex].authorizationLevel = newValue || '';

    // Map the dropdown value to "S" or "P"
    if (newValue === 'Sequential With Next Level') {
      newWorkflowLevels[optionIndex].levels[levelIndex].explan = 'S';
    } else if (newValue === 'Parallel With Next Level') {
      newWorkflowLevels[optionIndex].levels[levelIndex].explan = 'P';
    } else {
      newWorkflowLevels[optionIndex].levels[levelIndex].explan = ''; // Handle other cases if needed
    }

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
              <Grid item xs={3}>
                <Stack spacing={1.25}>
                  <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="workflowType">
                    Workflow Type
                  </InputLabel>
                  <Select
                    fullWidth
                    id="workflowType"
                    {...getFieldProps('workflowType')}
                    onChange={(e) => {
                      setWorkflowType(e.target.value);
                      formik.handleChange(e);
                    }}
                    value={workflowType}
                    error={Boolean(touched.workflowType && errors.workflowType)}
                    sx={{ width: '80%' }}
                  >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="OWN_TRANSFER">OWN_TRANSFER</MenuItem>
                  </Select>
                </Stack>
              </Grid>
              {workflowType === 'USER' ? null : (
                <>
                  <Grid item xs={3}>
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
                        sx={{ width: '80%' }}
                      >
                        <MenuItem value="account01">001910016519</MenuItem>
                        <MenuItem value="account02">022210000066</MenuItem>
                        <MenuItem value="106257485695">106257485695</MenuItem>
                        <MenuItem value="account04">009210007900</MenuItem>
                        <MenuItem value="account05">100250022772</MenuItem>
                        <MenuItem value="account06">000150180503</MenuItem>
                        <MenuItem value="account07">106257485692</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="minimumAmount">
                        Minimum Amount
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="minimumAmount"
                        type="number"
                        placeholder="Enter Minimum Amount"
                        {...getFieldProps('minimumAmount')}
                        error={Boolean(touched.minimumAmount && errors.minimumAmount)}
                        sx={{ width: '90%' }}
                        helperText={touched.minimumAmount && errors.minimumAmount}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="maximumAmount">
                        Maximum Amount
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="maximumAmount"
                        type="number"
                        placeholder="Enter Maximum Amount"
                        {...getFieldProps('maximumAmount')}
                        error={Boolean(touched.maximumAmount && errors.maximumAmount)}
                        sx={{ width: '90%' }}
                        helperText={touched.maximumAmount && errors.maximumAmount}
                      />
                    </Stack>
                  </Grid>
                </>
              )}
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

                                <Autocomplete
                                  options={groupOptions}
                                  getOptionLabel={(option) => option?.groupName}
                                  value={groupOptions.find((option) => option.groupId === level.group) || null}
                                  disablePortal
                                  disableClearable
                                  onChange={(e, newValue) => handleGroupChange(e, optionIndex, index, newValue)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Please Select Group"
                                      inputProps={{
                                        ...params.inputProps
                                      }}
                                    />
                                  )}
                                  style={{ width: '200px', maxHeight: '400px' }}
                                />
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
                                {/* <Autocomplete
                                  options={['Sequential With Next Level', 'Parallel With Next Level']}
                                  value={level.authorizationLevel}
                                  onChange={(e, newValue) => handleAuthorizationLevelChange(e, optionIndex, index, newValue)}
                                  renderInput={(params) => <TextField {...params} label="Please Select Level" />}
                                  style={{ width: '250px', maxHeight: '100px', overflow: 'auto' }}
                                  disableClearable
                                /> */}
                                <Autocomplete
                                  options={['Sequential With Next Level', 'Parallel With Next Level']}
                                  value={level.authorizationLevel}
                                  onChange={(e, newValue) => handleAuthorizationLevelChange(e, optionIndex, index, newValue)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Please Select Level"
                                      inputProps={{
                                        ...params.inputProps
                                      }}
                                    />
                                  )}
                                  style={{ width: '240px', maxHeight: '400px' }}
                                  disableClearable
                                />
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
                    onClick={handleClose}
                    sx={{
                      backgroundColor: '#121858',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      '&:hover': { backgroundColor: '#121858' }
                    }}
                  >
                    Close
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    //disabled={isSubmitting}
                    // onClick={() => {
                    //   console.log('Button Clicked');
                    //   formik.handleSubmit();
                    // }}
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
