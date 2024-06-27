import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const CustomHeader = () => {
  return (
    <View className='d-flex flex-row bg-[#28288a] h-[17.5vh] justify-center items-center'>
      <Image
        style={{ resizeMode: 'contain' }}
        className='w-[100px] justify-center items-center self-center object-contain mt-8'
        source={require('../assets/logo.png')}
      />
      <Text className='text-3xl text-white text-center font-pbold self-center justify-center items-center mt-12'>
        {' '}
        mobil
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // logoText: {
  //   fontSize: 36,
  //   color: '#fff',
  //   fontFamily: 'pop-b',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   marginTop: 32,
  // },
});

export default CustomHeader;
