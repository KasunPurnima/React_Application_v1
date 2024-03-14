import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';

import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { InputAdornment } from '@mui/material';
import * as yup from 'yup';

const getInitialValues = () => {
  return {
    fromAccount: '',
    toAccount: '',
    transferMode: '',
    commissinAccount: '',
    amount: '',
    companyRef: '',
    remarks: ''
  };
};

const validationSchema = yup.object({
  fromAccount: yup.string().required('From Account is required')
});

const AddNewTransfer = ({ onClose, onSubmit }) => {
  const [succesMessage, setSuccesMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSnackbarClose = () => {
    setSuccesMessage(null);
    setErrorMessage(null);
  };
  const handleClose = () => {
    onClose();
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      console.log('onSubmit called with values:', values);
      try {
        const singleTransferRequest = {
          accountName: 'ABC BROTHERS',
          amount: values.amount,
          commissionAccount: values.commissinAccount,
          companyRef: values.companyRef,
          currency: 'LKR',
          fromAccount: values.fromAccount,
          remarks: values.remarks,
          toAccount: values.toAccount,
          transferMode: values.transferMode,
          transferType: 'OWN'
        };

        const response = await axios.post('http://10.30.2.111:9081/transfer/transfer/single', singleTransferRequest, {
          headers: {
            companyId: 'nable',
            'request-id': 'nable',
            userId: 'nable'
          }
        });

        if (response.data.returnCode === 202) {
          setSuccesMessage('Transfer is Successfull');
          setErrorMessage(null);
          if (typeof onSubmit === 'function') {
            onSubmit(values);
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setErrorMessage('Transfer not Successfull');
        }
      } catch (error) {
        console.error('API Error:', error);
        setErrorMessage('Transfer not Successfull');
      }
    }
  });

  const { errors, touched, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          <DialogTitle style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#eeeeee', backgroundColor: '#212121' }}>
            New Fund Transfer
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 5.5, maxWidth: '800px', maxHeight: '800px', overflow: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25} sx={{ marginBottom: '1.5rem' }}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="fromAccount">
                        From Account No
                      </InputLabel>
                      <Select
                        fullWidth
                        id="fromAccount"
                        {...getFieldProps('fromAccount')}
                        value={formik.values.fromAccount}
                        error={Boolean(touched.fromAccount && errors.fromAccount)}
                        sx={{ width: '80%' }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Please Select---
                        </MenuItem>
                        <MenuItem value="001910016519">001910016519</MenuItem>
                        <MenuItem value="022210000066">022210000066</MenuItem>
                        <MenuItem value="106257485695">106257485695</MenuItem>
                        <MenuItem value="009210007900">009210007900</MenuItem>
                        <MenuItem value="100250022772">100250022772</MenuItem>
                        <MenuItem value="000150180503">000150180503</MenuItem>
                        <MenuItem value="106257485692">106257485692</MenuItem>
                      </Select>
                      {touched.fromAccount && errors.fromAccount && <div style={{ color: 'red' }}>{errors.fromAccount}</div>}
                    </Stack>

                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="toAccount">
                        To Account No
                      </InputLabel>
                      <Select
                        fullWidth
                        id="toAccount"
                        {...getFieldProps('toAccount')}
                        value={formik.values.toAccount}
                        error={Boolean(touched.toAccount && errors.toAccount)}
                        sx={{ width: '80%' }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Please Select---
                        </MenuItem>
                        <MenuItem value="100106000078">100106000078</MenuItem>
                        <MenuItem value="022210000066">022210000066</MenuItem>
                        <MenuItem value="106257485695">106257485695</MenuItem>
                        <MenuItem value="009210007900">009210007900</MenuItem>
                        <MenuItem value="100250022772">100250022772</MenuItem>
                        <MenuItem value="000150180503">000150180503</MenuItem>
                        <MenuItem value="106257485692">106257485692</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="commissinAccount">
                        Commission Account
                      </InputLabel>
                      <Select
                        fullWidth
                        id="commissinAccount"
                        {...getFieldProps('commissinAccount')}
                        value={formik.values.commissinAccount}
                        error={Boolean(touched.commissinAccount && errors.commissinAccount)}
                        sx={{ width: '80%' }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Please Select---
                        </MenuItem>
                        <MenuItem value="009210007900">009210007900</MenuItem>
                        <MenuItem value="022210000066">022210000066</MenuItem>
                        <MenuItem value="106257485695">106257485695</MenuItem>
                        <MenuItem value="009210007900">009210007900</MenuItem>
                        <MenuItem value="100250022772">100250022772</MenuItem>
                        <MenuItem value="000150180503">000150180503</MenuItem>
                        <MenuItem value="106257485692">106257485692</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="amount">
                        Transfer Amount
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="amount"
                        {...getFieldProps('amount')}
                        error={Boolean(touched.amount && errors.amount)}
                        sx={{ width: '80%' }}
                        value={formik.values.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onChange={(e) => formik.setFieldValue('amount', e.target.value.replace(/,/g, ''))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                        }}
                        helperText={touched.amount && errors.amount}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="companyRef">
                        Company Reference
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="companyRef"
                        {...getFieldProps('companyRef')}
                        error={Boolean(touched.companyRef && errors.companyRef)}
                        sx={{ width: '80%' }}
                        helperText={touched.companyRef && errors.companyRef}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="remarks">
                        Benificiary Remarks
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="remarks"
                        {...getFieldProps('remarks')}
                        error={Boolean(touched.remarks && errors.remarks)}
                        sx={{ width: '80%' }}
                        helperText={touched.remarks && errors.remarks}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel sx={{ color: 'black', fontWeight: 'bold' }} htmlFor="transferMode">
                        Transfer Mode
                      </InputLabel>
                      <Select
                        fullWidth
                        id="transferMode"
                        {...getFieldProps('transferMode')}
                        value={formik.values.transferMode}
                        error={Boolean(touched.transferMode && errors.transferMode)}
                        sx={{ width: '80%' }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Please Select---
                        </MenuItem>
                        <MenuItem value="IMMEDIATE">IMMEDIATE</MenuItem>
                        <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                      </Select>
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
                <Button color="error" onClick={handleClose}>
                  Back
                </Button>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button type="submit" variant="contained">
                    Create
                  </Button>
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

AddNewTransfer.propTypes = {
  onClose: PropTypes.func,
  addUser: PropTypes.func
};

export default AddNewTransfer;
