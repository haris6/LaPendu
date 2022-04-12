import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
  } from 'react-native';
  import React,{useState,useEffect} from 'react';
  import AppLovinMAX from 'react-native-applovin-max';
  
  export default function MainScreen({navigation}) {
    const [dots,setDots]= useState("●");
    const [count,setCount] = useState(0);
    // copied from applovin documentation
    const mybanner = Platform.select({
      android: '1b1564c66be3d695',//ids from applovin ads
      ios: '0512dbade22682b1',
    });
  
    // copied from applovin documentation
    const initializeBannerAds = () =>
    {
      // Banners are automatically sized to 320x50 on phones and 728x90 on tablets
      // You may use the utility method `AppLovinMAX.isTablet()` to help with view sizing adjustments
      AppLovinMAX.createBanner(mybanner, AppLovinMAX.AdViewPosition.BOTTOM_CENTER);
  
      // Set background or background color for banners to be fully functional
      // In this case we are setting it to black - PLEASE USE HEX STRINGS ONLY
      AppLovinMAX.setBannerBackgroundColor(mybanner, '#000000');
    }

    initializeBannerAds()

    useEffect(() => {
        if (dots == "●  ●  ●"){
            setTimeout(function () {
                setDots("●")
            }, 300);
            setCount(count+1);
        }
        else{
            setTimeout(function () {
                setDots(dots + "  ●")
            }, 500);
        }
        if(dots == ""){
            navigation.navigate('HomeScreen')
        }
        
      }, [dots]);

      useEffect(()=>{
          if (count == 2){
              setDots("");
          }
      },[count])

    return (
      <ImageBackground
        style={{flex:1}}
        source={require('../assets/background.png')}>
        <View style={{flex:1,justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <Text style={styles.header}>LE  PENDU</Text>
                <Text style={{paddingLeft:'12%',fontSize:25,fontWeight:"bold",color:"black",opacity:0.6,marginTop:25}}>{dots}</Text>
            </View>
        </View>   
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
        {/* copied from applovin documentation */}
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
      fontSize: 50,
      marginTop: 50,
      fontWeight: 'bold',
      letterSpacing: -1.9,
      color: 'black',
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
  