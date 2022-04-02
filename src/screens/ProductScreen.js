import React, { useState, useRef } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
} from 'react-native';
import {  Button, Surface } from 'react-native-paper';
import SearchHeader from 'react-native-search-header';

import colors from '../utils/colors';
import Images from '../images';
import { useNavigation } from '@react-navigation/native';

const productData = require('../data/products.json');
const { width, height } = Dimensions.get('window');

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const ProductScreen = () => {
    const [products, setProduct] = useState(productData);
    const [filteredProducts, setFilteredProducts] = useState(productData);

    const navigation = useNavigation();
    const searchHeaderRef = useRef(null);


    const RenderProducts = () => {
        return (
            <View style={{ flex: 1 }}>
                {filteredProducts.length != 0 ?
                    filteredProducts.map((item, index) => {
                        var image = item.image ? Images.products[item.image] : Images.products.default;
                        return (
                            <Surface style={styles.renderProductsSurface}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('ProductDetail', {
                                            id: item.id,
                                            name: item.display_name
                                        });
                                    }}
                                    style={styles.renderProductsTouchable}
                                >
                                    <Image source={image} style={styles.renderProductsImage} />
                                    <View style={styles.renderProductsDetails}>
                                        <Text style={styles.renderProductsDisplayName}>
                                            {item.display_name}
                                        </Text>
                                        <Text style={styles.renderProductsBrand}>
                                            {'Brand: ' + item.brand}
                                        </Text>
                                        <Text style={styles.renderProductsPrice}>
                                            {'₱ ' + item.price.toFixed(2)}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </Surface>
                        )
                    })
                    : null}
            </View>
        )
    }

    const searchProducts = (keyword) => {
        const allProducts = products;
        let filteredProducts = allProducts.filter(prod => {
            if (prod.display_name.indexOf(keyword) > -1
                || prod.brand.indexOf(keyword) > -1
                || prod.category.indexOf(keyword) > -1) {
                return true;
            }
        });
        if (filteredProducts.length > 0) {
            setFilteredProducts(filteredProducts)
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View>
                <StatusBar barStyle='light-content' backgroundColor={'transparent'} translucent />
                <View style={styles.header}>
                    <Button
                        title='Search'
                        color= {colors.primary}
                    onPress = {() => searchHeaderRef.current.show()}
                    />
                </View>
                <SearchHeader
                    ref = { searchHeaderRef }
                    placeholder='Search...'
                    placeholderColor='gray'
                    dropShadowed={false}
                    autoFocus={false}
                    visibleInitially={true}
                    persistent={true}
                    enableSuggestion={true}
                    entryAnimation='from-left-side'
                    iconColor='gray'
                    iconImageComponents={[{
                        name: 'hide',
                        customStyle: {
                            tintColor: 'red'
                        }
                    }, {
                        name: 'pin',
                        customStyle: {
                            tintColor: 'red'
                        }
                    }]}
                    onClear = {() => {
                        setFilteredProducts(products)
                    }}
                    onEnteringSearch = {(event) => {
                        searchProducts(event.nativeEvent.text);
                    }}
                    onSearch = {(event) => {
                        searchProducts(event.nativeEvent.text);
                    }}
                    style={{
                        header: styles.searchHeader,
                        input: styles.searchInputHeader
                    }}
                />
                <RenderProducts />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: hp(18),
        backgroundColor: colors.primary
    },
    searchHeader: {
        height: hp(5.5),
        marginTop: hp(10),
        marginHorizontal: wp(4),
        borderRadius: 19,
        backgroundColor: '#fdfdfd'
    },
    searchInputHeader: {
        fontSize: hp(2),
        margin: 0,
        padding: 0,
        borderRadius: 0,
        backgroundColor: 'transparent'
    },
    renderProductsSurface: {
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 2,
        borderRadius: 5,
        marginVertical: 10,
        width: width * 0.9,

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
    renderProductsTouchable:{
        flexDirection: 'row',
    },
    renderProductsImage:{
        resizeMode: 'cover',
        flex: 4,
        height: height * 0.2,
        width: '100%',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    renderProductsDetails:{
        flex: 6,
        padding: 10,
    },
    renderProductsDisplayName:{
        marginTop: 10,
        color: colors.black,
        fontSize: 16,
        fontWeight: 'bold',
    },
    renderProductsBrand:{
        color: colors.inactiveTab,
        fontSize: 12,
    },
    renderProductsPrice:{
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 20,
    }
});

export default ProductScreen;