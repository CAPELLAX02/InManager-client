import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FormField from '../../components/FormField';
import Animation from '../../components/Animantion';
import CustomButton from '../../components/CustomButton';
import { StatusBar } from 'expo-status-bar';
// https://bbb-mobil-backend.onrender.com/api

const IssueFormModal = () => {
  const { userAddress } = useLocalSearchParams();
  // console.log(userAddress);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');

  const clearForm = () => {
    setTitle('');
    setCode('');
    setImage(null);
    setImageName('');
    setDescription('');
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Kameranın açılması için izin vermeniz gerekmektedir.');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      // setPhotoLoading(true);
      const asset = pickerResult.assets[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300 } }],
        { format: 'jpeg' }
      );
      setImage(resizedImage.uri);
      // setPhotoLoading(false);
      let imageName = asset.uri.split('/').pop();
      setImageName(imageName);
    }
  };

  const uploadPhoto = async (photo) => {
    console.log('Received photo object:', photo); // Fotoğraf objesini logla
    if (!photo || !photo.uri) {
      console.log('No photo or photo URI is undefined');
      return; // Fotoğraf yoksa veya URI tanımlı değilse işlemi durdur
    }

    const formData = new FormData();
    formData.append('image', {
      uri: photo.uri,
      type: 'image/jpeg', // Fotoğrafın MIME tipi
      name: 'photo.jpg', // Fotoğrafın dosya adı
    });

    const userToken = await SecureStore.getItemAsync('regularUserToken');

    try {
      const response = await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Bu kısmı değiştirdim
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data.imagePath; // Yüklenen fotoğrafın URL'sini döndür
    } catch (error) {
      console.error('Error uploading photo: ', error);
      console.error('Error uploading photo: ', error.message);
      console.log(error.stack);
      return null; // Hata durumunda null döndür
    }
  };

  const submitForm = async () => {
    if (!title.trim() || !image) {
      Alert.alert('İşlem Başarısız.', 'Lütfen gerekli alanları doldurun.', [
        { text: 'Tamam' },
      ]);
      return;
    }

    setLoading(true);
    try {
      const photoUrl = await uploadPhoto({
        uri: image,
        type: 'image/jpeg',
        name: imageName,
      });
      if (!photoUrl) {
        Alert.alert('Fotoğraf yüklenirken bir hata oluştu.');
        setLoading(false);
        return;
      }

      const issueData = {
        title,
        code,
        description,
        image: photoUrl,
        address: userAddress,
      };

      const userToken = await SecureStore.getItemAsync('regularUserToken');

      console.log(title);
      console.log(code);
      console.log(description);

      await axios.post(
        `https://bbb-mobil-backend.onrender.com/api/issues`,
        issueData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      Alert.alert(
        'Sorun Bildirildi!',
        'Bildirdiğin sorun ile en kısa zaman içerisinde ilgileneceğiz.',
        [{ text: 'Tamam' }]
      );
      clearForm();
      router.push('issues');
    } catch (error) {
      console.error('Sorunu kaydederken bir hata oluştu: ', error);
      Alert.alert('Bir hata oluştu.', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-[#9ae5d2] h-full'>
      <ScrollView>
        <View className='w-full h-full justify-center'>
          <FormField
            otherStyles='w-[92vw] self-center'
            placeholder='Sorunun başlığı'
            value={title}
            handleChangeText={(text) => setTitle(text)}
          />

          <FormField
            otherStyles='w-[92vw] self-center'
            placeholder='Sorun ne ile ilgili?'
            value={code}
            handleChangeText={(code) => setCode(code)}
          />

          <TouchableOpacity
            className='flex-row justify-center items-center self-center px-4 py-3 m-5 w-[72vw] rounded-xl bg-[#28288a]'
            onPress={pickImage}
          >
            <MaterialCommunityIcons
              style={{ paddingEnd: 12 }}
              name='camera-marker-outline'
              size={24}
              color='#fff'
            />
            <Text className='text-white text-center text-md font-psemibold'>
              {image ? 'Tekrar Fotoğraf Çek' : 'Sorunun Fotoğrafını Çek'}
            </Text>
          </TouchableOpacity>

          <View className='w-[40vw] h-[220px] bg-[#eee] m-1 rounded-xl justify-center items-center self-center'>
            {image ? (
              <Image
                resizeMode='cover'
                source={{ uri: image }}
                style={styles.image}
              />
            ) : (
              <Text style={styles.previewText}>
                Sorunun fotoğrafını çektiğinizde bu alanda görebileceksiniz.
              </Text>
            )}
          </View>

          <FormField
            otherStyles='w-[92vw] self-center'
            placeholder='Sorunu detaylandır'
            value={description}
            handleChangeText={(description) => setDescription(description)}
            multiline
          />

          <CustomButton
            title='Sorunu Bildir'
            handlePress={submitForm}
            containerStyles='mt-6 bg-primary w-[50vw] self-center'
            textStyles='text-white'
            isLoading={loading}
          />
        </View>
        <StatusBar style='dark' />
      </ScrollView>
    </SafeAreaView>
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 30,
    ...sharedShadowStyles,
  },
  badge: {
    width: 32,
    height: 32,
    // borderRadius: 40,
    // backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    fontSize: 17,
    fontWeight: 'bold',
    // color: Colors.dark,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    // fontSize: 14,
    padding: 8,
    borderRadius: 30,
    width: '90%',
    fontFamily: 'Poppins-Regular',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.red,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    width: '76%',
    alignSelf: 'center',
    borderRadius: 30,
    ...sharedShadowStyles,
  },
  cameraText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  previewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 220,
    borderRadius: 12,
    margin: 8,
    // backgroundColor: Colors.lightblue,
    ...sharedShadowStyles,
  },
  previewText: {
    fontSize: 12,
    color: '#0a2e5c',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    padding: 10,
  },
  textArea: {
    backgroundColor: '#fff',
    marginTop: 4,
    padding: 8,
    borderRadius: 10,
    fontSize: 14,
    width: '90%',
    fontFamily: 'Poppins-Regular',
  },
  submitButton: {
    // backgroundColor: Colors.dark,
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 10,
    width: '50%',
    ...sharedShadowStyles,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },

  closeButton: {
    backgroundColor: '#333',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    width: '32%',
    alignSelf: 'center',
    ...sharedShadowStyles,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});

export default IssueFormModal;
