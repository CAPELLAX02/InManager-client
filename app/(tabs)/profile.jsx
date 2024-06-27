import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
// https://bbb-mobil-backend.onrender.com/api
import * as Network from 'expo-network';
import { router } from 'expo-router';
import Background from '../../components/Background';

const fonksiyon = async () => {
  output = await Network.getIpAddressAsync();
  console.log(output);
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { signOut, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fonksiyon();
    const fetchUserData = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const userToken = await SecureStore.getItemAsync('regularUserToken');

          const config = {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          };

          const response = await axios.get(
            `https://bbb-mobil-backend.onrender.com/api/users/profile`,
            config
          );

          // API'den dönen veriyi kullanarak state güncelleme
          const { name, surname, phone, email } = response.data;
          setName(name);
          setSurname(surname);
          setPhone(phone);
          setEmail(email);

          setLoading(false);
        } catch (error) {
          console.log('221324');
          setLoading(false);
          console.log(error.message);
          // Hata yönetimi...
          Alert.alert('AAA');
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const handleSignOut = () => {
    setSignOutLoading(true);
    setTimeout(async () => {
      try {
        // await axios.post(`${BASE_ENDPOINT}/users/logout`);
        signOut();
        setSignOutLoading(false);
        router.replace('sign-in');
      } catch (error) {
        setSignOutLoading(false);
        console.error('Error occurred while signing out:', error.message);
        // Handle error, if any
        Alert.alert(
          'İşlem Başarısız',
          'Çıkış yaparken beklenmedik bir hata meydana geldi.',
          [{ text: 'Tamam' }]
        );
      }
    }, 500);
  };

  return (
    // <SafeAreaView className='bg-[#7de4e8] h-full'>
    <Background source={require('../../assets/bg.png')}>
      <ScrollView>
        <View className='w-full h-full justify-between px-6'>
          {loading ? (
            <ActivityIndicator
              size={40}
              color='#161622'
              style={{ marginVertical: 50 }}
            />
          ) : (
            <>
              <View className='d-flex justify-center items-center mb-6'>
                <Text className='text-xl font-pbold'>
                  Birlikte 12 Sorunu Çözdük!
                </Text>
              </View>
              <View className='flex-row bg-white p-2 rounded-lg mb-4'>
                <Text className='me-3 pl-1 text-md font-psemibold'>İsim: </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className='d-flex text-md text-[#666] font-pregular'
                />
              </View>
              <View className='flex-row bg-white p-2 rounded-lg mb-4'>
                <Text className='me-3 pl-1 text-md font-psemibold'>
                  Soyisim:{' '}
                </Text>
                <TextInput
                  value={surname}
                  onChangeText={setSurname}
                  className='d-flex text-md text-[#666] font-pregular'
                />
              </View>
              <View className='flex-row bg-white p-2 rounded-lg mb-4'>
                <Text className='me-3 pl-1 text-md font-psemibold'>
                  Telefon:{' '}
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  className='d-flex text-md text-[#666] font-pregular'
                />
              </View>
              <View className='flex-row bg-white p-2 rounded-lg mb-4'>
                <Text className='me-3 pl-1 text-md font-psemibold'>
                  E-Posta:{' '}
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  className='d-flex text-md text-[#666] font-pregular'
                />
              </View>
            </>
          )}
          {signOutLoading ? (
            <ActivityIndicator
              size={42}
              color='#191922'
              style={{ marginVertical: 20 }}
            />
          ) : (
            <TouchableOpacity
              className='flex-row bg-primary justify-center items-center self-center m-3 px-7 py-3 rounded-lg'
              onPress={handleSignOut}
            >
              <MaterialCommunityIcons
                name='logout'
                size={26}
                color='#fff'
                style={{ marginRight: 10 }}
              />
              <Text
                className='text-white text-[16px] font-pbold'
                onPress={handleSignOut}
              >
                Çıkış Yap
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Background>
    // </SafeAreaView>
  );
};

const sharedShadowStyles = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    width: '100%', // Tüm genişliği kullan
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 26,
    // backgroundColor: '#c9e77e',
    backgroundColor: '#eee',
    paddingVertical: 6,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...sharedShadowStyles,
  },
  infoLabel: {
    marginRight: 10,
    paddingLeft: 6,
    fontSize: 15,

    fontFamily: 'pop-sb',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#666',

    fontFamily: 'pop',
  },
  editModeText: {
    margin: 7,
    color: '#555',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  editButton: {
    backgroundColor: '#1250a1',
    padding: 14,
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    width: '75%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'pop-b',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  editableInput: {
    // burada düzenleme modunda olunca textInput'un sahip olmasını istediğiniz stilleri tanımlayabilirsiniz.
    color: '#777',
    fontSize: 16,
    fontFamily: 'pop',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 14,
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    width: '75%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
});

export default Profile;
