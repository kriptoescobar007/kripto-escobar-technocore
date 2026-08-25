// Kripto Escobar - Technocore DID & Katkı Motoru
let currentIdentity = null;
let currentLobbySeq = null;
let currentContribSeq = null;

// Rastgele Ed25519 anahtar formatı (did:key:z6Mk...)
function generateRandomDID() {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'did:key:z6Mk';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 1. Adım: Kimlik Üretme
function generateIdentity() {
  const pass = document.getElementById('passphrase').value;
  const passConfirm = document.getElementById('passphraseConfirm').value;

  if (!pass || pass.length < 12) {
    alert('Lütfen en az 12 karakter uzunluğunda güvenli bir parola belirleyin!');
    return;
  }
  if (pass !== passConfirm) {
    alert('Parolalar birbiriyle eşleşmiyor. Lütfen kontrol edin!');
    return;
  }

  const did = generateRandomDID();
  const timestamp = new Date().toISOString();

  currentIdentity = {
    did: did,
    createdAt: timestamp,
    version: "1.0.0",
    client: "Kripto Escobar Technocore Web Suite"
  };

  document.getElementById('didValue').innerText = did;
  document.getElementById('didResultBox').classList.remove('hidden');

  // İndirme butonunu aktifleştir
  const dlBtn = document.getElementById('downloadBtn');
  dlBtn.disabled = false;
  dlBtn.classList.remove('bg-brand-border', 'text-gray-400', 'cursor-not-allowed');
  dlBtn.classList.add('bg-brand-border', 'text-white', 'hover:bg-gray-700', 'cursor-pointer');

  updateTweetTemplate();
  alert('Tebrikler! Kripto Escobar Technocore DID kimliğiniz başarıyla oluşturuldu.');
}

// Kimlik Yedek Dosyasını İndirme
function downloadBackup() {
  if (!currentIdentity) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentIdentity, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "kripto_escobar_identity.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// 2. Adım: Lobide Paylaşma
function postToLobby() {
  if (!currentIdentity) {
    alert('Önce 1. Adımdan bir DID Kimliği oluşturmalısınız!');
    return;
  }
  const msg = document.getElementById('introMessage').value;
  if (!msg.trim()) {
    alert('Lütfen lobide kendinizi tanıtan kısa bir metin yazın!');
    return;
  }

  // Simüle edilen sıra numarası (Sequence)
  currentLobbySeq = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('lobbySeq').innerText = currentLobbySeq;
  document.getElementById('lobbyResultBox').classList.remove('hidden');

  updateTweetTemplate();
}

// 3. Adım: Katkı Kaydı
function recordContribution() {
  if (!currentIdentity) {
    alert('Önce 1. Adımdan bir DID Kimliği oluşturmalısınız!');
    return;
  }
  const url = document.getElementById('contributionUrl').value;
  const topic = document.getElementById('contributionTopic').value;

  if (!url || !topic) {
    alert('Lütfen içerik linkinizi ve açıklamasını eksiksiz girin!');
    return;
  }

  currentContribSeq = Math.floor(200000 + Math.random() * 800000);
  document.getElementById('contribSeq').innerText = currentContribSeq;
  document.getElementById('contributionResultBox').classList.remove('hidden');

  updateTweetTemplate();
}

// 4. Adım: X Tweet Şablonunu Güncelleme
function updateTweetTemplate() {
  const did = currentIdentity ? currentIdentity.did : 'YOUR_PUBLIC_DID';
  const url = document.getElementById('contributionUrl')?.value || 'https://x.com/KriptoEsCoBaR';
  const topic = document.getElementById('contributionTopic')?.value || 'Technocore Airdrop Guide by @KriptoEsCoBaR';
  const seq = currentContribSeq || currentLobbySeq || 'SEQUENCE_NUM';

  const tweetText = `I published a useful tutorial for Technocore by @flop_labs !\n\nIt helps Web3 users understand ${topic}.\n\n🔗 Contribution: ${url}\n🆔 Agent DID: ${did}\n📜 Signed Technocore record: room technocore, sequence ${seq}\n\nBuilt via @KriptoEsCoBaR suite 🚀`;

  document.getElementById('xTweetTemplate').value = tweetText;
}

// X'te Paylaş Butonu
function shareOnX() {
  const text = document.getElementById('xTweetTemplate').value;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank');
}

// Metin Kopyalama
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Kopyalandı!');
  });
}

// Sayfa yüklendiğinde varsayılan şablonu doldur
window.onload = function() {
  updateTweetTemplate();
};
