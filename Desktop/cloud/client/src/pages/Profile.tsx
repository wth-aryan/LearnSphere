import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Person,
  Storage,
  Security
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useFiles } from '../contexts/FileContext';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { storageUsage } = useFiles();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

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

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">Profile Information</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                sx={{ width: 64, height: 64, mr: 2 }}
                src={user.avatar}
              >
                {user.firstName?.[0] || user.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{user.username}
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Avatar URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                value={user.email}
                disabled
                helperText="Email cannot be changed"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={user.username}
                disabled
                helperText="Username cannot be changed"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Storage Usage */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
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

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available: {formatFileSize(storageUsage.available)}
            </Typography>

            <Box mt={3}>
              <Typography variant="body2" color="text.secondary">
                Account created: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
              {user.lastLogin && (
                <Typography variant="body2" color="text.secondary">
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Security Information */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Security sx={{ mr: 1 }} />
              <Typography variant="h6">Security Information</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="success.main">
                    ✓
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email Verified
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="success.main">
                    ✓
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Account Active
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
