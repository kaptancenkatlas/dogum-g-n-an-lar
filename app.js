const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHElpAhDb5RvveOdawTGA4zYcPcuZOAtOAOPCY51h3LW_ez4VIJ9f5bSSag3lZIRzOGA/exec";

function konfetiPatlat() {
    const renkler = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#ffd166', '#06d6a0', '#118ab2'];
    for (let i = 0; i < 120; i++) {
        const konfeti = document.createElement('div');
        konfeti.style.position = 'fixed';
        konfeti.style.width = Math.random() * 10 + 6 + 'px';
        konfeti.style.height = Math.random() * 10 + 6 + 'px';
        konfeti.style.backgroundColor = renkler[Math.floor(Math.random() * renkler.length)];
        konfeti.style.left = Math.random() * 100 + 'vw';
        konfeti.style.top = '-20px';
        konfeti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        konfeti.style.zIndex = '9999';
        konfeti.style.pointerEvents = 'none';
        document.body.appendChild(konfeti);

        const sure = Math.random() * 3 + 2;
        const yatayKayma = (Math.random() - 0.5) * 200;

        konfeti.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${yatayKayma}px, 105vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: sure * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });

        setTimeout(() => konfeti.remove(), sure * 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    konfetiPatlat();

    const form = document.getElementById('ani-formu') || document.querySelector('form');
    const isimKutusu = document.getElementById('gonderen-adi') || document.querySelector('input[type="text"]');
    const metinKutusu = document.getElementById('ani-mesaji') || document.querySelector('textarea');
    const dosyaKutusu = document.getElementById('fotograf-sec') || document.querySelector('input[type="file"]');
    const secilenDosyaAdi = document.getElementById('secilen-dosya-adi');
    const durumMesaji = document.getElementById('durum-mesaji');
    const gonderBtn = document.getElementById('gonder-btn') || document.querySelector('button[type="submit"]');

    if (dosyaKutusu && secilenDosyaAdi) {
        dosyaKutusu.addEventListener('change', function(e) {
            const dosyalar = e.target.files;
            secilenDosyaAdi.textContent = (dosyalar && dosyalar.length > 0) ? "Seçilen: " + dosyalar.item(0).name : "Henüz fotoğraf seçilmedi";
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const isim = isimKutusu ? isimKutusu.value.trim() : 'Belirtilmedi';
            const mesaj = metinKutusu ? metinKutusu.value.trim() : '';
            if (!mesaj) return;

            if (gonderBtn) {
                gonderBtn.disabled = true;
                gonderBtn.textContent = "Kaydediliyor, lütfen bekleyin... ⏳";
            }

            const secilenDosya = (dosyaKutusu && dosyaKutusu.files && dosyaKutusu.files.length > 0) ? dosyaKutusu.files.item(0) : null;

            if (secilenDosya) {
                const okuyucu = new FileReader();
                okuyucu.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const MAX_GENISLIK = 800;
                        let genislik = img.width;
                        let yukseklik = img.height;

                        if (genislik > MAX_GENISLIK) {
                            yukseklik = Math.round((yukseklik * MAX_GENISLIK) / genislik);
                            genislik = MAX_GENISLIK;
                        }

                        canvas.width = genislik;
                        canvas.height = yukseklik;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, genislik, yukseklik);
                        const kucukFoto = canvas.toDataURL('image/jpeg', 0.7);

                        formVerisiGonder(isim, mesaj, kucukFoto, isim + "_ani.jpg");
                    };
                    img.src = event.target.result;
                };
                okuyucu.readAsDataURL(secilenDosya);
            } else {
                formVerisiGonder(isim, mesaj, "", "");
            }
        });
    }

    function formVerisiGonder(isim, mesaj, fotoData, fotoAdi) {
        const formData = new URLSearchParams();
        formData.append("isim", isim);
        formData.append("mesaj", mesaj);
        formData.append("fotoData", fotoData);
        formData.append("fotoAdi", fotoAdi);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(() => {
            form.reset();
            if (secilenDosyaAdi) secilenDosyaAdi.textContent = "Henüz fotoğraf seçilmedi";
            if (durumMesaji) {
                durumMesaji.textContent = "Anınız Cenk Atlas için güvenle kaydedildi! Teşekkür ederiz ❤️";
                durumMesaji.style.color = "#155724";
                durumMesaji.style.backgroundColor = "#d4edda";
                durumMesaji.style.padding = "12px";
                durumMesaji.style.borderRadius = "10px";
                durumMesaji.style.marginTop = "15px";
                durumMesaji.style.display = "block";
                durumMesaji.classList.remove('gizli');
            }
        })
        .catch((err) => {
            alert("Gönderim hatası: " + err.message);
        })
        .finally(() => {
            if (gonderBtn) {
                gonderBtn.disabled = false;
                gonderBtn.textContent = "Anıyı Gönder 💌";
            }
        });
    }
});