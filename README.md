# IELTS Prep - Installation Guide (Windows)

A Laravel + React application for IELTS writing practice with student, tutor, and admin roles.

---

## Prerequisites

Download and install the following software:

1. **PHP 8.2+** — Download from https://windows.php.net/download (use VS16 x64 Thread Safe zip)
2. **Composer** — Download from https://getcomposer.org/download/
3. **Node.js 20+** — Download from https://nodejs.org (LTS version)
4. **MySQL 8.0+** — Download from https://dev.mysql.com/downloads/installer/ (choose "MySQL Installer for Windows", use the full or web installer)
5. **Git** — Download from https://git-scm.com/download/win

> After installing, restart your terminal so the commands are available.

---

## Step-by-Step Setup

### 1. Extract the zip

Extract `ielts.zip` to any folder, e.g. `C:\Users\YourName\Desktop\ielts`.

### 2. Open terminal in the project folder

Open **Command Prompt** or **PowerShell**, then:

```bash
cd C:\Users\YourName\Desktop\ielts
```

### 3. Install PHP dependencies

```bash
composer install
```

### 4. Install Node.js dependencies

```bash
npm install
```

### 5. Create environment file

```bash
copy .env.example .env
```

### 6. Edit the .env file

Open the `.env` file in a text editor (e.g. Notepad) and update the database settings:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ielts_laravel
DB_USERNAME=root
DB_PASSWORD=
```

> If you set a password during MySQL installation, put it in `DB_PASSWORD=`.

### 7. Create the MySQL database

Open a new terminal and run:

```bash
mysql -u root -p
```

Enter your MySQL password (or press Enter if you didn't set one), then run:

```sql
CREATE DATABASE ielts_laravel;
EXIT;
```

### 8. Generate application key

```bash
php artisan key:generate
```

### 9. Run database migrations and seed demo data

```bash
php artisan migrate --seed
```

This creates the tables and adds demo users.

### 10. Create storage link

```bash
php artisan storage:link
```

### 11. Start the application

Run both the backend and frontend together:

```bash
npm run dev
```

Or run them separately in two terminals:

**Terminal 1 — Laravel backend:**
```bash
php artisan serve
```

**Terminal 2 — Vite frontend:**
```bash
npx vite
```

### 12. Open in browser

Go to: **http://localhost:8000**

---

## Demo Accounts

All demo accounts use the password: **password**

| Role    | Email               |
|---------|---------------------|
| Admin   | admin@ielts.test    |
| Tutor   | tutor@ielts.test    |
| Student | student@ielts.test  |

---

## Common Issues

### "php is not recognized"
Add PHP to your system PATH:
1. Search "Environment Variables" in Windows search
2. Edit the `Path` variable under System variables
3. Add the folder where you extracted PHP (e.g. `C:\php`)
4. Restart your terminal

### "composer is not recognized"
Re-run the Composer installer and make sure "Add to PATH" is checked. Restart your terminal.

### "node is not recognized"
Re-run the Node.js installer. Restart your terminal.

### "mysql is not recognized"
Add MySQL to your system PATH:
1. Search "Environment Variables" in Windows search
2. Edit the `Path` variable under System variables
3. Add `C:\Program Files\MySQL\MySQL Server 8.0\bin` (adjust version if different)
4. Restart your terminal

### PHP MySQL extension not enabled
Edit your `php.ini` file (in your PHP folder) and uncomment (remove the `;`):
```
extension=pdo_mysql
extension=mysqli
```

### SQLSTATE[HY000] [2002] Connection refused
Make sure MySQL is running:
1. Open **Services** (search "Services" in Windows search)
2. Find **MySQL** or **MySQL80**
3. Right-click and select **Start**

### Port 8000 already in use
```bash
php artisan serve --port=8080
```
Then open http://localhost:8080 instead.
