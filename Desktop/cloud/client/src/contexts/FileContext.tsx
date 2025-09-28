import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface File {
  id: number;
  userId: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isEncrypted: boolean;
  isPublic: boolean;
  downloadCount: number;
  lastAccessed?: string;
  createdAt: string;
  updatedAt: string;
}

interface Share {
  id: number;
  fileId: number;
  userId: number;
  shareToken: string;
  shareType: 'public' | 'private' | 'password';
  expiresAt?: string;
  maxDownloads?: number;
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FileContextType {
  files: File[];
  shares: Share[];
  storageUsage: {
    used: number;
    limit: number;
    percentage: number;
    available: number;
  };
  loading: boolean;
  uploadFile: (file: File, options?: UploadOptions) => Promise<void>;
  deleteFile: (fileId: number) => Promise<void>;
  updateFileVisibility: (fileId: number, isPublic: boolean) => Promise<void>;
  createShare: (fileId: number, shareData: ShareData) => Promise<Share>;
  deleteShare: (shareToken: string) => Promise<void>;
  deactivateShare: (shareToken: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
  refreshShares: () => Promise<void>;
  refreshStorageUsage: () => Promise<void>;
}

interface UploadOptions {
  isEncrypted?: boolean;
  isPublic?: boolean;
}

interface ShareData {
  shareType: 'public' | 'private' | 'password';
  password?: string;
  expiresAt?: string;
  maxDownloads?: number;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [storageUsage, setStorageUsage] = useState({
    used: 0,
    limit: 0,
    percentage: 0,
    available: 0
  });
  const [loading, setLoading] = useState(false);

  const refreshFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/files');
      setFiles(response.data.files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshShares = async () => {
    try {
      const response = await axios.get('/api/share');
      setShares(response.data.shares);
    } catch (error) {
      console.error('Failed to fetch shares:', error);
    }
  };

  const refreshStorageUsage = async () => {
    try {
      const response = await axios.get('/api/users/storage');
      setStorageUsage(response.data);
    } catch (error) {
      console.error('Failed to fetch storage usage:', error);
    }
  };

  const uploadFile = async (file: File, options: UploadOptions = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalName', file.name);
      formData.append('mimeType', file.type);
      formData.append('fileSize', file.size.toString());
      formData.append('isEncrypted', (options.isEncrypted || false).toString());
      formData.append('isPublic', (options.isPublic || false).toString());

      await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await Promise.all([refreshFiles(), refreshStorageUsage()]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  };

  const deleteFile = async (fileId: number) => {
    try {
      await axios.delete(`/api/files/${fileId}`);
      setFiles(files.filter(file => file.id !== fileId));
      await refreshStorageUsage();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Delete failed');
    }
  };

  const updateFileVisibility = async (fileId: number, isPublic: boolean) => {
    try {
      await axios.put(`/api/files/${fileId}/visibility`, { isPublic });
      setFiles(files.map(file => 
        file.id === fileId ? { ...file, isPublic } : file
      ));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  };

  const createShare = async (fileId: number, shareData: ShareData): Promise<Share> => {
    try {
      const response = await axios.post('/api/share/create', {
        fileId,
        ...shareData
      });
      await refreshShares();
      return response.data.share;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Share creation failed');
    }
  };

  const deleteShare = async (shareToken: string) => {
    try {
      await axios.delete(`/api/share/${shareToken}`);
      setShares(shares.filter(share => share.shareToken !== shareToken));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Share deletion failed');
    }
  };

  const deactivateShare = async (shareToken: string) => {
    try {
      await axios.put(`/api/share/${shareToken}/deactivate`);
      setShares(shares.map(share => 
        share.shareToken === shareToken ? { ...share, isActive: false } : share
      ));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Share deactivation failed');
    }
  };

  // Load initial data
  useEffect(() => {
    refreshFiles();
    refreshShares();
    refreshStorageUsage();
  }, []);

  const value: FileContextType = {
    files,
    shares,
    storageUsage,
    loading,
    uploadFile,
    deleteFile,
    updateFileVisibility,
    createShare,
    deleteShare,
    deactivateShare,
    refreshFiles,
    refreshShares,
    refreshStorageUsage
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};
