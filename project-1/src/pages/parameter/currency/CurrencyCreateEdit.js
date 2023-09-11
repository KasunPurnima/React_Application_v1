
// material-ui
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputLabel,
    Stack,
    TextField
} from '@mui/material';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

// project imports

// assets

// types

// constant
const getInitialValues = (currency) => {

    const newCurrency = {
        id: undefined,
        currencyCode: "",
        currencyName: "",
    }

    if (currency) {
        return _.merge({}, newCurrency, currency);
    }

    return newCurrency;
};

// ==============================|| CURRENCY ADD / EDIT ||============================== //

const AddEditCurrency = ({ currency, onCancel, addCurrency, updateCurrency }) => {
    const CurrencySchema = Yup.object().shape({
        currencyCode: Yup.string()
            .required('Currency Code is required')
            .min(3, 'Currency Code must be at least 3 characters')
            .max(10, 'Currency Code cannot exceed 10 characters'),
        currencyName: Yup.string().required('Currency Name is required'),
    });


    const formik = useFormik({
        initialValues: getInitialValues(currency),
        validationSchema: CurrencySchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            try {
                if (currency) {
                    //put API 
                    updateCurrency({
                        currencyTypeId: currency.id,
                        code: values.currencyCode,
                        name: values.currencyName,
                        isActive: true
                    })
                } else {
                    //post API
                    addCurrency({
                        code: values.currencyCode,
                        name: values.currencyName,
                        isActive: true
                    })
                }
                resetForm()
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
                    <DialogTitle>{currency ? 'Edit Currency' : 'New Currency'}</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 2.5 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1.25}>
                                            <InputLabel htmlFor="currencyCode">Currency Code</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="currencyCode"
                                                placeholder="Enter Currency Code"
                                                {...getFieldProps('currencyCode')}
                                                error={Boolean(touched.currencyCode && errors.currencyCode)}
                                                helperText={touched.currencyCode && errors.currencyCode}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1.25}>
                                            <InputLabel htmlFor="currencyName">Currency Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="currencyName"
                                                placeholder="Enter Currency Name"
                                                {...getFieldProps('currencyName')}
                                                error={Boolean(touched.currencyName && errors.currencyName)}
                                                helperText={touched.currencyName && errors.currencyName}
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
                            </Grid>
                            <Grid item>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button color="error" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        {currency ? 'Edit' : 'Add'}
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

export default AddEditCurrency;
