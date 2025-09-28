import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Search,
  Download,
  Share,
  Delete,
  Visibility,
  VisibilityOff,
  Folder,
  InsertDriveFile
} from '@mui/icons-material';
import { useFiles } from '../contexts/FileContext';

const FileManager: React.FC = () => {
  const { files, loading, deleteFile, updateFileVisibility, refreshFiles } = useFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    refreshFiles();
  }, []);

  const handleDelete = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleVisibility = async (fileId: number, isPublic: boolean) => {
    try {
      await updateFileVisibility(fileId, !isPublic);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
    return '📁';
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading files...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">File Manager</Typography>
        <Button variant="contained" href="/upload">
          Upload Files
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {filteredFiles.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'No files found matching your search' : 'No files uploaded yet'}
          </Typography>
          <Button variant="contained" href="/upload" sx={{ mt: 2 }}>
            Upload Your First File
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredFiles.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {getFileIcon(file.mimeType)}
                    </Typography>
                    <Box flex={1}>
                      <Typography variant="h6" noWrap title={file.originalName}>
                        {file.originalName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.fileSize)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {file.isEncrypted && (
                      <Chip label="Encrypted" size="small" color="primary" />
                    )}
                    {file.isPublic ? (
                      <Chip label="Public" size="small" color="success" />
                    ) : (
                      <Chip label="Private" size="small" color="default" />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Uploaded: {formatDate(file.createdAt)}
                  </Typography>
                  {file.downloadCount > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Downloads: {file.downloadCount}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => window.open(`/api/files/${file.id}/download`, '_blank')}
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      // Navigate to share creation
                      window.location.href = `/shares?fileId=${file.id}`;
                    }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    color={file.isPublic ? 'warning' : 'success'}
                    onClick={() => handleToggleVisibility(file.id, file.isPublic)}
                  >
                    {file.isPublic ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedFile(file);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedFile?.originalName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedFile && handleDelete(selectedFile.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FileManager;
