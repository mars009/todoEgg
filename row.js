// This file contains the row that will be passed into the ListView.renderRow(...)

import React, { Component } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

class Row extends Component {

    render() {
      const {complete} = this.props;
      
      return (
          <View style={styles.container}>
            <Switch value={complete}
              onValueChange={this.props.onComplete}/>
            <View style={styles.textWrap}>
              {/*This style applies the 'complete' style when the todo is marked as complete*/}
              <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
            </View>
            <TouchableOpacity onPress={this.props.onRemove}>
              <Text style={styles.destroy}>X</Text>
            </TouchableOpacity>
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
  destroy: {
    fontSize: 20,
    color: '#CC9A9A'
  },
  // Add 10 pixels of margin on both sides and a flex of 1 so our wrapper aligns correctly next to the switch
  textWrap: {
    flex: 1,
    marginHorizontal: 10    
  },
  complete: {
    textDecorationLine: 'line-through'
  },
  text: {
    fontSize: 24,
    color: '#4D4D4D'
  }
})

export default Row;