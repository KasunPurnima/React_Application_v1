import React from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const OwnRequestTable = ({ onCancel }) => {
  return (
    <>
      <DialogTitle>Own Request</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="companyId">Company ID</InputLabel>
              <TextField fullWidth id="companyId" placeholder="Enter Company ID" />
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="groupId">Group ID</InputLabel>
              <TextField fullWidth id="groupId" placeholder="Enter Group ID" />
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="groupName">Group Name</InputLabel>
              <TextField fullWidth id="groupName" placeholder="Enter Group Name" />
            </Stack>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[{ userId: '1', userName: 'John Doe' }].map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid item xs={3}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="action">Action</InputLabel>
            <TextField fullWidth id="action" placeholder="Enter Action" />
          </Stack>
        </Grid>

        <Grid item xs={3}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="recordstatus">Record Status</InputLabel>
            <TextField fullWidth id="recordstatus" placeholder="Enter Record Status" />
          </Stack>
        </Grid>

        <Grid item xs={2}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="approvalstatus">Approval Status</InputLabel>
            <TextField fullWidth id="approvalstatus" placeholder="Enter Approval Status" />
          </Stack>
        </Grid>
      </DialogContent>
      <Divider />

      <DialogActions sx={{ p: 1 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item></Grid>
          <Grid item>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="error" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="contained">Approve</Button>
              <Button variant="contained">Reject</Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

export default OwnRequestTable;
