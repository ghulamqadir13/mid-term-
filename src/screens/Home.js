import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, TextInput, Switch,
    StyleSheet, I18nManager, ActivityIndicator,
    Image, TouchableOpacity, Linking
} from 'react-native';
import { getLocales } from 'expo-localization';
import { useFetchBooks } from '../hooks/useFetchBooks';
import { server } from '../constants';

const Home = () => {
    const { books, loading, error } = useFetchBooks();
    const [searchQuery, setSearchQuery] = useState('');
    const [isRTL, setIsRTL] = useState(false);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const locales = getLocales();
        const languageCode = locales.length > 0 ? locales[0].languageCode : 'en';
        setIsRTL(languageCode.startsWith('ar'));
    }, []);

    const toggleRTL = () => {
        const newState = !isRTL;
        setIsRTL(newState);
        I18nManager.forceRTL(newState);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search books"
                    onChangeText={text => setSearchQuery(text)}
                />
                <Switch value={isRTL} onValueChange={toggleRTL} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : (
                <FlatList
                    data={filteredBooks}
                    renderItem={({ item }) => (
                        <View style={styles.bookItem}>
                            <Text>Title: {item.title}</Text>
                            <Text>Description: {item.description}</Text>
                            <Text>Is Published: {item.isPublished ? "Yes" : "No"}</Text>
                            <Text>Is Arabic: {item.isArabic ? "Yes" : "No"}</Text>
                            <Text>Author: {item.author.name}</Text>
                            <Text>Category: {item.category.name}</Text>
                            <Text>Book Type: {item.bookType}</Text>
                            <Text>Tags: {item.tags.join(", ")}</Text>
                            <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
                            <Text>Updated At: {new Date(item.updatedAt).toLocaleString()}</Text>
                            <Image source={{ uri: `${server}/${item.coverPhotoUri}` }} style={styles.coverImage} />
                            <TouchableOpacity onPress={() => Linking.openURL(`${server}/${item.fileUri}`)}>
                                <Text style={styles.fileLink}>Open PDF</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item._id}
                />
            )}
        </View >
    );
};

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    bookItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
