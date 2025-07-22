FROM node:18-slim

# Evita interacción en instalaciones
ENV DEBIAN_FRONTEND=noninteractive

# Instalamos dependencias necesarias
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-noto-color-emoji \
  fonts-freefont-ttf \
  libx11-dev \
  libxss1 \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libasound2 \
  libxshmfence1 \
  libgbm-dev \
  libxrandr2 \
  libu2f-udev \
  libdrm2 \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Establece directorio de trabajo
WORKDIR /app

# Copia el package.json e instala puppeteer
COPY package*.json ./
RUN npm install

# Copia el resto de archivos
COPY . .

# Expone el puerto (ajusta si es necesario)
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]
