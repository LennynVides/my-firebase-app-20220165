// Importaciones necesarias
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Alert } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Constantes from '../utils/constantes';
import Buttons from '../components/Buttons/Button';
import CarritoCard from '../components/CarritoCard/CarritoCard';
import ModalEditarCantidad from '../components/Modales/ModalEditarCantidad';

const Carrito = ({ navigation }) => {
  const [dataDetalleCarrito, setDataDetalleCarrito] = useState([]);
  const [idDetallepe, setIdDetallepe] = useState(null); // Cambiado a id_detallepe
  const [cantidadProductoCarrito, setCantidadProductoCarrito] = useState('0'); // Cambiado a string
  const [modalVisible, setModalVisible] = useState(false);
  const ip = Constantes.IP;

  const backProducts = () => {
    navigation.navigate('Productos');
  };

  useFocusEffect(
    React.useCallback(() => {
      getDetalleCarrito();
    }, [])
  );

  const getDetalleCarrito = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/pedido.php?action=readDetail`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data, "Data desde getDetalleCarrito")
      if (data.status) {
        setDataDetalleCarrito(data.dataset);
      } else {
        console.log("No hay detalles del carrito disponibles")
        Alert.alert('ADVERTENCIA', data.error);
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      Alert.alert('Error', 'Ocurrió un error al listar las categorias');
    }
  };

  const finalizarPedido = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/pedido.php?action=finishOrder`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.status) {
        Alert.alert("Se finalizó la compra correctamente")
        setDataDetalleCarrito([]);
        navigation.navigate('TabNavigator', { screen: 'Productos' });
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al finalizar pedido');
    }
  };

  const handleEditarDetalle = (idDetallepe, cantidadDetalle) => {
    setModalVisible(true);
    setIdDetallepe(idDetallepe);
    setCantidadProductoCarrito(cantidadDetalle.toString()); // Asegurar que cantidadDetalle sea un string
  };

  const renderItem = ({ item }) => (
    <CarritoCard
      item={item}
      cargarCategorias={getDetalleCarrito}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      setCantidadProductoCarrito={setCantidadProductoCarrito}
      cantidadProductoCarrito={cantidadProductoCarrito}
      idDetallepe={idDetallepe} // Cambiado a id_detallepe
      setIdDetallepe={setIdDetallepe} // Cambiado a id_detallepe
      accionBotonDetalle={handleEditarDetalle}
      getDetalleCarrito={getDetalleCarrito}
      updateDataDetalleCarrito={setDataDetalleCarrito}
    />
  );

  return (
    <View style={styles.container}>
      <ModalEditarCantidad
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        idDetallepe={idDetallepe} // Cambiado a id_detallepe
        setIdDetallepe={setIdDetallepe} // Cambiado a id_detallepe
        setCantidadProductoCarrito={setCantidadProductoCarrito}
        cantidadProductoCarrito={cantidadProductoCarrito}
        getDetalleCarrito={getDetalleCarrito}
      />

      <Text style={styles.title}>Carrito de Compras</Text>

      {dataDetalleCarrito.length > 0 ? (
        <FlatList
          data={dataDetalleCarrito}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_detalle.toString()}
        />
      ) : (
        <Text style={styles.titleDetalle}>No hay detalles del carrito disponibles.</Text>
      )}

      <View style={styles.containerButtons}>
        {dataDetalleCarrito.length > 0 && (
          <Buttons
            textoBoton='Finalizar Pedido'
            accionBoton={finalizarPedido}
          />
        )}
        <Buttons
          textoBoton='Regresar a productos'
          accionBoton={backProducts}
        />
      </View>
    </View>
  );
};

export default Carrito;


// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD8C0',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#5C3D2E',
  },
  titleDetalle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    color: '#5C3D2E',
  },
  containerButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
