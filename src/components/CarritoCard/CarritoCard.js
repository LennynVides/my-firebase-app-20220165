import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import * as Constantes from '../../utils/constantes';

const CarritoCard = ({ item, setModalVisible, setCantidadProductoCarrito, accionBotonDetalle, idDetallepe, setIdDetallepe, getDetalleCarrito, updateDataDetalleCarrito }) => {
  const ip = Constantes.IP;

  // Estados de animación
  const cardTranslateY = useRef(new Animated.Value(20)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const modifyButtonScale = useRef(new Animated.Value(1)).current;
  const deleteButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada para el card
    Animated.parallel([
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardTranslateY, cardOpacity]);

  const handleDeleteDetalleCarrito = async (idDetalle) => {
    try {
      Alert.alert(
        'Confirmación',
        '¿Estás seguro de que deseas eliminar este elemento del carrito?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Eliminar',
            onPress: async () => {
              const formData = new FormData();
              formData.append('idDetalle', idDetalle);
              const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/pedido.php?action=deleteDetail`, {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              if (data.status) {
                Alert.alert('Datos eliminados correctamente del carrito');
                updateDataDetalleCarrito(prevData => prevData.filter(item => item.id_detallepe !== idDetalle));
              } else {
                Alert.alert('Error al eliminar del carrito', data.error);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error al eliminar del carrito");
    }
  };

  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslateY }],
        }
      ]}
    >
      {/* Eliminar esta línea para ocultar el ID */}
      {/* <Text style={styles.itemText}>ID: {item.id_detallepe}</Text> */}
      <Text style={styles.itemText}>Nombre: {item.nombre_producto}</Text>
      <Text style={styles.itemText}>Precio: ${item.precio_producto}</Text>
      <Text style={styles.itemText}>Cantidad: {item.cantidad_producto}</Text>
      <Text style={styles.itemText}>SubTotal: ${(parseFloat(item.cantidad_producto) * parseFloat(item.precio_producto)).toFixed(2)}</Text>

      <Animated.View style={{ transform: [{ scale: modifyButtonScale }] }}>
        <TouchableOpacity
          style={styles.modifyButton}
          onPress={() => accionBotonDetalle(item.id_detallepe, item.cantidad_producto)}
          onPressIn={() => handlePressIn(modifyButtonScale)}
          onPressOut={() => handlePressOut(modifyButtonScale)}
        >
          <Text style={styles.buttonText}>Modificar Cantidad</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: deleteButtonScale }] }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onLongPress={() => handleDeleteDetalleCarrito(item.id_detallepe)}
          onPressIn={() => handlePressIn(deleteButtonScale)}
          onPressOut={() => handlePressOut(deleteButtonScale)}
        >
          <Text style={styles.buttonText}>Eliminar del carrito</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default CarritoCard;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  modifyButton: {
    borderWidth: 1,
    borderColor: '#8F6B58',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#8F6B58',
    marginVertical: 4,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D2691E',
    marginVertical: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});
