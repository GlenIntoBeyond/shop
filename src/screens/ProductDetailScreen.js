import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    Text, 
    TouchableOpacity, 
    View,
    StatusBar,
    StyleSheet
} from 'react-native';
import { Surface } from 'react-native-paper';
import Counter from "react-native-counters";
import FlashMessage, { showMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Images from '../images';

import colors from '../utils/colors';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const products = require('../data/products.json');
const { width, height } = Dimensions.get('window');

class ProductDetailScreen extends Component {

    constructor(Props) {
        super(Props);
    }

    state = {
        product: null,
        quantity: 1,
    }
    componentDidMount() {
        let id = this.props.route.params.id;
        this.setState({
            product: this._getProductDetail(id) ?? null
        });
        
    }
    _getProductDetail = (id) => {
        return products.find(product => {
            return product.id == id;
        });
    }

    _getProductImage = (image) => {
        return image ? Images.products[image] : Images.products.default;
    }

    onChange(number, type) {
        this.setState({
            quantity: number
        });
    }

    _renderImage = (product) => {
        return (
            <Surface style={styles.imageContainer}>
                <Image
                    source={this._getProductImage(product.image)} 
                    style={styles.image}
                />
            </Surface>
        )
    }

    _renderNamePrice = (product) => {
        return (
            <View style={{
                flexDirection: 'row',
            }}>
                <Text style={styles.displayName}>
                    {product.display_name}
                </Text>
                <Text style={styles.productPrice}>
                    {'₱' + product.price.toFixed(2)}
                </Text>
            </View>
        );
    }

    _addToCart = async (id) => {
        let cart = await AsyncStorage.getItem('cart');
        let cartArray = [];
        let existingItemIdx = -1;
        if (cart != null) {
            cartArray = JSON.parse(cart);
            existingItemIdx = cartArray.findIndex(item => {
                return id == item.id;
            });
        }
        if (existingItemIdx >= 0) {
            cartArray[existingItemIdx].quantity += this.state.quantity
        } else {
            cartArray.push({
                id,
                quantity: this.state.quantity
            });
        }
        await AsyncStorage.setItem('cart', JSON.stringify(cartArray))
    }

    _renderAddSection = (product) => {
        return (
            <View style={styles.renderAddSection}>
                <View style={styles.renderAddSectionCounter}>
                    <Counter 
                        start={1} 
                        min={1}
                        onChange={this.onChange.bind(this)} 
                        buttonStyle={{
                            borderColor: colors.secondary,
                            padding: 1,
                        }}
                        buttonTextStyle={{
                            color: colors.primary,
                        }}
                        countTextStyle={{
                            color: colors.black,
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.renderAddSectionTouchable}
                    onPress={async () => {
                        this._addToCart(product.id);
                        showMessage({
                            message: "Added to cart",
                            type: "success",
                        });
                    }}
                >
                    <Text style={styles.renderAddSectionText}>
                        {'ADD TO CART'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderDescription = (product) => {
        return (
            <View>
                <Text style={styles.renderdetails}>
                    {'Details'}
                </Text> 
                <Text style={styles.renderdetailsDesc}>
                    {"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
                </Text>
            </View>
        )
    }

    render() {
        const { product } = this.state;
        if (product === null) {
            return (
                <View>
                    <Text>
                        {'Sorry, this product is no longer available.'}
                    </Text>
                </View>
            )
        }
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <StatusBar barStyle='dark-content' backgroundColor={'transparent'} translucent />
                <View style={styles.header}>
                    { this._renderImage(product) }
                    <View style={styles.body}>
                        { this._renderNamePrice(product) }
                        { this._renderDescription(product) }
                        { this._renderAddSection(product) }
                    </View>
                </View>
                <FlashMessage position="bottom" />
            </ScrollView>
        )
    }
}

export default ProductDetailScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    header: {
        paddingBottom: hp(2),
        paddingTop: hp(6),
    },
    body:{
        paddingHorizontal: 20
    },
    imageContainer:{
        alignSelf: 'center',
        justifyContent: 'center',
        
        borderRadius: 5,
        width: wp(90),
        height: hp(40),
        marginVertical: hp(2),

        shadowColor: "#000",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 8,
        backgroundColor: '#fff',
    },
    image:{
        width: wp(90),
        height: hp(40),
        borderRadius: 5,
        resizeMode: 'cover',
    },
    displayName:{
        flex: 7,
        alignSelf: 'center',
        marginTop: 10,
        color: colors.secondary,
        fontSize: hp(2.7),
        fontWeight: 'bold',
        textAlign: 'left',
    },
    productPrice:{
        flex: 3,
        alignSelf: 'flex-end',
        marginTop: 10,
        color: colors.secondary,
        fontSize: hp(2.5),
        fontWeight: 'bold',
        textAlign: 'right',
        textAlignVertical: 'center',
    },
    renderAddSection:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
        width: '100%',
    },
    renderAddSectionCounter:{
        alignContent: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    renderAddSectionTouchable:{
        alignContent: 'center',
        borderRadius: 30,
        backgroundColor: colors.primary,
        marginVertical: hp(2.3),
        width: wp(50),
        height: hp(6),
        alignItems: 'center',
        justifyContent: 'center'
    },
    renderAddSectionText:{
        color: 'white',
        textAlign: 'center',
    },
    renderdetails:{
        color: 'black',
        fontSize: hp(2.8),
        fontWeight: 'bold',
        marginTop: hp(1.5),
        marginBottom: hp(1)
    },
    renderdetailsDesc:{
        color: 'black',
        textAlign: 'justify',
    }
})