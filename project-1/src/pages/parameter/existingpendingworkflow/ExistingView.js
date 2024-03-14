import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';

const ApproverDetailsTable = ({ workflowSelectionId, onClose }) => {
  const [workflowDetails, setWorkflowDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://10.30.2.111:9081/workflow2/v3/v4/existing/client/${workflowSelectionId}/selectedWorkflow-details`,
          {}
        );

        const approvedData = response.data;

        if (approvedData) {
          setWorkflowDetails({
            workflowType: approvedData.type,
            account: approvedData.account,
            minAmount: approvedData.minAmount,
            maxAmount: approvedData.maxAmount,
            status: approvedData.status,
            approvalStatus: approvedData.approvalStatus
          });

          const transformedData = approvedData.workFlowOptions.flatMap((workFlowOption) => {
            const workFlowLevels = workFlowOption?.workFlowLevels || [];

            return workFlowLevels.map((item, index) => ({
              id: `${workFlowOption.workflowOptionId}_${index}`,
              option: workFlowOption.option,
              level: item.level || '',
              gravity: item.gravity || '',
              groupName: item.groupName || '',
              approvalStatus: approvedData.approvalStatus
            }));
          });

          setRows(transformedData);
        } else {
          setWorkflowDetails({});
          setRows([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [workflowSelectionId]);

  const handleClose = () => {
    onClose();
  };

  const columns = [
    { field: 'option', headerName: 'Option', flex: 1, headerClassName: 'table-header' },
    { field: 'level', headerName: 'Level', flex: 1, headerClassName: 'table-header' },
    { field: 'groupName', headerName: 'Group ID', flex: 1, headerClassName: 'table-header' },
    { field: 'gravity', headerName: 'No of Authorizers', flex: 1, headerClassName: 'table-header' },
    { field: 'approvalStatus', headerName: 'Status', flex: 1, headerClassName: 'table-header' }
  ];

  return (
    <div style={{ textAlign: 'left', padding: '16px' }}>
      <h2>Workflow Details</h2>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <strong>Workflow Type:</strong> {workflowDetails.workflowType}
            </div>
            <div>
              <strong>Account:</strong> {workflowDetails.account}
            </div>
            <div>
              <strong>Minimum Amount:</strong> {workflowDetails.minAmount}
            </div>
            <div>
              <strong>Maximum Amount:</strong> {workflowDetails.maxAmount}
            </div>
            <div>
              <strong>Status:</strong> {workflowDetails.status}
            </div>
            <div>
              <strong>Approval Status:</strong> {workflowDetails.approvalStatus}
            </div>
          </>
        )}
      </div>

      <h3>Workflow Options</h3>
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
        hideFooterPagination={true}
      />

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
