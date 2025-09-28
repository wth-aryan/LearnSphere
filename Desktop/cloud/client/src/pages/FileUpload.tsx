import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { useFiles } from '../contexts/FileContext';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { uploadFile } = useFiles();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 10 * 1024 * 1024 * 1024, // 10GB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (uploadFileItem) => {
      try {
        setFiles(prev => prev.map(f => 
          f.id === uploadFileItem.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ));

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === uploadFileItem.id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        await uploadFile(uploadFileItem.file, {
          isEncrypted,
          isPublic
        });

        clearInterval(progressInterval);
        setFiles(prev => prev.map(f => 
          f.id === uploadFileItem.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ));
      } catch (error: any) {
        setFiles(prev => prev.map(f => 
          f.id === uploadFileItem.id 
            ? { ...f, status: 'error', error: error.message }
            : f
        ));
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
  };

  const clearAll = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <CloudUpload />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload Files
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Maximum file size: 10GB
          </Typography>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
              />
            }
            label="Encrypt files"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            }
            label="Make files public"
          />
        </Box>
      </Paper>

      {files.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Files to Upload ({files.length})
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={clearAll}
                disabled={uploading}
                sx={{ mr: 1 }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
              >
                {uploading ? <CircularProgress size={20} /> : 'Upload All'}
              </Button>
            </Box>
          </Box>

          <Box>
            {files.map((fileItem) => (
              <Box
                key={fileItem.id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center" flex={1}>
                    {getStatusIcon(fileItem.status)}
                    <Box ml={2} flex={1}>
                      <Typography variant="body1" noWrap>
                        {fileItem.file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(fileItem.file.size)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={fileItem.status}
                      color={getStatusColor(fileItem.status) as any}
                      size="small"
                    />
                    {fileItem.status === 'pending' && (
                      <Button
                        size="small"
                        onClick={() => removeFile(fileItem.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </Box>

                {fileItem.status === 'uploading' && (
                  <LinearProgress
                    variant="determinate"
                    value={fileItem.progress}
                    sx={{ mt: 1 }}
                  />
                )}

                {fileItem.status === 'error' && fileItem.error && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {fileItem.error}
                  </Alert>
                )}

                {fileItem.status === 'success' && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    File uploaded successfully!
                  </Alert>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default FileUpload;
