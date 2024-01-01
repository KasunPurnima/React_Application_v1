import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const ApproverDetailsTable = () => {
  const columns = [
    { field: 'option', headerName: 'Option', flex: 1 },
    { field: 'level', headerName: 'Level', flex: 1 },
    { field: 'group', headerName: 'Group', flex: 1 },
    { field: 'approvalcount', headerName: 'Approval Count', flex: 1 },
    { field: 'username', headerName: 'User Name', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'approveduser', headerName: 'Approved User', flex: 1 },
    { field: 'approveddate', headerName: 'Approved Date', flex: 1 }
  ];

  const rows = [
    {
      id: 1,
      option: 'Option 1',
      level: 'Level 1',
      group: 'Group A',
      approvalcount: 3,
      username: 'User 1',
      status: 'Approved',
      approveduser: 'Approver 1',
      approveddate: '2023-01-01'
    },
    {
      id: 2,
      option: 'Option 2',
      level: 'Level 2',
      group: 'Group B',
      approvalcount: 2,
      username: 'User 2',
      status: 'Pending',
      approveduser: 'Approver 2',
      approveddate: '2023-01-01'
    }
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Approvers Details</h2>
      <DataGrid rows={rows} columns={columns} autoHeight autoWidth pageSize={5} />
      <div style={{ position: 'absolute', right: 16, bottom: 16 }}>
        <Button variant="contained" color="primary">
          Back
        </Button>
      </div>
    </div>
  );
};

export default ApproverDetailsTable;
