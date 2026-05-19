# KodZen Scapes - Match-3 Bulmaca Oyunu

Gardenscapes benzeri bir match-3 bulmaca oyunu. Bulmaca coz, bahceni guzellestir!

## Ozellikler

### Oyun
- **60 Bolum**: Kolay (1-15), Orta (16-40), Zor (41-60) zorluk seviyeleri
- **Match-3 Mekanigi**: HTML5 Canvas tabanli, animasyonlu tas eslestirme
- **Yildiz Sistemi**: Her bolumde 1-3 yildiz kazanin
- **Kombo Sistemi**: Ard arda eslesmelerde kombo bonusu
- **Engeller**: Ileri seviyelerde kirilamaz bloklar

### Ekonomi Sistemi
- **Kredi/Altin**: Oyun ici para birimi
- **Reklam Izleme**: Video reklam izleyerek kredi kazanma
- **Bolum Kapisi**: 15. bolumden sonra reklam/kredi/bekleme secenegi
- **Zorunlu Kapi**: 20. bolumden sonra reklam veya kredi zorunlu
- **Bekleme Suresi**: Opsiyonel kapida 2 saat bekleme secenegi

### Uyelik Sistemi
- Kayit olma (isim, email, sifre)
- Giris / Cikis
- Profil sayfasi (kredi, yildiz, ilerleme)
- JWT tabanli oturum yonetimi

### Bahce Sistemi
- Yildizlarla bahce esyasi satin alma
- 10 farkli bahce esyasi (cicek, agac, havuz, bank, heykel vb.)
- Bahce gorunumu

### Yonetim Paneli (Admin)
- **Dashboard**: Genel istatistikler
- **Kullanici Yonetimi**: Kullanici listesi, rol degistirme, kredi tanimlama, silme, ilerleme sifirlama
- **Bolum Yonetimi**: 60 bolumun tum ayarlari (zorluk, hamle, hedef skor, engel, reklam/kredi gereksinimleri)
- **Reklam Yonetimi**: Reklam ekleme/duzenleme/silme, Google Ads entegrasyonu, ozel video/gorsel reklam
- **Kredi Islemleri**: Tum kredi hareketleri (tanimlama, harcama, reklam odulleri)
- **Ayarlar**: Oyun adi, logo, aciklama, renkler, kredi ayarlari, reklam kapisi ayarlari, Google Ads Client ID, bakim modu

### Google Ads Entegrasyonu
- Google Ads Client ID ayari
- Reklam birimleri yonetimi (banner, video, tam ekran)
- Ozel reklam video/gorsel destegi
- Izlenme ve tiklama istatistikleri

## Teknolojiler

- **Next.js 15** - React Framework
- **TypeScript** - Tip guvenligi
- **Tailwind CSS 4** - Stil
- **Prisma 6** - ORM / Veritabani
- **SQLite** - Veritabani
- **JWT (jose)** - Kimlik dogrulama
- **HTML5 Canvas** - Oyun motoru
- **bcryptjs** - Sifre hashleme

## Kurulum

### Gereksinimler
- Node.js 18+
- npm

### Adimlar

```bash
# 1. Repoyu klonlayin
git clone https://github.com/Caqlayano8/kodzen-scapes.git
cd kodzen-scapes

# 2. Bagimliliklari yukleyin
npm install

# 3. .env dosyasini olusturun
cp .env.example .env

# 4. Veritabanini olusturun ve seed yapin
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 5. Gelistirme sunucusunu baslatin
npm run dev
```

Tarayicinizda [http://localhost:3000](http://localhost:3000) adresini acin.

### Hizli Kurulum (Tek Komut)
```bash
npm run setup
```

## Test Hesaplari

| Rol   | Email                    | Sifre    |
|-------|--------------------------|----------|
| Admin | admin@kodzenscapes.com   | admin123 |
| Oyuncu| test@kodzenscapes.com    | user123  |

## VS Code'da Acma

1. VS Code'u acin
2. **File > Open Folder** ile proje klasorunu secin
3. Terminal acin (Ctrl+`)
4. `npm run dev` komutu ile gelistirme sunucusunu baslatin
5. Tarayicinizda http://localhost:3000 adresine gidin

## Hosting'e Kurulum

### Vercel (Onerilen)
1. [vercel.com](https://vercel.com) adresinde hesap olusturun
2. GitHub reponuzu baglayin
3. Environment Variables ekleyin:
   - `DATABASE_URL`: Veritabani baglanti adresi
   - `JWT_SECRET`: Guvenlik anahtari
4. Deploy butonuna basin

### VPS / Sunucu
```bash
# Sunucuya baglanin
ssh user@sunucu-ip

# Repoyu klonlayin
git clone https://github.com/Caqlayano8/kodzen-scapes.git
cd kodzen-scapes

# Kurulum
npm install
cp .env.example .env
# .env dosyasini duzenleyin

npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Build ve baslat
npm run build
npm run start
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Proje Yapisi

```
kodzen-scapes/
├── prisma/
│   ├── schema.prisma      # Veritabani semasi
│   └── seed.ts            # Baslangic verileri
├── src/
│   ├── app/
│   │   ├── page.tsx        # Ana sayfa
│   │   ├── giris/          # Giris sayfasi
│   │   ├── kayit/          # Kayit sayfasi
│   │   ├── oyun/           # Oyun sayfasi + bolumler
│   │   ├── bahce/          # Bahce sayfasi
│   │   ├── profil/         # Profil sayfasi
│   │   ├── admin/          # Yonetim paneli
│   │   │   ├── kullanicilar/  # Kullanici yonetimi
│   │   │   ├── bolumler/      # Bolum yonetimi
│   │   │   ├── reklamlar/     # Reklam yonetimi
│   │   │   ├── krediler/      # Kredi islemleri
│   │   │   └── ayarlar/       # Oyun ayarlari
│   │   └── actions/        # Server Actions
│   ├── components/
│   │   └── game/
│   │       └── GameBoard.tsx  # Oyun tahtasi (Canvas)
│   └── lib/
│       ├── auth.ts         # Kimlik dogrulama
│       ├── db.ts           # Veritabani baglantisi
│       └── game-engine.ts  # Oyun motoru
├── .env.example
├── package.json
└── README.md
```

## Lisans

MIT
