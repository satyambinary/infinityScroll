import React, { Component } from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  StyleSheet 
} from 'react-native';

// presentational components
// import BeerPreviewCard from './components/BeerPreviewCard';

// app theme
// import { colors } from './config/theme';

// axios service
// import axiosService from './utils/lib/axiosService';

// screen height and width
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});


export default class AllBeersScreen extends Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    filtering: false,
    refreshing: false,
    error: null
  };

  componentDidMount() {
    this._fetchAllBeers();
  }

  _fetchAllBeers = () => {
    const { page } = this.state;
    const URL = `https://api.punkapi.com/v2/beers?page=${page}&per_page=10`
    // const URL = `/beers?page=${page}&per_page=10`;

     fetch(URL)
    .then((response) => response.json())
    .then((json) => {
      // return json.movies;
      this.setState((prevState, nextProps) => ({
        data:
          page === 1
            ? Array.from(json)
            : [...this.state.data, ...json],
        loading: false,
        loadingMore: false,
        refreshing: false
      }));
    })
    .catch((error) => {
      this.setState({ error, loading: false });
    });

    // axiosService
    //   .request({
    //     url: URL,
    //     method: 'GET'
    //   })
    //   .then(response => {
    //     this.setState((prevState, nextProps) => ({
    //       data:
    //         page === 1
    //           ? Array.from(response.data)
    //           : [...this.state.data, ...response.data],
    //       loading: false,
    //       loadingMore: false,
    //       refreshing: false
    //     }));
    //   })
    //   .catch(error => {
    //     this.setState({ error, loading: false });
    //   });
  };

  _handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this._fetchAllBeers();
      }
    );
  };

  _handleLoadMore = () => {
    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true
      }),
      () => {
        this._fetchAllBeers();
      }
    );
  };

  _renderFooter = () => {
    if (!this.state.loadingMore) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: width,
          height: height,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          // borderColor: colors.veryLightPink
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return !this.state.loading ? (
      <FlatList
        // contentContainerStyle={{
        //   flex: 1,
        //   flexDirection: 'column',
        //   height: '100%',
        //   width: '100%'
        // }}
        numColumns={2}
        data={this.state.data}
        renderItem={({ item }) => (
          <View
            style={{
              marginTop: 25,
              width: '50%'
            }}
          >
            <Text> name: {item.name} 
            image:{item.image_url}
            </Text>
            <Image
          style={styles.tinyLogo}
          source={{uri:  item.image_url}}
        />
            

            {/* <BeerPreviewCard name={item.name} imageUrl={item.image_url} /> */}
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        // ListHeaderComponent={this._renderHeader}
        ListFooterComponent={this._renderFooter}
        onRefresh={this._handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this._handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
      />
    ) : (
      <View>
        <Text style={{ alignSelf: 'center' }}>Loading beers</Text>
        <ActivityIndicator />
      </View>
    );
  }
}