import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, StatusBar, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';

const supabaseUrl = 'https://vbqksysvvbgadjjevioe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZicWtzeXN2dmJnYWRqamV2aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzY4MDMsImV4cCI6MjA2NzQxMjgwM30.5pIsj9qFIKna6G6OdFzuMsyrHRKH378Q-O_0RP61ttc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Stack = createNativeStackNavigator();

function LinkDeviceScreen({ navigation }) {
  // Aquí puedes agregar la lógica para buscar y vincular el ESP32 vía Bluetooth o WiFi
  return (
    <View style={{ flex: 1, backgroundColor: '#F7EFDF', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0091EA', marginBottom: 20 }}>Enlazar dispositivo</Text>
      <Text style={{ fontSize: 16, color: '#222', marginBottom: 30, textAlign: 'center' }}>
        Aquí podrás buscar y vincular tu dispositivo 'dashcam' con la aplicación.
      </Text>
      {/* Aquí irán los botones y lógica para escanear y vincular */}
      <TouchableOpacity
        style={{
          backgroundColor: '#0091EA',
          borderRadius: 20,
          paddingVertical: 12,
          paddingHorizontal: 32,
        }}
        onPress={() => Alert.alert('Función en desarrollo', 'Aquí se implementará la vinculación con el ESP32.')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Buscar dispositivos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 30 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#0091EA', fontSize: 16 }}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

function ReportIncidentScreen({ navigation, incidentPhotos, setIncidentPhotos }) {
  const [incidentType, setIncidentType] = useState(null);
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState('');

  const incidentOptions = [
    { label: 'Robo de mercancía', key: 'robo' },
    { label: 'Atropellamiento (peatón)', key: 'atropello_peaton' },
    { label: 'Atropellamiento (animal)', key: 'atropello_animal' },
    { label: 'Obstrucción en ruta', key: 'obstruccion' },
    { label: 'Ponchadura', key: 'ponchadura' },
    { label: 'Asalto', key: 'asalto' },
    { label: 'Cuestiones de salud', key: 'salud' },
    { label: 'Incidencias de otro tipo', key: 'otro' },
  ];

  const handleIncidentPress = async (key) => {
    setIncidentType(key);
    setImage(null);
    setDetails('');
    if (key !== 'asalto') {
      // Solicita permisos y abre la cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.5,
        });
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      } else {
        Alert.alert('Permiso denegado', 'No se puede acceder a la cámara.');
      }
    }
  };

  const handleSend = () => {
  if (image) {
    setIncidentPhotos(prev => [
      ...prev,
      { uri: image, date: new Date().toISOString(), details }
    ]);
  }
  Alert.alert('Incidencia enviada', `Tipo: ${incidentType}\nDetalles: ${details}\nImagen: ${image ? 'Sí' : 'No'}`);
  setIncidentType(null);
  setImage(null);
  setDetails('');
  };

  if (incidentType) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7EFDF', padding: 30, marginTop: 40 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0091EA', marginBottom: 16 }}>
          {incidentOptions.find(opt => opt.key === incidentType)?.label}
        </Text>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 16, alignSelf: 'center', borderRadius: 12 }} />
        )}
        <Text style={{ marginBottom: 8, color: '#222' }}>Detalles:</Text>
        <TextInput
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            borderColor: '#bbb',
            borderWidth: 1,
            padding: 10,
            minHeight: 60,
            marginBottom: 16,
            textAlignVertical: 'top',
          }}
          multiline
          placeholder="Describe la incidencia..."
          value={details}
          onChangeText={setDetails}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Enviar incidencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setIncidentType(null)}>
          <Text style={{ color: '#0091EA', fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7EFDF' }}>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={{ alignItems: 'center', marginVertical: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0091EA', marginBottom: 20, paddingTop: 40 }}>Reportar incidencia</Text>
        {incidentOptions.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.button, { width: '80%', marginBottom: 12 }]}
            onPress={() => handleIncidentPress(opt.key)}
          >
            <Text style={styles.buttonText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#0091EA', fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function GalleryScreen({ route, navigation }) {
  // Recibe las fotos por params o usa un estado global/contexto en una app real
  const { incidentPhotos = [] } = route.params || {};

  // Ordena por fecha descendente
  const sortedPhotos = [...incidentPhotos].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7EFDF' }}>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={{ alignItems: 'center', marginVertical: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0091EA', marginBottom: 20, paddingTop: 50 }}>Galería de incidentes</Text>
        {sortedPhotos.length === 0 ? (
          <Text style={{ color: '#222', fontSize: 16 }}>No hay fotos registradas.</Text>
        ) : (
          sortedPhotos.map((photo, idx) => (
            <View key={idx} style={{ marginBottom: 24, alignItems: 'center', width: '90%' }}>
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 280, height: 200, borderRadius: 12, marginBottom: 8 }}
                resizeMode="cover"
              />
              <Text style={{ color: '#0091EA', fontWeight: 'bold' }}>
                {new Date(photo.date).toLocaleString()}
              </Text>
              <Text style={{ color: '#222', fontSize: 15 }}>{photo.details}</Text>
            </View>
          ))
        )}
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#0091EA', fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.replace('Home', { user: data.user });
    }
  };

  return (
    <View style={styles.bg}>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('./images/AxoMotor_horizontal.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>Bienvenido a AxoMotor</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/user.png' }}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmergencyNumbersScreen({ navigation }) {
  const emergencyOptions = [
    {
      label: 'Emergencias',
      icon: 'ambulance',
      number: '911',
    },
    {
      label: 'Servicios públicos',
      icon: 'hard-hat',
      number: '089',
    },
    {
      label: 'Oficina',
      icon: 'headset',
       number: '6641153273',
    },
  ];

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7EFDF' }}>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={{ alignItems: 'center', marginVertical: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0091EA', marginBottom: 20, paddingTop: 40 }}>
          Números de emergencia
        </Text>
        {emergencyOptions.map(opt => (
          <TouchableOpacity
            key={opt.number}
            style={[styles.button, { width: '80%', marginBottom: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => handleCall(opt.number)}
          >
            <FontAwesome5 name={opt.icon} size={22} color="#fff" style={{ marginRight: 12 }} />
            <Text style={styles.buttonText}>{opt.label} ({opt.number})</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#0091EA', fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function EmployeeSettingsScreen({ navigation }) {
  // Simulación de datos del empleado
  const [photo, setPhoto] = useState(null);
  const [phone, setPhone] = useState('6441153273');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Cambiar foto (opcional)
  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería.');
    }
  };

  const handleSavePassword = async () => {
    const esValida = await verificarContraseñaActual(currentPassword);
    if (!esValida) {
      alert('La contraseña actual es incorrecta');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }
    // Aquí llamas al backend para actualizar la contraseña
    actualizarContraseña(newPassword);
  };

  const handleSavePhone = () => {
    setPhone(newPhone);
    setShowPhoneInput(false);
    setNewPhone('');
    Alert.alert('Teléfono actualizado', 'El número telefónico se cambió correctamente.');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7EFDF' }}>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={{ alignItems: 'center', marginVertical: 32 }}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Image
            source={photo ? { uri: photo } : require('./images/Palomito.jpeg')}
            style={{ width: 120, height: 120, borderRadius: 60, marginTop: 35, marginBottom: 16, backgroundColor: '#eee' }}
          />
          <Text style={{ color: '#0091EA', marginBottom: 24, marginLeft: 18 }}>Cambiar foto</Text>
        </TouchableOpacity>

        {/* Cambiar contraseña */}
        <TouchableOpacity
          style={[styles.button, { width: '80%', marginBottom: 16 }]}
          onPress={() => setShowPasswordInput(true)}
        >
          <FontAwesome5 name="key" size={22} color="#fff" style={{ marginRight: 12 }} />
          <Text style={styles.buttonText}>Cambiar contraseña</Text>
        </TouchableOpacity>
        {showPasswordInput && (
          <View style={{ width: '80%', marginBottom: 16 }}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={[styles.button, { marginTop: 8 }]} onPress={handleSavePassword}>
              <Text style={styles.buttonText}>Guardar contraseña</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cambiar número telefónico */}
        <TouchableOpacity
          style={[styles.button, { width: '80%', marginBottom: 16 }]}
          onPress={() => setShowPhoneInput(true)}
        >
          <FontAwesome5 name="phone" size={22} color="#fff" style={{ marginRight: 12 }} />
          <Text style={styles.buttonText}>Cambiar número telefónico</Text>
        </TouchableOpacity>
        <Text style={{ color: '#222', marginBottom: 8 }}>Teléfono actual: {phone}</Text>
        {showPhoneInput && (
          <View style={{ width: '80%', marginBottom: 16 }}>
            <TextInput
              style={styles.input}
              placeholder="Nuevo número"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <TouchableOpacity style={[styles.button, { marginTop: 8 }]} onPress={handleSavePhone}>
              <Text style={styles.buttonText}>Guardar número</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={{ marginTop: 30 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#0091EA', fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function HomeScreen({ route, navigation }) {
  const user = route.params?.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  const handlePanic = async () => {
    try {
      const response = await fetch('http://localhost/AxoMotor_mock/alerts/alert.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user?.email || 'Usuario',
          timestamp: new Date().toISOString(),
          type: 'panic',
        }),
      });
      if (response.ok) {
        Alert.alert('Alerta enviada', 'La alerta de pánico fue enviada correctamente.');
      } else {
        Alert.alert('Error', 'No se pudo enviar la alerta.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7EFDF' }}>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={styles.headerRow}>
        <Image
          source={require('./images/AxoMotor_logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTextHome}>
          Hola de nuevo, {user?.email || 'Usuario'}.
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome5 name="sign-out-alt" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.panicContainer}>
        <TouchableOpacity style={styles.panicButton}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/100/fa314a/circled.png' }}
            style={{ width: 90, height: 90 }}
          />
        </TouchableOpacity>
        <Text style={styles.panicText}>Botón de pánico</Text>
      </View>
      <View style={styles.optionsContainer}>
        <OptionItem icon="link" label="Enlazar dispositivo" onPress={() => navigation.navigate('LinkDevice')} />
        <OptionItem icon="exclamation-triangle" label="Reportar incidencia" onPress={() => navigation.navigate('ReportIncident')} />
        <OptionItem icon="images" label="Galería de incidentes" onPress={() => navigation.navigate('Gallery')}/>
        <OptionItem icon="phone-alt" label="Números de emergencia" onPress={() => navigation.navigate('EmergencyNumbers')} />
        <OptionItem icon="route" label="Iniciar/finalizar viaje" />
        <OptionItem icon="cogs" label="Ajustes de empleado" onPress={() => navigation.navigate('EmployeeSettings')} />
      </View>
    </ScrollView>
  );
}

function OptionItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <FontAwesome5 name={icon} size={24} color="#0091EA" style={{ marginRight: 16 }} />
      <Text style={styles.optionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [incidentPhotos, setIncidentPhotos] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LinkDevice" component={LinkDeviceScreen} />
        <Stack.Screen name="ReportIncident">
          {props => <ReportIncidentScreen {...props} setIncidentPhotos={setIncidentPhotos} />}
        </Stack.Screen>
        <Stack.Screen name="Gallery">
          {props => <GalleryScreen {...props} incidentPhotos={incidentPhotos} />}
        </Stack.Screen>
        <Stack.Screen name="EmergencyNumbers" component={EmergencyNumbersScreen} />
        <Stack.Screen name="Settings" component={LinkDeviceScreen} />
        <Stack.Screen name="EmployeeSettings" component={EmployeeSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#F7EFDF',
  },
  header: {
    backgroundColor: '#0091EA',
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0091EA',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerTextHome: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 12,
  },
  logoutButton: {
    padding: 6,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  form: {
    backgroundColor: '#F7EFDF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    height: 40,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0091EA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 10,
  },
  buttonIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  panicContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  panicButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 4,
    marginBottom: 8,
  },
  panicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  optionsContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 18,
    color: '#222',
  },
});