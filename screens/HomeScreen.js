import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import words from '../data.json';
import React, {useState, useEffect} from 'react';
import AppLovinMAX from 'react-native-applovin-max';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';

export default function HomeScreen({navigation,route}) {
  const [shown, setShown] = useState(0);
  const [unlocked,setUnlocked] = useState("");
  const [tries, setTries] = useState(0);
  
  useEffect(() => {
    if (route.params?.category) {
      setUnlocked(route.params?.category)
    }
  }, [route.params?.category]);

  useEffect(() => {
    if (route.params?.tries) {
      setTries(route.params?.tries)
    }
  }, [route.params?.tries]);

  const mybanner = Platform.select({
    android: '27726cbd3cb14837',
  });

  const myreward = Platform.select({
    android: 'd066447410aa2591',
  });

  const [retryAttempt, setRetryAttempt] = useState(0);

  const initializeRewardedAds = () => {
    AppLovinMAX.addEventListener('OnRewardedAdLoadedEvent', () => {
      // Rewarded ad is ready to be shown. AppLovinMAX.isInterstitialReady(REWARDED_AD_UNIT_ID) will now return 'true'

      // Reset retry attempt
      setRetryAttempt(0);
    });
    AppLovinMAX.addEventListener('OnRewardedAdLoadFailedEvent', () => {
      // Rewarded ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)

      setRetryAttempt(retryAttempt + 1);
      var retryDelay = Math.pow(2, Math.min(6, retryAttempt));

      console.log(
        'Rewarded ad failed to load - retrying in ' + retryDelay + 's',
      );

      setTimeout(function () {
        loadRewardedAd();
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnRewardedAdClickedEvent', () => {});
    AppLovinMAX.addEventListener('OnRewardedAdDisplayedEvent', () => {});
    AppLovinMAX.addEventListener('OnRewardedAdFailedToDisplayEvent', () => {
      // Rewarded ad failed to display. We recommend loading the next ad
      loadRewardedAd();
    });
    AppLovinMAX.addEventListener('OnRewardedAdHiddenEvent', () => {
      loadRewardedAd();
    });
    AppLovinMAX.addEventListener('OnRewardedAdReceivedRewardEvent', () => {});
    
    // Load the first rewarded ad
    loadRewardedAd();
  };

  function loadRewardedAd() {
    AppLovinMAX.loadRewardedAd(myreward);
  }

  initializeRewardedAds();

  const callAd = item => {
    loadRewardedAd();
    if (shown == 0) {
      setShown(1);
      navigation.navigate('GameScreen', {item});
    } else {
      if (AppLovinMAX.isRewardedAdReady(myreward)) {
        AppLovinMAX.showRewardedAd(myreward);
        setTimeout(function () {
          navigation.navigate('GameScreen', {item});
        }, 10);
      } else {
        console.log('reward ad yawaing');
      }
    }
  }

  const checkUnlocked = item => {
    if(!(item == unlocked)){
      callAd(item);
    }
    else{
      navigation.navigate('GameScreen', {item});
    }
  };

  const getImage = name => {
    switch (name) {
      case 'Science':
        return require('../assets/icons/Science.imageset/icon.png');
      case 'Sport':
        return require('../assets/icons/Sport.imageset/icon.png');
      case 'Films':
        return require('../assets/icons/Films.imageset/icon.png');
      case 'Musique':
        return require('../assets/icons/Musique.imageset/icon.png');
      case 'Nature':
        return require('../assets/icons/Nature.imageset/icon.png');
      case 'Aliments':
        return require('../assets/icons/Aliments.imageset/icon.png');
      case 'Animaux':
        return require('../assets/icons/Animaux.imageset/icon.png');
      case 'Autos':
        return require('../assets/icons/Autos.imageset/icon.png');
      case 'Celebrites':
        return require('../assets/icons/Celebrites.imageset/icon.png');
      case 'Divers':
        return require('../assets/icons/Divers.imageset/icon.png');
      case 'Groupes':
        return require('../assets/icons/Groupes.imageset/icon.png');
      case 'Jeux':
        return require('../assets/icons/Jeux.imageset/icon.png');
      case 'Pays':
        return require('../assets/icons/Pays.imageset/icon.png');
      case 'Professions':
        return require('../assets/icons/Professions.imageset/icon.png');
      case 'Facile':
        return require('../assets/icons/Facile.imageset/icon.png');
    }
  };

  const getLock = name =>{
    if(name == unlocked){
      return require('../assets/unlocked.png');
    }
    else{
      return require('../assets/lock.png');
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={{}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 7,
            marginRight: 5,
          }}
          onPress={() => {
            checkUnlocked(item);
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image source={getImage(item)} style={{height: 30, width: 30}} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'left',
                marginVertical: 5,
                marginLeft: 5,
                letterSpacing: -1.2,
                color: 'black',
              }}>
              {item.toUpperCase()}
            </Text>
          </View>
          <Image
            source={getLock(item)}
            style={{height: 30, width: 30}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../assets/background.png')}>
      <Text style={styles.header}>LE PENDU</Text>
      <Text style={styles.subHeader}>SELECTIONNEZ LE GENRE</Text>
      <FlatList
        data={Object.keys(words)}
        renderItem={renderItem}
        keyExtractor={item => item}
        style={{marginBottom: 240, marginHorizontal: 60}}
      />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <AppLovinMAX.AdView
          adUnitId={mybanner}
          adFormat={AppLovinMAX.AdFormat.BANNER}
          style={styles.banner}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 50,
    fontWeight: 'bold',
    letterSpacing: -1.9,
    color: 'black',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 80,
    paddingBottom: 15,
    fontWeight: 'bold',
    letterSpacing: -0.8,
    color: 'black',
    marginBottom: 5,
  },
  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  banner: {
    borderRadius: 25,
    height: AppLovinMAX.isTablet() ? 90 : 50,
    bottom: Platform.select({
      ios: '15%',
      android: '15%',
    }),
  },
});
