import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';

// material-ui
import {
    Box,
    CircularProgress,
    Grid,
    IconButton,
    OutlinedInput,
    Snackbar,
    Stack,
    Tooltip
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// project import
import MainCard from 'components/MainCard';

// assets
import { DeleteTwoTone, EditTwoTone, SearchOutlined } from '@ant-design/icons';

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

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ==============================|| CompanyPage ||============================== //

const CompanyPage = () => {
    //table
    const [rows, setRows] = useState([])
    const preGlobalFilteredRows = rows || [];
    const [globalFilter, setGlobalFilter] = useState("");

    const columns = [
        // { field: 'id', headerName: 'ID', flex: 1 }, 
        { field: 'groupId', headerName: 'Group Id', flex: 1 },
        { field: 'groupName', headerName: 'Group Name', flex: 1 },
        { field: 'companyId', headerName: 'Company Id', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: () => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Edit">
                            <IconButton
                                color=""
                                onClick={(e) => {
                                    // handleEdit(params.row);
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
                                    // handleDelete(params.row);
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

    //snack bar
    const [open, setOpen] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({
        severity: "",
        description: ""
    })

    const handleClick = ({ severity, description }) => {
        setSnackbarContent({
            severity: severity,
            description: description
        })
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    // API calls
    const [loading, setLoading] = useState(false);
    const [totalDataCount, setTotalDataCount] = useState(0)

    const fetchData = async (queryParams = {}) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://10.30.2.111:9081/workflow2/v3/v4/groups/existing`,
                {
                    headers: {
                        'adminUserId': 'nble'
                    },
                    params: {
                        per_page: queryParams.per_page || 10,
                        sort: queryParams.sort || 'groupId',
                        direction: queryParams.direction || 'ASC',
                        search: queryParams.search || '',
                    },
                }
            );
            const mappedData = response.data.result.map((item, index) => ({
                id: index,
                ...item
            }));

            setTotalDataCount(response.data.pagination.total)
            setRows(mappedData);
        } catch (err) {
            if (!err.response) {
                handleClick({
                    severity: "error",
                    description: 'Something went wrong ...'
                })
                return;
            }
            handleClick({
                severity: "error",
                description: err.response.data.description
            })
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({ search: globalFilter });
    }, [globalFilter]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <MainCard>
                        <Stack direction="row" spacing={2} justifyContent="space-between"  >
                            <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                        </Stack>
                        {loading ? <>
                            <Box
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
                            >
                                <CircularProgress />
                            </Box>
                        </> : <>
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
                        </>}
                    </MainCard>
                </Grid>
            </Grid>
            {/* snackbar model */}
            {open && <>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={snackbarContent.severity || "success"} sx={{ width: '100%' }}>
                        {snackbarContent.description || ''}
                    </Alert>
                </Snackbar>
            </>}
        </>
    )
}

export default CompanyPage;
