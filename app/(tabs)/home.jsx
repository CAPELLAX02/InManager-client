import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import IssueFormModal from '../modals/IssueFormModal';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Background from '../../components/Background';
// https://bbb-mobil-backend.onrender.com/api

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [locationError, setLocationError] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false); => modal mekanizması expo-router modal larıyla yapılacak!
  const [userName, setUserName] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) {
      return 'İyi geceler';
    } else if (hour < 12) {
      return 'Günaydın';
    } else if (hour < 18) {
      return 'Merhaba';
    } else {
      return 'İyi akşamlar';
    }
  };

  const fetchUserName = async () => {
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

      setUserName(response.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  // const toggleModal = () => {
  //   setModalVisible(!modalVisible);
  // };

  const fetchUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('İzin Hatası.', 'Konum izni reddedildi.');
      setLocationError(true);
      return;
    }
    let location;
    try {
      location = await Location.getCurrentPositionAsync({});
      setLocationError(false);
    } catch (error) {
      Alert.alert(
        'Konum Hatası!',
        'Konum bilgisi alınamadı. Lütfen konum izinlerini kontrol edin.',
        [{ text: 'Tamam' }]
      );
      setLocationError(true);
      return;
    }
    const { latitude, longitude } = location.coords;
    setUserLocation({ latitude, longitude });

    let address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address && address.length > 0) {
      setUserAddress(
        `${address[0].subregion}, ${address[0].district} Mahallesi, ${address[0].street}, ${address[0].name}`
      );
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchUserLocation();
  }, []);

  return (
    <Background source={require('../../assets/bg.png')}>
      <ScrollView>
        <View className='w-full justify-between h-full px-4'>
          <Text className='text-lg text-center font-pbold'>{`${getGreeting()} ${userName}!`}</Text>
          {/* "user?.name" => "user && user.name ? user.name : null" ternary operatörünün kısaltılmış halidir. */}
          <>
            <View style={styles.mapContainer} className='w-[90vw] self-center'>
              {userLocation ? (
                <MapView
                  // customMapStyle={customStyle}
                  // onMapReady={fetchUserLocation}
                  style={styles.map}
                  region={{
                    latitude: userLocation ? userLocation.latitude : 39.6492,
                    longitude: userLocation ? userLocation.longitude : 27.8861,
                    latitudeDelta: 0.0015,
                    longitudeDelta: 0.0015,
                  }}
                >
                  {userLocation && (
                    <Marker
                      coordinate={userLocation}
                      title='Şu anki konumunuz'
                      description={userAddress}
                    />
                  )}
                </MapView>
              ) : (
                <View className='d-flex h-full justify-center items-center bg-white'>
                  <Text className='text-md text-center px-4 font-pregular'>
                    Konum bilginiz alındığında harita üzerindeki konumuzunu
                    görebileceksiniz.
                  </Text>
                </View>
              )}
            </View>

            <View
              className='p-3 self-center bg-white rounded-md my-2 w-[90vw]'
              style={{ ...sharedShadowStyles }}
            >
              <Text className='text-[12px] font-pregular'>
                {userAddress
                  ? userAddress
                  : locationError
                  ? 'Konum bilgisine şu anda erişilemiyor. Konum servislerinizin aktif olduğundan emin olun.'
                  : 'Konum bilgisi yükleniyor...'}
              </Text>
            </View>

            {/* <TouchableOpacity
              onPress={() => {
                if (!userLocation) {
                  Alert.alert(
                    'Konum bilgisi alınamadı.',
                    'Sorun bildirmek için konumunuza erişmemiz gerekiyor.',
                    [{ text: 'Tamam' }]
                  );
                } else {
                  const { userAddress } = userAddress;
                  router.push({
                    pathname: '/issue-form-modal',
                    query: { userAddress: '123 Main St' },
                  });
                }
              }}
            >
              <View className='d-flex bg-primary justify-center items-center self-center w-[50vw] h-[50px] my-3 rounded-lg'>
                <Text className='text-lg text-white font-pbold'>
                  Sorun Bildir
                </Text>
              </View>
            </TouchableOpacity> */}

            <View className='d-flex bg-[#28288a] justify-center items-center self-center w-[50vw] h-[50px] my-3 rounded-lg'>
              <Link
                href={{
                  pathname: '/(modals)/issue-form-modal',
                  params: { userAddress },
                }}
              >
                <Text className={`text-white font-pbold text-lg`}>
                  Sorun Bildir
                </Text>
              </Link>
            </View>
          </>
        </View>
      </ScrollView>
    </Background>
  );
};

const sharedShadowStyles = {
  shadowColor: '#000',
  shadowOffset: {
    width: 1,
    height: 2,
  },
  shadowOpacity: 0.16,
  shadowRadius: 1.5,
  elevation: 3.1,
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 320,
    borderRadius: 8,
    margin: 12,
    overflow: 'hidden',
    ...sharedShadowStyles,
  },
  map: {
    flex: 1,
    height: 320,
  },
});

export default Home;
