import React, { useState } from 'react';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';

const App = () => {
  const [logged, setLogged] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    if ((companyId === 'nable' || companyId === 'nable2') && password === '1234' && (userId === 'nable' || userId === 'nable2')) {
      localStorage.setItem('companyId', companyId);
      localStorage.setItem('userId', userId);
      console.log('CompanyID from LocalStorage:', companyId);
      console.log('UserID from LocalStorage:', userId);
      setLogged(true);
    } else {
      alert('Invalid CompanyId, UserID, or Password. Please try again.');
    }
  };

  return (
    <ThemeCustomization>
      <ScrollTop>
        {logged ? (
          <Routes />
        ) : (
          <Container
            component="main"
            maxWidth="xs"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '150px'
            }}
          >
            <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <form>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="CompanyId"
                  value={companyId}
                  style={{ width: '350px', maxHeight: '600px' }}
                  onChange={(e) => setCompanyId(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="UserID"
                  value={userId}
                  style={{ width: '350px', maxHeight: '600px' }}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Password"
                  value={password}
                  style={{ width: '350px', maxHeight: '600px' }}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleLoginClick}
                  style={{ marginTop: '20px' }}
                >
                  LOGIN AS ENTERER
                </Button>
              </form>
            </Paper>
          </Container>
        )}
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
