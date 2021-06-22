// Пишем свой хук
import {useState, useCallback} from 'react';


export const useHttp = () => {

    // определяет, грузится что-то или нет
    const [loading, setLoading] = useState(false);
    // если будут ошибки, запишем сюда
    const [error, setError] = useState(null);

    // в request запишем ответ от сервера
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {

            // если есть body, переводим его в строку для передачи на сервер
            // и чтоб сервер понял, что мы передали JSON, указываем явно тип в headers
            if(body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, { method, body, headers });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Что-то пошло не так");
            }

            setLoading(false);

            return data;
        } catch (error) {
            console.log('---', 'catch ', error.message);
            setLoading(false);
            setError(error.message);
            throw error;
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null);
    }, [])

    return { loading, request, error, clearError };
}
