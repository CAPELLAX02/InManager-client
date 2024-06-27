import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Background from '../../components/Background';

const Issues = () => {
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('regularUserToken');
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };
        const { data } = await axios.get(
          `https://bbb-mobil-backend.onrender.com/api/issues/myissues`,
          config
        );
        setIssues(data.userIssues);
      } catch (error) {
        console.error('Fetch issues error: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'solved':
        return { backgroundColor: '#8cf2b5' };
      case 'unsolved':
        return { backgroundColor: '#fad1d1' };
      default: // case 'pending'
        return { backgroundColor: '#fff0d6' };
    }
  };

  if (loading) {
    return (
      <Background source={require('../../assets/bg.png')}>
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size={42}
          color='#191922'
        />
      </Background>
    );
  }

  if (issues.length === 0) {
    return (
      <Background source={require('../../assets/bg.png')}>
        <View className='m-6' style={styles.noContentContainer}>
          <Text
            className='text-center text-[15px] text-primary font-psemibold'
            style={styles.noContentText}
          >
            Henüz bir sorun bildirmediniz. Bildirdiğinizde son durum bilgisiyle
            beraber burada görebileceksiniz.
          </Text>
        </View>
      </Background>
    );
  }

  return (
    // // <SafeAreaView className='bg-[#7de4e8]' style={styles.fullContainer}>
    <Background source={require('../../assets/bg.png')}>
      <FlatList
        data={issues}
        extraData={issues}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.issueContainer}>
              <Text style={styles.issueTitle}>{item.title}</Text>
              <Image
                source={{ uri: item.image.replace(/\\/g, '/') }}
                style={styles.issueImage}
              />
              <Text style={styles.issueDescription}>{item.description}</Text>
            </View>
            <View style={[styles.statusContainer, getStatusStyle(item.status)]}>
              <Text style={styles.statusText}>
                {item.status === 'solved'
                  ? 'Bildirdiğiniz sorun çözüldü!'
                  : item.status === 'unsolved'
                  ? 'Maalesef bildirdiğiniz sorun çözülemedi.'
                  : 'Sorununuz bildirildi! En kısa zamanda çözülecektir.'}
                {'\n----------------\n'}
                {item.statusContent || 'Durum bilgisi bekleniyor.'}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Bildirilen Sorun</Text>
            <Text style={styles.headerText}>Durumu</Text>
          </View>
        )}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
  },
  issueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: 'yellow',
  },
  issueImage: {
    width: 130,
    height: 180,
    borderRadius: 6,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: 'yellow',
  },
  statusText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  headerText: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Issues;
