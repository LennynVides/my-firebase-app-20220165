import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importa tus componentes de pantalla aquí
import Productos from '../screens/Productos';
import Home from '../screens/Home';
import Carrito from '../screens/Carrito';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
<<<<<<< HEAD
  return (
    <Tab.Navigator
=======
    return (

<Tab.Navigator
>>>>>>> cd4753f09b37335ff5ed540f5bdb6b9ad3836859
      screenOptions={({ route }) => ({
        headerShown: false, // Oculta el header
        tabBarActiveTintColor: '#AF8260', // Color de los íconos activos
        tabBarInactiveTintColor: '#B99873', // Color de los íconos inactivos
        tabBarStyle: { backgroundColor: '#FFF', height: 60, borderTopWidth: 0 }, // Estilo de la barra de pestañas
        tabBarIcon: ({ focused, color, size }) => { // Función que define el ícono de la pestaña
          let iconName;
<<<<<<< HEAD
          if (route.name === 'Home') { // Si la ruta es 'Home'
            iconName = focused ? 'home' : 'home-outline'; // Ícono para 'Home' (activo o inactivo)
          } else if (route.name === 'Productos') { // Si la ruta es 'Productos'
            iconName = focused ? 'cafe' : 'cafe-outline'; // Ícono para 'Productos' (activo o inactivo)
          } else if (route.name === 'Carrito') { // Si la ruta es 'Carrito'
            iconName = focused ? 'cart' : 'cart-outline'; // Ícono para 'Carrito' (activo o inactivo)
          }
          return <Ionicons name={iconName} color={color} size={size} />; // Retorna el ícono correspondiente
=======
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          return <Ionicons name={iconName} color={color} size={size} />;
>>>>>>> cd4753f09b37335ff5ed540f5bdb6b9ad3836859
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
<<<<<<< HEAD
  );
=======
    );
>>>>>>> cd4753f09b37335ff5ed540f5bdb6b9ad3836859
};

export default TabNavigator;

