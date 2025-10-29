# Alur Bisnis rePrecinct

## Ringkasan Eksekutif

**rePrecinct** adalah platform CRM (Customer Relationship Management) untuk industri real estat komersial yang dikembangkan oleh **REQ2 Pty Ltd** (ACN: 622 046 520). Platform ini dirancang khusus untuk membantu agen properti komersial mengelola operasional bisnis mereka dari awal hingga penutupan transaksi.

---

## 1. Gambaran Umum Alur Bisnis

### 1.1 Perjalanan Pelanggan (Customer Journey)

```
1. Generasi Lead (Lead Generation)
   ↓
2. Manajemen Kontak (Contact Management)
   ↓
3. Manajemen Properti & Kampanye (Property/Campaign Management)
   ↓
4. Pencocokan Kebutuhan dengan AI (AI Requirement Matching)
   ↓
5. E-Marketing & Komunikasi
   ↓
6. Manajemen Transaksi (Transaction Management)
   ↓
7. Pelaporan & Analitik (Reporting & Analytics)
```

---

## 2. Alur Bisnis Detail

### 2.1 Tahap 1: Generasi Lead (Lead Generation)

#### Proses:

1. **Lead dari Portal Properti**
   - Calon pembeli/penyewa melihat listing di portal (Domain, REA, dll)
   - Mereka mengisi formulir enquiry
   - Lead otomatis masuk ke sistem rePrecinct melalui integrasi API

2. **Lead dari Email**
   - Email enquiry masuk ke sistem
   - AI mengenali dan mengekstrak informasi lead
   - Kontak otomatis dibuat di CRM

3. **Lead Manual**
   - Agen dapat menambahkan lead secara manual
   - Dari referral, telepon, atau walk-in

#### Output:

- Lead tersimpan di database CRM
- Notifikasi dikirim ke agen yang relevan
- Lead siap untuk di-follow up

---

### 2.2 Tahap 2: Manajemen Kontak (Contact Management)

#### Proses:

1. **Konversi Lead ke Kontak**
   - Lead yang valid dikonversi menjadi kontak
   - Informasi lengkap dikumpulkan (nama, email, telepon, alamat)
   - Kontak dikategorikan (pembeli, penyewa, pemilik properti, investor)

2. **Segmentasi Kontak**
   - Kontak dikelompokkan menggunakan tags
   - Contact groups dibuat berdasarkan kriteria
   - Memudahkan targeting untuk marketing

3. **Tracking Interaksi**
   - Semua komunikasi dengan kontak dicatat
   - History enquiry disimpan
   - Task follow-up dijadwalkan

#### Output:

- Database kontak yang terorganisir
- Profil lengkap setiap kontak
- Riwayat interaksi tersimpan

---

### 2.3 Tahap 3: Manajemen Properti & Kampanye

#### Proses:

1. **Input Data Properti**
   - Agen memasukkan detail properti
   - Alamat, luas tanah, tipe properti
   - Lokasi (koordinat GPS)
   - Zona perencanaan (planning zone)

2. **Membuat Kampanye**
   - Pilih tipe kampanye: Jual (Sale), Sewa (Lease), atau Keduanya
   - Tentukan status: Pre-listing, Listed, Under Offer, dll
   - Assign agen yang bertanggung jawab

3. **Manajemen Space (Ruang)**
   - Untuk properti dengan multiple unit/ruang
   - Set pricing per space:
     - Target price (tidak terlihat publik)
     - List price from/to (harga publikasi)
     - Tipe harga (Per Square Meter/Per Annum/Total Amount)
     - GST (Included/Excluded/Net/Gross)
   - Luas ruang (lettable area)
   - Fitur-fitur ruangan

4. **Upload Media**
   - Foto properti
   - Floor plan
   - Video (jika ada)
   - Dokumen (brochure, kontrak, dll)

5. **Membuat Listing**
   - Generate listing dari data kampanye
   - Pilih portal mana yang akan dipublish
   - Set listing detail dan deskripsi
   - Publikasikan ke portal terintegrasi

#### Output:

- Kampanye aktif dengan semua detail lengkap
- Listing terpublikasi di multiple portal
- Properti siap dipasarkan

---

### 2.4 Tahap 4: Pencocokan Kebutuhan dengan AI

#### Proses:

1. **Input Requirement**
   - Kontak (pembeli/penyewa) menyampaikan kebutuhannya
   - Kriteria disimpan: lokasi, budget, luas area, tipe properti, dll

2. **AI Matching Engine**
   - AI menganalisis requirement vs available properties
   - Memberikan skor kecocokan (matching score)
   - Mengurutkan properti berdasarkan relevansi

3. **Rekomendasi**
   - Sistem memberikan 3-5 properti paling cocok
   - Agen mendapat notifikasi
   - Agen dapat langsung follow-up dengan rekomendasi

#### Output:

- Daftar properti yang cocok dengan kebutuhan
- Efisiensi waktu dalam mencari properti
- Peningkatan conversion rate

---

### 2.5 Tahap 5: E-Marketing & Komunikasi

#### Proses:

1. **Membuat Template Email (EDM)**
   - Marketing manager membuat template dengan drag-and-drop builder
   - Template bisa disimpan dan digunakan ulang
   - Personalisasi dengan data kontak

2. **Campaign Email Marketing**
   - Pilih contact list/segment
   - Pilih template
   - Schedule pengiriman
   - Kirim email massal

3. **Tracking & Analytics**
   - Monitor open rate
   - Track click rate
   - Capture response/reply sebagai lead baru

4. **Laporan Marketing**
   - Generate laporan untuk klien (pemilik properti):
     - Vendor/Leasing Minute Reports
     - Progress Reports
     - Listing Sheets
     - Comp Reports (analisis pasar)
     - Track Record Reports

#### Output:

- Email marketing terkirim ke target audience
- Lead baru dari respon email
- Laporan marketing untuk klien

---

### 2.6 Tahap 6: Inspeksi & Negosiasi

#### Proses:

1. **Penjadwalan Inspeksi**
   - Agen schedule inspection date/time
   - Sistem kirim invitation ke calon pembeli/penyewa
   - Reminder otomatis sebelum inspeksi

2. **Pencatatan Hasil Inspeksi**
   - Agen catat feedback dari inspection
   - Update status lead/enquiry
   - Follow-up task dibuat

3. **Offer & Negosiasi**
   - Calon pembeli/penyewa membuat offer
   - Agen catat detail offer
   - Negosiasi dilacak dalam sistem
   - Update status: Under Offer

#### Output:

- Inspeksi terjadwal dan terorganisir
- Feedback tersimpan
- Proses negosiasi terdokumentasi

---

### 2.7 Tahap 7: Manajemen Transaksi

#### Proses:

1. **Membuat Transaksi**
   - Setelah offer diterima, transaksi dibuat
   - Link ke kampanye terkait
   - Link ke kontak (pembeli/penyewa)
   - Tipe: Sale atau Lease

2. **Detail Transaksi**
   - Jumlah transaksi (amount)
   - Tanggal settlement (untuk sale)
   - Durasi lease (untuk lease)
   - Commission split (jika ada conjunctional agency)

3. **Manajemen Dokumen**
   - Upload kontrak
   - Upload dokumen pendukung
   - Track status dokumen
   - Integrasi e-signature (dalam rencana)

4. **Update Status**
   - In Progress → Under Contract → Settled/Executed
   - Notifikasi otomatis ke semua pihak terkait
   - Update di portal (mark as sold/leased)

5. **Post-Transaction**
   - Follow-up task dibuat otomatis
   - Request testimonial
   - Referral request

#### Output:

- Transaksi tercatat lengkap
- Dokumen terorganisir
- Deal closed successfully

---

### 2.8 Tahap 8: Pelaporan & Analitik

#### Proses:

1. **Dashboard Real-time**
   - KPI utama: jumlah listing, deals in pipeline, revenue
   - Performance per agen
   - Lead sources analytics
   - Conversion funnel

2. **Custom Reports**
   - Filter berdasarkan periode, agen, office, tipe properti
   - Export ke PDF/Excel
   - Automated report scheduling

3. **Analytics untuk Keputusan Bisnis**
   - Tren pasar
   - Best performing agents
   - Portal effectiveness
   - Campaign ROI

#### Output:

- Insights untuk business decision
- Laporan untuk stakeholders
- Data untuk evaluasi performance

---

## 3. Alur Bisnis untuk Lease Expiry Management

### Proses Khusus untuk Manajemen Lease Expiry:

#### 3.1 Monitoring

- Sistem otomatis track tanggal expiry lease
- Notifikasi dikirim 6 bulan, 3 bulan, 1 bulan sebelum expiry
- Agen mendapat task untuk follow-up

#### 3.2 Renewal Campaign

- Hubungi tenant yang lease-nya akan expired
- Tawarkan renewal dengan terms baru
- Jika tidak renew, properti kembali ke pasar

#### 3.3 Re-listing

- Jika tenant tidak renew, buat kampanye baru
- Listing kembali ke portal
- Mulai proses marketing dari awal

#### Output:

- Retention rate tinggi
- Tidak ada gap period tanpa tenant
- Proactive client management

---

## 4. Integrasi dengan Sistem Eksternal

### 4.1 Property Portals (Domain, REA, dll)

**Alur:**

1. Kampanye dibuat di rePrecinct
2. Push listing ke portal via API
3. Portal publish listing
4. Lead dari portal auto-sync ke rePrecinct
5. Update status listing (views, enquiries) sync otomatis

### 4.2 Property Management Systems (PMS)

**Alur:**

1. Data property dari PMS sync ke rePrecinct
2. Lease expiry data dari PMS
3. Tenant information sync
4. Two-way data synchronization

### 4.3 Third-Party Services

**Alur:**

- **Address Finder**: Validasi alamat saat input property
- **Email Service**: Kirim email marketing
- **SMS Gateway**: SMS notifications
- **Sentry**: Error monitoring

---

## 5. Roles & Responsibilities dalam Alur Bisnis

### 5.1 System Administrator

**Tugas:**

- Setup agency configuration
- Manage user accounts
- Configure portal integrations
- Set permissions

### 5.2 Agency Principal/Director

**Tugas:**

- Approve campaigns
- View overall reports
- Set targets
- Manage budgets

### 5.3 Real Estate Agents

**Tugas:**

- Create campaigns
- Manage contacts
- Follow-up leads
- Schedule inspections
- Record transactions
- Generate reports

### 5.4 Leasing Manager

**Tugas:**

- Fokus pada lease campaigns
- Monitor lease expiries
- Tenant matching
- Renewal negotiations

### 5.5 Marketing Manager

**Tugas:**

- Create email templates
- Run email campaigns
- Manage portal listings
- Generate marketing reports
- Monitor marketing KPIs

### 5.6 Admin Staff

**Tugas:**

- Data entry
- Upload contacts/transactions
- Process enquiries
- Schedule tasks
- Administrative support

---

## 6. Keuntungan Alur Bisnis rePrecinct

### 6.1 Untuk Agency

1. **Efisiensi Operasional**
   - Semua proses dalam satu platform
   - Eliminasi duplikasi data entry
   - Otomasi tasks repetitif

2. **Peningkatan Revenue**
   - Lead conversion lebih tinggi dengan AI matching
   - Tidak ada lead yang terlewat dengan auto-capture
   - Follow-up lebih terstruktur

3. **Better Client Service**
   - Response time lebih cepat
   - Regular updates ke klien
   - Professional reporting

4. **Data-Driven Decisions**
   - Real-time analytics
   - Performance tracking
   - Market insights

### 6.2 Untuk Agen Individual

1. **Produktivitas Meningkat**
   - Hemat waktu 50-70% dari task administratif
   - Fokus pada aktivitas revenue-generating
   - Organized workflow

2. **Better Lead Management**
   - Semua lead dalam satu tempat
   - Prioritization dengan AI scoring
   - Automated follow-ups

3. **Professional Image**
   - High-quality marketing materials
   - Quick response to enquiries
   - Professional communication

### 6.3 Untuk Klien (Pemilik Properti)

1. **Transparency**
   - Regular progress reports
   - Real-time updates
   - Marketing statistics visible

2. **Better Results**
   - Wider exposure (multi-portal)
   - Targeted marketing
   - Qualified leads only

3. **Peace of Mind**
   - Professional handling
   - Proactive communication
   - Clear process

---

## 7. Workflow Automation dalam rePrecinct

### 7.1 Automated Workflows

#### A. New Lead Workflow

```
Lead masuk dari portal
    ↓
Auto-create contact
    ↓
Assign ke agen yang sesuai
    ↓
Kirim notifikasi ke agen
    ↓
Create follow-up task (24 jam)
    ↓
Jika tidak di-follow up, escalate ke manager
```

#### B. Inspection Workflow

```
Schedule inspection
    ↓
Send invitation email ke prospect
    ↓
Send reminder 24 jam sebelumnya
    ↓
Send reminder 2 jam sebelumnya
    ↓
Post-inspection: create feedback task
    ↓
Create follow-up task (48 jam)
```

#### C. Lease Expiry Workflow

```
6 bulan sebelum expiry: notifikasi pertama
    ↓
Create renewal task untuk agen
    ↓
3 bulan sebelum: reminder kedua
    ↓
1 bulan sebelum: reminder ketiga (urgent)
    ↓
Jika tenant confirm tidak renew:
    ↓
Buat kampanye baru untuk re-lease
```

#### D. Transaction Workflow

```
Offer diterima
    ↓
Create transaction record
    ↓
Generate contract documents
    ↓
Send to client untuk signature
    ↓
Track document status
    ↓
Settlement/execution
    ↓
Update campaign status
    ↓
Update portal (mark as sold/leased)
    ↓
Post-transaction follow-up tasks
```

---

## 8. Data Flow dalam Sistem

### 8.1 Lead to Deal Flow

```
LEAD MASUK
    ↓
    ├─→ Dari Portal (Domain, REA)
    ├─→ Dari Email Enquiry
    └─→ Manual Input
    ↓
CONTACT CREATED
    ↓
    ├─→ Data tersimpan di CRM
    ├─→ Tags & segmentation
    └─→ Assign ke agen
    ↓
REQUIREMENT CAPTURED
    ↓
AI MATCHING ENGINE
    ↓
    ├─→ Analisis requirement
    ├─→ Compare dengan available properties
    └─→ Generate matches
    ↓
AGENT FOLLOW-UP
    ↓
    ├─→ Present properties
    ├─→ Schedule inspection
    └─→ Communication tracking
    ↓
INSPECTION
    ↓
    ├─→ Feedback captured
    └─→ Interest level recorded
    ↓
OFFER & NEGOTIATION
    ↓
    ├─→ Offer details recorded
    └─→ Negotiation history tracked
    ↓
TRANSACTION
    ↓
    ├─→ Contract generated
    ├─→ Documents managed
    └─→ Status tracked
    ↓
SETTLEMENT/EXECUTION
    ↓
    ├─→ Deal closed
    ├─→ Commission calculated
    └─→ Reports generated
    ↓
POST-TRANSACTION
    ↓
    ├─→ Follow-up tasks
    ├─→ Request testimonial
    └─→ Referral request
```

---

## 9. Best Practices Penggunaan rePrecinct

### 9.1 Untuk Agen

1. **Konsisten Input Data**
   - Segera input lead baru
   - Lengkapi detail kontak
   - Update status secara real-time

2. **Manfaatkan Automation**
   - Set task reminders
   - Use email templates
   - Enable notifications

3. **Regular Follow-ups**
   - Check dashboard setiap hari
   - Follow task list
   - Don't let leads go cold

4. **Leverage AI**
   - Gunakan requirement matching
   - Review AI suggestions
   - Provide feedback untuk improve AI

### 9.2 Untuk Marketing Manager

1. **Build Template Library**
   - Create reusable templates
   - A/B testing different designs
   - Optimize based on analytics

2. **Segment Your Audience**
   - Use tags effectively
   - Targeted campaigns
   - Personalized content

3. **Track & Optimize**
   - Monitor email metrics
   - Test sending times
   - Improve subject lines

### 9.3 Untuk Management

1. **Regular Reporting**
   - Weekly performance reviews
   - Monthly trend analysis
   - Quarterly planning based on data

2. **Team Training**
   - Ensure proper system usage
   - Share best practices
   - Regular updates on new features

3. **Data Quality**
   - Audit data regularly
   - Clean up duplicates
   - Maintain consistency

---

## 10. Kesimpulan

Alur bisnis rePrecinct dirancang untuk mengotomasi dan mengoptimalkan seluruh proses commercial real estate dari lead generation hingga deal closure. Dengan integrasi yang seamless, AI-powered matching, dan comprehensive reporting, platform ini membantu agency meningkatkan efisiensi operasional dan revenue growth.

Key takeaways:

- **Otomasi mengurangi pekerjaan manual hingga 50-70%**
- **AI matching meningkatkan conversion rate**
- **Integrasi portal memastikan no lead is missed**
- **Real-time analytics untuk better decision making**
- **Professional tools untuk better client service**

---

**Versi Dokumen**: 1.0
**Terakhir Diperbarui**: 29 Oktober 2025
**Disiapkan Oleh**: Tim Produk rePrecinct
