// This file contains the row that will be passed into the ListView.renderRow(...)

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Row extends Component {

    render() {
      return (
          <View style={styles.container}>
            <Text style={styles.text}>{this.props.text}</Text>
          </View>
      )  
    }

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    // 'flext-start' with 'alignItems' will render items towards the top
    alignItems: 'flex-start',
    // will render contents across the way with space in between them
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 24,
    color: '#4D4D4D'
  }
})

export default Row;