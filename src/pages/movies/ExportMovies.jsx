import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import filmService from '../../services/filmService';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  TableChart as TableChartIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

const ExportMovies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState(location.state?.format || null);

  // Handle export
  const handleExport = async (format) => {
    try {
      setLoading(true);
      setError(null);
      setExportFormat(format);
      
      let response;
      switch (format) {
        case 'csv':
          response = await filmService.exportToCsv();
          downloadFile(response, 'movies.csv', 'text/csv');
          break;
        case 'docx':
          response = await filmService.exportToDocx();
          downloadFile(response, 'movies.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          break;
        case 'json':
          response = await filmService.exportToJson();
          downloadFile(response, 'movies.json', 'application/json');
          break;
        case 'xml':
          response = await filmService.exportToXml();
          downloadFile(response, 'movies.xml', 'application/xml');
          break;
        default:
          throw new Error('Unsupported export format');
      }
    } catch (err) {
      console.error('Export error:', err);
      setError(`Failed to export movies as ${format.toUpperCase()}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to download file
  const downloadFile = (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Export Movies</Typography>
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
        <Typography variant="h6" gutterBottom>
          Select Export Format
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* CSV Export */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <TableChartIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  CSV
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                  Export as comma-separated values file. Best for spreadsheet applications like Excel.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => handleExport('csv')}
                  disabled={loading && exportFormat === 'csv'}
                >
                  {loading && exportFormat === 'csv' ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Export as CSV'
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* DOCX Export */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <DescriptionIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  DOCX
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                  Export as Microsoft Word document. Best for text processing and printing.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => handleExport('docx')}
                  disabled={loading && exportFormat === 'docx'}
                >
                  {loading && exportFormat === 'docx' ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Export as DOCX'
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* JSON Export */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <CodeIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  JSON
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                  Export as JavaScript Object Notation. Best for web and application development.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => handleExport('json')}
                  disabled={loading && exportFormat === 'json'}
                >
                  {loading && exportFormat === 'json' ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Export as JSON'
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* XML Export */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <ArticleIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  XML
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                  Export as Extensible Markup Language. Best for data interchange and storage.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => handleExport('xml')}
                  disabled={loading && exportFormat === 'xml'}
                >
                  {loading && exportFormat === 'xml' ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Export as XML'
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ExportMovies;