import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import Input from '../components/Inputs/Input';
import InputEmail from '../components/Inputs/InputEmail';
import Buttons from '../components/Buttons/Button';
import * as Constantes from '../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

export default function Sesion({ navigation }) {
  const ip = Constantes.IP;

  const [isContra, setIsContra] = useState(true);
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const [logoFade] = useState(new Animated.Value(0));
  const [logoTranslate] = useState(new Animated.Value(-50));
  const [textFade] = useState(new Animated.Value(0));
  const [textTranslate] = useState(new Animated.Value(20));
  const [buttonScale] = useState(new Animated.Value(1));
  const [borderColor] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslate, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      validarSesion(); // Llama a la función validarSesion.
    }, [])
  );

  const validarSesion = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=getUser`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.status === 1) {
        navigation.navigate('TabNavigator');
        console.log("Se ingresa con la sesión activa");
      } else {
        console.log("No hay sesión activa");
        return;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al validar la sesión');
    }
  };

  const cerrarSesion = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=logOut`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.status) {
        console.log("Sesión Finalizada");
      } else {
        console.log('No se pudo eliminar la sesión');
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  const handlerLogin = async () => {
    if (!correo || !contrasenia) {
      Alert.alert('Error', 'Por favor ingrese su correo y contraseña');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('correoCliente', correo);
      formData.append('claveCliente', contrasenia);

      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=logIn`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        setContrasenia('');
        setCorreo('');
        navigation.navigate('TabNavigator');
      } else {
        console.log(data);
        Alert.alert('Error sesión', data.error);
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  const irRegistrar = () => {
    navigation.navigate('SignUp');
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, friction: 4, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const handleFocus = () => {
    Animated.timing(borderColor, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderColor, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };

  const borderColorInterpolation = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF6F61', '#EAD8C0']
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../img/KIDDYLAND.png')}
        style={[
          styles.image,
          {
            opacity: logoFade,
            transform: [{ translateY: logoTranslate }]
          }
        ]}
      />
      <Animated.Text
        style={[
          styles.texto,
          {
            opacity: textFade,
            transform: [{ translateY: textTranslate }]
          }
        ]}
      >
        Iniciar Sesión
      </Animated.Text>
      <Animated.View style={{ borderBottomColor: borderColorInterpolation, borderBottomWidth: 2 }}>
        <InputEmail
          placeHolder='Correo'
          setValor={correo}
          setTextChange={setCorreo}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      <Animated.View style={{ borderBottomColor: borderColorInterpolation, borderBottomWidth: 2 }}>
        <Input
          placeHolder='Contraseña'
          setValor={contrasenia}
          setTextChange={setContrasenia}
          contra={isContra}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Buttons
          textoBoton='Iniciar Sesión'
          accionBoton={handlerLogin}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </Animated.View>
      <TouchableOpacity onPress={irRegistrar}>
        <Animated.Text
          style={[
            styles.textRegistrar,
            {
              opacity: textFade,
              transform: [{ translateY: textTranslate }]
            }
          ]}
        >
          ¿No tienes cuenta? Regístrate aquí
        </Animated.Text>
      </TouchableOpacity>
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
  texto: {
    color: '#322C2B',
    fontWeight: '900',
    fontSize: 20
  },
  textRegistrar: {
    color: '#322C2B',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 10
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 10
  },
});
