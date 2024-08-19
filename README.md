# Audio Separator

Bu proje, kullanıcıların müzik dosyalarını yükleyip vokal ve enstrümantal olarak ayırmalarını sağlayan bir web uygulamasıdır. Proje, modern web geliştirme teknolojileri kullanılarak geliştirilmiştir.

## Özellikler

- **Dosya Yükleme:** Kullanıcılar müzik dosyalarını yükleyebilir.
- **Müzik Ayrıştırma:** Yüklenen dosyalar Spleeter kullanılarak vokal ve enstrümantal olarak ayrılır.
- **Sonuç Görüntüleme:** Ayrıştırılmış dosyalar kullanıcıya gösterilir ve indirilebilir.

## Kullanılan Teknolojiler

### Frontend

- **HTML5:** Projenin temel yapısını oluşturmak için kullanıldı.
- **CSS3:** Sayfa düzeni ve stilini belirlemek için kullanıldı.
- **JavaScript:** Dinamik içerik yönetimi, kullanıcı etkileşimleri ve AJAX istekleri için kullanıldı.

### Backend

- **Node.js:** Sunucu tarafında çalıştırılan JavaScript kodları için kullanıldı.
- **Express.js:** Node.js üzerinde çalışan web uygulamaları için minimal ve esnek bir framework olarak kullanıldı.
- **Multer:** Dosya yükleme işlemleri için kullanıldı.
- **Spleeter:** Deezer tarafından geliştirilen, müzik parçalarını vokal ve enstrümantal olarak ayırmak için kullanılan bir araçtır.
- **Docker:** Spleeter'ı izole bir ortamda çalıştırmak için kullanıldı.
- **FFmpeg:** WAV formatındaki dosyaları MP3 formatına dönüştürmek için kullanıldı.

### Diğer Teknolojiler

- **AJAX:** Sunucuya dosya yükleme ve yanıtları işleme işlemleri için kullanıldı.
- **FormData API:** Dosya yükleme işlemleri için kullanıldı.
- **DOM Manipülasyonu:** HTML ve CSS ile oluşturulan sayfa yapısının dinamik olarak değiştirilmesi için kullanıldı.
- **Event Handling:** Kullanıcı etkileşimlerini (tıklama, dosya seçme vb.) yönetmek için kullanıldı.
- **CSS Animations:** Yükleme ve analiz animasyonları için kullanıldı.

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js
- Docker

### Adımlar

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/kullanici-adi/audio-separator.git
   cd audio-separator
2. **Gerekli Paketleri Yükleyin**
   ```bash
   npm install
4. **Docker Container Başlat**
   ```bash
   docker run -d -v $(pwd)/output:/output researchdeezer/spleeter
5. **Uygulamayı başlat**
   ```bash
   npm start
7. **Tarayıcıda Aç**
   ```bash
   Tarayıcıda Açın: http://localhost:3000


**UYGULAMA GÖRSELLERİ**
<hr>
<img src="https://github.com/muratozkol/AudioSeperator/blob/main/a.png?raw=true" width="320" height="180">
<br>
<img src="https://github.com/muratozkol/AudioSeperator/blob/main/b.png?raw=true" width="320" height="180">
<br>
<img src="https://github.com/muratozkol/AudioSeperator/blob/main/c.png?raw=true" width="320" height="180">
<br>
<img src="https://github.com/muratozkol/AudioSeperator/blob/main/d.png?raw=true" width="320" height="180">
<br>
<img src="https://github.com/muratozkol/AudioSeperator/blob/main/e.png?raw=true" width="320" height="180">
