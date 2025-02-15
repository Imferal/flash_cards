# Flashcards App

Приложение для изучения слов и фраз на базе React Native (Expo). Позволяет создавать папки и коллекции слов, редактировать карточки, выбирать коллекции для «изучения», а также выполнять анимацию переворота карточек.

## Содержание
- [Основные особенности](#основные-особенности)
- [Требования](#требования)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [База данных](#база-данных)
- [Дополнительно](#дополнительно)

## Основные особенности

### Папки и коллекции
- Иерархический доступ к содержимому (папка → подпапки → коллекции).
- Создание / переименование / удаление / перенос.

### Карточки
- Хранение текстов лицевой и обратной стороны.
- Добавление / удаление / редактирование.
- Поиск (Searchbar) по содержимому (фильтрация по front/back тексту).

### Изучение коллекций
- Список выбранных (selected) коллекций.
- Экран «Учить», где карточки можно переворачивать анимацией и пролистывать.

### SQLite (через Expo) для локального хранения
- CRUD-операции (Create/Read/Update/Delete) по папкам/коллекциям/карточкам.
- Данные сохраняются между сессиями.

### React Native Paper
- Темизация UI: цвета, кнопки, Card, FAB, Dialog.
- Компоненты Switch, Searchbar, IconButton и т.д.

## Требования
- Node.js (версия 20+).
- Установленный Expo CLI (версия 5+) — `npm install -g expo-cli`.
- Установленный пакет менеджер npm или yarn.
- Поддержка React Native (Android/iOS-эмулятор или Expo Go на реальном телефоне).

## Установка и запуск

### Склонируйте репозиторий:
```bash
git clone https://github.com/username/flashcards.git
cd flashcards
```

### Установите зависимости:
```bash
npm install
```
или
```bash
yarn
```

### Запустите Expo:
```bash
npm start
```
или
```bash
yarn start
```

Откройте приложение на эмуляторе или в Expo Go (QR-код в консоли).

## Структура проекта
```
flashcards/
 ┣ app/
 ┃  ┣ (tabs)/folders/      # Экраны работы с папками/коллекциями
 ┃  ┣ (tabs)/study.tsx     # Экран "Учить" (анимация карточек)
 ┃  ┗ _layout.tsx          # Конфигурация вкладок (Tabs)
 ┣ components/
 ┃  ┣ CollectionItem.tsx
 ┃  ┣ FolderItem.tsx
 ┃  ┣ CardItem.tsx
 ┃  ┣ ...
 ┗ data/
    ┣ database.ts          # Инициализация и структура БД (SQLite)
    ┣ folders.db.ts        # Операции CRUD с папками
    ┣ collections.db.ts    # Операции CRUD с коллекциями
    ┣ cards.db.ts          # Операции CRUD с карточками
    ┗ ...

contexts/ — контекст, управляющий состоянием коллекций (выбранные, перезагрузка и пр.).
theme/ — пользовательские темы для React Native Paper (цвета, закругления).
```

## База данных
- `folders`: (id, name, parentFolderId, createdByUser)
- `collections`: (id, name, folderId, createdByUser, selected)
- `cards`: (id, frontText, backText, collectionId, createdByUser)

При первом запуске создаются таблицы, а также базовые наборы (напр. «Английские неправильные глаголы», «200 популярных казахских слов»).

## Дополнительно
- Сброс приложения: можно вызвать `resetAppState()` (удаление таблиц, повторная инициализация).
- Анимации: в экране «Учить» карточки переворачиваются и «улетают» при переключении.
- Реиспользование: проект легко дополняется другими модулями (Toast, Push-уведомления и т. д.).

Приятного использования!
