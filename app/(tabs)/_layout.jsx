import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { icons } from '../../constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { StatusBar } from 'expo-status-bar';

const TabIcon = ({ iconName, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      <MaterialCommunityIcons name={iconName} size={25} color={color} />
      <Text
        style={{
          fontFamily: focused ? 'Poppins-Bold' : 'Poppins-SemiBold',
          fontSize: 12,
          color: color,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#28288a',

          tabBarStyle: {
            backgroundColor: '#f4f4f4',
            borderTopWidth: 8,
            borderTopColor: '#f4f4f4',
            height: 75,
          },
        }}
      >
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profil',
            header: () => <CustomHeader title='Profil' />,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? 'account-circle' : 'account-circle-outline'}
                color={color}
                name='Profil'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='home'
          options={{
            title: 'Anasayfa',
            header: () => <CustomHeader title='Anasayfa' />,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? 'home-circle' : 'home-circle-outline'}
                color={color}
                name='Anasayfa'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='issues'
          options={{
            title: 'Sorunlar',
            header: () => <CustomHeader title='Sorunlar' />,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={
                  focused ? 'alert-circle-check' : 'alert-circle-check-outline'
                }
                color={color}
                name='Sorunlar'
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar style='light' />
    </>
  );
};

export default TabsLayout;
