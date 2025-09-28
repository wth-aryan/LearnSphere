import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Button
} from '@mui/material';
import {
  CloudUpload,
  Folder,
  Share,
  Storage
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useFiles } from '../contexts/FileContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { files, shares, storageUsage, refreshFiles, refreshShares, refreshStorageUsage } = useFiles();
  const navigate = useNavigate();

  useEffect(() => {
    refreshFiles();
    refreshShares();
    refreshStorageUsage();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const recentFiles = files.slice(0, 5);
  const activeShares = shares.filter(share => share.isActive);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName || user?.username}!
      </Typography>

      <Grid container spacing={3}>
        {/* Storage Usage */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Storage sx={{ mr: 1 }} />
                <Typography variant="h6">Storage Usage</Typography>
              </Box>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {formatFileSize(storageUsage.used)} of {formatFileSize(storageUsage.limit)}
                  </Typography>
                  <Typography variant="body2">
                    {storageUsage.percentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={storageUsage.percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(storageUsage.available)} available
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {files.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Files
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary">
                      {activeShares.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Shares
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => navigate('/upload')}
                >
                  Upload Files
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Folder />}
                  onClick={() => navigate('/files')}
                >
                  Manage Files
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => navigate('/shares')}
                >
                  Manage Shares
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Files */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Files</Typography>
                <Button size="small" onClick={() => navigate('/files')}>
                  View All
                </Button>
              </Box>
              {recentFiles.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No files uploaded yet
                </Typography>
              ) : (
                <Box>
                  {recentFiles.map((file) => (
                    <Box
                      key={file.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Box>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {file.originalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.fileSize)}
                        </Typography>
                      </Box>
                      <Box>
                        {file.isEncrypted && (
                          <Chip label="Encrypted" size="small" color="primary" />
                        )}
                        {file.isPublic && (
                          <Chip label="Public" size="small" color="secondary" />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active Shares */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Active Shares</Typography>
                <Button size="small" onClick={() => navigate('/shares')}>
                  View All
                </Button>
              </Box>
              {activeShares.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No active shares
                </Typography>
              ) : (
                <Box>
                  {activeShares.slice(0, 5).map((share) => (
                    <Box
                      key={share.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Box>
                        <Typography variant="body2">
                          {share.shareType.charAt(0).toUpperCase() + share.shareType.slice(1)} Share
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {share.downloadCount} downloads
                        </Typography>
                      </Box>
                      <Chip
                        label={share.shareType}
                        size="small"
                        color={share.shareType === 'public' ? 'success' : 'default'}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
