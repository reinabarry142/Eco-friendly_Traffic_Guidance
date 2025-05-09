import React ,{useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Easing, Image } from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';
import ContribuerScreen from '../screens/ContribuerScreen/ContribuerScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AuthPromptScreen from '../screens/Auth/AuthPromptScreen';
import theme from '../styles/theme';
import { AuthContext } from '../contexts/auth.context';


const Tab = createBottomTabNavigator();

function AnimatedIcon({ name, size, color, focused, source }) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ 
      transform: [{ scale: scaleValue }],
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
    }}>
      {source ? (
        <Image 
          source={source} 
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <MaterialIcons name={name} size={size} color={color} />
      )}
    </Animated.View>
  );
}

export default function BottomTabNavigator({ userProfile }) {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 3,
          fontFamily: theme.fonts.medium,
        },
        tabBarIconStyle: {
          marginTop: 3,
        },
      }}
    >
      <Tab.Screen 
        name="Carte" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedIcon 
              name="map" 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
 
      <Tab.Screen 
        name="Contribuer" 
        component={ContribuerScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedIcon 
              name="add-location" 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />

      <Tab.Screen 
        name="Profil"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            isAuthenticated && userProfile?.avatar ? (
              <AnimatedIcon 
                size={size} 
                color={color} 
                focused={focused}
                source={userProfile.avatar}
              />
            ) : (
              <AnimatedIcon 
                name="account-circle" 
                size={size} 
                color={color} 
                focused={focused} 
              />
            )
          ),
        }}
      >
        {(props) =>
          isAuthenticated ? (
            <ProfileScreen 
              {...props} 
              setIsAuthenticated={setIsAuthenticated}
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
            />
          ) : (
            <AuthPromptScreen {...props} />
          )
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}
