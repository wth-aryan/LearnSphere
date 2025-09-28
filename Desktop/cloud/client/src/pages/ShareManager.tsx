import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import {
  Share,
  ContentCopy,
  Delete,
  LinkOff,
  Lock,
  Public,
  Person
} from '@mui/icons-material';
import { useFiles } from '../contexts/FileContext';
import { useAuth } from '../contexts/AuthContext';

const ShareManager: React.FC = () => {
  const { files, shares, createShare, deleteShare, deactivateShare, refreshShares } = useFiles();
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [shareData, setShareData] = useState({
    shareType: 'public' as 'public' | 'private' | 'password',
    password: '',
    expiresAt: '',
    maxDownloads: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    refreshShares();
  }, []);

  const handleCreateShare = async () => {
    if (!selectedFileId) return;

    try {
      setError('');
      const share = await createShare(selectedFileId, {
        ...shareData,
        expiresAt: shareData.expiresAt || undefined,
        maxDownloads: shareData.maxDownloads ? parseInt(shareData.maxDownloads) : undefined
      });
      
      setSuccess('Share created successfully!');
      setCreateDialogOpen(false);
      setShareData({
        shareType: 'public',
        password: '',
        expiresAt: '',
        maxDownloads: ''
      });
      setSelectedFileId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteShare = async (shareToken: string) => {
    try {
      await deleteShare(shareToken);
      setSuccess('Share deleted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeactivateShare = async (shareToken: string) => {
    try {
      await deactivateShare(shareToken);
      setSuccess('Share deactivated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Link copied to clipboard!');
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
        return <Share />;
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Share Manager</Typography>
        <Button
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Share
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {shares.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Share sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No shares created yet
          </Typography>
          <Button variant="contained" onClick={() => setCreateDialogOpen(true)} sx={{ mt: 2 }}>
            Create Your First Share
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {shares.map((share) => {
            const file = files.find(f => f.id === share.fileId);
            return (
              <Grid item xs={12} md={6} key={share.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getShareIcon(share.shareType)}
                      <Box ml={1} flex={1}>
                        <Typography variant="h6">
                          {file?.originalName || 'Unknown File'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {formatDate(share.createdAt)}
                        </Typography>
                      </Box>
                      <Chip
                        label={share.shareType}
                        color={getShareColor(share.shareType) as any}
                        size="small"
                      />
                    </Box>

                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Share Link:
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TextField
                          value={`${window.location.origin}/share/${share.shareToken}`}
                          size="small"
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            style: { fontFamily: 'monospace', fontSize: '0.875rem' }
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(`${window.location.origin}/share/${share.shareToken}`)}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip
                        label={`${share.downloadCount} downloads`}
                        size="small"
                        variant="outlined"
                      />
                      {share.maxDownloads && (
                        <Chip
                          label={`Max: ${share.maxDownloads}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {share.expiresAt && (
                        <Chip
                          label={`Expires: ${formatDate(share.expiresAt)}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Chip
                        label={share.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={share.isActive ? 'success' : 'default'}
                      />
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(`${window.location.origin}/share/${share.shareToken}`)}
                      startIcon={<ContentCopy />}
                    >
                      Copy Link
                    </Button>
                    {share.isActive ? (
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => handleDeactivateShare(share.shareToken)}
                        startIcon={<LinkOff />}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleDeactivateShare(share.shareToken)}
                        startIcon={<Share />}
                      >
                        Reactivate
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteShare(share.shareToken)}
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Share Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Share</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select File</InputLabel>
            <Select
              value={selectedFileId || ''}
              onChange={(e) => setSelectedFileId(Number(e.target.value))}
            >
              {files.map((file) => (
                <MenuItem key={file.id} value={file.id}>
                  {file.originalName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Share Type</InputLabel>
            <Select
              value={shareData.shareType}
              onChange={(e) => setShareData({ ...shareData, shareType: e.target.value as any })}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="password">Password Protected</MenuItem>
            </Select>
          </FormControl>

          {shareData.shareType === 'password' && (
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={shareData.password}
              onChange={(e) => setShareData({ ...shareData, password: e.target.value })}
            />
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Expiration Date (optional)"
            type="datetime-local"
            value={shareData.expiresAt}
            onChange={(e) => setShareData({ ...shareData, expiresAt: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Max Downloads (optional)"
            type="number"
            value={shareData.maxDownloads}
            onChange={(e) => setShareData({ ...shareData, maxDownloads: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateShare}
            variant="contained"
            disabled={!selectedFileId}
          >
            Create Share
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShareManager;
