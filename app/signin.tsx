import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, sendOTP } = useAuth();
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const result = await sendOTP(email);
    setIsLoading(false);

    if (result.success) {
      setStep('otp');
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleSignIn = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    const result = await signIn(email, otp);
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    await handleSendOTP();
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    header: {
      marginBottom: 48,
    },
    title: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      gap: 20,
    },
    inputContainer: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      height: 56,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#ffffff',
    },
    secondaryButton: {
      marginTop: 16,
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    footer: {
      marginTop: 32,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    footerLink: {
      color: colors.primary,
      fontWeight: '600' as const,
    },
    otpInfo: {
      backgroundColor: colors.primaryLight,
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
    },
    otpInfoText: {
      fontSize: 14,
      color: colors.primary,
      textAlign: 'center',
    },
  });

  return (
    <KeyboardAvoidingView
      style={dynamicStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={dynamicStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Welcome Back</Text>
          <Text style={dynamicStyles.subtitle}>
            {step === 'email' 
              ? 'Sign in to your account' 
              : 'Enter the OTP sent to your email'}
          </Text>
        </View>

        <View style={dynamicStyles.form}>
          {step === 'email' ? (
            <>
              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Email Address</Text>
                <View style={dynamicStyles.inputWrapper}>
                  <Mail size={20} color={colors.iconColor} />
                  <TextInput
                    style={dynamicStyles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[dynamicStyles.button, isLoading && dynamicStyles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={dynamicStyles.buttonText}>Continue</Text>
                    <ArrowRight size={20} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={dynamicStyles.otpInfo}>
                <Text style={dynamicStyles.otpInfoText}>
                  We&apos;ve sent a 6-digit code to {email}
                </Text>
              </View>

              <View style={dynamicStyles.inputContainer}>
                <Text style={dynamicStyles.label}>Enter OTP</Text>
                <View style={dynamicStyles.inputWrapper}>
                  <Lock size={20} color={colors.iconColor} />
                  <TextInput
                    style={dynamicStyles.input}
                    placeholder="000000"
                    placeholderTextColor={colors.textSecondary}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[dynamicStyles.button, isLoading && dynamicStyles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={dynamicStyles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={dynamicStyles.secondaryButton}
                onPress={handleResendOTP}
                disabled={isLoading}
              >
                <Text style={dynamicStyles.secondaryButtonText}>Resend OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={dynamicStyles.secondaryButton}
                onPress={() => setStep('email')}
                disabled={isLoading}
              >
                <Text style={dynamicStyles.secondaryButtonText}>Change Email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={dynamicStyles.footer}>
          <Text style={dynamicStyles.footerText}>
            Don&apos;t have an account?{' '}
            <Text
              style={dynamicStyles.footerLink}
              onPress={() => router.push('/signup')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
