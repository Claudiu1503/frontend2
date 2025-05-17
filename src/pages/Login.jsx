import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import UserType from '../utils/userTypes';

// Material UI imports
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, loading } = useAuth();
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Handle language change
  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!username.trim() || !password.trim()) {
      setFormError(t('auth.requiredField'));
      return;
    }

    try {
      setFormError('');
      const user = await login(username, password);

      // Redirect based on user type
      if (user.type === UserType.EMPLOYEE) {
        navigate('/employee');
      } else if (user.type === UserType.MANAGER) {
        navigate('/manager');
      } else if (user.type === UserType.ADMIN) {
        navigate('/admin');
      } else {
        // Default fallback
        navigate('/employee');
      }
    } catch (err) {
      setFormError(t('auth.invalidCredentials'));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Language selector */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
          <FormControl variant="outlined" size="small">
            <Select
              value={currentLanguage}
              onChange={handleLanguageChange}
              sx={{ minWidth: 120 }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5">
            {t('auth.signIn')}
          </Typography>

          {(formError || error) && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {formError || error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t('auth.username')}
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('auth.signIn')}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {t('auth.selectLanguage')}
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? "contained" : "outlined"}
                  size="small"
                  onClick={() => changeLanguage(lang.code)}
                  sx={{ minWidth: 90 }}
                >
                  {t(`auth.${lang.code === 'en' ? 'english' : lang.code === 'es' ? 'spanish' : 'romanian'}`)}
                </Button>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
