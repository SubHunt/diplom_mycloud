# Разворачиваем приложение на сервере

## Работоспособность данного приложения можно проверить на сервере [MyCloud](http://176.108.254.47/)

1. Для начала нужно выпустить на своем компьютере SSH-ключ, например через терминал командой 
```bash
ssh-keygen
```
2. Далее передим на сайт [reg.ru](https://cloud.reg.ru/) и cоздаем облачный сервер: 

- образ - Ubuntu 24.04 LTS
- тип диска - Стандартный
- тариф - Std C1-M1-D10 (на мой взгяд лучше взять M2 - 2Gb RAM, долго npm install происходит на М1)
- регион размещения - Москва (либо Санкт-Петербург)
- указываем название SSH ключа
- добавляем SSH-ключ, используя ранее сгенерированный публичный SSH-ключ
- даем название серверу
- нажимаем кнопку Заказать сервер
---
После успешной регистрации на вашу почту придет письмо с IP- адресом сервера, логином и паролем. 
3. Открываем терминал от имени администратора и набираем
```bash
ssh root@IP
```
где IP - это ip-адрес вашего сервера и вводим пароль из письма, или от SSH-ключа 

4. Создаем нового пользователя: 
   `adduser <ИМЯ ПОЛЬЗОВАТЕЛЯ>`
   
5. Добавляем созданного пользователя в группу `sudo`: 
   `usermod <ИМЯ ПОЛЬЗОВАТЕЛЯ> -aG sudo` 

6. Выходим из под пользователя `root`: 
   `logout` 

7. Подключаемся к серверу под новым пользователем: 
   `ssh <ИМЯ ПОЛЬЗОВАТЕЛЯ>@<IP АДРЕС СЕРВЕРА>`

   ---

8. Обновляем список доступных пакетов `apt` и их версий из всех настроенных репозиториев, включая PPA, чтобы пользоваться их актуальными релизами:
   ```bash
   sudo apt update
   ```
10. Устанавливаем нужной версии `Python 3.13.1+`:
- Установка необходимых инструментов для добавления PPA:
```bash
sudo apt install software-properties-common
```
- Добавление PPA для установок новых версий Python:
```bash
sudo add-apt-repository ppa:deadsnakes/ppa
```
- Обновление списка пакетов:
```bash
sudo apt update
```
- Установка Python 3.13 и необходимых пакетов для разработки:
```bash
sudo apt install python3.13 python3.13-venv python3.13-dev python3-pip
```
- Проверка установленной версии Python 3.13:
```bash
python3.13 --version`
```
- Настройка Python 3.13 как альтернативы для python3:
```bash
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.13 1`
sudo update-alternatives --config python3`
```
- Проверка версии python3, чтобы убедиться, что всё настроено правильно:
```bash
python3 --version`
```
11. Устанавливаем необходимые пакеты:
```bash
sudo apt install postgresql nginx`
```
12. Заходим в панель `psql` под пользователем `postgres`:
```bash
sudo -u postgres psql`
```
13. Задаем пароль для пользователя `postgres`:
```bash
ALTER USER postgres WITH PASSWORD 'postgres';
```
14. Создаем базу данных:\
```bash
CREATE DATABASE mycloud;
```
15. Выходим из панели `psql`:
```bash
\q
```
17. Проверяем что установлен `git`:\
```bash
git --version
```
18. Клонируем репозиторий:\
```bash
git clone https://github.com/SubHunt/diplom_mycloud.git
```
19. Переходим в папку проекта `mycloud`:\
   `cd /home/<ИМЯ ПОЛЬЗОВАТЕЛЯ>/diplom_mycloud/mycloud`
20. Устанавливаем виртуальное окружение:
```bash
python3 -m venv venv`
```
21. Активируем виртуальное окружение:
```bash
source venv/bin/activate
```
22. Устанавливаем зависимости:
```bash
pip install -r requirements.txt
```
23. В папке `backend` создаем файл `.env` в соответствии с шаблоном:
```bash
nano .env
```
      ```python
         # Настройки Django
         # можно сгенерировать с помощью терминала python: >>> import secrets >>> print(secrets.token_urlsafe(50))
         SECRET_KEY=*******
         # False or True
         DEBUG=False
         # ALLOWED_HOSTS например через запятую: localhost,127.0.0.1,<ИМЯ ДОМЕНА ИЛИ IP АДРЕС СЕРВЕРА> или оставить `*` для всех
         ALLOWED_HOSTS=*

         # Настройки базы данных, что создали на этапе 12-13
         DB_NAME=mycloud
         DB_USER=postgres
         DB_PASSWORD=password
         DB_HOST=localhost
         DB_PORT=5432
      ```

24. Применяем миграции:
```bash
python manage.py migrate
```
25. Создаем администратора (суперпользователя):
```bash
python manage.py createsuperuser
```
    либо готовым скриптом: 
```bash
python manage.py create_admin
```
*Суперпользователь позволят входить как в "Django administration", так и в "Административный интерфейс" на фронте сайта после входа.*
Вы можете предварительно изменить настройки на свои в файле mycloud/users/management/commands/create_admin.py
26. Собираем весь статичный контент в одной папке (`static`) на сервере:
```bash
python manage.py collectstatic`
```
27. Запускаем сервер:
```bash
python manage.py runserver 0.0.0.0:8000
```

После этого уже можно коннектиться к серверу по дресу вашего сервера http://Ваш_ip_сервера:8000/admin/ Например у меня `http://194.67.88.118:8000/admin/`

    ---

28. Проверяем работу gunicorn: \
```bash
gunicorn --bind 0.0.0.0:8000 mycloud.wsgi
```
29. Создаем файл `gunicorn.socket`:\
```bash
sudo nano /etc/systemd/system/gunicorn.socket
```

      ```ini
      [Unit]
      Description=gunicorn socket

      [Socket]
      ListenStream=/run/gunicorn.sock

      [Install]
      WantedBy=sockets.target
      ```

    ---

30. Создаем файл `gunicorn.service`:
```bash
sudo nano /etc/systemd/system/gunicorn.service
```

      ```ini
      [Unit]
      Description=gunicorn daemon
      Requires=gunicorn.socket
      After=network.target

      [Service]
      User=admin
      Group=www-data
      WorkingDirectory=/home/admin/diplom_mycloud/mycloud
      ExecStart=/home/admin/diplom_mycloud/mycloud/venv/bin/gunicorn \
               --access-logfile - \
               --workers 3 \
               --bind unix:/run/gunicorn.sock \
               mycloud.wsgi:application

      [Install]
      WantedBy=multi-user.target
      ```
    ---

31. Запускаем файл `gunicorn.socket`:
```bash
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
```
32. Проверяем статус файла `gunicorn.socket`:
```bash
sudo systemctl status gunicorn.socket
```
33. Убеждаемся что файл `gunicorn.sock` присутствует в папке `/run`:
```bash
file /run/gunicorn.sock
```
34. Проверяем статус `gunicorn`:
```bash
sudo systemctl status gunicorn
```
Если `gunicorn` не активен, то запускаем его:
```bash
sudo systemctl start gunicorn;
```
```bash
sudo systemctl enable gunicorn;
```

    ---

35. Создаем модуль `nginx`:\
```bash
sudo nano /etc/nginx/sites-available/mycloud
```

      ```ini
      server {
         listen 80;
         server_name <ИМЯ ДОМЕНА ИЛИ IP АДРЕС СЕРВЕРА>;
         root /home/admin/diplom_mycloud/frontend/build;
         index index.html index.htm;
         try_files $uri $uri/ /index.html;

         location = /favicon.ico {
            access_log off;
            log_not_found off;
         }

         location /static/ {
            alias /home/admin/diplom_mycloud/mycloud/static/;
         }

         location /media/ {
            alias /home/admin/diplom_mycloud/mycloud/media/;
         }

         location /admindjango/ {
            proxy_pass http://unix:/run/gunicorn.sock;
            include proxy_params;
         }

         location /api/ {
            proxy_pass http://unix:/run/gunicorn.sock;
            include proxy_params;
         }
      }
      ```

36. Создаем символическую ссылку:
```bash
sudo ln -s /etc/nginx/sites-available/mycloud /etc/nginx/sites-enabled
```
37. Добавляем пользователя `www-data` в группу текущего пользователя:
```bash
sudo usermod -a -G ${admin} www-data
```
38. Диагностируем `nginx` на предмет ошибок в синтаксисе:
```bash
sudo nginx -t
```
40. Перезапускаем веб-сервер:
```bash
sudo systemctl restart nginx
```

41. Проверяем статус `nginx`:\
   `sudo systemctl status nginx`
42. При помощи `firewall` даем полные права `nginx` для подключений:\
   `sudo ufw allow 'Nginx Full'`

    ---
43. Устанавливаем [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm):\
   `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
44. Добавляем переменную окружения:

      ```bash
      export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      ```

45. Проверяем версию `nvm`:\
   `nvm -v`
46. Устанавливаем нужную версию `node`:\
   `nvm install <НОМЕР ВЕРСИИ>`
47. Проверяем версию `node`:\
   `node -v`
48. Проверяем версию `npm`:\
   `npm -v`

    ---
49. Переходим в папку проекта `frontend`:\
   `cd /home/<ИМЯ ПОЛЬЗОВАТЕЛЯ>/Diplom_MyCloud/frontend`
50. В папке `frontend/src/services` в файлах `apiService.js` и `authService.js`редактируем базовый URL:\
   `nano apiService.js`\
   `const API_BASE_URL = 'http://<IP АДРЕС СЕРВЕРА>:8000';`
   `nano authService.js`\
   `const API_BASE_URL = 'http://<IP АДРЕС СЕРВЕРА>:8000';
51. Устанавливаем зависимости:\
   `npm i`

    ---

52. В папке `frontend` создаем файл `start.sh`:\
   `nano start.sh`

      ```sh
      #!/bin/bash
      . /home/admin/.nvm/nvm.sh
      npm run build
      ```

53. Делаем файл `start.sh` исполняемым:\
   `sudo chmod +x /home/admin/diplom_mycloud/frontend/start.sh`

    ---

54. Создаем файл `frontend.service`:\
   `sudo nano /etc/systemd/system/frontend.service`

      ```ini
      [Unit]
      Description=frontend service
      After=network.target

      [Service]
      User=admin
      Group=www-data
      WorkingDirectory=/home/admin/diplom_mycloud/frontend
      ExecStart=/home/admin/diplom_mycloud/frontend/start.sh

      [Install]
      WantedBy=multi-user.target
      ```

    ---

55. Запускаем сервис `frontend`:\
   `sudo systemctl start frontend`\
   `sudo systemctl enable frontend`
56. Проверяем статус сервиса `frontend`:\
   `sudo systemctl status frontend`

    ---

57. Проверяем доступность сайта по адресу:\
   `http://<IP АДРЕС СЕРВЕРА>`
58. Проверяем доступность Django administration по адресу:\
   `http://<IP АДРЕС СЕРВЕРА>/admin/`

Помощь по развертыванию черпал из лекции Нетологии и источника [HABR](https://habr.com/ru/articles/501414/)
