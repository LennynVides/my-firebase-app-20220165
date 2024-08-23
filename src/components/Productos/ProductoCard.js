import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function ProductoCard({ ip, imagenProducto, idProducto, nombreProducto, descripcionProducto, precioProducto, existenciasProducto, accionBotonProducto }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);

  // Obtener comentarios del producto
  const fetchComentarios = async () => {
    try {
      const response = await fetch(`${ip}/Kiddyland3/api/get_comments.php?id_detallepe=${idProducto}`);
      const result = await response.json();

      if (result.status === 'success') {
        setComentarios(result.comentarios);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al obtener comentarios: ' + error.message);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [idProducto]);

  const handleComentarioSubmit = async () => {
    try {
      const comentarioData = {
        id_detallepe: idProducto, // Cambia según tu lógica
        valoracion: 'Buena', // Cambia según tu lógica
        comentario: comentario,
      };

      console.log('Datos enviados:', comentarioData); // Imprime los datos en la consola

      const response = await fetch(`${ip}/Kiddyland3/api/add_comment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Comentario Enviado', result.message);
        setComentario('');
        setShowCommentInput(false);
        fetchComentarios(); // Actualiza la lista de comentarios después de enviar
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al enviar el comentario: ' + error.message);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${ip}/Kiddyland3/api/images/producto/${imagenProducto}` }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.text}>{idProducto}</Text>
      <Text style={styles.textTitle}>{nombreProducto}</Text>
      <Text style={styles.text}>{descripcionProducto}</Text>
      <Text style={styles.textTitle}>Precio: <Text style={styles.textDentro}>${precioProducto}</Text></Text>
      <Text style={styles.textTitle}>Existencias: <Text style={styles.textDentro}>{existenciasProducto} {(existenciasProducto === 1) ? 'Unidad' : 'Unidades'}</Text></Text>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={accionBotonProducto}>
        <FontAwesome name="plus-circle" size={24} color="white" />
        <Text style={styles.cartButtonText}>Seleccionar Producto</Text>
      </TouchableOpacity>

      {/* Botón para mostrar campo de comentario */}
      <TouchableOpacity
        style={styles.commentButton}
        onPress={() => setShowCommentInput(!showCommentInput)}>
        <Text style={styles.commentButtonText}>
          {showCommentInput ? 'Cancelar' : 'Agregar Comentario'}
        </Text>
      </TouchableOpacity>

      {/* Campo de comentario */}
      {showCommentInput && (
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu comentario aquí..."
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.button} onPress={handleComentarioSubmit}>
            <Text style={styles.buttonText}>Enviar Comentario</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Comentarios */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comentarios:</Text>
        <FlatList
          data={comentarios}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentDate}>{item.fecha_valo}</Text>
              <Text style={styles.commentRating}>Valoración: {item.valoracion}</Text>
              <Text style={styles.commentText}>{item.comentario}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlat: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#EAD8C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 1,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  textTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '700'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#AF8260',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  image: {
    width: '65%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: 'center',
  },
  textDentro: {
    fontWeight: '400'
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center'
  },
  commentButton: {
    marginTop: 10,
    backgroundColor: '#AF8260',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  commentContainer: {
    marginTop: 10,
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentDate: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentRating: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  commentText: {
    fontSize: 14,
  },
});
