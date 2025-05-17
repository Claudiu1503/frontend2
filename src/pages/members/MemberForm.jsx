import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
import MemberType from '../../utils/memberTypes';
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
  useMediaQuery
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  BrokenImage as BrokenImageIcon 
} from '@mui/icons-material';

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentUser, hasRole } = useAuth();
  const isEditMode = !!id;
  
  // Redirect if not a manager
  useEffect(() => {
    if (currentUser && !hasRole(UserType.MANAGER)) {
      navigate('/manager');
    }
  }, [currentUser, hasRole, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    image: '',
    birthday: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  // Load member data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMember = async () => {
        try {
          setLoading(true);
          const member = await memberService.getMemberById(id);
          if (member) {
            setFormData({
              name: member.name || '',
              type: member.type || '',
              image: member.image || '',
              birthday: member.birthday ? formatDateForInput(member.birthday) : ''
            });
          } else {
            setError('Member not found');
          }
        } catch (err) {
          console.error('Error fetching member:', err);
          setError('Failed to load member data');
        } finally {
          setLoading(false);
        }
      };

      fetchMember();
    }
  }, [id, isEditMode]);

  // Format date for display in input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
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
      const memberData = {
        ...formData,
        birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null
      };

      if (isEditMode) {
        await memberService.updateMember(id, memberData);
      } else {
        await memberService.createMember(memberData);
      }

      // Navigate back to member list on success
      navigate('/members');
    } catch (err) {
      console.error('Error saving member:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} member. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
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
          {isEditMode ? 'Edit Member' : 'Add New Member'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/members')}
        >
          Back to Members
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
              <Typography variant="h6">Basic Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.type} required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {Object.values(MemberType).map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {formErrors.type && (
                  <Typography variant="caption" color="error">
                    {formErrors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Image */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Image</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Enter URL for member image (photo, portrait, etc.)
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                {/* Image preview */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: 300, 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {formData.image && !imageError ? (
                    <Box
                      component="img"
                      src={formData.image}
                      alt="Image preview"
                      onError={handleImageError}
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      {imageError ? (
                        <>
                          <BrokenImageIcon sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="caption">
                            Failed to load image
                          </Typography>
                        </>
                      ) : (
                        <>
                          <PersonIcon sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="caption">
                            No image URL provided
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Paper>
              </Box>
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

export default MemberForm;