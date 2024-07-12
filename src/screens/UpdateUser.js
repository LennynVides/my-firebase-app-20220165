import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Constantes from '../utils/constantes';

// Componentes
import Input from '../components/Inputs/Input';
import InputEmail from '../components/Inputs/InputEmail';
import Buttons from '../components/Buttons/Button';
import MaskedInputTelefono from '../components/Inputs/MaskedInputTelefono';

export default function UpdateProfile({ navigation }) {
    const ip = Constantes.IP;
    const [idCliente, setIdCliente] = useState('')
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [claveActual, setClaveActual] = useState(''); // Nueva estado para la contraseña actual
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');
    
    // Expresión regular para validar teléfono
    const telefonoRegex = /^\d{4}-\d{4}$/;

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                // Realiza la llamada al backend para obtener los datos del perfil
                const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=readProfile`);

                if (!response.ok) {
                    throw new Error('Error al obtener el perfil');
                }

                const data = await response.json();
                console.log('Datos del perfil:', data); // Verifica los datos del perfil en la consola

                if (data.dataset) {
                    // Asigna los datos del perfil a los estados locales
                    const perfil = data.dataset; 
                    // Ajusta según la estructura de respuesta del backend
                    setIdCliente(perfil.id_cliente)
                    setNombre(perfil.nombre_cliente);
                    setApellido(perfil.apellido_cliente);
                    setEmail(perfil.correo_cliente);
                    setTelefono(perfil.telefono_cliente);
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };

        // Llama a la función para cargar el perfil al cargar el componente
        cargarPerfil();
    }, []);

    const handleUpdate = async () => {
        // Validar los campos
        if (!nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim()) {
            Alert.alert("Debes llenar todos los campos");
            return;
        } else if (!telefonoRegex.test(telefono)) {
            Alert.alert("El teléfono debe tener el formato correcto (####-####)");
            return;
        } else if (clave !== confirmarClave) {
            Alert.alert("Las contraseñas no coinciden");
            return;
        }

        // Si todos los campos son válidos, proceder con la actualización del usuario
        const formData = new FormData();
        formData.append('idCliente', idCliente);
        formData.append('nombreCliente', nombre);
        formData.append('apellidoCliente', apellido);
        formData.append('correoCliente', email);
        formData.append('telefonoCliente', telefono);
        formData.append('claveCliente', clave);
        formData.append('confirmarClave', confirmarClave);

        try {
            // Realiza la llamada al backend para actualizar los datos del perfil y contraseña
            const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=editProfile`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.status) {
                Alert.alert('Datos actualizados correctamente');

                // Actualiza los estados locales con los nuevos datos
                setNombre(data.nombre);
                setApellido(data.apellido);
                setEmail(data.email);
                setTelefono(data.telefono);
                

                // Puedes manejar la navegación según tu flujo de la aplicación
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Ocurrió un error al intentar actualizar el usuario');
        }
    };
    const handleUpdatePassword = async () => {
        if (!claveActual.trim() || !clave.trim() || !confirmarClave.trim()) {
            Alert.alert("Debes llenar todos los campos");
            return;
        } else if (clave !== confirmarClave) {
            Alert.alert("Las contraseñas no coinciden");
            return;
        }
    
        const formData = new FormData();
        formData.append('idCliente', idCliente);
        formData.append('ClaveActual', claveActual);
        formData.append('claveCliente', clave);
        formData.append('confirmarClave', confirmarClave);
        
        try {
            const response = await fetch(`${ip}/Kiddyland3/api/servicios/publico/cliente.php?action=changePassword`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('La solicitud de cambio de contraseña falló');
            }
    
            const data = await response.json();
            if (data.status) {
                Alert.alert('Contraseña actualizada correctamente');
                setClaveActual('');
                setClave('');
                setConfirmarClave('');
    
                // Navegar a la pantalla 'Home' después de actualizar la contraseña
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            console.error('Error al intentar actualizar la contraseña:', error.message);
            Alert.alert('Ocurrió un error al intentar actualizar la contraseña');
        }
    };

    const atras = () => {
        navigation.navigate('Home');
      };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                <Text style={styles.texto}>Editar Perfil</Text>
                <Input
                    placeHolder='Nombre Cliente'
                    setValor={nombre}
                    setTextChange={setNombre}
                    value={nombre}
                />
                <Input
                    placeHolder='Apellido Cliente'
                    setValor={apellido}
                    setTextChange={setApellido}
                    value={apellido}
                />
                <InputEmail
                    placeHolder='Email Cliente'
                    setValor={email}
                    setTextChange={setEmail}
                    value={email}
                />
                <MaskedInputTelefono
                    telefono={telefono}
                    setTelefono={setTelefono}
                    value={email}
                />
                <Buttons
                    textoBoton='Guardar Cambios'
                    accionBoton={handleUpdate}
                />
                <Text style={styles.texto}>Cambiar contraseña</Text>
                <Input
                    placeHolder='Contraseña Actual'
                    contra={true}
                    setValor={claveActual}
                    setTextChange={setClaveActual}
                    value={claveActual}
                />
                <Input
                    placeHolder='Nueva Contraseña'
                    contra={true}
                    setValor={clave}
                    setTextChange={setClave}
                    value={clave}
                />
                <Input
                    placeHolder='Confirmar Nueva Contraseña'
                    contra={true}
                    setValor={confirmarClave}
                    setTextChange={setConfirmarClave}
                    value={confirmarClave}
                />
                <Buttons
                    textoBoton='Guardar Cambios'
                    accionBoton={handleUpdatePassword}
                />
                <Buttons
                    textoBoton='Volver al inicio'
                    accionBoton={atras}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAD8C0',
        paddingTop: Constants.statusBarHeight + 5,
    },
    scrollViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    texto: {
        color: '#322C2B', 
        fontWeight: '900',
        fontSize: 20,
        marginBottom: 20
    }
});
