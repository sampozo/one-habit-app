# One Habit 🌑

Una aplicación móvil minimalista diseñada para ayudarte a construir **un solo hábito a la vez**. Basada en la filosofía de simplicidad extrema para principiantes.

## 🚀 Características Premium
- **Enfoque Único:** Solo puedes tener un hábito activo. Elimina la parálisis por análisis.
- **Diseño Glassmorphism:** Interfaz moderna con efectos de cristal y desenfoque profundo.
- **Haptic Feedback:** Respuesta táctil al completar tu hábito diario (vía Capacitor Haptics).
- **Estadísticas de Racha:** Visualización clara de tu progreso mensual y mejores marcas.
- **Zero-Backend:** Privacidad total, tus datos se guardan localmente en tu dispositivo.

## 🛠 Stack Tecnológico
- **Core:** HTML5, CSS3 (Custom Variables + Flexbox/Grid), JS (ES6+).
- **Mobile Engine:** [Capacitor JS](https://capacitorjs.com/).
- **Bundler:** [Vite](https://vitejs.dev/).
- **Tipografía:** Outfit & JetBrains Mono (vía Google Fonts).

## 📦 Construcción Local

Para generar el APK localmente:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Compilar el proyecto web:**
   ```bash
   npm run build
   ```

3. **Sincronizar con Android:**
   ```bash
   npx cap sync
   ```

4. **Abrir en Android Studio:**
   ```bash
   npx cap open android
   ```

## 🤖 Automatización CI/CD
Este repositorio utiliza **GitHub Actions** para compilar automáticamente el APK cada vez que se realiza un push a la rama `main`. El APK resultante estará disponible en la sección de "Releases".

---
Desarrollado con el Protocolo **Maestro** por Antigravity.
