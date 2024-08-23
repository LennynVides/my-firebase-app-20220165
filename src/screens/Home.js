import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, Dimensions, Animated } from 'react-native';
import Buttons from '../components/Buttons/Button';
import * as Constantes from '../utils/constantes';
import LottieView from 'lottie-react-native';

export default function Home({ navigation }) {
  const [nombre, setNombre] = useState(null);
  const ip = Constantes.IP;

  // Estado de animación
  const [titleOpacity] = useState(new Animated.Value(0));
  const [subtitleOpacity] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));

  const handleLogout = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=logOut`, {
        method: 'GET'
      });
      const data = await response.json();
      if (data.status) {
        navigation.navigate('Sesion');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al cerrar la sesión');
    }
  };

  const irActualizar = () => {
    navigation.navigate('Productos');
  };

  const EditUser = () => {
    navigation.navigate('UpdateUser');
  };

  const getUser = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=getUser`, {
        method: 'GET'
      });
      const data = await response.json();
      if (data.status) {
        setNombre(data.username); // Ajusta según la estructura de respuesta del backend
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al obtener los datos del usuario');
    }
  };

  useEffect(() => {
    getUser();
    // Animaciones
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, { 
      toValue: 0.95, 
      friction: 4, 
      useNativeDriver: true 
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { 
      toValue: 1, 
      friction: 4, 
      useNativeDriver: true 
    }).start();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/KIDDYLAND.png')}
        style={styles.image}
      />
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Bienvenid@ 
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        {nombre ? nombre : 'No hay Nombre para mostrar'}
      </Animated.Text>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Buttons
          textoBoton='Cerrar Sesión'
          accionBoton={handleLogout}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
        <Buttons
          textoBoton='Ver Productos'
          accionBoton={irActualizar}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
        <Buttons
          textoBoton='Editar Usuario'
          accionBoton={EditUser}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </Animated.View>
      <LottieView
        source={require('../../assets/Animation-pelota.json')} // Cambia esto por la ruta a tu archivo JSON de animación
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD8C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    color: '#5C3D2E', // Brown color for the title
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 5,
    color: '#5C3D2E', // Brown color for the subtitle
  },
  animation: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    height: 150, // Ajusta la altura de la animación según sea necesario
  },
});
