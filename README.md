# Questify

Questify — це веб-застосунок, створений для перетворення повсякденних завдань на захоплюючу гру. Він дозволяє користувачам створювати, відстежувати та виконувати завдання (`Tasks`) і виклики (`Challenges`), організовуючи їх у зручному та інтерактивному інтерфейсі. Додаток допомагає гейміфікувати рутину та підвищити продуктивність.

## Функціонал

-   **Автентифікація користувача**: Реєстрація та вхід у систему за допомогою email та пароля.
-   **Створення завдань**: Можливість додавати два типи карток: звичайні завдання (`Task`) та виклики (`Challenge`).
-   **Редагування та видалення**: Користувачі можуть редагувати всі параметри завдань та видаляти їх із підтвердженням.
-   **Система статусів**: Завдання можна позначати як виконані (`Complete`), після чого вони переміщуються до секції "DONE".
-   **Сортування та групування**: Картки автоматично групуються за часом виконання ("TODAY", "TOMORROW") та сортуються за типом (`Task` перед `Challenge`) і часом.
-   **Секції-акордеони**: Групи завдань можна згортати та розгортати для зручності.
-   **"Палаючі" завдання**: Візуальне сповіщення (іконка вогню) з'являється, якщо до дедлайну завдання залишається менше години.
-   **Автоматичне оновлення**: Інтерфейс автоматично оновлюється щохвилини для актуалізації статусу "палаючих" завдань без перезавантаження сторінки.

## Технології

-   **React**: Основна бібліотека для побудови користувацького інтерфейсу.
-   **TypeScript**: Для статичної типізації та підвищення надійності коду.
-   **Vite**: Сучасний та швидкий інструмент для збірки проєкту.
-   **TanStack Query (React Query)**: Для керування станом сервера, кешування даних та автоматичного оновлення.
-   **Axios**: HTTP-клієнт для взаємодії з REST API.
-   **Formik & Yup**: Для керування формами та валідації даних.
-   **React Hot Toast**: Для відображення спливаючих повідомлень (сповіщень).
-   **React Icons**: Бібліотека для використання іконок.
-   **CSS Modules**: Для локалізації стилів та уникнення конфліктів імен класів.

## Структура Проєкту

```
/src
├── assets/                 # Шрифти, SVG та інші статичні ресурси
├── components/
│   ├── api/                # Централізований екземпляр Axios з інтерсепторами
│   ├── App/                # Головний компонент застосунку
│   ├── Header/             # Хедер сторінки
│   ├── LandingPage/        # Сторінка входу та реєстрації
│   ├── QuestCard/          # Компонент для відображення та редагування "Task"
│   ├── QuestCardChallenge/ # Компонент для відображення та редагування "Challenge"
│   ├── QuestCardCompleted/ # Компонент для виконаних завдань
│   ├── QuestCardCreate/    # Компонент-форма для створення нових карток
│   ├── QuestCardModalDelete/ # Модальне вікно підтвердження видалення
│   ├── QuestDashboard/     # Головний дашборд з усіма картками
│   ├── QuestGroup/         # Компонент-акордеон для груп завдань
│   ├── context/
│   │   ├── AuthContext.tsx # Створення об'єкту контексту
│   │   └── AuthProvider.tsx# Компонент-провайдер з логікою автентифікації
│   ├── data/
│   │   └── constants.ts    # Глобальні константи (рівні складності, категорії)
│   ├── hooks/
│   │   ├── useAuth.ts      # Хук для доступу до AuthContext
│   │   └── useOnClickOutside.ts # Хук для відстеження кліків поза елементом
│   ├── services/
│   │   ├── authService.ts  # Функції для запитів, пов'язаних з автентифікацією
│   │   └── cardService.ts  # Функції для CRUD-операцій з картками
│   ├── types/
│   │   ├── auth.ts         # TypeScript-типи для автентифікації
│   │   └── card.ts         # TypeScript-типи для карток
│   └── utils/
│       └── dateUtils.ts    # Допоміжні функції для роботи з датами
├── index.css               # Глобальні стилі та підключення шрифтів
└── main.tsx                # Вхідна точка застосунку
```

---

# Questify (English Version)

Questify is a web application designed to turn everyday tasks into an exciting game. It allows users to create, track, and complete tasks and challenges, organizing them in a user-friendly and interactive interface. The app helps to gamify routines and increase productivity.

## Features

-   **User Authentication**: Sign up and log in using an email and password.
-   **Quest Creation**: Ability to add two types of cards: regular `Tasks` and `Challenges`.
-   **Editing and Deletion**: Users can edit all task parameters and delete them with a confirmation step.
-   **Status System**: Quests can be marked as `Complete`, after which they are moved to the "DONE" section.
-   **Sorting and Grouping**: Cards are automatically grouped by their due date ("TODAY", "TOMORROW") and sorted by type (`Task` before `Challenge`) and time.
-   **Accordion Sections**: Task groups can be collapsed and expanded for convenience.
-   **"Due Soon" Quests**: A visual notification (a fire icon) appears if a quest's deadline is less than an hour away.
-   **Automatic Refresh**: The UI automatically updates every minute to reflect the status of "due soon" quests without needing a page reload.

## Technologies Used

-   **React**: The primary library for building the user interface.
-   **TypeScript**: For static typing and enhancing code reliability.
-   **Vite**: A modern and fast build tool for the project.
-   **TanStack Query (React Query)**: For managing server state, caching data, and automatic updates.
-   **Axios**: An HTTP client for interacting with the REST API.
-   **Formik & Yup**: For form management and data validation.
-   **React Hot Toast**: For displaying toast notifications.
-   **React Icons**: A library for using icons.
-   **CSS Modules**: For localizing styles and avoiding class name conflicts.

## Project Structure

```
/src
├── assets/                 # Fonts, SVGs, and other static assets
├── components/
│   ├── api/                # Centralized Axios instance with interceptors
│   ├── App/                # Main application component
│   ├── Header/             # Page header
│   ├── LandingPage/        # Login and registration page
│   ├── QuestCard/          # Component for displaying and editing "Task" cards
│   ├── QuestCardChallenge/ # Component for displaying and editing "Challenge" cards
│   ├── QuestCardCompleted/ # Component for completed quests
│   ├── QuestCardCreate/    # Form component for creating new cards
│   ├── QuestCardModalDelete/ # Modal for delete confirmation
│   ├── QuestDashboard/     # Main dashboard with all quest cards
│   ├── QuestGroup/         # Accordion component for quest groups
│   ├── context/
│   │   ├── AuthContext.tsx # Context object creation
│   │   └── AuthProvider.tsx# Provider component with authentication logic
│   ├── data/
│   │   └── constants.ts    # Global constants (difficulties, categories)
│   ├── hooks/
│   │   ├── useAuth.ts      # Hook for accessing AuthContext
│   │   └── useOnClickOutside.ts # Hook for detecting clicks outside an element
│   ├── services/
│   │   ├── authService.ts  # Functions for authentication-related API requests
│   │   └── cardService.ts  # Functions for card CRUD operations
│   ├── types/
│   │   ├── auth.ts         # TypeScript types for authentication
│   │   └── card.ts         # TypeScript types for cards
│   └── utils/
│       └── dateUtils.ts    # Helper functions for date manipulation
├── index.css               # Global styles and font imports
└── main.tsx                # Application entry point
```
