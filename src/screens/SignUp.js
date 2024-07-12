import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import * as Constantes from '../utils/constantes';
import Constants from 'expo-constants';

// Import de componentes
import Input from '../components/Inputs/Input';
import InputEmail from '../components/Inputs/InputEmail';
import Buttons from '../components/Buttons/Button';
import MaskedInputTelefono from '../components/Inputs/MaskedInputTelefono';

export default function SignUp({ navigation }) {
    const ip = Constantes.IP;
    const [idCliente, setIdCliente] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');

    // Expresiones regulares para validar teléfono
    const telefonoRegex = /^\d{4}-\d{4}$/;

    const handleLogout = async () => {
        navigation.navigate('Sesion');
    };

    const handleCreate = async () => {
        // Validar los campos
        if (!nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim() || !clave.trim() || !confirmarClave.trim()) {
            Alert.alert("Debes llenar todos los campos");
            return;
        } else if (!telefonoRegex.test(telefono)) {
            Alert.alert("El teléfono debe tener el formato correcto (####-####)");
            return;
        } else if (clave !== confirmarClave) {
            Alert.alert("Las contraseñas no coinciden");
            return;
        }

        // Si todos los campos son válidos, proceder con la creación del usuario
        const formData = new FormData();
        formData.append('nombreCliente', nombre);
        formData.append('apellidoCliente', apellido);
        formData.append('correoCliente', email);
        formData.append('telefonoCliente', telefono);
        formData.append('claveCliente', clave);
        formData.append('confirmarClave', confirmarClave);

        try {
            const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=signUpMovil`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.status) {
                Alert.alert('Datos Guardados correctamente');
                // Almacena el ID del cliente en AsyncStorage o en el contexto según tu configuración
                setIdCliente(data.idCliente);
                // Ajusta esto según cómo manejes el estado global o local de la aplicación
                navigation.navigate('Sesion');
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Ocurrió un error al intentar crear el usuario');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                <Text style={styles.texto}>Registrar Usuario</Text>
                <Input
                    placeHolder='Nombre Cliente'
                    setValor={nombre}
                    setTextChange={setNombre}
                />
                <Input
                    placeHolder='Apellido Cliente'
                    setValor={apellido}
                    setTextChange={setApellido}
                />
                <InputEmail
                    placeHolder='Email Cliente'
                    setValor={email}
                    setTextChange={setEmail}
                />
                <MaskedInputTelefono
                    telefono={telefono}
                    setTelefono={setTelefono}
                />
                <Input
                    placeHolder='Clave'
                    contra={true}
                    setValor={clave}
                    setTextChange={setClave}
                />
                <Input
                    placeHolder='Confirmar Clave'
                    contra={true}
                    setValor={confirmarClave}
                    setTextChange={setConfirmarClave}
                />
                <Buttons
                    textoBoton='Registrar Usuario'
                    accionBoton={handleCreate}
                />
                <Buttons
                    textoBoton='Ir al Login'
                    accionBoton={handleLogout}
                />
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAD8C0',
        paddingTop: Constants.statusBarHeight + 5, // el 5 es para darle un pequeño margen cuando hay una camara en el centro de la pantalla
    },
    scrollViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    texto: {
        color: '#322C2B', fontWeight: '900',
        fontSize: 20
    },
    textRegistrar: {
        color: '#322C2B', fontWeight: '700',
        fontSize: 18
    },

    fecha: {
        fontWeight: '600',
        color: '#FFF'
    },
    fechaSeleccionar: {
        fontWeight: '700',
        color: '#322C2B',
        textDecorationLine: 'underline'
    },
    contenedorFecha: {
        backgroundColor: '#A79277',
        color: "#fff", fontWeight: '800',
        width: 250,
        borderRadius: 5,
        padding: 5,
        marginVertical: 10
    }
});

