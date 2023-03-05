import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Realm from 'realm';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Set up Realm schema and open database connection
  const MessageSchema = {
    name: 'Message',
    properties: {
      message: 'string',
      createdAt: 'date',
    },
  };

  const [realm, setRealm] = useState(null);

  useEffect(() => {
    Realm.open({
      schema: [MessageSchema],
    }).then((realm) => {
      setRealm(realm);
      const messages = realm.objects('Message').sorted('createdAt', true);
      setMessages([...messages]);
    });
  }, [message]);

  // Save message to Realm
  const saveMessage = () => {
    if (message.trim() === '') return;

    const now = new Date();

    realm.write(() => {
      realm.create('Message', {
        message: message,
        createdAt: now,
      });
    });

    setMessage('');
  };

  return (
    <View >
      <View >
        {messages.map((item, index) => (
          <View key={index} style={styles.messageBubble}>
            <Text 
             style={styles.messageText}
            >{item.message}</Text>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
          placeholder="Type your message here"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.button} onPress={saveMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  messageContainer: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: '#e1e1e1',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
