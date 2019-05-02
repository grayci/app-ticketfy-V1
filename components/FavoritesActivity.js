import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  Image,
  TouchableWithoutFeedback
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 17,
    paddingRight: 17
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
  btnFav: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center'
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
  }
})

class FavoritesActivity extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      presentations: [],
      search: ''
    }
  }

  static navigationOptions = {
    title: 'Favoritos',
    headerTintColor: '#d13972',
    headerTitleStyle: {
      color: '#838383',
      fontWeight: 'bold',
      fontSize: 20
    }
  }

  componentDidMount = async () => {
    const { navigation } = this.props
    const presentationId = navigation.getParam('presentationId')

    try {
      const presentationsStorage = await AsyncStorage.getItem('presentations')
      const presentations = JSON.parse(presentationsStorage).filter(p => p.id === parseInt(presentationId))
      this.setState({ isLoading: false, presentations: presentations })
    } catch (error) {
      console.log(error)
      alert('Nenhum evento encontrado')
      navigation.navigate('MainActivity')
    }
  }

  render() {
    const { isLoading, presentations } = this.state
    if (isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#838383" />
        </View>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.9 }}>
          <ScrollView style={styles.container}>
            <View style={styles.presentationsContainer} shouldRasterizeIOS={true} renderToHardwareTextureAndroid={true}>
              {presentations.length > 0 ? (
                presentations.map(p => (
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
        </View>
        <View style={{ flex: 0.1, backgroundColor: '#d13972', justifyContent: 'center' }}>
          <Text style={styles.btnFav}>Editar favoritos</Text>
        </View>
      </View>
    )
  }
}

export default FavoritesActivity
