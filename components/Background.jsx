import { ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Background = ({ children, source }) => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}
      source={source}
      resizeMode='cover'
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Background;
