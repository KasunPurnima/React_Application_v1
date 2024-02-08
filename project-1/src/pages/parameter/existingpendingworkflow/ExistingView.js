import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';

const ApproverDetailsTable = ({ workflowSelectionId, onClose }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [existingDetailsRows, setExistingDetailsRows] = useState([]);
  const [existingDetailsLoading, setExistingDetailsLoading] = useState(true);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://10.30.2.111:9081/workflow2/v3/v4/existing/client/${workflowSelectionId}/selectedWorkflow-details`,
          {}
        );

        const approvedData = response.data;

        if (approvedData) {
          const transformedData = approvedData.workFlowOptions.flatMap((workFlowOption) => {
            const workFlowLevels = workFlowOption?.workFlowLevels || [];

            return workFlowLevels.map((item, index) => ({
              id: `${workFlowOption.workflowOptionId}_${index}`,
              option: workFlowOption.option,
              level: item.level || '',
              gravity: item.gravity || '',
              groupName: item.groupName || '',
              //createdBy: approvedData.createdBy,
              approvalStatus: approvedData.approvalStatus
            }));
          });

          setRows(transformedData);

          const existingDetails = {
            //id: `${workflowOptionId}_0`,
            id: approvedData.workflowId,
            workflowType: approvedData.type,
            account: approvedData.account,
            minAmount: approvedData.minAmount,
            maxAmount: approvedData.maxAmount,
            status: approvedData.status,
            approvalStatus: approvedData.approvalStatus
          };

          setExistingDetailsRows([existingDetails]);
        } else {
          setRows([]);
          setExistingDetailsRows([]);
        }

        setLoading(false);
        setExistingDetailsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setExistingDetailsLoading(false);
      }
    };

    fetchData();
  }, [workflowSelectionId]);

  // const columns = [
  //   { field: 'option', headerName: 'Option', flex: 1 },
  //   { field: 'level', headerName: 'Level', flex: 1 },
  //   { field: 'groupName', headerName: 'Group ID', flex: 1 },
  //   { field: 'gravity', headerName: 'No of Authorizers', flex: 1 },
  //   //{ field: 'createdBy', headerName: 'User Name', flex: 1 },
  //   { field: 'approvalStatus', headerName: 'Status', flex: 1 }
  // ];
  const columns = [
    { field: 'option', headerName: 'Option', flex: 1, headerClassName: 'table-header' },
    { field: 'level', headerName: 'Level', flex: 1, headerClassName: 'table-header' },
    { field: 'groupName', headerName: 'Group ID', flex: 1, headerClassName: 'table-header' },
    { field: 'gravity', headerName: 'No of Authorizers', flex: 1, headerClassName: 'table-header' },
    { field: 'approvalStatus', headerName: 'Status', flex: 1, headerClassName: 'table-header' }
  ];

  const existingDetailsColumns = [
    { field: 'workflowType', headerName: 'Workflow Type', flex: 1, headerClassName: 'table-header' },
    { field: 'account', headerName: 'Account', flex: 1, headerClassName: 'table-header' },
    { field: 'minAmount', headerName: 'Minimum Amount', flex: 1, headerClassName: 'table-header' },
    { field: 'maxAmount', headerName: 'Maximum Amount', flex: 1, headerClassName: 'table-header' },
    { field: 'status', headerName: 'Status', flex: 1, headerClassName: 'table-header' },
    { field: 'approvalStatus', headerName: 'Approval Status', flex: 1, headerClassName: 'table-header' }
  ];

  return (
    <div style={{ textAlign: 'left', padding: '16px' }}>
      <h2>Workflow Details</h2>

      {existingDetailsLoading ? (
        <p>Loading Existing Details...</p>
      ) : (
        <DataGrid rows={existingDetailsRows} columns={existingDetailsColumns} autoHeight autoWidth pageSize={1} />
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          sortModel={[
            { field: 'option', sort: 'asc' },
            { field: 'level', sort: 'asc' }
          ]}
          autoHeight
          autoWidth
          pageSize={5}
        />
      )}
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
      <div style={{ position: 'absolute', right: 16, bottom: 16 }}></div>
      <style>
        {`
          .table-header {
            background-color: #e0e0e0; 
          }
          
        `}
      </style>
    </div>
  );
};

export default ApproverDetailsTable;
