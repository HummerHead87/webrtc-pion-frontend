# chat-frontend
Фронтенд часть для https://github.com/HummerHead87/webrtc-pion-backend   
Webrtc и GraphQl сервер для видео трансляции один стример - много клиентов и чата

## Как запустить
1. развернуть сервер по инструкции в ридми https://github.com/HummerHead87/webrtc-pion-backend
2. git clone https://github.com/HummerHead87/webrtc-pion-frontend
3. cd webrtc-pion-frontend
4. создать файл .env.development.local с содержимым:
```
VUE_APP_GRAPHQL_HTTP=https://192.168.0.107:4001/graphql
VUE_APP_GRAPHQL_WS=wss://192.168.0.107:4001/graphql
```
ip адрес поменять на адрес своего компа   
5. Запустить yarn serve   
6. После сборки открыть в браузере url (SPA приложение), который сгенерит сборщик и добавить ssl сертификат в исключения. Https нужен для доступа к видеокамере и микрофону  
7. Т.к. нам нужен https, то запросы ajax тоже должны идти по https протоколу. Нужно добавить в исключения сертификаты бекенда. Для этого перейти по адресу https://{ваш ip}/graphql в браузере и добавить сертификат в исключения.
8. Вернуться на страницу SPA приложения. Для начала трансляции выбрать Publish stream, указать название стрима в инпуте и нажать publish   
9. Для просмотра стрима зайти на ip адрес SPA приложения в браузере. Выбрать в дропдауне стрим, указать свое имя в инпуте, нажать watch

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
