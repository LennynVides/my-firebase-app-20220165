import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Buttons from '../Buttons/Button';
import * as Constantes from '../../utils/constantes';

const ModalCompra = ({ visible, cerrarModal, nombreProductoModal, idProductoModal, cantidad, setCantidad }) => {
  const ip = Constantes.IP;

  const handleCreateDetail = async () => {
    try {
      if (cantidad <= 0 || isNaN(parseInt(cantidad))) {
        Alert.alert("La cantidad debe ser un número mayor que cero");
        return;
      } else {
        const formData = new FormData();
        formData.append('idProducto', idProductoModal);
        formData.append('cantidadProducto', cantidad);
  
        const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/pedido.php?action=createDetail`, {
          method: 'POST',
          body: formData
        });
        // Verificar si la respuesta es exitosa antes de intentar parsear JSON
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status} - ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
  
        if (data.status) {
          Alert.alert('Producto agregado correctamente');
          cerrarModal(false);
        } else {
          if (data.session === 0) {
            Alert.alert('Error', 'Debe iniciar sesión para agregar el producto al carrito');
            // Aquí podrías redirigir a la pantalla de inicio de sesión si lo deseas
          } else {
            Alert.alert('Error', data.error || 'Error al guardar los datos');
          }
        }
      }
    } catch (error) {
      Alert.alert('Ocurrió un error al crear detalle', error.message);
      console.error('Error:', error);
    }
  };

  const handleCancelCarrito = () => {
    cerrarModal(false);
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        cerrarModal(!visible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{nombreProductoModal}</Text>
          <Text style={styles.modalText}>Cantidad:</Text>
          <TextInput  
            style={styles.input}
            value={cantidad}
            onChangeText={text => setCantidad(text)}
            keyboardType="numeric"
            placeholder="Ingrese la cantidad"
          />
          <Buttons
          textoBoton='Agregar al carrito'
          accionBoton={() => handleCreateDetail()}/>
                    <Buttons
          textoBoton='Cancelar'
          accionBoton={() => handleCancelCarrito()}/>
        </View>
      </View>
    </Modal>
  );
};

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
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModalCompra;