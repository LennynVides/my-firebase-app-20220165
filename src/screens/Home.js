import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import Buttons from '../components/Buttons/Button';
import * as Constantes from '../utils/constantes';

export default function Home({ navigation }) {
  const [nombre, setNombre] = useState(null);
  const [apellido, setApellido] = useState(null);
  const ip = Constantes.IP;

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
}, []);

return (
  <View style={styles.container}>
      <Image
          source={require('../../assets/KIDDYLAND.png')}
          style={styles.image}
      />
      <Text style={styles.title}>Bienvenid@</Text>
      <Text style={styles.subtitle}>
          {nombre ? nombre : 'No hay Nombre para mostrar'}
      </Text>
      <Buttons
          textoBoton='Cerrar Sesión'
          accionBoton={handleLogout}
      />
      <Buttons
          textoBoton='Ver Productos'
          accionBoton={irActualizar}
      />
      <Buttons
          textoBoton='Editar Usuario'
          accionBoton={EditUser}
      />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD8C0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  button: {
    borderWidth: 2,
    borderColor: "black",
    width: 100,
    borderRadius: 10,
    backgroundColor: "darkblue"
  },
  buttonText: {
    textAlign: 'center',
    color: "white"
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
    color: '#5C3D2E', // Brown color for the title
  },
});