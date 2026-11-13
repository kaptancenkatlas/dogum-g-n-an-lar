window.addEventListener('load', () => {
    const renkler = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7', '#ffd166', '#06d6a0', '#118ab2'];
    
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
});