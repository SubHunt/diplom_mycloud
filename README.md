# Diplom_My_cloud
Дипломный проект по профессии «Fullstack-разработчик на Python»

Запуск

Создайте виртуальное окружение
(В программе VSCode комбинация клавиш Ctrl+Shirft+P. В строке поиска наберите 
Python: Create Environment и выберите "Venv Creates .venv virtual environments in current workspace
Появится предложение сразу же установить зависимости из файла requirements.txt в виртуальное окружение,
соглашаемся и шаг с установкой зависимостей можно пропустить
)

python -m venv .venv

Активируйте его
.venv/Scripts/activate

Установите зависимости
pip install -r requirements.txt

либо используйте (установите при необходимости) pipenv
pip install pipenv

и установите зависимости из файла Pipfile
pipenv install

Создайте БД в PgAdmin4 или в терминале
psql 
CREATE DATABASE name_db

Выполните миграции БД
python manage.py migrate

Создайте суперпользователя для админки Django (Для входа в админ-панель)
python manage.py createsuperuser

Запустите сервер Django
python manage.py runserver

Админка доступна по адресу
http://127.0.0.1:8000/admin/

Работа с API
Для удобства просмотра json-формата в браузере Google Chrome, Yandex Browser и подобных рекомендуется установить плагин "json formatter google chrome"
GET-запросы:
/api/v1/users/ - Получение списка пользователей. Если после слеша указать id - получим информацию по конкретному пользователю с данным id.
/api/v1/files/ - Получение списка всех файлов. Если после слеша указать id - получим информацию по конкретному файлу с данным id.




Что сделано...
Установлены Django и React
Установка и подключение БД PostgreSQL mycloud_db
Скрестил Django и React на одном порту.
Создал первичные тестовые модели "Пользователи" и "Файлы". Связь один-ко-многим.
Добавил папку storage, в нее добавляются файлы пользователей, при создании через админку
Создал шаблон и натянул bootstrap для лучшей наглядности записей.
Добавление навигационной панели.
Настройка роутинга между страницами списка файлов и какого-то конкретного
Создание приложения для работы с REST API. Используется фреймворк django-tastypie
Для работы с POST-запросами делаем аутентификацию и авторизацию пользователей.
------
TODO
Добавить свою 404
Возможно изменить логику отображения вместо файлов -> пользователи и переход не к файлу, а к пользователю с его файлами?
API - POST - запросы либо через APIKey  в админке, либо через поле is_admin модели USER