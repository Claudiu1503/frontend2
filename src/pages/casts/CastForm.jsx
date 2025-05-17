import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import castService from '../../services/castService';
import UserType from '../../utils/userTypes';

// Material UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  TheaterComedy as RoleIcon
} from '@mui/icons-material';

const CastForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentUser, hasRole } = useAuth();
  const isEditMode = !!id;
  
  // Redirect if not an employee
  useEffect(() => {
    if (currentUser && !hasRole(UserType.EMPLOYEE)) {
      navigate('/employee');
    }
  }, [currentUser, hasRole, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    filmId: '',
    actorId: '',
    role: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load cast data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCast = async () => {
        try {
          setLoading(true);
          const cast = await castService.getCastById(id);
          if (cast) {
            setFormData({
              filmId: cast.filmId || '',
              actorId: cast.actorId || '',
              role: cast.role || ''
            });
          } else {
            setError('Cast not found');
          }
        } catch (err) {
          console.error('Error fetching cast:', err);
          setError('Failed to load cast data');
        } finally {
          setLoading(false);
        }
      };

      fetchCast();
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

    if (!formData.filmId) {
      errors.filmId = 'Film ID is required';
    } else if (isNaN(formData.filmId) || parseInt(formData.filmId) <= 0) {
      errors.filmId = 'Film ID must be a positive number';
    }

    if (!formData.actorId) {
      errors.actorId = 'Actor ID is required';
    } else if (isNaN(formData.actorId) || parseInt(formData.actorId) <= 0) {
      errors.actorId = 'Actor ID must be a positive number';
    }

    // Role is optional, no validation needed

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
      const castData = {
        ...formData,
        filmId: parseInt(formData.filmId, 10),
        actorId: parseInt(formData.actorId, 10)
      };

      if (isEditMode) {
        await castService.updateCast(id, castData);
      } else {
        await castService.createCast(castData);
      }

      // Navigate back to cast list on success
      navigate('/casts');
    } catch (err) {
      console.error('Error saving cast:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} cast. Please try again.`);
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
          {isEditMode ? 'Edit Cast' : 'Add New Cast'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/casts')}
        >
          Back to Casts
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
            {/* Cast Information */}
            <Grid item xs={12}>
              <Typography variant="h6">Cast Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Film ID"
                name="filmId"
                type="number"
                value={formData.filmId}
                onChange={handleChange}
                error={!!formErrors.filmId}
                helperText={formErrors.filmId}
                required
                InputProps={{
                  startAdornment: <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actor ID"
                name="actorId"
                type="number"
                value={formData.actorId}
                onChange={handleChange}
                error={!!formErrors.actorId}
                helperText={formErrors.actorId}
                required
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'secondary.main' }} />
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <RoleIcon sx={{ mr: 1, color: 'info.main' }} />
                }}
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

export default CastForm;