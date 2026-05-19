# KodZen Scapes - Game Design Document (GDD)
## Next-Generation Cozy Mobile Restoration Game

---

## 1. Oyun Genel Bakisi (Game Overview)

### 1.1 Konsept
KodZen Scapes, Gardenscapes'ten ilham alan ancak daha derin simulasyon, duygusal ilerleme ve yasayan dunya sistemleriyle genisletilmis yeni nesil bir mobil restorasyon oyunudur.

### 1.2 Vizyon
Oyun canli, rahatlatici, gorsel olarak oduillendirici ve duygusal olarak bagimlilik yaratan bir deneyim sunmalidir.

### 1.3 Hedef Kitle
- Yas: 18-45
- Casual ve mid-core oyuncular
- Gardenscapes, Homescapes, Merge Mansion severleri
- Rahatlatici oyun deneyimi arayanlar

### 1.4 Platform
- Mobil (iOS/Android) - Unity ile gelistirme
- Web versiyonu (Next.js - mevcut prototip)

### 1.5 Oyun Dongusu (Core Loop)
```
Bulmaca Coz → Yildiz Kazan → Bahce Restore Et → Yeni Alan Ac → Hikaye Ilerle → Tekrar
```

---

## 2. Restorasyon Sistemi (Restoration System)

### 2.1 Genisletilebilir Bahce Dunyasi
- **Ana Bahce**: Baslangic alani, 50+ dekorasyon noktasi
- **Gizli Orman**: Level 15'te acilir, mistik agaclar ve peri isiklari
- **Golet Alani**: Level 25'te acilir, balik tutma ve su bitkileri
- **Sera**: Level 35'te acilir, egzotik bitkiler yetistirme
- **Kafe**: Level 45'te acilir, NPC'lere hizmet verme
- **Plaj Alani**: Level 55'te acilir, kumsal ve deniz
- **Dag Evi**: Level 70'te acilir, kis temasi

### 2.2 Restorasyon Asamalari
Her alan 5 asamadan gecer:
1. **Kesfet**: Eski/harap alan ilk kez gorulur
2. **Temizle**: Cop, yabani ot, kirik parcalar temizlenir
3. **Onar**: Temel yapilar restore edilir
4. **Dekore Et**: Oyuncu secim yaparak dekore eder
5. **Canlandir**: Alan tamamen canlanir, animasyonlar baslar

### 2.3 Gorunur Donusum
- Her gorev sonrasi aninda gorsel degisim
- Before/After karsilastirma ekrani
- Parlama ve isiltili gecis animasyonlari
- Kamera zoom-out ile buyuk resim gosterimi

### 2.4 Dekorasyon Kategorileri
| Kategori | Ornekler | Yildiz Maliyeti |
|----------|----------|-----------------|
| Cicekler | Gul, Lale, Orkide, Lavanta | 2-8 |
| Agaclar | Cinar, Kavak, Kiraz Agaci | 5-15 |
| Mobilya | Bank, Masa, Salincak, Hamak | 4-12 |
| Su Ogeleri | Cesme, Havuz, Selaleci, Golet | 10-25 |
| Aydinlatma | Fener, Isik Zinciri, Lamba | 3-8 |
| Heykeller | Melek, Hayvan, Soyut | 15-30 |
| Yollar | Tas, Tugla, Ahsap, Mozaik | 2-6 |
| Ozel | Goz Degistiren, Animasyonlu | 20-50 |

---

## 3. Match-3 Bulmaca Sistemi (Puzzle Gameplay)

### 3.1 Temel Mekanikler
- **Tas Eslestirme**: 3+ ayni renk tasi eslestir
- **Cascading**: Ustdeki taslar otomatik duser
- **Gravity**: Yer cekimi yonu degisebilir (ileri seviyeler)
- **Shuffle**: Hamle kalmayinca otomatik karistirma

### 3.2 Tas Turleri
| Tas | Renk | Ozel Guc |
|-----|------|----------|
| Elmas | Kirmizi | Yatay patlama |
| Zumrut | Yesil | Dikey patlama |
| Safir | Mavi | Alan patlama (3x3) |
| Ametist | Mor | L-seklinde patlama |
| Topaz | Sari | Yildiz patlama |
| Yakut | Turuncu | Renk bazli temizleme |
| Inci | Beyaz | Rastgele 5 tas temizle |

### 3.3 Booster Sistemi
| Booster | Olusturma | Etki |
|---------|-----------|------|
| Roket | 4'lu eslestirme | Tum satir/sutun temizler |
| Bomba | L/T seklinde eslestirme | 5x5 alan temizler |
| Gok Kusagi | 5'li eslestirme | Secilen rengin tamamini temizler |
| Dinamit | 2 booster birlestirme | Ekrandaki yarisi temizler |
| Tsunami | Roket+Gok Kusagi | Tum ekrani temizler |

### 3.4 Engel Turleri
| Engel | Ilk Gorus | Ozellik |
|-------|-----------|---------|
| Buz | Level 5 | 1-3 katman, eslestirme ile kirilir |
| Zincir | Level 10 | Tasi kilitler, yaninda eslestirme gerekir |
| Tahta Kutu | Level 15 | 2 darbe ile kirilir |
| Bal | Level 20 | Yayilir, hizli temizlenmeli |
| Kaya | Level 30 | Tasinamaz, etrafinda eslestirme |
| Karanlk | Level 40 | Taslari gizler |
| Portal | Level 50 | Taslari baska yere isinlar |

### 3.5 Dinamik Level Mekanikleri
- **Zaman Bazli**: Bazi levellerde sure siniri
- **Hamle Bazli**: Sinirli hamle sayisi
- **Toplama**: Belirli taslari topla (meyve, yildiz vb.)
- **Engelve Kurtarma**: Hayvanlari kurtar, esyalari indir
- **Boss Level**: Her 10 levelde bir ozel zorluk

### 3.6 Zorluk Siniflari
- **Kolay (1-15)**: 30+ hamle, 5 tas turu, engel yok
- **Orta (16-40)**: 25 hamle, 6 tas turu, temel engeller
- **Zor (41-60)**: 20 hamle, 7 tas turu, coklu engeller
- **Uzman (61-100)**: 15-18 hamle, boss levelleri, ozel mekanikler
- **Efsanevi (101+)**: Canlı etkinlik levelleri, ultra zorluk

---

## 4. Cozy Simulasyon Sistemleri (Cozy Simulation)

### 4.1 Gece/Gunduz Dongusu
- **Sabah (06:00-12:00)**: Sicak isik, kuslar ot, cicekler acilir
- **Ogle (12:00-17:00)**: Parlak gunes, golgelar kisa
- **Aksam (17:00-20:00)**: Altin saat, romantik atmosfer
- **Gece (20:00-06:00)**: Ay isigi, atesi bocekleri, yildizlar

Bahcedeki elemanlar zamana gore degisir:
- Fenerler geceleyin otomatik yanar
- Hayvanlar gece uyur
- Cicekler sabah acilir, gece kapanir
- NPC'ler farkli saatlerde farkli aktiviteler yapar

### 4.2 Dinamik Hava Durumu
| Hava | Efekt | Ozel Olay |
|------|-------|-----------|
| Gunesli | Parlak isik, golge | Kelebek gelir |
| Bulutlu | Yumusak isik | Huzurlu atmosfer |
| Yagmurlu | Yagmur animasyonu, su birikinitileri | Salyangazlar cikar |
| Karlı | Kar taneleri, beyaz ortum | Kardan adam yap (mini oyun) |
| Sisli | Dusuk gorush | Gizli hazine bulma sansi |
| Firtina | Simsek, ruzgar | +%50 bulmaca puani bonusu |

### 4.3 Mevsim Sistemi
- **Ilkbahar**: Cicek acma festivali, pastel renkler
- **Yaz**: Plaj etkinligi, canli renkler
- **Sonbahar**: Hasat festivali, sicak tonlar
- **Kis**: Noel/Yilbasi etkinligi, kar temasi

### 4.4 Ambient Ses Tasarimi
- Kus sesleri (turlere gore farkli)
- Su sesi (cesme, dere, yagmur)
- Ruzgar sesi (yaprak hisjirtisi)
- Bocek sesleri (gece ciricir)
- Yumusak arka plan muzigi (mevsime gore degisir)

### 4.5 Interaktif Hayvanlar
| Hayvan | Acilib Level | Etkilesim |
|--------|-------------|-----------|
| Kedi | 1 | Sevme, top oynama |
| Kopek | 5 | Gezdirme, cop getirme |
| Tavsan | 10 | Besleme, havuc yetistirme |
| Papagan | 20 | Konusma ogretme |
| Balik | 25 | Balik tutma (mini oyun) |
| Sincap | 35 | Findik toplama |
| Kelebek | Mevsimsel | Cicek polenleme |

### 4.6 Rahatlama Bolgeleri
- **Hamak Alani**: Oyuncu karakteri uzanir, ambient ses artar
- **Meditasyon Kosesi**: Nefes egzersizi mini oyunu
- **Okuma Nook**: Oyun ici hikayeleri oku
- **Piknik Alani**: NPC'lerle sohbet et

---

## 5. AI NPC Sistemi (AI-Driven NPCs)

### 5.1 Ana Karakterler
| Karakter | Rol | Kisilik |
|----------|-----|---------|
| Bahcivan Cem | Rehber/Mentor | Sicak, bilge, espri sever |
| Komslu Elif | Arkadas | Enerjik, yaratici, yardmsever |
| Amca Hasan | Usta | Tecrubeli, sabirli, hikaye anlatici |
| Kucuk Deniz | Cocuk | Merakli, oyrenci, sevimli |
| Kedi Mimi | Maskot | Tembel, sevecen, komik |

### 5.2 Dinamik Diyalog Sistemi
- **Durum Bazli**: NPC'ler bahcenin durumuna gore yorum yapar
  - "Vay, bu yeni cicekler harika gorunuyor!"
  - "Burada bir bank olsa ne guzel olur..."
- **Zaman Bazli**: Sabah/aksam farkli selamlamalar
  - Sabah: "Gunaydin! Bugun bahce icin harika bir gun!"
  - Aksam: "Bugun cok guzel is cikardik!"
- **Hava Bazli**: Hava durumuna tepki
  - Yagmur: "Cicekler bu yagmuru cok sevecek!"
  - Kar: "Hadi kardan adam yapalim!"
- **Ilerleme Bazli**: Oyuncunun ilerlemesine gore
  - Yeni alan: "Bu alan cok potansiyelli, hadi temizleyelim!"
  - Basari: "Sen gercek bir bahcivan oluyorsun!"

### 5.3 Iliski Sistemi
- Her NPC icin 0-100 arasi iliski puani
- Hediye verme, diyalog secimi, gorev tamamlama ile artar
- Seviye 25: NPC ozel hikayesi acilir
- Seviye 50: NPC ozel dekoru hediye eder
- Seviye 75: NPC ozel mini oyun acilir
- Seviye 100: NPC ozel animasyon + basari

### 5.4 NPC Gunluk Rutini
```
06:00 - NPC uyanir, bahcede yuruyus
08:00 - Kahvalti (kafe alaninda)
10:00 - Bahce islerine yardim
12:00 - Ogle yemegi
14:00 - Hobi aktivitesi
16:00 - Oyuncuyla etkilesim
18:00 - Aksam rutini
20:00 - Gece aktivitesi
22:00 - Uyuma
```

---

## 6. Sosyal Ozellikler (Social Features)

### 6.1 Arkadas Sistemi
- Arkadas ekleme (kod ile)
- Arkadas listesi ve cevrimici durumu
- Arkadas bahcesini ziyaret etme

### 6.2 Bahce Ziyareti
- Arkadas bahcesinde gezinme (read-only)
- Begenme butonu (gunluk 5 begeni siniri)
- Yorum birakma
- Ilham alma - bahce tasarimini kopyalama secenegi

### 6.3 Takas Sistemi
- Dekorasyon takasi (ender esyalar)
- Booster takasi
- Kaynak takasi (yildiz → kredi donusumu)

### 6.4 Topluluk Etkinlikleri
- Haftalik tema yarismasi ("En guzel gul bahcesi")
- Topluluk hedefleri (toplam 1M cicek dikme)
- Sezonluk turnuvalar
- Ozel odul havuzu

### 6.5 Liderlik Tablosu
- Bahce puani siralmasi
- Bulmaca skoru siralaması
- Koleksiyon tamamlama orani
- Haftalik/aylik/tum zamanlar

---

## 7. Mini Oyunlar (Mini-Games)

### 7.1 Balikcilik
- Golet alaninda erisilebilir
- Zamanlama bazli mekanik (dogru anda tikla)
- 20+ balik turu, ender baliklar
- Akvaryum doleme odulu

### 7.2 Sera Yonetimi
- Tohum ekme → sulama → hasat dongusu
- Egzotik bitki turleri
- Otomatik sulama sistemi yukseltmesi
- Ciçek pazarinda satma

### 7.3 Hazine Avi
- Bahcede gizli hazineler
- Ipucu tabanlı arama
- Gunluk yeni hazine
- Ender koleksiyon parcalari

### 7.4 Kafe Yonetimi
- NPC siparisleri alma
- Yemek hazirlama (zamanlama oyunu)
- Dekorasyon ile musteri memnuniyeti
- Ozel tarifler acma

### 7.5 Evcil Hayvan Bakimi
- Besleme, temizleme, oynama
- Kiyafet giydirme
- Numara ogretme
- Hayvan yarismasi

### 7.6 Bahce Yarisi
- Zamana karsi bahce duzenleme
- NPC'lere karsi yarisma
- Haftalik turnuva

---

## 8. Gorsel Tasarim (Visual Style)

### 8.1 Sanat Yonu
- Stilize yari-gercekci (Gardenscapes benzeri)
- Sicak, davetkar renk paleti
- Yumusak kenarlarda, yuvarlak formlar
- Zengin detaylar ama temiz gorunum

### 8.2 Renk Paleti
```
Ana Renkler:
- Gokyuzu: #87CEEB → #5BA3D9
- Cim: #4A8C3F → #2D6A2E
- Ahsap: #8B5E3C → #C7925A
- Altin: #FFD700 → #FFA500

Mevsimsel Renkler:
- Ilkbahar: #FFB7C5, #98FB98, #FFE4B5
- Yaz: #FF6347, #00CED1, #FFD700
- Sonbahar: #D2691E, #FF8C00, #8B4513
- Kis: #B0E0E6, #F0F8FF, #C0C0C0
```

### 8.3 UI/UX Tasarim Ilkeleri
- Tahta panel estetigi (Gardenscapes stili)
- Buyuk, net ikonlar
- Akici gecisler ve animasyonlar
- Tek elle oynanabilir layout
- Minimum text, maksimum gorsel iletisim

### 8.4 Animasyon Standartlari
- 60 FPS hedefi
- Fizik bazli animasyonlar (bounce, spring)
- Particle effectler (isiltik, yaprak, su damlasi)
- Kamera: Smooth follow, pinch zoom, pan

---

## 9. Tutma ve Psikoloji (Retention & Psychology)

### 9.1 Ilerleme Geri Bildirimi
- Her aksiyonda gorsel/sesli geri bildirim
- Yildiz kazanma animasyonu
- Seviye atlama kutlamasi
- Before/After gosterimi

### 9.2 Dopamin Odul Dongusu
```
Kisa Doungui (1-5 dk):
Bulmaca Coz → Aninda Odul → Tatmin

Orta Doungui (1 gun):
Gunluk Giris → Gorevler → Oduller → Bahce Gelisimi

Uzun Doungui (1-4 hafta):
Alan Acma → Hikaye → Karakter Iliskisi → Duygusal Baglantı
```

### 9.3 Duygusal Sahiplik
- "Benim bahcem" hissi
- NPC'lerle duygusal bag
- Zaman yatirimi gorsellestirilir
- Basarilar ve hatiralar galerisi

### 9.4 Dusuk Frustrasyon Tasarimi
- Kaybedince 3 ek hamle secenegi (reklam izle)
- Zorluk dinamik olarak ayarlanir
- Ipucu sistemi (takilinca otomatik yardim)
- Negatif surecler minimumda

### 9.5 Gunluk Mekanikler
| Mekanik | Odul | Amac |
|---------|------|------|
| Gunluk giris | Artan oduller (7 gunluk) | Rutini olustur |
| Gunluk gorev (3 adet) | Yildiz + Kredi | Kisa oturum |
| Bahce bakimi | +%10 puan bonusu | Her gun don |
| NPC hediyesi | Iliski +5 | Karakter bagi |
| Gizli hazine | Ender esya sansi | Kesfet |

---

## 10. Monetizasyon (Monetization)

### 10.1 Etik Monetizasyon Ilkeleri
- Pay-to-win DEGIL, pay-to-express
- Tum icerik oynanarak erisilebilir
- Kozmetik oncelikli
- Sinirsiz can sistemi (bekleme yok)

### 10.2 Gelir Kaynaklari
| Kaynak | Fiyat Araligi | Aciklama |
|--------|---------------|----------|
| Dekorasyon Paketleri | $0.99-$4.99 | Tematik dekor setleri |
| Sezon Karti | $4.99/ay | Ozel oduller, +%20 puan |
| Booster Paketi | $0.99-$2.99 | Ekstra hamle, bomba vb |
| Premium Para Birimi | $0.99-$99.99 | Kredi satin alma |
| Reklam Kaldirma | $2.99 | Kalici reklam kaldirma |
| Ozel Hayvanlar | $1.99-$9.99 | Nadir evcil hayvanlar |
| VIP Uyelik | $9.99/ay | Tum premiumlar dahil |

### 10.3 Reklam Sistemi
- Odullu video: Ekstra hamle, booster, kredi
- Interstitial: Sadece level arasi (5 dakikada 1)
- Banner: Sadece menu ekranlarinda
- Kullanici tercihi ile reklam sikligi ayarlanabilir

### 10.4 Sezon Karti Detayi
- 30 gunluk ilerleme yolu
- Ucretsiz yol: Temel oduller
- Premium yol: Ozel dekorlar, ender hayvanlar, ekstra boosterlar
- Her sezon yeni tema (Ilkbahar Festivali, Yaz Karnavali vb.)

---

## 11. Teknik Yapi (Technical Architecture)

### 11.1 Web Versiyonu (Mevcut - Next.js)
```
Frontend: Next.js 15 + React 19 + TypeScript
Styling: Tailwind CSS 4 + Custom CSS
Database: Prisma + SQLite
Auth: Custom JWT
State: React State + Server Actions
Canvas: HTML5 Canvas (match-3 board)
```

### 11.2 Mobil Versiyonu (Gelecek - Unity)
```
Engine: Unity 2023 LTS
Language: C#
UI: Unity UI Toolkit
Rendering: URP (Universal Render Pipeline)
Audio: FMOD / Wwise
Analytics: Firebase Analytics
Ads: AdMob / IronSource
IAP: Unity IAP
Backend: Firebase / PlayFab
```

### 11.3 Backend Mimarisi
```
API: REST + WebSocket (gercek zamanli)
Database: PostgreSQL (production)
Cache: Redis
CDN: CloudFlare
Auth: OAuth2 + JWT
Push: Firebase Cloud Messaging
```

### 11.4 Moduler Icerik Sistemi
- JSON tabanli level tanimlari
- Asset bundle sistemi (Unity)
- Hot-swap dekorasyon paketleri
- A/B testing altyapisi

### 11.5 Kayit Senkronizasyonu
- Bulut kayit (otomatik)
- Cihazlar arasi senkronizasyon
- Offline oynama destegi
- Conflict resolution (son yazma kazanir)

---

## 12. Yol Haritasi (Roadmap)

### Faz 1: MVP (Mevcut - Web)
- [x] Match-3 bulmaca motoru
- [x] 60 bolum
- [x] Bahce dekorasyon sistemi
- [x] Uyelik sistemi
- [x] Admin paneli
- [x] Monetizasyon temeli

### Faz 2: Cozy Genisleme (Simdiki Sprint)
- [ ] Gece/gunduz dongusu
- [ ] Dinamik hava durumu
- [ ] AI NPC diyalog sistemi
- [ ] Mini oyunlar (balikcilik, sera)
- [ ] Sosyal ozellikler
- [ ] Mevsimsel etkinlikler
- [ ] Gelismis match-3 mekanikleri

### Faz 3: Derinlestirme
- [ ] Evcil hayvan sistemi
- [ ] Kafe yonetimi
- [ ] Topluluk etkinlikleri
- [ ] Sezon karti sistemi
- [ ] Liderlik tablolari

### Faz 4: Mobil (Unity)
- [ ] Unity'ye port
- [ ] Mobil optimizasyon
- [ ] App Store/Play Store yayinlama
- [ ] Push notification
- [ ] Bulut kayit

---

## 13. KPI Hedefleri

| Metrik | Hedef | Aciklama |
|--------|-------|----------|
| D1 Retention | %45+ | 1. gun geri donus |
| D7 Retention | %25+ | 7. gun geri donus |
| D30 Retention | %12+ | 30. gun geri donus |
| Oturum Suresi | 15+ dk | Ortalama oturum |
| Gunluk Oturum | 3+ | Gunde kac kez acilir |
| ARPDAU | $0.05+ | Gunluk kullanici geliri |
| LTV | $3+ | Yasam boyu deger |

---

## 14. Oyun Akis Semasi

```
Ana Menu
  ├── Oyuna Basla → Seviye Haritasi → Bulmaca → Sonuc
  ├── Bahcem → Bahce Gorunumu → Dukkan → Dekore Et
  ├── NPC'ler → Diyalog → Gorevler → Oduller
  ├── Mini Oyunlar → Balikcilik / Sera / Kafe / Hazine
  ├── Sosyal → Arkadaslar → Ziyaret → Takas
  ├── Magaza → Paketler → Sezon Karti → Kremdi
  ├── Profil → Istatistikler → Basarilar → Ayarlar
  └── Etkinlikler → Mevsimsel → Topluluk → Turnuva
```

---

*Bu doküman KodZen Scapes projesinin kapsamli oyun tasarim rehberidir.*
*Versiyon: 2.0 | Tarih: Mayıs 2026*
