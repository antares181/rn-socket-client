import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
const net = require('net');
import TcpSocket from 'react-native-tcp-socket';


const App = () => {

  const [chatters, setChatters] = useState([]);
  const [activeHost, setActiveHost] = useState('');
  const [activePort, setActivePort] = useState('');
  const [message, setMessage] = useState('');

  const updateChatter = (msg) => {
    setChatters((oldValue) => {
      return oldValue.concat([msg]);
    });
  };

  const testConnection = () => {
    // Create socket
    const client = TcpSocket.createConnection({
      port: activePort,
      host: activeHost
    }, () => {
      // Write on the socket
      client.write(message || 'Hellow from client');
      updateChatter(message || 'Hellow from client');
      // Close socket
      // client.destroy();
    });

    client.on('data', function (data) {
      updateChatter('message was received', data);
    });

    client.on('error', function (error) {
      updateChatter(error);
    });

    client.on('close', function () {
      updateChatter('Connection closed!');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>CLIENT</Text>
      {/* <Text>host: {HOST}</Text>
      <Text>port: {PORT}</Text> */}
      <View style={styles.inputContainer}>
        <TextInput placeholder="HOST" style={styles.input} value={activeHost} onChangeText={(val) => setActiveHost(val)} />
        <View style={styles.separator} />
        <TextInput placeholder="PORT" style={styles.input} value={activePort} onChangeText={(val) => setActivePort(val)} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput placeholder="MESSAGE" style={styles.input} value={message} onChangeText={(val) => setMessage(val)} />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => testConnection()}>
        <Text>TEST SERVER CONNECTION</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        {chatters.map((msg, index) => {
          return (
            <Text key={index} style={styles.welcome}>
              {index} {msg}
            </Text>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    marginBottom: 20,
    marginLeft: 10
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  separator: {
    width: 30,
    height: 30
  },
  button: { backgroundColor: 'orange', height: 60, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }
});

export default App;
