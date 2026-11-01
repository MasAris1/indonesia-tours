import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette: Minimalist Tech / Dark Mode
BG_COLOR = RGBColor(15, 23, 42)        # Deep slate/dark background (#0F172A)
CARD_BG = RGBColor(30, 41, 59)         # Surface card (#1E293B)
TEXT_WHITE = RGBColor(248, 250, 252)   # Pure text white
TEXT_MUTED = RGBColor(148, 163, 184)   # Slate light muted
ACCENT_CYAN = RGBColor(56, 189, 248)   # Tech cyan (#38BDF8)
ACCENT_GREEN = RGBColor(52, 211, 153)  # Success emerald (#34D399)
ACCENT_ORANGE = RGBColor(251, 146, 60) # Warm highlight (#FB923C)
BORDER_COLOR = RGBColor(51, 65, 85)    # Slate border (#334155)

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = BG_COLOR

def add_header(slide, title_text, category_text="FITUR WEB DEV • SISTEM AUTENTIKASI"):
    # Category / Pill
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
    tf_c = cat_box.text_frame
    tf_c.word_wrap = True
    p_c = tf_c.paragraphs[0]
    p_c.text = category_text.upper()
    p_c.font.size = Pt(11)
    p_c.font.bold = True
    p_c.font.color.rgb = ACCENT_CYAN

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title_text
    p_t.font.size = Pt(28)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

# ==========================================
# SLIDE 1: Title Slide (Pengenalan)
# ==========================================
slide_layout = prs.slide_layouts[6] # Blank
s1 = prs.slides.add_slide(slide_layout)
set_slide_background(s1)

# Badge
badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(3.2), Inches(0.45))
badge.fill.solid()
badge.fill.fore_color.rgb = CARD_BG
badge.line.color.rgb = ACCENT_CYAN
b_tf = badge.text_frame
b_p = b_tf.paragraphs[0]
b_p.text = "⚡ WEB DEV ESSENTIALS"
b_p.font.size = Pt(12)
b_p.font.bold = True
b_p.font.color.rgb = ACCENT_CYAN
b_p.alignment = PP_ALIGN.CENTER

# Main Title & Subtitle
t_box = s1.shapes.add_textbox(Inches(0.8), Inches(2.5), Inches(11.5), Inches(2.2))
t_tf = t_box.text_frame
t_tf.word_wrap = True

p1 = t_tf.paragraphs[0]
p1.text = "Bagaimana Sistem Login Bekerja?"
p1.font.size = Pt(40)
p1.font.bold = True
p1.font.color.rgb = TEXT_WHITE
p1.space_after = Pt(12)

p2 = t_tf.add_paragraph()
p2.text = "Memahami Fitur Login Biasa & Login with Google (OAuth) Secara Sederhana"
p2.font.size = Pt(20)
p2.font.color.rgb = ACCENT_ORANGE
p2.space_after = Pt(16)

p3 = t_tf.add_paragraph()
p3.text = "Presentasi Singkat (5 Menit) untuk Mahasiswa Junior • Dilanjutkan Live Demo Aplikasi"
p3.font.size = Pt(14)
p3.font.color.rgb = TEXT_MUTED

# Speaker Notes S1
s1.notes_slide.notes_text_frame.text = (
    "[WAKTU: MENIT 00:00 - 00:45]\n"
    "Halo semuanya! Selamat datang teman-teman mahasiswa. "
    "Ketika pertama kali belajar bikin website, salah satu fitur yang paling sering kita temui tapi "
    "bikin penasaran adalah: 'Gimana sih sebenarnya sebuah website bisa mengenali siapa diri kita?'\n\n"
    "Dalam 5 menit ke depan, saya akan jelaskan secara sederhana cara kerja Login Biasa dan fitur ajaib "
    "'Login with Google'. Tenang saja, bahasanya sangat santai dan mudah dipahami bahkan jika kalian belum "
    "pernah ngoding sama sekali. Setelah ini, kita akan langsung coba aplikasinya bareng-bareng!"
)

# ==========================================
# SLIDE 2: Login Biasa (Email & Password)
# ==========================================
s2 = prs.slides.add_slide(slide_layout)
set_slide_background(s2)
add_header(s2, "1. Login Biasa: Seperti Kunci Pintu Rumah Sendiri")

# Card 1: Analogi
c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
c1.fill.solid()
c1.fill.fore_color.rgb = CARD_BG
c1.line.color.rgb = BORDER_COLOR
c1_tf = c1.text_frame
c1_tf.word_wrap = True
c1_tf.margin_top = Inches(0.4)
c1_tf.margin_left = Inches(0.4)
c1_tf.margin_right = Inches(0.4)

p = c1_tf.paragraphs[0]
p.text = "🔑 Analogi Kunci Kamar Kos"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.space_after = Pt(14)

bullets = [
    "Daftar Akun: Kamu membuat kunci baru dan menitipkan salinannya ke pemilik kos (Database website).",
    "Login: Saat ingin masuk, kamu memasukkan Email & Password yang kamu miliki.",
    "Pencocokan: Website mengecek ke 'buku catatan' (database). Jika kuncinya cocok, pintu langsung terbuka!"
]
for b in bullets:
    p_b = c1_tf.add_paragraph()
    p_b.text = "• " + b
    p_b.font.size = Pt(14)
    p_b.font.color.rgb = TEXT_WHITE
    p_b.space_after = Pt(10)

# Card 2: Kelebihan & Tantangannya
c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
c2.fill.solid()
c2.fill.fore_color.rgb = CARD_BG
c2.line.color.rgb = BORDER_COLOR
c2_tf = c2.text_frame
c2_tf.word_wrap = True
c2_tf.margin_top = Inches(0.4)
c2_tf.margin_left = Inches(0.4)
c2_tf.margin_right = Inches(0.4)

p = c2_tf.paragraphs[0]
p.text = "⚙️ Realita di Dunia Nyata"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = ACCENT_GREEN
p.space_after = Pt(14)

points = [
    ("Kelebihan:", "User tidak perlu punya akun pihak ketiga (cukup email apa saja)."),
    ("Tantangan User:", "Sering lupa password karena punya puluhan akun di website berbeda."),
    ("Tantangan Developer:", "Website harus mengamankan password dengan enkripsi ketat agar tidak mudah dibobol hacker.")
]
for title, desc in points:
    p_t = c2_tf.add_paragraph()
    p_t.text = "✓ " + title
    p_t.font.size = Pt(14)
    p_t.font.bold = True
    p_t.font.color.rgb = ACCENT_ORANGE
    
    p_d = c2_tf.add_paragraph()
    p_d.text = desc
    p_d.font.size = Pt(13)
    p_d.font.color.rgb = TEXT_WHITE
    p_d.space_after = Pt(8)

# Speaker Notes S2
s2.notes_slide.notes_text_frame.text = (
    "[WAKTU: MENIT 00:45 - 01:45]\n"
    "Pertama, kita bedah dulu 'Login Biasa' menggunakan Email dan Password. "
    "Bayangkan ini seperti kamu punya kunci kamar kos sendiri. Saat pertama kali daftar, kamu membuat kunci "
    "dan website menyimpannya di brankas database mereka. Saat mau masuk, website tinggal mencocokkan kuncinya.\n\n"
    "Kelebihannya simpel, tapi masalah terbesarnya adalah: user gampang lupa password, dan developer punya "
    "tanggung jawab besar mengamankan password tersebut agar tidak bocor. Nah, dari masalah inilah muncul solusi "
    "yang jauh lebih keren dan praktis, yaitu Login with Google di slide berikutnya."
)

# ==========================================
# SLIDE 3: Login with Google (OAuth)
# ==========================================
s3 = prs.slides.add_slide(slide_layout)
set_slide_background(s3)
add_header(s3, "2. Login with Google: Sistem Titip Identitas (OAuth)")

# 3 Step Columns
steps = [
    ("Langkah 1", "Klik Tombol Google", "User mengklik tombol 'Lanjutkan dengan Google' di halaman aplikasi.", ACCENT_CYAN),
    ("Langkah 2", "Izin ke Google", "Website minta konfirmasi ke Google: 'Hai Google, apakah benar ini akun asli user ini?'", ACCENT_ORANGE),
    ("Langkah 3", "Surat Izin (Token)", "Google memverifikasi user lalu memberikan 'Surat Izin Resmi' (Token) ke website kita. User langsung masuk!", ACCENT_GREEN)
]

for i, (step_num, step_title, step_desc, col_color) in enumerate(steps):
    left_pos = Inches(0.8 + i * 3.95)
    box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(1.8), Inches(3.8), Inches(4.8))
    box.fill.solid()
    box.fill.fore_color.rgb = CARD_BG
    box.line.color.rgb = BORDER_COLOR
    b_tf = box.text_frame
    b_tf.word_wrap = True
    b_tf.margin_top = Inches(0.4)
    b_tf.margin_left = Inches(0.3)
    b_tf.margin_right = Inches(0.3)

    p_s = b_tf.paragraphs[0]
    p_s.text = step_num.upper()
    p_s.font.size = Pt(12)
    p_s.font.bold = True
    p_s.font.color.rgb = col_color
    p_s.space_after = Pt(8)

    p_t = b_tf.add_paragraph()
    p_t.text = step_title
    p_t.font.size = Pt(18)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_t.space_after = Pt(14)

    p_d = b_tf.add_paragraph()
    p_d.text = step_desc
    p_d.font.size = Pt(14)
    p_d.font.color.rgb = TEXT_MUTED

# Speaker Notes S3
s3.notes_slide.notes_text_frame.text = (
    "[WAKTU: MENIT 01:45 - 03:00]\n"
    "Sekarang, bagaimana cara kerja tombol 'Login with Google'? Di dunia web development, teknologi ini "
    "disebut dengan istilah OAuth (Open Authorization).\n\n"
    "Analoginya seperti kalian mau masuk gedung perkantoran, tapi kalian tidak perlu bikin kartu akses baru. "
    "Kalian cukup tunjukkan KTP asli kalian ke satpam. Satpam Google melihat KTP itu, lalu bilang ke website kita: "
    "'Tenang, orang ini asli dan akunnya valid!'. Website kita tidak pernah tahu password Google kalian, yang diterima "
    "website hanyalah bukti izin masuk (token). Jadi jauh lebih aman dan praktis hanya dalam sekali klik!"
)

# ==========================================
# SLIDE 4: Perbandingan & Keunggulan
# ==========================================
s4 = prs.slides.add_slide(slide_layout)
set_slide_background(s4)
add_header(s4, "3. Perbandingan: Mengapa Keduanya Kita Sediakan?")

# Box 1: Login Biasa
box1 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
box1.fill.solid()
box1.fill.fore_color.rgb = CARD_BG
box1.line.color.rgb = BORDER_COLOR
b1_tf = box1.text_frame
b1_tf.word_wrap = True
b1_tf.margin_top = Inches(0.4)
b1_tf.margin_left = Inches(0.4)
b1_tf.margin_right = Inches(0.4)

p = b1_tf.paragraphs[0]
p.text = "✉️ Login Email & Password"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = ACCENT_CYAN
p.space_after = Pt(14)

items1 = [
    ("Universal", "Bisa digunakan oleh siapapun, tanpa bergantung pada akun Google."),
    ("Kontrol Penuh", "Data akun disimpan langsung di bawah kendali sistem aplikasi."),
    ("Uji Coba Cepat", "Sangat cocok untuk akun uji coba demo internal (Customer / Mitra / Admin).")
]
for t, d in items1:
    p_t = b1_tf.add_paragraph()
    p_t.text = "• " + t + ":"
    p_t.font.size = Pt(14)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_d = b1_tf.add_paragraph()
    p_d.text = "  " + d
    p_d.font.size = Pt(13)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.space_after = Pt(8)

# Box 2: Login Google
box2 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
box2.fill.solid()
box2.fill.fore_color.rgb = CARD_BG
box2.line.color.rgb = BORDER_COLOR
b2_tf = box2.text_frame
b2_tf.word_wrap = True
b2_tf.margin_top = Inches(0.4)
b2_tf.margin_left = Inches(0.4)
b2_tf.margin_right = Inches(0.4)

p = b2_tf.paragraphs[0]
p.text = "🌐 Login with Google"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = ACCENT_GREEN
p.space_after = Pt(14)

items2 = [
    ("Instan 1-Klik", "Pengguna tidak perlu mengetik nama & menghafal password baru."),
    ("Keamanan Standar Google", "Otomatis terlindungi oleh fitur keamanan 2-Factor Authentication dari Google."),
    ("User Experience Tinggi", "Mengurangi angka gagal daftar karena formulir yang terlalu panjang.")
]
for t, d in items2:
    p_t = b2_tf.add_paragraph()
    p_t.text = "• " + t + ":"
    p_t.font.size = Pt(14)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_d = b2_tf.add_paragraph()
    p_d.text = "  " + d
    p_d.font.size = Pt(13)
    p_d.font.color.rgb = TEXT_MUTED
    p_d.space_after = Pt(8)

# Speaker Notes S4
s4.notes_slide.notes_text_frame.text = (
    "[WAKTU: MENIT 03:00 - 04:00]\n"
    "Lalu kenapa kita sediakan dua-duanya di aplikasi Indonesia Tours? "
    "Pertama, fleksibilitas. Tidak semua orang ingin menghubungkan akun Google mereka ke sebuah website baru. "
    "Bagi mereka, opsi email biasa tetap sangat penting.\n\n"
    "Namun bagi mayoritas pengguna zaman sekarang yang ingin serba cepat dan anti ribet, tombol Google memberikan "
    "kenyamanan luar biasa. Mereka cukup klik satu tombol dan langsung bisa memesan tiket open trip!"
)

# ==========================================
# SLIDE 5: Penutup & Transisi ke Demo
# ==========================================
s5 = prs.slides.add_slide(slide_layout)
set_slide_background(s5)
add_header(s5, "4. Saatnya Live Demo Aplikasi!", "KESIMPULAN & SESI DEMO")

center_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.8), Inches(1.8), Inches(9.7), Inches(4.8))
center_card.fill.solid()
center_card.fill.fore_color.rgb = CARD_BG
center_card.line.color.rgb = ACCENT_CYAN
cc_tf = center_card.text_frame
cc_tf.word_wrap = True
cc_tf.margin_top = Inches(0.4)
cc_tf.margin_left = Inches(0.6)
cc_tf.margin_right = Inches(0.6)

p = cc_tf.paragraphs[0]
p.text = "🚀 Yang Akan Kita Buktikan di Layar Sekarang:"
p.font.size = Pt(22)
p.font.bold = True
p.font.color.rgb = ACCENT_ORANGE
p.space_after = Pt(14)

demo_list = [
    "Animasi Geser Modern: Transisi mulus antara form Masuk (kiri) & Buat Akun (kanan).",
    "Smart Role Redirect: Mitra otomatis ke /mitra/dashboard, Admin ke /admin/dashboard, Customer ke Beranda.",
    "Auto-Login Instan: Daftar akun baru langsung otomatis login tanpa tertahan verifikasi.",
    "Google OAuth Flow: Masuk secara aman tanpa perlu mengetik kata sandi secara manual."
]
for item in demo_list:
    p_i = cc_tf.add_paragraph()
    p_i.text = "👉 " + item
    p_i.font.size = Pt(15)
    p_i.font.color.rgb = TEXT_WHITE
    p_i.space_after = Pt(10)

p_foot = cc_tf.add_paragraph()
p_foot.text = "Yuk kita beralih ke layar browser untuk melihat live action-nya!"
p_foot.font.size = Pt(16)
p_foot.font.bold = True
p_foot.font.color.rgb = ACCENT_CYAN
p_foot.space_before = Pt(12)

# Speaker Notes S5
s5.notes_slide.notes_text_frame.text = (
    "[WAKTU: MENIT 04:00 - 05:00]\n"
    "Sebagai kesimpulan, autentikasi adalah pintu gerbang utama keamanan dan kenyamanan sebuah aplikasi web. "
    "Di proyek Indonesia Tours ini, kita sudah mengimplementasikan desain antarmuka modern dengan animasi sliding, "
    "serta logika backend pintar yang otomatis mengarahkan peran pengguna ke dashboard masing-masing.\n\n"
    "Karena teori tanpa praktik kurang seru, sekarang mari kita buka browser dan langsung demonstrasikan aplikasinya! "
    "Terima kasih atas perhatiannya, mari kita masuk ke sesi demo."
)

# Save
output_path = "Presentasi_Fitur_Login_Indonesia_Tours.pptx"
prs.save(output_path)
print(f"Presentation saved successfully to {output_path}")
