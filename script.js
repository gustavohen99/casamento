/**
 * CASAMENTO CAMILA & GUSTAVO • 12 DE DEZEMBRO DE 2026
 * Interatividade: Envelope 3D, Áudio Sintetizado, RSVP, Pix QR Code, Contagem Regressiva e Partículas
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. ÁUDIO DO SELO DE CERA (Paper / Wax Sound Effect)
  // =========================================================================
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Efeito sonoro realista de rompimento do selo de cera e papel
  function playWaxBreakSound() {
    try {
      initAudioContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // 1. Ruído de papel desdobrando
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(now);

      // 2. Tom sutil de "pop" do selo
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

      oscGain.gain.setValueAtTime(0.25, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      // Navegadores sem suporte a áudio continuam silenciosamente
    }
  }

  // =========================================================================
  // 2. CONVITE NATIVO
  // =========================================================================
  // O convite agora é 100% nativo em HTML/CSS para uma experiência mobile perfeita.

  // =========================================================================
  // 3. CONTAGEM REGRESSIVA (12 DE DEZEMBRO DE 2026 ÀS 16H30)
  // =========================================================================
  // Data do Casamento: 12/12/2026 às 16:30 no horário de Brasília (UTC-3)
  const weddingDate = new Date('2026-12-12T16:30:00-03:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 4. DOWNLOAD DE EVENTO ICS (Apple Calendar / Outlook)
  // =========================================================================
  const btnDownloadIcs = document.getElementById('btn-download-ics');
  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Casamento Camila e Gustavo//PT-BR',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'SUMMARY:Casamento Camila & Gustavo',
        'DESCRIPTION:Celebração do casamento de Camila e Gustavo no Florença Festas. Estamos muito felizes em celebrar este dia com você!',
        'LOCATION:Florença Festas - Rua Júlio César Setenareski, 2493 - Colônia Murici, São José dos Pinhais - PR',
        'DTSTART:20261212T193000Z',
        'DTEND:20261213T030000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'casamento_camila_e_gustavo.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // =========================================================================
  // 5. COPIAR ENDEREÇO & CHAVES PIX
  // =========================================================================
  const btnCopyAddress = document.getElementById('btn-copy-address');
  const copyAddressLabel = document.getElementById('copy-address-label');
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      const address = "Florença Festas - Rua Júlio César Setenareski, 2493, Colônia Murici, São José dos Pinhais - PR, CEP 83085-300";
      navigator.clipboard.writeText(address).then(() => {
        copyAddressLabel.textContent = "Endereço Copiado! ✓";
        btnCopyAddress.style.borderColor = "var(--color-sage)";
        setTimeout(() => {
          copyAddressLabel.textContent = "Copiar Endereço";
          btnCopyAddress.style.borderColor = "";
        }, 2500);
      });
    });
  }

  const btnCopyPixMain = document.getElementById('btn-copy-pix-main');
  const copyPixMainLabel = document.getElementById('copy-pix-main-label');
  if (btnCopyPixMain) {
    btnCopyPixMain.addEventListener('click', () => {
      const pixKey = "41998867853";
      navigator.clipboard.writeText(pixKey).then(() => {
        if (copyPixMainLabel) copyPixMainLabel.textContent = "Chave Pix Copiada! ✓";
        btnCopyPixMain.style.backgroundColor = "var(--color-sage)";
        setTimeout(() => {
          if (copyPixMainLabel) copyPixMainLabel.textContent = "Copiar Chave Pix";
          btnCopyPixMain.style.backgroundColor = "";
        }, 2500);
      });
    });
  }

  // =========================================================================
  // 6. CONFIRMAÇÃO DE PRESENÇA (RSVP) & LOCALSTORAGE
  // =========================================================================
  const rsvpForm = document.getElementById('rsvp-form');
  const attendanceDetails = document.getElementById('attendance-details');
  const rsvpSuccessBox = document.getElementById('rsvp-success-box');
  const rsvpSuccessMessage = document.getElementById('rsvp-success-message');
  const btnEditRsvp = document.getElementById('btn-edit-rsvp');
  const btnWhatsappRsvp = document.getElementById('btn-whatsapp-rsvp');

  // Alternar campos extras conforme Sim / Não
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'nao') {
        attendanceDetails.style.display = 'none';
      } else {
        attendanceDetails.style.display = 'block';
      }
    });
  });

  // Obter lista salva
  function getRsvpList() {
    return JSON.parse(localStorage.getItem('wedding_rsvp_camila_gustavo') || '[]');
  }

  function saveRsvp(entry) {
    const list = getRsvpList();
    list.unshift(entry);
    localStorage.setItem('wedding_rsvp_camila_gustavo', JSON.stringify(list));
    updateAdminStats();
  }

  // Envio do formulário
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const phone = document.getElementById('rsvp-phone').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const adults = document.getElementById('rsvp-adults').value;
      const kids = document.getElementById('rsvp-kids').value;
      const companions = document.getElementById('rsvp-companions').value.trim();
      const diet = document.getElementById('rsvp-diet').value.trim();
      const message = document.getElementById('rsvp-message').value.trim();

      const rsvpData = {
        id: Date.now(),
        name,
        phone,
        attendance,
        adults: attendance === 'sim' ? parseInt(adults, 10) : 0,
        kids: attendance === 'sim' ? parseInt(kids, 10) : 0,
        companions: attendance === 'sim' ? companions : '',
        diet: attendance === 'sim' ? diet : '',
        message,
        date: new Date().toLocaleDateString('pt-BR')
      };

      saveRsvp(rsvpData);

      // Também adiciona ao mural de recados se houver mensagem
      if (message) {
        saveGuestbookEntry({
          name,
          relation: 'Convidado(a)',
          message,
          date: new Date().toLocaleDateString('pt-BR')
        });
      }

      // Exibe sucesso
      rsvpForm.style.display = 'none';
      rsvpSuccessBox.classList.add('show');
      if (attendance === 'sim') {
        rsvpSuccessMessage.textContent = `Que alegria, ${name}! Sua presença foi confirmada com sucesso. Mal podemos esperar para celebrar com você dia 12 de Dezembro!`;
      } else {
        rsvpSuccessMessage.textContent = `Sentiremos muito sua falta, ${name}! Agradecemos de coração pelo carinho e por nos avisar.`;
      }
    });
  }

  if (btnEditRsvp) {
    btnEditRsvp.addEventListener('click', () => {
      rsvpSuccessBox.classList.remove('show');
      rsvpForm.style.display = 'block';
    });
  }

  // Enviar Confirmação via WhatsApp
  if (btnWhatsappRsvp) {
    btnWhatsappRsvp.addEventListener('click', () => {
      const name = document.getElementById('rsvp-name').value.trim() || 'Convidado';
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const adults = document.getElementById('rsvp-adults').value;
      const companions = document.getElementById('rsvp-companions').value.trim();

      let text = '';
      if (attendance === 'sim') {
        text = `Olá Camila e Gustavo! Vim confirmar minha presença no casamento de vocês dia 12/12/2026 no Florença Festas!\n\n` +
               `*Nome:* ${name}\n` +
               `*Adultos:* ${adults}\n` +
               (companions ? `*Acompanhantes:* ${companions}\n` : '') +
               `Estamos muito felizes e animados para esse dia tão especial! 🎉🥂`;
      } else {
        text = `Olá Camila e Gustavo! Passando para agradecer com muito carinho pelo convite de casamento. Infelizmente não poderei comparecer no dia 12/12/2026, mas estarei em oração e torcendo pela felicidade de vocês! ❤️`;
      }

      const encoded = encodeURIComponent(text);
      // Número padrão para o casal (pode ser o telefone do Gustavo)
      window.open(`https://api.whatsapp.com/send?phone=5541999999999&text=${encoded}`, '_blank');
    });
  }

  // =========================================================================
  // 8. MURAL DE RECADOS (GUESTBOOK)
  // =========================================================================
  const guestbookForm = document.getElementById('guestbook-form');
  const guestbookList = document.getElementById('guestbook-list');

  const defaultMessages = [
    {
      name: "Tia Regina & Família",
      relation: "Tia da Noiva",
      message: "Camila e Gustavo, que emoção ver esse momento chegar! Que Deus abençoe cada passo dessa nova família com paz, sabedoria e muito amor. Estaremos lá comemorando!",
      date: "10/10/2026"
    },
    {
      name: "Lucas & Marcela",
      relation: "Padrinhos",
      message: "Amigos do coração, que alegria imensa fazer parte desse sonho ao lado de vocês! Já estamos com a roupa pronta para brindar muito no Florença Festas!",
      date: "12/10/2026"
    },
    {
      name: "Fernando Ribeiro",
      relation: "Amigo de infância",
      message: "Gustavão, quem te viu quem te vê, casando com essa mulher incrível! Vocês foram feitos um para o outro. Parabéns e contem sempre comigo!",
      date: "14/10/2026"
    }
  ];

  function getGuestbookEntries() {
    const stored = localStorage.getItem('wedding_guestbook_camila_gustavo');
    if (!stored) {
      localStorage.setItem('wedding_guestbook_camila_gustavo', JSON.stringify(defaultMessages));
      return defaultMessages;
    }
    return JSON.parse(stored);
  }

  function saveGuestbookEntry(entry) {
    const list = getGuestbookEntries();
    list.unshift(entry);
    localStorage.setItem('wedding_guestbook_camila_gustavo', JSON.stringify(list));
    renderGuestbook();
  }

  function renderGuestbook() {
    if (!guestbookList) return;
    const entries = getGuestbookEntries();
    guestbookList.innerHTML = entries.map(item => `
      <div class="guestbook-card">
        <p class="gb-message-text">"${item.message}"</p>
        <span class="gb-author">${item.name}</span>
        <span class="gb-relation">${item.relation || 'Convidado(a)'} • ${item.date}</span>
      </div>
    `).join('');
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('gb-name').value.trim();
      const relation = document.getElementById('gb-relation').value.trim() || 'Convidado(a)';
      const message = document.getElementById('gb-message').value.trim();

      saveGuestbookEntry({
        name,
        relation,
        message,
        date: new Date().toLocaleDateString('pt-BR')
      });

      guestbookForm.reset();
      alert('Mensagem enviada com sucesso! Muito obrigado pelo carinho.');
    });
  }

  renderGuestbook();

  // =========================================================================
  // 9. PAINEL ADMINISTRATIVO DOS NOIVOS (RSVP)
  // =========================================================================
  const btnOpenAdmin = document.getElementById('btn-open-admin');
  const adminModal = document.getElementById('admin-modal');
  const btnCloseAdmin = document.getElementById('btn-close-admin-modal');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnClearRsvp = document.getElementById('btn-clear-rsvp');
  const adminTableBody = document.getElementById('admin-rsvp-table-body');

  function updateAdminStats() {
    const list = getRsvpList();
    const confirmed = list.filter(item => item.attendance === 'sim');
    const declined = list.filter(item => item.attendance === 'nao');

    const totalAdults = confirmed.reduce((acc, item) => acc + (item.adults || 1), 0);
    const totalKids = confirmed.reduce((acc, item) => acc + (item.kids || 0), 0);

    const statTotal = document.getElementById('stat-total-rsvp');
    const statAdults = document.getElementById('stat-confirmed-adults');
    const statKids = document.getElementById('stat-confirmed-kids');
    const statDeclined = document.getElementById('stat-declined');

    if (statTotal) statTotal.textContent = list.length;
    if (statAdults) statAdults.textContent = totalAdults;
    if (statKids) statKids.textContent = totalKids;
    if (statDeclined) statDeclined.textContent = declined.length;

    if (adminTableBody) {
      if (list.length === 0) {
        adminTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: #888;">Nenhuma confirmação registrada ainda.</td></tr>`;
      } else {
        adminTableBody.innerHTML = list.map(item => `
          <tr>
            <td><strong>${item.name}</strong></td>
            <td>${item.phone}</td>
            <td><span style="color: ${item.attendance === 'sim' ? '#2e7d32' : '#c62828'}; font-weight:600;">${item.attendance === 'sim' ? 'Confirmado ✓' : 'Recusado ✕'}</span></td>
            <td>${item.attendance === 'sim' ? item.adults : '-'}</td>
            <td>${item.attendance === 'sim' ? item.kids : '-'}</td>
            <td>${item.companions || '-'}</td>
            <td>${item.diet || '-'}</td>
            <td>${item.date}</td>
          </tr>
        `).join('');
      }
    }
  }

  if (btnOpenAdmin) {
    btnOpenAdmin.addEventListener('click', () => {
      updateAdminStats();
      adminModal.classList.add('show');
    });
  }

  if (btnCloseAdmin) {
    btnCloseAdmin.addEventListener('click', () => {
      adminModal.classList.remove('show');
    });
  }

  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      adminModal.classList.remove('show');
    }
  });

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const list = getRsvpList();
      if (list.length === 0) {
        alert('Nenhuma confirmação para exportar.');
        return;
      }

      let csvContent = "Nome;Telefone;Presenca;Adultos;Criancas;Acompanhantes;Restricoes;Mensagem;Data\n";
      list.forEach(i => {
        csvContent += `"${i.name}";"${i.phone}";"${i.attendance === 'sim' ? 'Sim' : 'Nao'}";"${i.adults}";"${i.kids}";"${i.companions || ''}";"${i.diet || ''}";"${(i.message || '').replace(/"/g, '""')}";"${i.date}"\n`;
      });

      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `lista_rsvp_camila_gustavo_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (btnClearRsvp) {
    btnClearRsvp.addEventListener('click', () => {
      if (confirm('Tem certeza de que deseja limpar a lista de confirmações de teste?')) {
        localStorage.removeItem('wedding_rsvp_camila_gustavo');
        updateAdminStats();
      }
    });
  }

  // =========================================================================
  // 10. ENGINE DE PARTÍCULAS (Pétalas de Flores & Pó Dourado)
  // =========================================================================
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const petalColors = [
    'rgba(213, 196, 175, 0.7)', // Sand
    'rgba(191, 135, 94, 0.65)', // Terracotta
    'rgba(197, 160, 89, 0.8)',  // Gold dust
    'rgba(235, 228, 216, 0.7)', // Linen
    'rgba(138, 154, 134, 0.6)'  // Sage green
  ];

  class Particle {
    constructor(x, y, isBurst = false) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * -100;
      this.size = Math.random() * 8 + 4;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.speedY = isBurst ? (Math.random() * -6 - 2) : (Math.random() * 1.2 + 0.6);
      this.speedX = isBurst ? (Math.random() * 8 - 4) : (Math.random() * 1.5 - 0.75);
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.opacity = isBurst ? 1 : Math.random() * 0.7 + 0.3;
      this.isBurst = isBurst;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotationSpeed;

      if (this.isBurst) {
        this.speedY += 0.15; // gravidade
        this.opacity -= 0.008;
      } else {
        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.opacity);

      // Desenha pétala oval elegante
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Cria partículas de fundo
  for (let i = 0; i < 28; i++) {
    particles.push(new Particle());
  }

  function triggerPetalBurst() {
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle(centerX, centerY, true));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();

      if (p.isBurst && p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // =========================================================================
  // 11. NAVEGAÇÃO INFERIOR MOBILE & SCROLL SPY
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

  function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = sec.getAttribute('id');
      }
    });

    bottomNavItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${current}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

});
