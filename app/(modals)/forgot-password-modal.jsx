import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import Animation from '../../components/Animantion';
// https://bbb-mobil-backend.onrender.com/api

const ForgotPasswordModal = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetPasswordCode, setResetPasswordCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const closeModalAndClearStates = () => {
    setStep(1);
    setEmail('');
    setNewPassword('');
    setConfirmNewPassword('');
    setLoading(false);
    router.back();
  };

  const handleSendCode = async () => {
    if (email.trim() === '') {
      Alert.alert(
        'İşlem Başarısız.',
        'Lütfen geçerli bir e-posta adresi girin.',
        [{ text: 'Tamam' }]
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/users/forgot-password`,
        { email }
      );
      Alert.alert(
        'Başarılı!',
        `Sıfırlama kodu ${email} adresine gönderildi. Lütfen gelen kutusunu kontrol edin.`,
        [{ text: 'Tamam' }]
      );
      setStep(2);
    } catch (error) {
      Alert.alert(
        'İşlem Başarısız.',
        'Şifre sıfırlama kodu gönderilirken bir hata meydana geldi',
        [{ text: 'Tamam' }]
      );
      console.log('send reset password code error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('İşlem Başarısız.', 'Şifreler eşleşmiyor.', [
        { text: 'Tamam' },
      ]);
      return;
    }
    if (
      resetPasswordCode.trim() === 0 ||
      newPassword.trim() === 0 ||
      confirmNewPassword.trim() === 0
    ) {
      Alert.alert(
        'İşlem Başarısız.',
        'Lütfen gerekli alanların tamamını doldurun.',
        [{ text: 'Tamam' }]
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/users/reset-password`,
        {
          email,
          resetPasswordCode,
          newPassword,
        }
      );
      Alert.alert(
        'Başarılı!',
        'Şifreniz başarılı bir şekilde sıfırlandı. Yeni şifreniz ile giriş yapabilirsiniz.',
        [{ text: 'Tamam', onPress: router.replace('sign-in') }]
      );
    } catch (error) {
      Alert.alert(
        'İşlem Başarısız.',
        'Şifre sıfırlama işlemi sırasında beklenmedik bir hata meydana geldi.',
        [{ text: 'Tamam' }]
      );
      console.log('reset password error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-[#7de4e8] h-full'>
      <ScrollView>
        <View className='w-full h-full justify-center'>
          {step === 1 && (
            <>
              <Text className='text-center text-lg pt-2 font-psemibold'>
                E-posta Adresinizi Girin
              </Text>

              <FormField
                placeholder='Email Adresiniz'
                otherStyles='w-[90%] self-center'
                value={email}
                handleChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />

              <TouchableOpacity
                className='w-[50%] p-3 mt-6 bg-primary rounded-lg self-center'
                onPress={handleSendCode}
                disabled={loading}
              >
                <Text className='text-center text-white text-[16px] font-psemibold'>
                  {loading ? (
                    <ActivityIndicator
                      color='#fff'
                      size={24}
                      style={{ paddingVertical: 4 }}
                    />
                  ) : (
                    'Devam Et'
                  )}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {step === 2 && (
            <>
              <Animation
                style={{ width: 100, height: 100 }}
                src={require('../../assets/unlock.json')}
              />

              <Text className='text-center text-lg font-psemibold'>
                Şifre Sıfırlama Bilgilerini Girin
              </Text>

              <FormField
                placeholder='Sıfırlama Kodu'
                otherStyles='w-[90%] self-center'
                value={resetPasswordCode}
                handleChangeText={setResetPasswordCode}
                keyboardType='number-pad'
                maxLength={6}
              />

              <FormField
                placeholder='Yeni Şifreniz'
                otherStyles='w-[90%] self-center'
                value={newPassword}
                handleChangeText={setNewPassword}
              />

              <FormField
                placeholder='Yeni Şifreniz (Tekrar)'
                otherStyles='w-[90%] self-center'
                value={confirmNewPassword}
                handleChangeText={setConfirmNewPassword}
              />

              <TouchableOpacity
                className='w-[50%] p-3 mt-7 bg-primary rounded-lg self-center'
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text className='text-center text-white text-[16px] font-psemibold'>
                  {loading ? (
                    <ActivityIndicator
                      color='#fff'
                      size={24}
                      style={{ paddingVertical: 4 }}
                    />
                  ) : (
                    'Şifreyi Sıfırla'
                  )}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            className='self-center mt-4'
            onPress={closeModalAndClearStates}
          >
            <Text className='text-primary text-center text-[14px] font-psemibold'>
              Vazgeç
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı saydam siyah arka plan
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    // color: Colors.dark,
  },
  modalInput: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    // borderColor: Colors.lightpurple,
    width: 300,
    fontSize: 16,
    // color: Colors.dark,
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 14,
    width: '100%',
    marginTop: 20,
  },
  buttonConfirm: {
    // backgroundColor: Colors.dark, // Onay butonu rengi
  },
  buttonCancel: {
    // backgroundColor: Colors.red, // İptal butonu rengi
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default ForgotPasswordModal;
