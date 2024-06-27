import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { icons } from '../constants';

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  autoCapitalize,
  keyboardType,
  multiline,
  maxLength,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-2-y ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>

      <View className='w-full h-10 px-4 bg-white rounded-lg focus:border-secondary items-center flex-row'>
        <TextInput
          className='flex-1 text-primary font-psemibold'
          value={value}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor='#999999'
          onChangeText={handleChangeText}
          secureTextEntry={title == 'Password' && !showPassword}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          maxLength={maxLength}
        />

        {(placeholder === 'Şifreniz' ||
          placeholder === 'Yeni Şifreniz' ||
          placeholder === 'Yeni Şifreniz (Tekrar)' ||
          placeholder === 'Şifreniz (Tekrar)') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className='w-6 h-6'
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
