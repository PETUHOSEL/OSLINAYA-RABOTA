// Событие fn-runner → fetch Request → ответ fn-runner.
//
// Origin запроса задаёт платформа (SITE_ORIGIN функции), а не клиент: из
// event.url берётся только путь и query. Тело ответа — base64, Set-Cookie —
// отдельным списком multiValueHeaders (их бывает несколько).
const HOP_BY_HOP = new Set(['set-cookie', 'content-length', 'transfer-encoding', 'connection'])

export function createRunnerHandler(fetchHandler, origin) {
    return async function handler(event) {
        const url = new URL(event.url || '/', origin)
        if (url.origin !== origin) throw new Error('Unexpected origin')
        for (const [key, values] of Object.entries(event.multiValueQueryStringParameters || {})) {
            url.searchParams.delete(key)
            for (const value of values) url.searchParams.append(key, value)
        }
        const method = event.httpMethod || 'GET'
        const request = new Request(url, {
            method,
            headers: new Headers(event.headers),
            body: ['GET', 'HEAD'].includes(method)
                ? undefined
                : Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8'),
        })
        const response = await fetchHandler(request)
        const cookies = response.headers.getSetCookie()
        const headers = Object.fromEntries([...response.headers].filter(([key]) => !HOP_BY_HOP.has(key)))
        return {
            statusCode: response.status,
            headers,
            multiValueHeaders: cookies.length ? {'set-cookie': cookies} : {},
            body: method === 'HEAD' ? '' : Buffer.from(await response.arrayBuffer()).toString('base64'),
            isBase64Encoded: true,
        }
    }
}
