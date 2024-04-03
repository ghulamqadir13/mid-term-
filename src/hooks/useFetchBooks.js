import { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../constants';

export const useFetchBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(`${server}/books`);
                if (!res.data) {
                    throw new Error('Failed to fetch books');
                }
                setBooks(res.data.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return { books, loading, error };
};
