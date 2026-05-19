# KodZen Scapes - Kurulum ve Kullanim Rehberi

## 1. VS Code'da Projeyi Acma

### VS Code Kurulumu
1. https://code.visualstudio.com adresinden VS Code'u indirin ve kurun
2. Onerilen eklentiler:
   - **ESLint** - Kod kalite kontrolu
   - **Tailwind CSS IntelliSense** - CSS otomatik tamamlama
   - **Prisma** - Veritabani sema destegi

### Projeyi Acma
1. VS Code'u acin
2. **File > Open Folder** menusunden proje klasorunu secin
3. Sol alt kosede "Terminal" ikonuna tiklayin veya **Ctrl + `** (backtick) tusuna basin
4. Terminal acildiginda asagidaki komutlari sirasiyla calistirin

## 2. Lokal Kurulum (Bilgisayarinizda Calistirma)

### Gereksinimler
- **Node.js 18+**: https://nodejs.org adresinden indirin (LTS surumu onerilen)
- **npm**: Node.js ile birlikte gelir
- **Git**: https://git-scm.com adresinden indirin

### Adim Adim Kurulum

```bash
# 1. Repoyu bilgisayariniza kopyalayin
git clone https://github.com/Caqlayano8/kodzen-scapes.git

# 2. Proje klasorune girin
cd kodzen-scapes

# 3. Bagimliliklari yukleyin (bu islem birkaç dakika surebilir)
npm install

# 4. Ortam degiskenleri dosyasini olusturun
cp .env.example .env
# Not: .env dosyasindaki JWT_SECRET degerini guvenli bir sekilde degistirin

# 5. Veritabanini olusturun
npx prisma generate
npx prisma db push

# 6. Baslangic verilerini yukleyin (admin hesabi, 60 bolum, ornek reklamlar)
npx tsx prisma/seed.ts

# 7. Gelistirme sunucusunu baslatin
npm run dev
```

### Tek Komut ile Kurulum
```bash
npm run setup
```
Bu komut yukaridaki 3-6 adimlarini otomatik olarak yapar.

### Tarayicida Acma
- http://localhost:3000 - Ana sayfa
- http://localhost:3000/giris - Giris sayfasi
- http://localhost:3000/admin - Yonetim paneli (admin hesabiyla)

### Test Hesaplari
| Rol    | Email                   | Sifre    |
|--------|-------------------------|----------|
| Admin  | admin@kodzenscapes.com  | admin123 |
| Oyuncu | test@kodzenscapes.com   | user123  |

## 3. Hosting'e Kurulum (Canli Yayina Alma)

### Secenek A: Vercel (En Kolay - Ucretsiz)

1. **Vercel Hesabi Olusturun**: https://vercel.com adresine gidin
2. **GitHub ile Giris Yapin**
3. **"New Project"** butonuna tiklayin
4. GitHub reponuzu secin: `kodzen-scapes`
5. **Environment Variables** bolumune asagidakileri ekleyin:
   - `DATABASE_URL` = `file:./dev.db`
   - `JWT_SECRET` = `sizin-gizli-anahtariniz`
6. **"Deploy"** butonuna basin
7. Birkaç dakika icerisinde siteniz yayinda olacak!

### Secenek B: VPS / Sunucu (Tam Kontrol)

```bash
# 1. Sunucuya SSH ile baglanin
ssh kullanici@sunucu-ip-adresi

# 2. Node.js yukleyin (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. PM2 yukleyin (process manager)
sudo npm install -g pm2

# 4. Projeyi klonlayin
git clone https://github.com/Caqlayano8/kodzen-scapes.git
cd kodzen-scapes

# 5. Kurulum yapin
npm install
cp .env.example .env
nano .env  # JWT_SECRET'i degistirin

# 6. Veritabani
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 7. Build alin
npm run build

# 8. PM2 ile baslatin
pm2 start npm --name "kodzen-scapes" -- start
pm2 save
pm2 startup  # Otomatik baslama icin
```

### Secenek C: Docker

```bash
# Dockerfile zaten projede mevcut
docker build -t kodzen-scapes .
docker run -p 3000:3000 -e JWT_SECRET=sizin-anahtariniz kodzen-scapes
```

## 4. Yonetim Paneli Kullanimi

### Giris
1. http://localhost:3000/giris adresine gidin
2. Admin hesabiyla giris yapin: `admin@kodzenscapes.com` / `admin123`
3. Otomatik olarak admin paneline yonlendirileceksiniz

### Dashboard
- Toplam kullanici, bolum, reklam izlenme, kredi harcama istatistikleri

### Kullanici Yonetimi
- Kullanicilarin listesi, kredileri, yildizlari, bolumleri
- **Kredi Tanimla**: 💎 butonuna tiklayarak herhangi bir kullaniciya ucretsiz kredi verebilirsiniz
- **Rol Degistir**: Kullaniciyi admin yapabilirsiniz
- **Ilerleme Sifirla**: Oyuncunun tum ilerlemesini sifirlar
- **Sil**: Kullaniciyi tamamen siler

### Bolum Yonetimi
- 60 bolumun tum ayarlarini duzenleyebilirsiniz
- Zorluk, hamle sayisi, hedef skor, tas turu sayisi
- Engel sayisi, reklam/kredi gereksinimleri
- Bolumleri aktif/pasif yapabilirsiniz

### Reklam Yonetimi
- **Yeni reklam ekleme**: Banner, video veya tam ekran reklam
- **Google Ads**: Ad Unit ID ile Google reklamlari entegrasyonu
- **Ozel reklamlar**: Kendi video/gorsel reklamlarinizi ekleyin
- **Odul ayari**: Her reklam icin verilecek kredi miktari
- **Yerlesim**: Bolum kapisi, bonus odul, magaza, bolumler arasi

### Kredi Islemleri
- Tum kredi hareketlerinin listesi
- Admin tanimlari, reklam odulleri, bolum harcamalari

### Ayarlar
- **Genel**: Oyun adi, logo URL, aciklama, karsilama mesaji
- **Renkler**: Ana renk ve ikincil renk (renk secici ile)
- **Kredi**: Baslangic kredisi, gunluk bonus, reklam odul miktari
- **Bolum Kapisi**: Opsiyonel/zorunlu kapi baslangic bolumleri, bekleme suresi
- **Can Sistemi**: Maksimum can, can yenilenme suresi
- **Google Ads**: Client ID, aktif/pasif
- **Sistem**: Bakim modu

## 5. Oyun Mekanikleri

### Match-3 Nasil Oynanir
1. Bir tasa tiklayin (secilecek)
2. Yanindaki bir tasa tiklayin (yer degistirecek)
3. 3 veya daha fazla ayni renk tas yan yana gelirse patlayip puan kazanirsiniz
4. Hedef skora ulasin!

### Bolum Kapisi Sistemi
- **Bolum 1-14**: Ucretsiz oyna
- **Bolum 15-19**: Reklam izle VEYA kredi harca VEYA 2 saat bekle
- **Bolum 20+**: Reklam izle VEYA kredi harca (bekleme yok)

### Kredi Kazanma Yollari
- Bolumleri tamamlama (yildiz basina 5 kredi)
- Reklam izleme (ayarlara bagli, varsayilan 15 kredi)
- Admin tarafindan tanimlama
- Gunluk bonus

## 6. Sorun Giderme

### "npm install" hatasi
```bash
rm -rf node_modules package-lock.json
npm install
```

### Veritabani hatasi
```bash
rm dev.db
npx prisma db push
npx tsx prisma/seed.ts
```

### Port kullanimda
```bash
# 3001 portunda calistirin
PORT=3001 npm run dev
```
