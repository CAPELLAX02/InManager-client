import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import Background from '../components/Background';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <Background source={require('../assets/images/balikesir.jpg')}>
      {/* <SafeAreaView className='bg-[#202060] h-full'> */}
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <LinearGradient
          colors={['#000000', '#00000099', '#00000099', '#000000']}
          className='absolute left-0 right-0 top-0 bottom-0 h-full'
        />
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <View className='flex-row items-center gap-2'>
            <Image
              source={images.logo2}
              className='w-[140px] h-[90px]'
              resizeMode='contain'
            />
            <Text className='text-white text-center text-4xl font-pbold pt-5'>
              mobil
            </Text>
          </View>
          {/* <Image
            source={images.balikesir}
            className='max-w-[380px] w-full h-[220px]'
            resizeMode='contain'
          /> */}
          <View className='relative mt-3'>
            <Text className='text-2xl text-white font-pbold text-center'>
              Kuvayi Milliye Şehri Balıkesir'imizin sorunlarını{' '}
              <Text className='text-[#ffc700]'>birlikte</Text> çözelim.
            </Text>
          </View>

          <Text className='text-sm font-pregular text-gray-100 mt-3 text-center'>
            Where creativity meets innovation: embark on a journey with BBB
            Mobil.
          </Text>

          <CustomButton
            title='Devam Et'
            handlePress={() => router.replace('/sign-in')}
            containerStyles='w-full mt-5 bg-[#ffc700]'
            textStyles='text-lg'
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#000' style='light' />
      {/* </SafeAreaView> */}
    </Background>
  );
}
