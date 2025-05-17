import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import UserType from '../../utils/userTypes';

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentUser, hasRole } = useAuth();
  const isEditMode = !!id;
  
  // Redirect if not an admin
  useEffect(() => {
    if (currentUser && !hasRole(UserType.ADMIN)) {
      navigate('/admin');
    }
  }, [currentUser, hasRole, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    type: '',
    email: '',
    phone: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await authService.getUserById(id);
          if (user) {
            setFormData({
              username: user.username || '',
              password: '', // Don't populate password for security reasons
              type: user.type || '',
              email: user.email || '',
              phone: user.phone || ''
            });
          } else {
            setError('User not found');
          }
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to load user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!isEditMode && !formData.password.trim()) {
      errors.password = 'Password is required for new users';
    }

    if (!formData.type) {
      errors.type = 'User type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare data for API
      const userData = { ...formData };
      
      // Don't send empty password when editing
      if (isEditMode && !userData.password) {
        delete userData.password;
      }

      if (isEditMode) {
        // When editing, don't update email and phone as per requirements
        delete userData.email;
        delete userData.phone;
        
        await authService.updateUser(id, userData);
      } else {
        await authService.createUser(userData);
      }

      // Navigate back to user list on success
      navigate('/admin/users');
    } catch (err) {
      console.error('Error saving user:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} user. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6">User Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isEditMode ? "New Password (leave blank to keep current)" : "Password"}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required={!isEditMode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.type} required>
                <InputLabel>User Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="User Type"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {Object.values(UserType).map(type => (
                    <MenuItem key={type} value={type} sx={{ width: '100%', whiteSpace: 'normal' }}>{type}</MenuItem>
                  ))}
                </Select>
                {formErrors.type && (
                  <Typography variant="caption" color="error">
                    {formErrors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">Contact Information</Typography>
                {isEditMode && (
                  <Tooltip title="Email and phone cannot be updated for existing users">
                    <InfoIcon color="info" sx={{ ml: 1 }} />
                  </Tooltip>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isEditMode} // Disable email field when editing
                InputProps={{
                  readOnly: isEditMode,
                }}
                helperText={isEditMode ? "Email cannot be updated for existing users" : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isEditMode} // Disable phone field when editing
                InputProps={{
                  readOnly: isEditMode,
                }}
                helperText={isEditMode ? "Phone cannot be updated for existing users" : ""}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                  sx={{ minWidth: 120 }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;