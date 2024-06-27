import LottieView from 'lottie-react-native';
import { View } from 'react-native';

const Animation = ({ src, style }) => {
  return (
    <View className='justify-center items-center my-2'>
      <LottieView autoPlay style={style} source={src} />
    </View>
  );
};

export default Animation;
