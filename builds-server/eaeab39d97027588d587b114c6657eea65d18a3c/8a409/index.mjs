// Функция fn-runner для опубликованного TanStack Start сайта.
//
// BUILD_ID — id релиза (тот же, что вшит в клиент как VITE_BUILD_ID).
// Вкладка, открытая до публикации, шлёт свой id в x-build-id; на чужой id
// отвечаем 409 + x-reload, и вкладка перезагружается, а не вызывает
// серверную функцию, которой в этом релизе может не быть.
//
// Кэш по умолчанию закрыт: ответ SSR может зависеть от cookies посетителя,
// поэтому без явного Cache-Control от приложения — private, no-store.
import server from './server/server.js'
import {createRunnerHandler} from './runner-adapter.mjs'

const BUILD_ID = process.env.BUILD_ID
const run = createRunnerHandler(server.fetch, process.env.SITE_ORIGIN)

export async function handler(event) {
    const clientBuild = Object.entries(event.headers || {})
        .find(([key]) => key.toLowerCase() === 'x-build-id')?.[1]
    if (clientBuild && clientBuild !== BUILD_ID) {
        return {statusCode: 409, headers: {'x-build-id': BUILD_ID, 'x-reload': '1'}, body: ''}
    }
    const result = await run(event)
    result.headers['x-build-id'] = BUILD_ID
    if (!Object.keys(result.headers).some(key => key.toLowerCase() === 'cache-control')) {
        result.headers['cache-control'] = 'private, no-store'
    }
    return result
}
