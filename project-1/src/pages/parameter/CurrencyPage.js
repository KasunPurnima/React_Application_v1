import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';

// material-ui
import {
    Button,
    Dialog,
    IconButton,
    OutlinedInput,
    Stack,
    Tooltip
} from '@mui/material';

// project import
import { PopupTransition } from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';

// assets
import { DeleteTwoTone, EditTwoTone, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AlertCurrencyDelete from './AlertCurrencyDelete';
import AddEditCurrency from './CurrencyCreateEdit';

/**
 * currencyTypeId
 * code 
 * name
 * isActive
 */
//const
const rowsSample = [
    { id: 1, currencyCode: 'LKR', currencyName: 'Sri Lankan Rupee', status: "Active" },
    { id: 2, currencyCode: 'USD', currencyName: 'United States dollar', status: "Active" },
];

const currencyInit = {
    id: undefined,
    currencyCode: "",
    currencyName: ""
}

// ==============================|| Components ||============================== //
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

// ==============================|| CurrencyPage ||============================== //

const CurrencyPage = () => {
    //table
    const [rows, setRows] = useState(rowsSample || [])
    const preGlobalFilteredRows = rows || [];
    const [globalFilter, setGlobalFilter] = useState("");

    const columns = [
        // { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'currencyCode', headerName: 'Currency Code', flex: 1 },
        { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Edit">
                            <IconButton
                                color=""
                                onClick={(e) => {
                                    handleEdit(params.row);
                                    e.stopPropagation();
                                }}
                            >
                                <EditTwoTone />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                onClick={(e) => {
                                    handleDelete(params.row);
                                    e.stopPropagation();
                                }}
                            >
                                <DeleteTwoTone />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    //dialog model 
    const [addEdit, setAddEdit] = useState(false);
    const [currency, setCurrency] = useState(currencyInit);

    const handleAddEdit = () => {
        setAddEdit(!addEdit);
        if (currency && !addEdit) setCurrency(undefined);
    };

    const handleEdit = (rowData) => {
        setCurrency({
            id: rowData.id,
            currencyCode: rowData.currencyCode,
            currencyName: rowData.currencyName
        })
        setAddEdit(true)
    }

    //alert model
    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
    };

    const handleDelete = (rowData) => {
        setCurrency({
            id: rowData.id,
            currencyCode: rowData.currencyCode,
            currencyName: rowData.currencyName
        })
        setOpenAlert(true)
    }

    // API calls
    const [loading, setLoading] = useState(false);
    const [totalDataCount, setTotalDataCount] = useState(0)

    const fetchData = async (queryParams = {}) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://edcsdev.informaticsint.com/api/v1/pettycash/reference/currencytype`,
                {
                    headers: {
                        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOeUhyZWpOc2p3UWZaNFdvbngwbzF1RkswQzVqNkFsUmlkSlR4VjNvN3E4In0.eyJleHAiOjE2OTQ0MzE3NTcsImlhdCI6MTY5NDM0NTM1NywianRpIjoiOTVjZTQzY2ItNjQ1YS00NDdiLTk2MjItNTI3ZGQ3ODc3NjQwIiwiaXNzIjoiaHR0cHM6Ly8xMC41NC4xLjg6ODQ0My9yZWFsbXMvRURDUyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyNDI2NGZlYy00OTcxLTQwNmUtYmNjZi1lMWM0Y2U3OWE1YjciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjdXJsIiwic2Vzc2lvbl9zdGF0ZSI6ImVkZDZlNGY0LTRiYTctNDU3YS1iNGU3LTdhMDZmY2RmMmRjMCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZWRjcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImVkZDZlNGY0LTRiYTctNDU3YS1iNGU3LTdhMDZmY2RmMmRjMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZ3JvdXBzIjpbInN1cGVyX2FkbWluIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImVkY3NhZG1pbiJ9.GvuoTT8pzIinnw-Krb9ewwkXWo-t6jK8cGEJAa8KmP5i_EzRKFalS27JARL7f5qHjdJYH_El6K_xy_qQi6D85gn4w5zrEdRUi32KAmQLFuJwTx4ekkY9rxWiB5i_dYNJ4-rzgxZhECn1j96ek8uk2ujLp80CdO5fMb4Qe86eQ2x7MtfRRvF5MCJndRXMsQvGfM1rrFT8v3NYxF4w3YOKIwMDCFeWdhblNuPrJWphX3kGXgwVgtkjDo9LunmU7iL0B21HVsnvakjaOLFIEG_yN4tfFpAmqHCrMTOTIkzdSB_fYCPmp4_JKeVjlSOXucZGKLbGZZ4uKEjtBXjXUhLg3g`, // Replace with your actual token
                        'Content-Type': 'application/json', // Adjust this header as needed
                    },
                    params: {
                        per_page: queryParams.per_page || 10,
                        sort: queryParams.sort || 'currencyTypeId',
                        direction: queryParams.direction || 'ASC',
                        search: queryParams.search || '',
                    },
                }
            );

            const mappedData = response.data.result.map((item) => ({
                id: item.currencyTypeId, // Map currencyTypeId to id
                currencyCode: item.code,
                currencyName: item.name,
                status: item.isActive ? "Active" : "Inactive", // Assuming isActive is a boolean
            }));

            setTotalDataCount(response.data.pagination.total)
            setRows(mappedData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const addCurrency = async (newCurrency) => {
        try {
            setLoading(true);
            await axios.post(
                'https://edcsdev.informaticsint.com/api/v1/pettycash/reference/currencytype',
                newCurrency,
                {
                    headers: {
                        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOeUhyZWpOc2p3UWZaNFdvbngwbzF1RkswQzVqNkFsUmlkSlR4VjNvN3E4In0.eyJleHAiOjE2OTQ0MzE3NTcsImlhdCI6MTY5NDM0NTM1NywianRpIjoiOTVjZTQzY2ItNjQ1YS00NDdiLTk2MjItNTI3ZGQ3ODc3NjQwIiwiaXNzIjoiaHR0cHM6Ly8xMC41NC4xLjg6ODQ0My9yZWFsbXMvRURDUyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyNDI2NGZlYy00OTcxLTQwNmUtYmNjZi1lMWM0Y2U3OWE1YjciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjdXJsIiwic2Vzc2lvbl9zdGF0ZSI6ImVkZDZlNGY0LTRiYTctNDU3YS1iNGU3LTdhMDZmY2RmMmRjMCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZWRjcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImVkZDZlNGY0LTRiYTctNDU3YS1iNGU3LTdhMDZmY2RmMmRjMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZ3JvdXBzIjpbInN1cGVyX2FkbWluIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImVkY3NhZG1pbiJ9.GvuoTT8pzIinnw-Krb9ewwkXWo-t6jK8cGEJAa8KmP5i_EzRKFalS27JARL7f5qHjdJYH_El6K_xy_qQi6D85gn4w5zrEdRUi32KAmQLFuJwTx4ekkY9rxWiB5i_dYNJ4-rzgxZhECn1j96ek8uk2ujLp80CdO5fMb4Qe86eQ2x7MtfRRvF5MCJndRXMsQvGfM1rrFT8v3NYxF4w3YOKIwMDCFeWdhblNuPrJWphX3kGXgwVgtkjDo9LunmU7iL0B21HVsnvakjaOLFIEG_yN4tfFpAmqHCrMTOTIkzdSB_fYCPmp4_JKeVjlSOXucZGKLbGZZ4uKEjtBXjXUhLg3g`, // Replace with your actual token
                        'Content-Type': 'application/json', // Adjust this header as needed
                    }
                }
            );

            console.log("Create Currency Success");
            fetchData();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const updateCurrency = async (updatedCurrency) => {
        try {
            setLoading(true);
            await axios.put(
                `https://edcsdev.informaticsint.com/api/v1/pettycash/reference/currencytype/${updatedCurrency.currencyTypeId}`,
                updatedCurrency,
                {
                    headers: {
                        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOeUhyZWpOc2p3UWZaNFdvbngwbzF1RkswQzVqNkFsUmlkSlR4VjNvN3E4In0.eyJleHAiOjE2OTQ0MzE3NTcsImlhdCI6MTY5NDM0NTM1NywianRpIjoiOTVjZTQzY2ItNjQ1YS00NDdiLTk2MjItNTI3ZGQ3ODc3NjQwIiwiaXNzIjoiaHR0cHM6Ly8xMC41NC4xLjg6ODQ0My9yZWFsbXMvRURDUyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyNDI2NGZlYy00OTcxLTQwNmUtYmNjZi1lMWM0Y2U3OWE1YjciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjdXJsIiwic2Vzc2lvbl9zdGF0ZSI6ImVkZDZlNGY0LTRiYTctNDU3YS1iNGU3LTdhMDZmY2RmMmRjMCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZWRjcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImVkZDZlNGY0LTRiYTctNDU3YS1iNGU3LTdhMDZmY2RmMmRjMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZ3JvdXBzIjpbInN1cGVyX2FkbWluIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImVkY3NhZG1pbiJ9.GvuoTT8pzIinnw-Krb9ewwkXWo-t6jK8cGEJAa8KmP5i_EzRKFalS27JARL7f5qHjdJYH_El6K_xy_qQi6D85gn4w5zrEdRUi32KAmQLFuJwTx4ekkY9rxWiB5i_dYNJ4-rzgxZhECn1j96ek8uk2ujLp80CdO5fMb4Qe86eQ2x7MtfRRvF5MCJndRXMsQvGfM1rrFT8v3NYxF4w3YOKIwMDCFeWdhblNuPrJWphX3kGXgwVgtkjDo9LunmU7iL0B21HVsnvakjaOLFIEG_yN4tfFpAmqHCrMTOTIkzdSB_fYCPmp4_JKeVjlSOXucZGKLbGZZ4uKEjtBXjXUhLg3g`, // Replace with your actual token
                        'Content-Type': 'application/json', // Adjust this header as needed
                    }
                }
            );

            console.log("Update Currency Success");
            fetchData();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <>Loading...</>
    }

    return (
        <>
            <MainCard>
                <Stack direction="row" spacing={2} justifyContent="space-between"  >
                    <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddEdit}>
                            Add New Currency
                        </Button>
                    </Stack>
                </Stack>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    pageSize={10} // Set your desired page size
                    rowCount={totalDataCount} // Replace with the actual total count from your API response
                    onPageChange={(newPage) => {
                        fetchData({ page: newPage + 1 }); // Add 1 to newPage to match your API's page numbering
                    }}
                    autoHeight
                    autoWidth
                    sx={{ mt: 3 }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    onPageSizeChange={(newPageSize) => {
                        fetchData({ page: 1, per_page: newPageSize }); // Fetch data with the new page size
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </MainCard>
            {/* add / edit Currency dialog */}
            <Dialog
                maxWidth="sm"
                TransitionComponent={PopupTransition}
                keepMounted
                fullWidth
                onClose={handleAddEdit}
                open={addEdit}
                sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                aria-describedby="alert-dialog-slide-description"
            >
                <AddEditCurrency currency={currency} onCancel={handleAddEdit} addCurrency={addCurrency} updateCurrency={updateCurrency} />
            </Dialog>
            {/* alert model */}
            {currency && <AlertCurrencyDelete title={currency.currencyName || ""} open={openAlert} handleClose={handleAlertClose} updateCurrency={updateCurrency} currency={currency} />}
        </>
    )
}

export default CurrencyPage;
