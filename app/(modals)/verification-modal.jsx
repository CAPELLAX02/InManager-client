import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const VerificationModal = () => {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { email } = useLocalSearchParams();

  const handleVerificationCodeSubmit = async () => {
    setLoading(true);
    console.log('Gönderilen email: ', email);
    console.log('Gönderilen verification code: ', verificationCode);
    try {
      await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/users/verify-email`,
        {
          email,
          verificationCode,
        }
      );
      Alert.alert(
        'Başarılı!',
        'E-posta adresiniz başarıyla doğrulandı. Hesabınıza giriş yapabilirsiniz.',
        [{ text: 'Tamam' }]
      );
      router.replace('sign-in');
    } catch (error) {
      console.log('email verification error message:', error.message);
      Alert.alert(
        'Doğrulama Hatası',
        error.response?.data?.message ||
          (error.response
            ? `Hata: ${error.response.status} - ${error.response.statusText}`
            : 'Doğrulama kodu hatalı veya süresi dolmuş.')
      );
    } finally {
      setLoading(false);
      clearInputs();
    }
  };

  const clearInputs = () => {
    setVerificationCode('');
  };

  const sendVerificationCodeAgain = async () => {
    try {
      console.log('(resend-verification-code) Gönderilen email:', email);
      await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/users/resend-verification-code`,
        { email }
      );
      Alert.alert(
        'İşlem Başarılı.',
        'Onay kodu tekrar gönderildi. Gelen kutunuzu kontrol edin.',
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      console.log(
        'send verification code again - error: ',
        error.response
          ? `${error.response.status} - ${error.response.statusText}`
          : error.message
      );
      Alert.alert(
        'İşlem Başarısız.',
        error.response && error.response.data && error.response.data.message
          ? `Hata: ${error.response.data.message}`
          : 'Onay kodu gönderilirken bir hata meydana geldi.',
        [{ text: 'Tamam' }]
      );
    }
  };

  return (
    <SafeAreaView className='bg-[#7de4e8] h-full'>
      <ScrollView>
        <View className='w-full h-full justify-center px-4'>
          <Text className='text-center text-[16px] pt-2 font-psemibold'>
            <Text className='text-[#666]'>{email}</Text> adresine gönderilen 6
            haneli onay kodunu girin:
          </Text>

          <FormField
            maxLength={6}
            value={verificationCode}
            handleChangeText={setVerificationCode}
            keyboardType='number-pad'
            otherStyles='w-[36%] self-center'
          />

          <CustomButton
            title='Kayıt İşlemini Tamamla'
            handlePress={handleVerificationCodeSubmit}
            containerStyles='w-[80%] bg-primary self-center mt-8'
            textStyles='text-white text-[16px]'
          />

          <CustomButton
            title='Kodu Tekrar Gönder'
            handlePress={sendVerificationCodeAgain}
            containerStyles='w-[80%] self-center mt-4'
            textStyles='text-primary text-[14px]'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationModal;
