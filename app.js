import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ListView, Keyboard, AsyncStorage } from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';

const filterItems = (filter, items) => {
  return items.filter((item) => {
    if (filter === 'ALL') {
      return true;
    }

    if (filter === 'COMPLETED') {
      return item.complete;
    }

    if (filter === 'ACTIVE') {
      return !item.complete;
    }
  })
}

class App extends Component {

  constructor(props) {
    super(props);

    // ListView takes an object with a 'rowHasChanged' function which helps the list view render efficiently
    const dataSource = new ListView.DataSource({
      // Don't forget to add 'return' if not using inline arrow functions
      rowHasChanged: (r1, r2) => {
        return r1 !== r2;
      }
    });

    this.state = {
      value: "",
      items: [],
      allComplete: false,
      filter: 'ALL',
      // We add the dataSource to our state by using the "DataSource.cloneWithRows()" function
      dataSource: dataSource.cloneWithRows([])
    }

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.setSource = this.setSource.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);
  }

  componentWillMount() {
    /**
     * AsyncStorage.getItem("key") takes in a key of items to gather and returns a Promise,
     * which upon "then" returns a "json" string
     */
    AsyncStorage.getItem("items").then((json) => {
        // try/catch block needed in case json is unparsable
        try {
          const items = JSON.parse(json);
          this.setSource(items, items);
        } catch(e) { 

        }
    })
  }

  setSource(items, itemsDataSource, otherState = {}) {
    this.setState({
      items,
      // This will allow us to keep track of different items than are rendered on the screen
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      // Any other state that anybody gives us
      ...otherState
    });

    // Because all our calls to set items go through this method, we can call AsyncStorage
    // to set the "items" within it
    AsyncStorage.setItem("items", JSON.stringify(items));
  }

  handleClearComplete() {
    // Filter the 'ACTIVE' items
    const newItems = filterItems('ACTIVE', this.state.items);
    // Apply the current filter in the state to the current items in state
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleFilter(filter) {
    console.log(`handle filter ${filter}`)
    // As the 2nd param we filter the items since those are the items we want to display in our ListView
    this.setSource(this.state.items, filterItems(filter, this.state.items), {filter});
  }

  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) {
        return item;
      } else {
        // If key matches then spread the item, but add the new complete flag value
        return {
          ...item,
          complete
        }
      }
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter(item => {
      return item.key !== key;
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems));
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

    this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete});
  }

  handleAddItem() {    
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
    this.setSource(newItems, filterItems(this.state.filter, newItems), { value: ''});
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
                  onRemove={() => this.handleRemoveItem(key)}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  {...value}/>
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator}/>
            }}
          />
        </View>
        <Footer 
          filter={this.state.filter} 
          onFilter={this.handleFilter} 
          count={filterItems("ACTIVE", this.state.items).length}
          onClearComplete={this.handleClearComplete}/>
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