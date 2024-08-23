import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import Buttons from '../Buttons/Button';
import * as Constantes from '../../utils/constantes';

const ModalEditarCantidad = ({ modalVisible, setModalVisible, idDetallepe, cantidadProductoCarrito, setCantidadProductoCarrito, getDetalleCarrito }) => {
  const [cantidad, setCantidad] = useState(cantidadProductoCarrito);
  const ip = Constantes.IP;

  useEffect(() => {
    if (modalVisible) {
      setCantidad(cantidadProductoCarrito);
    }
  }, [modalVisible]);

  const handleUpdateCantidad = async () => {
    try {
      const formData = new FormData();
      formData.append('idDetalle', idDetallepe);
      formData.append('cantidadProducto', cantidad);

      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/pedido.php?action=updateDetail`, {
        method: 'POST',
        body: formData,
      });
      console.log(response);
      const data = await response.json();
      if (data.status) {
        Alert.alert('Cantidad actualizada correctamente');
        getDetalleCarrito();
        setModalVisible(false);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar la cantidad');
    }
  };

  const handleCancel = () => {
    setCantidadProductoCarrito(cantidadProductoCarrito);
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Cantidad actual: {cantidadProductoCarrito}</Text>
          <Text style={styles.modalText}>Nueva cantidad:</Text>
          <TextInput
            style={styles.input}
            value={cantidad.toString()}
            onChangeText={text => setCantidad(text)}
            keyboardType="numeric"
            placeholder="Ingrese la cantidad"
          />
          <Buttons
            textoBoton='Editar cantidad'
            accionBoton={handleUpdateCantidad}
          />
          <Buttons
            textoBoton='Cancelar'
            accionBoton={handleCancel}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditarCantidad;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 200,
  },
});
