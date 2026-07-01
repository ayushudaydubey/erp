import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMeApi, loginUserApi, registerUserApi, logoutUserApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Query to automatically fetch the current logged-in user profile if a valid cookie is present
  const {
    data: user,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: getMeApi,
    retry: false, // Do not retry on failure (e.g. if not logged in, just fail silently)
    staleTime: Infinity, // Keep auth user cached until invalidated (e.g., logout or manual refetch)
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginUserApi,
    onSuccess: (data) => {
      // Update the cached user query with returned user profile
      queryClient.setQueryData(['authUser'], data);
      toast.success(`Welcome back, ${data.name}!`);
    },
    onError: (error) => {
      // Error toaster is handled centrally by Axios interceptors, but we can do extra logic here if needed
    }
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: registerUserApi,
    onSuccess: (data) => {
      queryClient.setQueryData(['authUser'], data);
      toast.success(`Account created! Welcome, ${data.name}!`);
    }
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUserApi,
    onSuccess: () => {
      // Clear all queries and redirect
      queryClient.setQueryData(['authUser'], null);
      queryClient.clear();
      toast.success('Logged out successfully.');
    }
  });

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetchUser: refetch
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
