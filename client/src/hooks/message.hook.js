import {useCallback} from 'react'

// кастомный хук (в данном случае просто удобная красивая обертка)
// существует для красивого вывода результата для пользователя
export const useMessage = () => {
    return useCallback( (text) => {
        if (window.M && text) {
            window.M.toast({ html: text })
        } 
    }, [])
}