import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import Animation from '../../components/Animantion';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
('expo-secure-store');
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Background from '../../components/Background';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
// https://bbb-mobil-backend.onrender.com/api

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // useEffect(() => {
  //   setEmail('');
  //   setPassword('');
  // });

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useContext(AuthContext);

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.log('Failed to get push token for push notification.');
    }

    return token;
  };

  const sendPushTokenToServer = async (token) => {
    const userToken = await SecureStore.getItemAsync('regularUserToken');
    try {
      await axios.put(
        `https://bbb-mobil-backend.onrender.com/api/users/push-token`,
        {
          pushToken: token,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log('Push token successfully sent to the server');
    } catch (error) {
      console.error('Error sending push token to server:', error);
      // Alert.alert('Error', 'Could not send push token to server.');
    }
  };

  const handleSignIn = async () => {
    console.log(1);
    setIsSubmitting(true);
    if (!email || !password) {
      Alert.alert('Giriş Başarısız.', 'Lütfen gerekli alanları doldurun.', [
        { text: 'Tamam' },
      ]);
      setIsSubmitting(false);
      return;
    }
    console.log(2);
    try {
      console.log(3);
      const response = await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/users/auth`,
        {
          email,
          password,
        }
      );
      console.log(4);

      const { regularUserToken } = response.data;
      console.log(5);
      if (regularUserToken) {
        console.log(6);
        await signIn(regularUserToken);
        console.log(7);
        // const token = await registerForPushNotificationsAsync();
        // console.log(8);
        // if (token) {
        //   console.log(9);
        //   try {
        //     console.log(10);
        //     // await sendPushTokenToServer(token);
        //     console.log(11);
        //   } catch (error) {
        //     console.log('sendPushTokenToServer çalışmıyor.', error);
        //   }
        // } else {
        //   console.log('push token alınamadı.');
        // }
        setEmail('');
        setPassword('');
        setIsSubmitting(false);
        router.replace('home');
        Alert.alert('Giriş Başarılı!', 'Hoş Geldiniz!', [
          { text: 'Hoş Bulduk' },
        ]);
      } else {
        setIsSubmitting(false);
        Alert.alert('Giriş Başarısız.', 'Lütfen daha sonra tekrar deneyiniz.', [
          { text: 'Tamam' },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Giriş Başarısız.',
        'Lütfen bilgilerinizi kontrol edip tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
      setIsSubmitting(false);
      console.log('giriş yapma axios requestinde sorun var.', error);
    }
  };

  return (
    <SafeAreaView className='h-full bg-[#7de4e8]'>
      <LinearGradient
        colors={['#f9ecf5', '#7de4e8']}
        className='absolute left-0 right-0 top-0 bottom-0 h-full'
      />
      <ScrollView>
        <View className='w-full justify-center min-h-[83vh] px-4'>
          <Animation
            style={{ width: 200, height: 200 }}
            src={require('../../assets/login.json')}
          />

          <Text className='text-2xl text-primary text-semibold font-psemibold mt-3 text-center'>
            Tekrar Hoş Geldiniz!
          </Text>

          <FormField
            placeholder='Email Adresiniz'
            value={email}
            handleChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <FormField
            placeholder='Şifreniz'
            value={password}
            handleChangeText={setPassword}
          />

          <CustomButton
            title='Giriş Yap'
            handlePress={handleSignIn}
            containerStyles='mt-7 bg-[#ad1f8a]'
            isLoading={isSubmitting}
            textStyles='text-white'
          />

          <Link
            className='self-center pt-3'
            href='(modals)/forgot-password-modal'
            onPress={clearInputs}
          >
            <Text className='text-[14px] text-primary text-center font-psemibold underline'>
              Şifremi Unuttum
            </Text>
          </Link>

          <View className='justify-center pt-5 flex-column gap-2'>
            <Text className='text-lg text-primary text-center pt-5 font-psemibold'>
              Henüz aramıza katılmadın mı?
            </Text>
            <TouchableOpacity
              disabled={isSubmitting}
              className='rounded-lg min-h-[52px] justify-center items-center bg-[#1b1b31]'
              onPressOut={clearInputs}
              onPress={() => router.push('sign-up')}
            >
              <Text className='text-white text-center text-lg font-psemibold'>
                Kayıt Ol
              </Text>
            </TouchableOpacity>
            {/* <Link
              href='/sign-up'
              className='text-white bg-[#4747d1] rounded-xl text-sm p-4 mt-7 text-center'
              onPress={clearInputs}
            >
              <Text className={`text-white font-psemibold text-lg`}>
                Kayıt Ol
              </Text>
            </Link> */}
          </View>
          <StatusBar style='dark' />
        </View>
      </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

export default SignIn;
