# LearnSphere

A modern, personalized learning platform built with Laravel, Tailwind CSS, and modern frontend enhancements.

## 🚀 Features
- Futuristic glassmorphism UI
- Animated backgrounds (particles.js)
- Dark/light mode with smooth toggle
- Interactive cards and microinteractions
- Modular Laravel backend

## 🛠️ Prerequisites
- PHP >= 8.1
- Composer
- Node.js & npm
- Git
- MySQL or SQLite (or your preferred database)

## ⚡ Getting Started

### 1. Clone the repository
```sh
git clone git@github.com:wth-aryan/LearnSphere.git
cd LearnSphere
```

### 2. Install PHP dependencies
```sh
composer install
```

### 3. Install Node.js dependencies
```sh
npm install
```

### 4. Copy and configure environment variables
```sh
cp .env.example .env
```
- Edit `.env` and set your database credentials and other settings as needed.

### 5. Generate application key
```sh
php artisan key:generate
```

### 6. Run migrations and seeders
```sh
php artisan migrate --seed
```

### 7. Build frontend assets
```sh
npm run build
```

### 8. Start the development server
```sh
php artisan serve
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

## 🌑 Dark Mode
- Toggle dark/light mode using the moon/sun icon in the navbar.

## 🎨 Customization
- Particle background config: `public/particles.json`
- Main UI: `resources/views/welcome.blade.php`
- Tailwind config: `tailwind.config.js`

## 🧑‍💻 Author
**Created by Aryan**

## 📄 License
See [LICENSE](LICENSE) for details. Attribution to Aryan must remain in all copies and substantial portions of the software.
