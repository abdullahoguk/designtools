# designtools

`designtools.abdullahog.uk` — tarayıcıda çalışan küçük tasarım araçları. Her araç kendi klasöründe; build adımı yok, düz HTML/CSS/JS.

```
/                       → araç listesi (index.html)
/cuttingmatwallpaper/   → kesim matı duvar kağıdı üreteci
```

Yeni araç eklemek: `/<aracadi>/index.html` klasörü oluştur, kökteki `index.html` listesine bir satır ekle. Asset yollarını `/<aracadi>/...` şeklinde mutlak ver.

## Yerelde çalıştırma

```sh
python3 -m http.server 8000
# http://localhost:8000/cuttingmatwallpaper/
```

## Cloudflare Pages

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → bu repoyu bağla.
2. Framework preset: **None**, Build command: *(boş)*, Build output directory: **`/`**.
3. Deploy sonrası Custom domains → `designtools.abdullahog.uk` ekle (DNS Cloudflare'deyse CNAME otomatik oluşur).

`main`'e her push otomatik yayınlanır; diğer branch'ler önizleme URL'si alır.

## Cutting Mat Wallpaper

- Desenler: ızgara, artı, karma, nokta, düz; hücre sayısı, ana çizgi aralığı, ara bölmeler
- Cetvel sayıları, çerçeve, 45° köşegen ve 15/30/60/75° açı çizgileri, kenar yazısı
- Hazır veya özel söz + açıklama paragrafı, 8 yazı tipi, metnin arkasını ızgaraya oturtarak temizleme
- Işık gölgesi (jaluzi / yaprak / karışık), gren, vinyet
- Telefon, tablet, masaüstü presetleri + "bu ekran" + özel boyut; tam çözünürlükte PNG/JPG
- Tüm ayarlar URL hash'inde — link paylaşılabilir
