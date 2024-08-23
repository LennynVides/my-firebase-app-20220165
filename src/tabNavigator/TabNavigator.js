import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, Animated } from 'react-native';

// Importa tus componentes de pantalla aquí
import Productos from '../screens/Productos';
import Home from '../screens/Home';
import Carrito from '../screens/Carrito';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Oculta el header
        tabBarActiveTintColor: '#AF8260', // Color de los íconos activos
        tabBarInactiveTintColor: '#B99873', // Color de los íconos inactivos
        tabBarStyle: {
          backgroundColor: '#FFF',
          height: Platform.OS === 'ios' ? 80 : 60, // Estilo de la barra de pestañas, altura diferente para iOS y Android
          borderTopWidth: 0,
        }, // Estilo de la barra de pestañas
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const rotateValue = useRef(new Animated.Value(0)).current; // Valor inicial de la rotación

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          // Animación de rotación
          const rotateIcon = () => {
            rotateValue.setValue(0); // Reiniciar el valor de rotación
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: 500, // Duración de la rotación
              useNativeDriver: true,
            }).start();
          };

          // Interpolación de la rotación
          const rotateInterpolate = rotateValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'], // Rango de rotación de 0 a 360 grados
          });

          return (
            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolate }] }}
              onTouchStart={rotateIcon} // Ejecuta la animación al hacer clic
            >
              <Ionicons name={iconName} color={color} size={size} />
            </Animated.View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Productos"
        component={Productos}
        options={{ title: 'Productos' }}
      />
      <Tab.Screen
        name="Carrito"
        component={Carrito}
        options={{ title: 'Carrito' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
