import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const AuditTrailView = ({ transferId, wfValue, onClose }) => {
  const [rows, setRows] = useState([]);
  const [auditDetails, setAuditDetails] = useState([]);

  useEffect(() => {
    console.log('Current transferId:', transferId);
    console.log('Current wfValue:', wfValue);

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://10.30.2.111:9081/transfer/transfer/v2/single/own`,
          {
            transferId: transferId,
            transferType: 'OWN'
          },
          {
            headers: {
              companyId: 'nable',
              userId: 'nable',
              'request-id': '123'
            }
          }
        );

        const approvedData = response.data.singleTransferDetailList;

        const mappedData = approvedData.map((item, index) => ({
          id: index,
          accountName: item.accountName,
          transferMode: item.transferMode,
          remarks: item.remarks,
          commissionAccount: item.commissionAccount,
          transferStatus: item.transferStatus,
          currency: item.currency,
          localCurrencyAmount: item.localCurrencyAmount,
          fromAccount: item.fromAccount,
          toAccount: item.toAccount
        }));

        setRows(mappedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchAuditTrailData = async () => {
      try {
        const auditResponse = await axios.get(`http://10.30.2.111:9081/workflow2/v3/workflow/getWorkFlowAuditTrail`, {
          headers: {
            userId: 'nable',
            'request-id': '123',
            workFlowRequestId: wfValue
          }
        });

        const auditData = auditResponse.data.hierarchicalWorkflowBean;
        console.log('Audit Data:', auditData);
        const mappedAuditData = auditData.optionList.flatMap((option, optionIndex) =>
          option.levelList.map((level, levelIndex) => ({
            id: `option-${optionIndex}-level-${levelIndex}`,
            option: option.option,
            level: level.level,
            userId: level.userList.map((user) => user.userId).join(', '),
            approvable: level.assignList.map((assign) => assign.approvable).join(', '),
            status: level.assignList.map((assign) => assign.status).join(', '),
            approvedDate: level.assignList.map((assign) => assign.approvedDate).join(', ')
          }))
        );

        setAuditDetails(mappedAuditData);
      } catch (error) {
        console.error('Error fetching audit trail data:', error);
      }
    };

    fetchData();
    fetchAuditTrailData();
  }, [transferId, wfValue]);

  const handleClose = () => {
    onClose();
  };

  const columns = [
    { field: 'accountName', headerName: 'Account Name', flex: 1 },
    { field: 'fromAccount', headerName: 'From Account', flex: 1 },
    { field: 'toAccount', headerName: 'To Account', flex: 1 },
    { field: 'transferMode', headerName: 'Transfer Mode', flex: 1 },
    { field: 'commissionAccount', headerName: 'Commission Account', flex: 1 },
    { field: 'transferStatus', headerName: 'Transfer Status', flex: 1 },
    { field: 'currency', headerName: 'Currency', flex: 1 },
    {
      field: 'localCurrencyAmount',
      headerName: 'Local Currency Amount',
      flex: 1,
      valueFormatter: (params) => {
        return params.value?.toLocaleString();
      }
    },
    { field: 'remarks', headerName: 'Remarks', flex: 1 }
  ];

  const auditDetailsColumns = [
    { field: 'option', headerName: 'Option', flex: 1 },
    { field: 'level', headerName: 'Level', flex: 1 },
    { field: 'userId', headerName: 'Users', flex: 1 },
    { field: 'approvable', headerName: 'Approvable Status', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'approvedDate', headerName: 'Approved Date', flex: 1 }
  ];

  return (
    <div style={{ textAlign: 'left', padding: '16px', border: 'none' }}>
      <h2>Transfer Details</h2>

      <DataGrid rows={rows} columns={columns} autoHeight autoWidth pageSize={5} hideFooterPagination={true} />

      <div style={{ textAlign: 'left', padding: '16px', border: 'none' }}>
        <h2>Audit Details</h2>
        <DataGrid rows={auditDetails} columns={auditDetailsColumns} autoHeight autoWidth pageSize={5} hideFooterPagination={true} />
      </div>

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

export default AuditTrailView;
