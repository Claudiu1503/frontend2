import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import filmService from '../../services/filmService';
import { Type, Category } from '../../utils/filmEnums';

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
  Divider
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  BrokenImage as BrokenImageIcon 
} from '@mui/icons-material';

const MovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    type: '',
    category: '',
    directorId: '',
    writerId: '',
    producerId: '',
    image1: '',
    image2: '',
    image3: ''
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load movie data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMovie = async () => {
        try {
          setLoading(true);
          const movie = await filmService.getFilmById(id);
          if (movie) {
            setFormData({
              title: movie.title || '',
              year: movie.year || '',
              type: movie.type || '',
              category: movie.category || '',
              directorId: movie.directorId || '',
              writerId: movie.writerId || '',
              producerId: movie.producerId || '',
              image1: movie.image1 || '',
              image2: movie.image2 || '',
              image3: movie.image3 || ''
            });
          } else {
            setError('Movie not found');
          }
        } catch (err) {
          console.error('Error fetching movie:', err);
          setError('Failed to load movie data');
        } finally {
          setLoading(false);
        }
      };

      fetchMovie();
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

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.year) {
      errors.year = 'Year is required';
    } else if (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear()) {
      errors.year = 'Please enter a valid year';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
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

      // Convert numeric fields from string to number
      const movieData = {
        ...formData,
        year: parseInt(formData.year, 10),
        directorId: formData.directorId ? parseInt(formData.directorId, 10) : null,
        writerId: formData.writerId ? parseInt(formData.writerId, 10) : null,
        producerId: formData.producerId ? parseInt(formData.producerId, 10) : null
      };

      if (isEditMode) {
        await filmService.updateFilm(id, movieData);
      } else {
        await filmService.createFilm(movieData);
      }

      // Navigate back to movie list on success
      navigate('/movies');
    } catch (err) {
      console.error('Error saving movie:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} movie. Please try again.`);
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
          {isEditMode ? 'Edit Movie' : 'Add New Movie'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/movies')}
        >
          Back to Movies
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
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                error={!!formErrors.year}
                helperText={formErrors.year}
                required
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
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
                  {Object.values(Type).map(type => (
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
              <FormControl fullWidth error={!!formErrors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {Object.values(Category).map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <Typography variant="caption" color="error">
                    {formErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Credits */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Credits</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Director ID"
                name="directorId"
                type="number"
                value={formData.directorId}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Writer ID"
                name="writerId"
                type="number"
                value={formData.writerId}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Producer ID"
                name="producerId"
                type="number"
                value={formData.producerId}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* Images */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Images</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Enter URLs for movie images (posters, screenshots, etc.)
              </Typography>
            </Grid>

            {/* Image 1 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Image URL 1"
                  name="image1"
                  value={formData.image1}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                {/* Image preview */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: 200, 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {formData.image1 ? (
                    <Box
                      component="img"
                      src={formData.image1}
                      alt="Image 1 preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : null}

                  <Box 
                    sx={{ 
                      display: formData.image1 ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <BrokenImageIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="caption">
                      {formData.image1 ? 'Failed to load image' : 'No image URL provided'}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Image 2 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Image URL 2"
                  name="image2"
                  value={formData.image2}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                {/* Image preview */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: 200, 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {formData.image2 ? (
                    <Box
                      component="img"
                      src={formData.image2}
                      alt="Image 2 preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : null}

                  <Box 
                    sx={{ 
                      display: formData.image2 ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <BrokenImageIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="caption">
                      {formData.image2 ? 'Failed to load image' : 'No image URL provided'}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Image 3 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Image URL 3"
                  name="image3"
                  value={formData.image3}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                {/* Image preview */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    height: 200, 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {formData.image3 ? (
                    <Box
                      component="img"
                      src={formData.image3}
                      alt="Image 3 preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : null}

                  <Box 
                    sx={{ 
                      display: formData.image3 ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <BrokenImageIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="caption">
                      {formData.image3 ? 'Failed to load image' : 'No image URL provided'}
                    </Typography>
                  </Box>
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

export default MovieForm;
