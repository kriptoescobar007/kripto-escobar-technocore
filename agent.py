import os
import sys
import time
import base64
import urllib.request
import urllib.parse
import json

# GitHub Secrets'tan anahtarları güvenle alıyoruz
SECRET_KEY_HEX = os.environ.get("TECHNOCORE_SECRET_KEY")
DID = os.environ.get("TECHNOCORE_DID")

if not SECRET_KEY_HEX or not DID:
    print("HATA: TECHNOCORE_SECRET_KEY veya TECHNOCORE_DID tanımlı değil!")
    sys.exit(1)

# PyNaCl kütüphanesi kontrolü
try:
    import nacl.signing
except ImportError:
    print("PyNaCl kütüphanesi kuruluyor...")
    os.system("pip install pynacl")
    import nacl.signing

def to_base64_url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def run_agent():
    # 64-byte secret key'in ilk 32 byte'ı seed (özel anahtar) olarak kullanılır
    secret_bytes = bytes.fromhex(SECRET_KEY_HEX)
    seed = secret_bytes[:32]
    signing_key = nacl.signing.SigningKey(seed)

    room = "lobby"
    nonce = str(int(time.time() * 1000))
    
    # Otonom Ajan mesaj şablonu (Kripto Escobar Ajanı)
    message_text = "Kripto Escobar autonomous agent ping. Ecosystem participation online & verifying status."
    
    # İmzalanacak veri formatı: room|nonce|text
    payload = f"{room}|{nonce}|{message_text}"
    signed = signing_key.sign(payload.encode('utf-8'))
    signature_b64url = to_base64_url(signed.signature)

    # Technocore Relay API endpoint
    params = urllib.parse.urlencode({
        "room": room,
        "did": DID,
        "sig": signature_b64url,
        "nonce": nonce,
        "text": message_text
    })
    
    url = f"https://technocore.chat/r/{room}/say-signed/{DID}/{signature_b64url}/{nonce}/{urllib.parse.quote(message_text)}"
    
    print(f"[*] Ajan aktif: {DID}")
    print(f"[*] Technocore lobisine otonom imza gönderiliyor...")

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "KriptoEscobar-AutonomousAgent/1.0"}
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = response.read().decode('utf-8')
            print("[+] Technocore Sunucu Yanıtı:")
            print(res_data)
            print("[✓] Otonom döngü başarıyla tamamlandı!")
    except Exception as e:
        print(f"[-] İstek hatası: {e}")
        # Hata durumunda workflow'un çökmemesi için kontrollü çıkış
        sys.exit(0)

if __name__ == "__main__":
    run_agent()
