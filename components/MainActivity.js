import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import { presentations } from '../mock'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 17,
    paddingRight: 17
  },
  search: {
    borderWidth: 2,
    borderColor: '#d13972',
    height: 60,
    padding: 20
  },
  highlights: {
    fontWeight: 'bold',
    fontSize: 22,
    paddingTop: 20,
    paddingBottom: 20,
    color: '#838383'
  },
  presentationsContainer: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  presentationImage: {
    flexDirection: 'column',
    width: 160,
    height: 84,
    backgroundColor: '#d13972'
  },
  presentationBox: {
    flexDirection: 'column',
    width: 160,
    height: 84,
    backgroundColor: '#f7f7f7',
    marginBottom: 20,
    padding: 20
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#d13972'
  },
  eventDate: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#838383',
    paddingTop: 5
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconSearch: {
    position: 'absolute',
    right: 20,
    top: 20
  }
})

class MainActivity extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      presentations: [],
      search: ''
    }
  }

  static navigationOptions = {
    title: 'Ticketfy'
  }

  updateSearchInput = async (text, field) => {
    try {
      this.setState({ ...this.state, [field]: text })
      let filtredPresentation = []
      if (text === '' || text === '' || text === null) {
        const presentationsStorage = await AsyncStorage.getItem('presentations')
        filtredPresentation = JSON.parse(presentationsStorage)
        this.setState({ presentations: filtredPresentation })
      }
    } catch (error) {
      alert('Erro na busca')
    }
  }

  componentDidMount = async () => {
    try {
      await AsyncStorage.setItem('presentations', JSON.stringify(presentations))
      this.setState({ isLoading: false, presentations: presentations })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { isLoading, presentations, search } = this.state
    const filtredPresentations = presentations.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    if (isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#838383" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View>
          <TextInput
            style={styles.search}
            placeholder={'Buscar evento'}
            value={search}
            onChangeText={text => this.updateSearchInput(text, 'search')}
          />
          <Icon name="search" size={16} color="#d13972" style={styles.iconSearch} />
        </View>
        <View>
          <Text style={styles.highlights}>Destaques</Text>
        </View>

        <View style={styles.presentationsContainer} shouldRasterizeIOS={true} renderToHardwareTextureAndroid={true}>
          {filtredPresentations.length > 0 ? (
            filtredPresentations.map(p => (
              <TouchableWithoutFeedback
                key={p.id}
                onPress={() => {
                  this.props.navigation.navigate('EventsActivity', {
                    presentationId: p.id
                  })
                }}
              >
                <View style={styles.mainBoxEvent}>
                  <View
                    style={styles.presentationImage}
                    shouldRasterizeIOS={true}
                    renderToHardwareTextureAndroid={true}
                  >
                    <Image
                      source={p.image}
                      style={{ width: 160, height: 84 }}
                      shouldRasterizeIOS={true}
                      renderToHardwareTextureAndroid={true}
                    />
                  </View>

                  <View style={styles.presentationBox}>
                    <Text style={styles.eventTitle}>{p.name}</Text>
                    <Text style={styles.eventDate}>{p.date}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))
          ) : (
            <Text>Nenhum evento encontrado!</Text>
          )}
        </View>
      </ScrollView>
    )
  }
}

export default MainActivity
