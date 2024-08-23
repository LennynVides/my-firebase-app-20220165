import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, SafeAreaView, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as Constantes from '../utils/constantes';
import Buttons from '../components/Buttons/Button';
import ProductoCard from '../components/Productos/ProductoCard';
import ModalCompra from '../components/Modales/ModalCompra';
import RNPickerSelect from 'react-native-picker-select';
import Constants from 'expo-constants';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

export default function Productos({ navigation }) {
  const ip = Constantes.IP;
  const [dataProductos, setDataProductos] = useState([]);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [idProductoModal, setIdProductoModal] = useState('');
  const [nombreProductoModal, setNombreProductoModal] = useState('');

  // Estados de animación
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const pickerScale = useRef(new Animated.Value(1)).current;
  const cartButtonScale = useRef(new Animated.Value(1)).current;

  const isFocused = useIsFocused();

  const volverInicio = () => {
    navigation.navigate('Home');
  };

  const handleCompra = (nombre, id) => {
    setModalVisible(true);
    setIdProductoModal(id);
    setNombreProductoModal(nombre);
  };

  const getProductos = async (idCategoriaSelect = null) => {
    try {
      const formData = new FormData();
      let endpoint = `${ip}/Kiddyland3/api/servicios/publico/producto.php`;

      if (idCategoriaSelect !== null) {
        formData.append('id_categoria', idCategoriaSelect);
        endpoint += `?action=readProductosCategoria`;
      } else {
        endpoint += `?action=readAll`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status) {
        setDataProductos(data.dataset);
      } else {
        console.error('Error en getProductos:', data.error);
        Alert.alert('Error productos', data.error);
      }
    } catch (error) {
      console.error('Error en getProductos:', error);
      Alert.alert('Error', 'Ocurrió un error al listar los productos');
    }
  };

  const getCategorias = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/categoria.php?action=readAll`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.status) {
        setDataCategorias(data.dataset);
      } else {
        console.error('Error en getCategorias:', data.error);
        Alert.alert('Error categorias', data.error);
      }
    } catch (error) {
      console.error('Error en getCategorias:', error);
      Alert.alert('Error', 'Ocurrió un error al listar las categorias');
    }
  };

  useEffect(() => {
    if (isFocused) {
      // Animaciones
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 1000,
          delay: 500,
          useNativeDriver: true,
        }).start(),
        Animated.spring(pickerScale, {
          toValue: 1.05,
          friction: 4,
          useNativeDriver: true,
        }).start(),
        Animated.spring(cartButtonScale, {
          toValue: 1.05,
          friction: 4,
          useNativeDriver: true,
        }).start(),
      ]);
    }
  }, [isFocused]);

  useEffect(() => {
    getCategorias();
    getProductos();
  }, []);

  useEffect(() => {
    getProductos(selectedCategoria);
  }, [selectedCategoria]);

  const irCarrito = () => {
    navigation.navigate('Carrito');
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

  const renderItem = ({ item }) => (
    <Animated.View style={{ transform: [{ scale: 1.02 }] }}>
      <ProductoCard
        ip={ip}
        imagenProducto={item.imagen_producto}
        idProducto={item.id_producto}
        nombreProducto={item.nombre_producto}
        descripcionProducto={item.descripcion_producto}
        precioProducto={item.precio_producto}
        existenciasProducto={item.existencias_productos}
        accionBotonProducto={() => handleCompra(item.nombre_producto, item.id_producto)}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Catálogo de Productos
      </Animated.Text>
      <Buttons textoBoton="Volver a Home" accionBoton={volverInicio} />

      <ModalCompra
        visible={modalVisible}
        cerrarModal={setModalVisible}
        nombreProductoModal={nombreProductoModal}
        idProductoModal={idProductoModal}
        cantidad={cantidad}
        setCantidad={setCantidad}
      />

      <View>
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Selecciona una categoría para filtrar productos
        </Animated.Text>
        <Animated.View style={{ transform: [{ scale: pickerScale }] }}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              style={{ inputAndroid: styles.picker }}
              onValueChange={(value) => setSelectedCategoria(value)}
              placeholder={{ label: 'Selecciona una categoría...', value: null }}
              items={dataCategorias.map((categoria) => ({
                label: categoria.nombre_categoria,
                value: categoria.id_categoria,
              }))}
            />
          </View>
        </Animated.View>
      </View>

      <SafeAreaView style={styles.containerFlat}>
        <FlatList
          data={dataProductos}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={renderItem}
        />
      </SafeAreaView>

      <Animated.View style={{ transform: [{ scale: cartButtonScale }] }}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={irCarrito}
          onPressIn={() => handlePressIn(cartButtonScale)}
          onPressOut={() => handlePressOut(cartButtonScale)}
        >
          <FontAwesome name="shopping-cart" size={24} color="white" />
          <Text style={styles.cartButtonText}>Ir al carrito</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlat: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#EAD8C0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#5C3D2E',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5,
    marginHorizontal: 5,
    color: '#5C3D2E',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#AF8260',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    backgroundColor: '#AF8260',
  },
  picker: {
    color: '#ffffff'
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#AF8260',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  cartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
