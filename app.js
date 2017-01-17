import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ListView, Keyboard } from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';

class App extends Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 !== r2;
      }
    });

    this.state = {
      value: "",
      items: [],
      allComplete: false,
      dataSource: dataSource.cloneWithRows([])
    }

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.setSource = this.setSource.bind(this);
  }

  setSource(items, itemsDataSource, otherState = {}) {
    this.setState({
      items,
      // This will allow us to keep track of different items than are rendered on the screen
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      // Any other state that anybody gives us
      ...otherState
    });
  }

  handleToggleAllComplete() {    

    // We keep track of the value set in the 'allComplete'
    const complete = !this.state.allComplete;

    // We map through all the todos, spreading them and just changing their 'completed' prop
    // based on 'this.state.allComplete'
    const newItems = this.state.items.map(item => ({
      ...item,
      complete
    }));

    console.table(newItems);

    this.setSource(newItems, newItems, {allComplete: complete});
  }

  handleAddItem() {
    console.log('handleAddItem');
    if (!this.state.value) {
      return;
    }

    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ];

    // Set the state adding the new todo and removing the value in the input
    this.setSource(newItems, newItems, { value: ''});
  }

  render() {
    return (
      <View style={styles.container}>
        <Header value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          {/*Since we are not hiding the keyboard, whenever someone scrolls the ListView we will hide it*/}
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({key, ...value}) => {
              return (
                <Row 
                  key={key}
                  {...value}/>
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator}/>
            }}
          />
        </View>
        <Footer/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",    
    ...Platform.select({
      ios: {paddingTop: 30}      
    })
  },
  content: {
    flex: 1
  },
  list: {
    backgroundColor: '#FFF',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#F5F5F5'
  }
})

export default App;