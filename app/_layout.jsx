import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { SplashScreen, Stack, Redirect, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

// RootLayout'u AuthProvider içine al
const App = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const { isAuthenticated } = useAuth();

  // const triggerIsAuthenticated = () => {
  //   if (!isAuthenticated) {
  //     router.replace('sign-in');
  //   } else {
  //     return;
  //   }
  // };

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
    // triggerIsAuthenticated();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  // Kullanıcı kimlik doğrulaması geçmişse uygulama içeriğini göster
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='(modals)/issue-form-modal'
        options={{
          title: 'Sorun Bildir',
          presentation: 'modal',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
          },
        }}
      />
      <Stack.Screen
        name='(modals)/forgot-password-modal'
        options={{
          title: 'Şifrenizi Sıfırlayın',
          presentation: 'modal',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
          },
        }}
      />
      <Stack.Screen
        name='(modals)/verification-modal'
        options={{
          title: 'E-postanızı Onaylayın',
          presentation: 'modal',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
          },
        }}
      />
    </Stack>
  );
};

export default App;
