import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import filmService from '../../services/filmService';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardMedia,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Movie as MovieIcon,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  // Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await filmService.getFilmById(id);
        setFilm(data);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Handle image error
  const handleImageError = (imageIndex) => {
    setImgErrors(prev => ({
      ...prev,
      [imageIndex]: true
    }));
  };

  // Get available images
  const getAvailableImages = () => {
    if (!film) return [];
    
    const images = [];
    if (film.image1 && !imgErrors[1]) images.push({ url: film.image1, index: 1 });
    if (film.image2 && !imgErrors[2]) images.push({ url: film.image2, index: 2 });
    if (film.image3 && !imgErrors[3]) images.push({ url: film.image3, index: 3 });
    
    return images;
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${film.title}"? This action cannot be undone.`)) {
      try {
        await filmService.deleteFilm(id);
        navigate('/movies');
      } catch (err) {
        console.error('Error deleting movie:', err);
        setError('Failed to delete movie. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/movies')}
          sx={{ mb: 2 }}
        >
          Back to Movies
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!film) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/movies')}
          sx={{ mb: 2 }}
        >
          Back to Movies
        </Button>
        <Alert severity="warning">Movie not found</Alert>
      </Box>
    );
  }

  const availableImages = getAvailableImages();

  return (
    <Box>
      {/* Header with navigation and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/movies')}
        >
          Back to Movies
        </Button>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/movies/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Movie details */}
      <Grid container spacing={4}>
        {/* Left column - Images */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, mb: 2 }}>
            {availableImages.length > 0 ? (
              <Box>
                {/* Main image display */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 400, 
                    position: 'relative',
                    mb: 2,
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="img"
                    src={availableImages[activeImage]?.url || ''}
                    alt={`${film.title} - Image ${availableImages[activeImage]?.index}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      bgcolor: 'action.hover'
                    }}
                  />
                </Box>

                {/* Image thumbnails */}
                {availableImages.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {availableImages.map((image, index) => (
                      <Box
                        key={image.index}
                        component="img"
                        src={image.url}
                        alt={`Thumbnail ${image.index}`}
                        onClick={() => setActiveImage(index)}
                        sx={{
                          width: 80,
                          height: 60,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          borderRadius: 1,
                          border: activeImage === index ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  borderRadius: 1
                }}
              >
                <BrokenImageIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No images available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right column - Details */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {film.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MovieIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                {film.year}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Type
                </Typography>
                {film.type ? (
                  <Chip 
                    label={film.type} 
                    color={film.type === 'ARTISTIC' ? 'primary' : 'secondary'} 
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body2">Not specified</Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                {film.category ? (
                  <Chip 
                    label={film.category} 
                    variant="outlined" 
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body2">Not specified</Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Credits
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Director ID
                </Typography>
                <Typography variant="body1">
                  {film.directorId || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Writer ID
                </Typography>
                <Typography variant="body1">
                  {film.writerId || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Producer ID
                </Typography>
                <Typography variant="body1">
                  {film.producerId || 'Not specified'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieDetails;