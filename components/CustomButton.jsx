import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-lg min-h-[52px] justify-center items-center ${containerStyles}`}
    >
      {isLoading ? (
        <ActivityIndicator size={30} color='#fff' />
      ) : (
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
