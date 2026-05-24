# 1️⃣ בוחרים תמונת בסיס עם Node
FROM node:20-alpine AS build

# 2️⃣ יוצרים ספרייה לעבודה ומגדירים אותה כ־WORKDIR
WORKDIR /app

# 3️⃣ מעתיקים את קבצי ה־package.json וה־package-lock.json
COPY package*.json ./

# 4️⃣ מתקינים את כל התלויות
RUN npm install

# 5️⃣ מעתיקים את כל הקוד לספרייה
COPY . .

# 6️⃣ בונים את הפרויקט ל־production
RUN npm run build

# 7️⃣ בוחרים תמונת Nginx כדי להגיש את הפרויקט
FROM nginx:alpine

# 8️⃣ מעתיקים את התיקיה שנבנתה ל־Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 9️⃣ מעתיקים קובץ קונפיג ל־Nginx אם רוצים (אופציונלי)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 10️⃣ פותחים את פורט 80
EXPOSE 80

# 11️⃣ הפקודה שתתבצע כשמפעילים את הקונטיינר
CMD ["nginx", "-g", "daemon off;"]