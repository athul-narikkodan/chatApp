import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Realm from 'realm';

const UserSchema = {
  name: 'User',
  primaryKey: 'username',
  properties: {
    username: 'string',
    password: 'string',
  },
};

const realm = new Realm({ schema: [UserSchema] });

const addUser = (username, password) => {
  realm.write(() => {
    realm.create('User', { username, password });
  });
};

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = realm.objects('User').filtered(`username = "${username}" AND password = "${password}"`);

    if (user.length === 1) {
      // Navigate to the chat screen
      navigation.navigate('Chat');
    } else {
      // Display an error message
      console.log('Invalid username or password');
    }
  };

  const handleRegister = () => {
    const user = realm.objects('User').filtered(`username = "${username}"`);

    if (user.length === 0) {
      // Add the user to the database
      addUser(username, password);

      // Navigate to the chat screen
      navigation.navigate('Chat');
    } else {
      // Display an error message
      console.log('Username already taken');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat App</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    height: 48,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    borderRadius: 5,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    width: '80%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Login;
