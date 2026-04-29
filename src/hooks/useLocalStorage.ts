import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
    const getStoredValue = (): T => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                return JSON.parse(item) as T;
            }
            return initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
            console.log(`💾 Saved to localStorage (${key}):`, storedValue);
        } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    const removeValue = () => {
        try {
            localStorage.removeItem(key);
            setStoredValue(initialValue);
            console.log(`🗑️ Removed localStorage key: ${key}`);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;