import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    Text, 
    TouchableOpacity, 
    View,
    FlatList,
    RefreshControl, 
} from 'react-native';
import { Surface } from 'react-native-paper';
import Counter from "react-native-counters";
import AntIcon from 'react-native-vector-icons/AntDesign';

import colors from '../utils/colors';
import Images from '../images';
import AsyncStorage from '@react-native-async-storage/async-storage';

const products = require('../data/products.json');
const { width, height } = Dimensions.get('window');
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { color } from 'react-native-reanimated';

class CartScreen extends Component {

    constructor(Props) {
        super(Props);
    }

    state = {
        cartProducts: [],
        cart: [],
        total: 0,
        refreshing: false,
        EditId: 0,
    }

    

    async componentDidMount() {
        this._getCart();
    }

    _getCart = async () => {
        let cart = await AsyncStorage.getItem('cart');
        let cartArray = []
        if (cart != null) {
            cartArray = JSON.parse(cart);
        }
        this.setState({
            cart: cartArray
        })
        this._getProducts();
    }

    _getProducts = () => {
        let { cart } = this.state;
        let cartProducts = [], total = 0;
        cart.forEach(cartItem => {
            const product = products.find(product => {
                return product.id == cartItem.id;
            });
            if (product) {
                product.quantity = cartItem.quantity;
                product.totalPrice = cartItem.quantity * product.price;
                total += product.totalPrice;
                cartProducts.push(product);
            }
        });
        this.setState({
            cartProducts,
            total,
            refreshing: false
        }, () => {})
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._getCart();
        })
    }

    _renderProducts = () => {
        return (
            <FlatList
                data={this.state.cartProducts}
                renderItem={this._renderProductItem}
                ListEmptyComponent={this._renderListEmptyComponent}
                refreshControl={
                    <RefreshControl
                        colors={[colors.primary, colors.secondary]}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh} 
                    />
                }
            />
        );
    }

    _getProductImage = (image) => {
        return image ? Images.products[image] : Images.products.default;
    }

    _removeToCart = async (id) => {
        const removeIndex = this.state.cartProducts.filter((item, index) => {
            return item.id != id
        })
        const toPush = []
        removeIndex.forEach((i) => toPush.push({
            id: i.id,
            quantity: i.quantity
        }))
        await AsyncStorage.setItem('cart', JSON.stringify(toPush))
        this._getCart();
    }

    onChange(number, type) {
        this._addToCart(this.state.EditId, number);
    }
    

    _addToCart = async (id, number) => {
        let cart = await AsyncStorage.getItem('cart');
        let cartArray = [];
        let existingItemIdx = -1;
        if (cart != null) {
            cartArray = JSON.parse(cart);
            existingItemIdx = cartArray.findIndex(item => {
                return id == item.id;
            });
        }
        cartArray[existingItemIdx].quantity = number
        await AsyncStorage.setItem('cart', JSON.stringify(cartArray))
        this._getCart();
    }

    _renderProductItem = ({item, index}) => {
        let image = this._getProductImage(item.image);
        return (
            <View style={{
                flex: 1
            }}>
                <Surface
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        elevation: 2,
                        borderRadius: 5,
                        marginBottom: 10,
                        width: width,
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity 
                            style={{
                                width: '100%',
                                flex: 2,
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('ProductDetail', {
                                    id: item.id,
                                    name: item.display_name
                                });
                            }}
                        >
                            <View style={{
                                backgroundColor: 'white',
                                height: height * 0.2,
                            }}>
                                <Image source={image} style={{
                                    height: '100%',
                                    resizeMode: 'cover',
                                    width: '100%',
                                }} />
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            flex: 6,
                            padding: 10,
                        }}>
                            <Text style={{
                                marginTop: 10,
                                color: "black",
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>
                                {item.display_name}
                            </Text>
                            <Text style={{
                                color: colors.primary,
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}>
                                {'₱ ' + item.totalPrice.toFixed(2)}
                            </Text>
                            <View style={{
                                marginTop: 10,
                            }}>
                                {this.state.EditId == item.id?
                                    <View>
                                    <Counter
                                        start={item.quantity}
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
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                                            left: wp(10),
                                            maxWidth: wp(10.5),
                                            width: wp(10.5),
                                            height: hp(4.6),
                                            zIndex: 1,
                                            position: 'absolute',
                                            fontSize: hp(2.7),
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: colors.black,
                                            backgroundColor: colors.white
                                        }}>{item.quantity}</Text>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={()=>{
                                            this.setState({
                                                EditId: item.id
                                            })
                                        }}
                                        style={{
                                            maxWidth: wp(15),
                                            paddingVertical: hp(1),
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: colors.secondary
                                        }}
                                    >
                                        <Text>EDIT</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={{
                            flex: 1,
                            padding: 10,
                            alignItems: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                this._removeToCart(item.id)
                            }}
                        >
                            <AntIcon style={[{ color: colors.spice }]} size={25} name={'delete'} />
                        </TouchableOpacity>
                        </View>
                    </View>
                </Surface>
            </View>
        )
    }

    _renderListEmptyComponent = () => {
        return (
            <View style={{ 
                padding: 20,
                alignSelf: 'center',
                flex: 1,
                justifyContent: 'center',
            }}>
                <Text style={{ 
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                }}>
                    {'Your cart is empty'}
                </Text>
            </View>
        )
    }
    _renderTotalSection = () => {
        return (
            <View style={{
                paddingTop: 10,
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                }}>
                    <Text style={{
                        flex: 1,
                        color: colors.black,
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}>
                        {'TOTAL:'}
                    </Text>
                    <Text style={{
                        color: 'black',
                        flex: 1,
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'right',
                    }}>
                        {'₱ ' + this.state.total.toFixed(2)}
                    </Text>
                </View>
                <View style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    marginTop: 15,
                }}>
                    <TouchableOpacity style={{
                            backgroundColor: colors.primary,
                            padding: 15,
                            borderRadius: 30,
                            width: width * 0.8,
                        }}>
                        <Text style={{
                            color: colors.white,
                            textAlign: 'center',
                        }}>
                            {'CHECKOUT'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{
                flexDirection: 'column',
                flex: 1,
            }}>
                <View style={{
                    flex: 9
                }}>
                    {this._renderProducts()}
                </View>
                <View style={{
                    flex: 2,
                    backgroundColor: colors.white,
                }}>
                {this._renderTotalSection()}
                </View>
            </View>
        )
    }
}

export default CartScreen;