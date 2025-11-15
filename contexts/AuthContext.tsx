import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState, useMemo } from 'react';

const STORAGE_KEY = 'user_auth';
const OTP_EXPIRY_TIME = 5 * 60 * 1000;

export interface User {
  email: string;
  name: string;
  createdAt: string;
}

interface AuthData {
  user: User | null;
  isAuthenticated: boolean;
}

interface OTPData {
  code: string;
  email: string;
  expiresAt: number;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [authData, setAuthData] = useState<AuthData>({
    user: null,
    isAuthenticated: false,
  });
  const [pendingOTP, setPendingOTP] = useState<OTPData | null>(null);

  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { user: null, isAuthenticated: false };
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AuthData) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const { mutate: saveAuthData } = saveMutation;

  useEffect(() => {
    if (authQuery.data) {
      setAuthData(authQuery.data);
    }
  }, [authQuery.data]);

  const generateOTP = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  const sendOTP = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    const code = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY_TIME;
    
    setPendingOTP({ code, email, expiresAt });
    
    console.log(`OTP sent to ${email}: ${code}`);
    
    return {
      success: true,
      message: `OTP sent to ${email}. For demo purposes, use: ${code}`,
    };
  }, [generateOTP]);

  const verifyOTP = useCallback((code: string): boolean => {
    if (!pendingOTP) {
      return false;
    }

    if (Date.now() > pendingOTP.expiresAt) {
      setPendingOTP(null);
      return false;
    }

    if (code === pendingOTP.code) {
      return true;
    }

    return false;
  }, [pendingOTP]);

  const signUp = useCallback(async (
    email: string,
    name: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!verifyOTP(otp)) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    const user: User = {
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    const newAuthData = { user, isAuthenticated: true };
    setAuthData(newAuthData);
    saveAuthData(newAuthData);
    setPendingOTP(null);

    return { success: true, message: 'Account created successfully' };
  }, [verifyOTP, saveAuthData]);

  const signIn = useCallback(async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!verifyOTP(otp)) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    const user: User = {
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    const newAuthData = { user, isAuthenticated: true };
    setAuthData(newAuthData);
    saveAuthData(newAuthData);
    setPendingOTP(null);

    return { success: true, message: 'Signed in successfully' };
  }, [verifyOTP, saveAuthData]);

  const signOut = useCallback(async () => {
    const newAuthData = { user: null, isAuthenticated: false };
    setAuthData(newAuthData);
    saveAuthData(newAuthData);
    setPendingOTP(null);
  }, [saveAuthData]);

  return useMemo(() => ({
    user: authData.user,
    isAuthenticated: authData.isAuthenticated,
    isLoading: authQuery.isLoading,
    sendOTP,
    signUp,
    signIn,
    signOut,
    hasPendingOTP: !!pendingOTP,
  }), [authData, authQuery.isLoading, sendOTP, signUp, signIn, signOut, pendingOTP]);
});
