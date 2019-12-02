Генерация слизнечанков для проекта [https://minecraft-galaxy.ru/](https://minecraft-galaxy.ru/)
Сгенерированные карты находятся по пути `maps/slime/`

## Запуск
* `npm run i` - установка пакетов
* `javac calc-chunks.java` - компиляция файла
* Для файла `config.js` заполнить все данные
* `node index.js --map=названиеКарты` - запуск

## Файлы
* `config.json` - список карт (размеры, sid)
* `calc-chunks.java` - алгоритм, вычисляющий все чанки
* `index.js` - основной файл
* `maps/original` - оригинальные карты
* `maps/slime` - сгенерированные карты

###### Структура `config.js`
```js
exports.maps = [
    planetName: {
        size: 0,
        seed: '',
        url:  ''
    },
    ...
]
```
