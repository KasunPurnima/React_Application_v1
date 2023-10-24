import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';

import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
//import _ from 'lodash';
import PropTypes from 'prop-types';

const getInitialValues = (workflow) => {
  const newWorkflow = {
    companyId: '',
    workflowType: '',
    minAmount: '',
    maxAmount: ''
  };

  if (workflow) {
    return { ...newWorkflow, ...workflow };
  }

  return newWorkflow;
};

const AddEditWorkflow = ({ workflow, onCancel, addWorkflow, updateWorkflow }) => {
  const WorkflowSchema = Yup.object().shape({
    companyId: Yup.string().required('Company Name is required'),
    workflowType: Yup.string().required('Workflow Type is required'),
    minAmount: Yup.number().required('Minimum Amount is required'),
    maxAmount: Yup.number().required('Maximum Amount is required')
  });

  const formik = useFormik({
    initialValues: getInitialValues(workflow),
    validationSchema: WorkflowSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      try {
        if (workflow) {
          // Update existing workflow
          updateWorkflow({
            id: workflow.id,
            companyId: values.companyId,
            workflowType: values.workflowType,
            minAmount: values.minAmount,
            maxAmount: values.maxAmount
          });
        } else {
          // Add new workflow
          addWorkflow({
            companyId: values.companyId,
            workflowType: values.workflowType,
            minAmount: values.minAmount,
            maxAmount: values.maxAmount
          });
        }
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
          <DialogTitle>{workflow ? 'Edit Workflow' : 'Add New Workflow'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="companyId">Company Name</InputLabel>
                      <TextField
                        fullWidth
                        id="companyId"
                        placeholder="Enter Company Name"
                        {...getFieldProps('companyId')}
                        error={Boolean(touched.companyId && errors.companyId)}
                        helperText={touched.companyId && errors.companyId}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="workflowType">Workflow Type</InputLabel>
                      <TextField
                        fullWidth
                        id="workflowType"
                        placeholder="Enter Workflow Type"
                        {...getFieldProps('workflowType')}
                        error={Boolean(touched.workflowType && errors.workflowType)}
                        helperText={touched.workflowType && errors.workflowType}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="minAmount">Minimum Amount</InputLabel>
                      <TextField
                        fullWidth
                        id="minAmount"
                        placeholder="Enter Minimum Amount"
                        type="number"
                        {...getFieldProps('minAmount')}
                        error={Boolean(touched.minAmount && errors.minAmount)}
                        helperText={touched.minAmount && errors.minAmount}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="maxAmount">Maximum Amount</InputLabel>
                      <TextField
                        fullWidth
                        id="maxAmount"
                        placeholder="Enter Maximum Amount"
                        type="number"
                        {...getFieldProps('maxAmount')}
                        error={Boolean(touched.maxAmount && errors.maxAmount)}
                        helperText={touched.maxAmount && errors.maxAmount}
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
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {workflow ? 'Edit' : 'Add'}
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

AddEditWorkflow.propTypes = {
  workflow: PropTypes.object,
  onCancel: PropTypes.func,
  addWorkflow: PropTypes.func,
  updateWorkflow: PropTypes.func
};

export default AddEditWorkflow;
