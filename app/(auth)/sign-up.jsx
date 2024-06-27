import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
// https://bbb-mobil-backend.onrender.com/api

const SignUp = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isStrongPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    return regex.test(password);
  };

  const clearInputs = () => {
    setName('');
    setSurname('');
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handlePhoneChange = (input) => {
    let cleaned = ('' + input).replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      const formattedNumber =
        '0' + match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4];
      setPhone(formattedNumber);
    } else {
      setPhone(input);
    }
  };

  const handleSignUp = async () => {
    if (
      name === '' ||
      surname === '' ||
      phone === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      Alert.alert(
        'Kayıt Başarısız.',
        'Lütfen gerekli alanların tamamını doldurun.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'İşlem Başarısız.',
        'Şifreler eşleşmiyor, lütfen tekrar deneyiniz.'
      );
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        'Şifreniz Zayıf.',
        'Şifreniz en az 8 karakter uzunluğunda olmalı; en az birer tane büyük harf, küçük harf, rakam ile özel karakter içermelidir.'
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post(`https://bbb-mobil-backend.onrender.com/api/users`, {
        name,
        surname,
        phone,
        email,
        password,
      });

      setLoading(false);

      router.push({
        pathname: '(modals)/verification-modal',
        params: {
          email,
        },
      });
    } catch (error) {
      console.error(error.response || error.toJSON());
      Alert.alert(
        'Kayıt Hatası',
        error.response?.data?.message ||
          'Kayıt işlemi sırasında bir hata oluştu.'
      );
      signUpFlag = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-[#7de4e8] h-full'>
      <ScrollView>
        <View className='w-full justify-center h-full px-4 mt-3'>
          {/* <Image
            className='w-[115px] h-[35px]'
            source={images.logo2}
            resizeMode='contain'
          /> */}
          <Text className='text-xl text-primary mt-10 font-pbold text-center'>
            Hemen Aramıza Katıl!
          </Text>

          <FormField
            placeholder='Adınız'
            value={name}
            handleChangeText={setName}
          />

          <FormField
            placeholder='Soyadınız'
            value={surname}
            handleChangeText={setSurname}
          />

          <FormField
            placeholder='Telefon Numaranız'
            value={phone}
            handleChangeText={handlePhoneChange}
            keyboardType='phone-pad'
            maxLength={14}
          />

          <FormField
            placeholder='E-posta Adresiniz'
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

          <FormField
            placeholder='Şifreniz (Tekrar)'
            value={confirmPassword}
            handleChangeText={setConfirmPassword}
          />

          <CustomButton
            title='Kayıt Ol'
            handlePress={handleSignUp}
            containerStyles='mt-7 bg-primary w-[70%] self-center'
            isLoading={loading}
            textStyles='text-white'
          />

          <View className='justify-center pt-5 flex-row mt-3 mb-6 d-flex flex-col items-center'>
            <Text className='text-[16px] text-primary font-pregular'>
              Zaten bir hesabın var mı?
            </Text>
            <Link
              href='/sign-in'
              className='text-[16px] font-psemibold text-primary underline'
            >
              Giriş Yap
            </Link>
          </View>
        </View>
        <StatusBar style='dark' />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
