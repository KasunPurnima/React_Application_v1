// material-ui
import { Avatar, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import 
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';

// types 

// ==============================|| Currency - DELETE ||============================== //

export default function AlertCurrencyDelete({ title, open, handleClose, currency, updateCurrency }) {

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {" "}  {title ? title : " "} {" "}
              </Typography>
              currency, all details of currency will also be deleted.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => {
              // DELETE API Call
              updateCurrency({
                currencyTypeId: currency.id,
                code: currency.currencyCode,
                name: currency.currencyName,
                isActive: false
              })
              handleClose(true)
            }} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog >
  );
}
