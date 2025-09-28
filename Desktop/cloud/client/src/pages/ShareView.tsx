import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Download,
  Lock,
  Public,
  Person,
  InsertDriveFile
} from '@mui/icons-material';
import axios from 'axios';

interface ShareInfo {
  share: {
    id: number;
    shareType: string;
    expiresAt?: string;
    maxDownloads?: number;
    downloadCount: number;
    createdAt: string;
  };
  file: {
    id: number;
    originalName: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
  };
}

const ShareView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);

  useEffect(() => {
    if (token) {
      fetchShareInfo();
    }
  }, [token]);

  const fetchShareInfo = async () => {
    try {
      const response = await axios.get(`/api/share/${token}`);
      setShareInfo(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Share not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async () => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    try {
      await axios.post(`/api/share/${token}/verify`, { password });
      setPasswordVerified(true);
      setPasswordError('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Invalid password');
    }
  };

  const downloadFile = async () => {
    if (!shareInfo) return;

    try {
      const url = shareInfo.share.shareType === 'password' 
        ? `/api/share/${token}/download?password=${encodeURIComponent(password)}`
        : `/api/share/${token}/download`;
      
      window.open(url, '_blank');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Download failed');
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

  const getShareIcon = (shareType: string) => {
    switch (shareType) {
      case 'public':
        return <Public />;
      case 'private':
        return <Person />;
      case 'password':
        return <Lock />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getShareColor = (shareType: string) => {
    switch (shareType) {
      case 'public':
        return 'success';
      case 'private':
        return 'default';
      case 'password':
        return 'warning';
      default:
        return 'primary';
    }
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

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!shareInfo) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Shared File
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            {getShareIcon(shareInfo.share.shareType)}
            <Chip
              label={shareInfo.share.shareType}
              color={getShareColor(shareInfo.share.shareType) as any}
            />
          </Box>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h2" sx={{ mr: 2 }}>
                {getFileIcon(shareInfo.file.mimeType)}
              </Typography>
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                  {shareInfo.file.originalName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(shareInfo.file.fileSize)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip
                label={`${shareInfo.share.downloadCount} downloads`}
                size="small"
                variant="outlined"
              />
              {shareInfo.share.maxDownloads && (
                <Chip
                  label={`Max: ${shareInfo.share.maxDownloads}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {shareInfo.share.expiresAt && (
                <Chip
                  label={`Expires: ${formatDate(shareInfo.share.expiresAt)}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Shared on: {formatDate(shareInfo.share.createdAt)}
            </Typography>
          </CardContent>
        </Card>

        {shareInfo.share.shareType === 'password' && !passwordVerified && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Password Required
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                variant="contained"
                onClick={verifyPassword}
                sx={{ minWidth: 100 }}
              >
                Verify
              </Button>
            </Box>
          </Box>
        )}

        {(shareInfo.share.shareType !== 'password' || passwordVerified) && (
          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<Download />}
              onClick={downloadFile}
              sx={{ minWidth: 200 }}
            >
              Download File
            </Button>
          </Box>
        )}

        <Box textAlign="center" mt={3}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShareView;
