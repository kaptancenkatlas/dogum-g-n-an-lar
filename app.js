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

    const form = document.querySelector('form');
    const isimKutusu = document.querySelector('input[type="text"]');
    const metinKutusu = document.querySelector('textarea');
    const dosyaKutusu = document.querySelector('input[type="file"]');
    const secilenDosyaAdi = document.getElementById('secilen-dosya-adi');
    const durumMesaji = document.getElementById('durum-mesaji');
    
    let anilarListesi = document.getElementById('anilar-listesi');
    if (anilarListesi) anilarListesi.remove();
    
    anilarListesi = document.createElement('div');
    anilarListesi.id = 'anilar-listesi';
    anilarListesi.className = 'anilar-listesi';
    document.body.appendChild(anilarListesi);

    if (dosyaKutusu && secilenDosyaAdi) {
        dosyaKutusu.addEventListener('change', function() {
            secilenDosyaAdi.textContent = this.files.length > 0 ? "Seçilen: " + this.files[0].name : "Henüz fotoğraf seçilmedi";
        });
    }

    function anilariYukle() {
        const kayitliAnilar = JSON.parse(localStorage.getItem('dogumGunuAnilari')) || [];
        anilarListesi.innerHTML = '';

        kayitliAnilar.forEach(ani => {
            const kart = document.createElement('div');
            kart.className = 'ani-karti';
            const yazarAdi = ani.isim ? ani.isim : 'Sevgili Bir Misafir';
            const fotoHtml = ani.foto ? `<img src="${ani.foto}" class="ani-foto">` : '';
            
            kart.innerHTML = `
                <div class="ani-yazar">✍️ ${yazarAdi}</div>
                <p class="ani-metni">"${ani.mesaj}"</p>
                ${fotoHtml}
                <span class="ani-tarih">${ani.tarih}</span>
            `;
            anilarListesi.appendChild(kart);
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const isim = isimKutusu ? isimKutusu.value.trim() : '';
            const mesaj = metinKutusu ? metinKutusu.value.trim() : '';
            if (!mesaj) return;

            const kayitliAnilar = JSON.parse(localStorage.getItem('dogumGunuAnilari')) || [];
            const bugun = new Date().toLocaleDateString('tr-TR');

            if (dosyaKutusu && dosyaKutusu.files && dosyaKutusu.files.length > 0) {
                const okuyucu = new FileReader();
                okuyucu.onload = function(event) {
                    kayitliAnilar.unshift({ isim: isim, mesaj: mesaj, foto: event.target.result, tarih: bugun });
                    localStorage.setItem('dogumGunuAnilari', JSON.stringify(kayitliAnilar));
                    bitir();
                };
                okuyucu.readAsDataURL(dosyaKutusu.files[0]);
            } else {
                kayitliAnilar.unshift({ isim: isim, mesaj: mesaj, foto: null, tarih: bugun });
                localStorage.setItem('dogumGunuAnilari', JSON.stringify(kayitliAnilar));
                bitir();
            }

            function bitir() {
                form.reset();
                if (secilenDosyaAdi) secilenDosyaAdi.textContent = "Henüz fotoğraf seçilmedi";
                if (durumMesaji) {
                    durumMesaji.textContent = "Anınız başarıyla eklendi! ❤️";
                    durumMesaji.classList.remove('gizli');
                    setTimeout(() => durumMesaji.classList.add('gizli'), 4000);
                }
                anilariYukle();
            }
        });
    }

    anilariYukle();
});