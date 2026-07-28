export const commonStyle = `
  @page {
    size: 215.9mm 330.2mm; /* F4 / Folio Size */
    margin: 15mm 15mm 20mm 15mm;
  }
  body {
    font-family: 'Inter', Arial, sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 0;
    font-size: 12px;
    line-height: 1.6;
  }
  .header-container {
    display: flex;
    align-items: center;
    border-bottom: 4px solid #000;
    padding-bottom: 10px;
    margin-bottom: 2px;
    text-align: center;
  }
  .header-line-2 {
    border-bottom: 1px solid #000;
    margin-bottom: 20px;
  }
  .logo-placeholder {
    width: 80px;
    height: 80px;
    background: #f1f5f9;
    border: 1px dashed #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 10px;
    text-align: center;
  }
  .school-details {
    flex-grow: 1;
    text-align: center;
    padding: 0 10px;
  }
  .school-yayasan {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    color: #000;
    margin: 0;
  }
  .school-name {
    font-size: 22px;
    font-weight: 900;
    text-transform: uppercase;
    color: #000;
    margin: 5px 0;
    letter-spacing: 1px;
  }
  .school-info {
    font-size: 12px;
    color: #000;
    margin: 0;
  }
  .document-title {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    color: #0f172a;
    margin: 15px 0 25px 0;
    letter-spacing: 0.5px;
  }
  .grid-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
  }
  .info-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .info-row {
    display: flex;
    font-size: 11px;
  }
  .info-label {
    width: 120px;
    color: #64748b;
    font-weight: 500;
  }
  .info-value {
    color: #0f172a;
    font-weight: 600;
  }
  .section-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    color: #1e3a8a;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 5px;
    margin: 20px 0 10px 0;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  table.data-table th {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    color: #334155;
    font-weight: 700;
    padding: 8px 10px;
    text-align: left;
    font-size: 11px;
    text-transform: uppercase;
  }
  table.data-table td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    color: #334155;
    font-size: 11px;
  }
  table.data-table tr:nth-child(even) {
    background-color: #f8fafc;
  }
  .notes-box {
    border: 1px solid #cbd5e1;
    background-color: #f8fafc;
    border-radius: 6px;
    padding: 10px 15px;
    font-size: 11px;
    color: #334155;
    margin-bottom: 20px;
    min-height: 50px;
  }
  .signatures-container {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }
  .signature-block {
    text-align: center;
    width: 200px;
  }
  .signature-space {
    height: 60px;
  }
  .page-number {
    font-size: 10px;
    color: #94a3b8;
    text-align: right;
    margin-top: 20px;
  }
`;

export function generateReportCardHtml(data: {
  school: { name: string; npsn: string; address: string };
  student: { name: string; nis: string; nisn: string; className: string };
  academicYear: { year: string; semester: string };
  subjects: Array<{ name: string; finalScore: number; gradeLetter: string; knowledgeDescription: string }>;
  attendance: { sick: number; permission: number; absent: number };
  extracurriculars: Array<{ name: string; predicate: string; description: string }>;
  achievements: Array<{ title: string; level: string; description: string }>;
  p5: Array<{ theme: string; predicate: string; description: string }>;
  homeroomTeacherNotes: string;
  printDate: string;
}) {
  const subjectRows = data.subjects.length > 0 
    ? data.subjects.map((s, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600;">${s.name}</td>
          <td style="text-align: center; font-weight: 700; width: 60px;">${s.finalScore}</td>
          <td style="text-align: center; font-weight: 700; width: 60px;">${s.gradeLetter}</td>
          <td>${s.knowledgeDescription || "-"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="5" style="text-align: center; color: #64748b;">Belum ada nilai mata pelajaran.</td></tr>`;

  const extracurricularRows = data.extracurriculars.length > 0
    ? data.extracurriculars.map((e, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600; width: 200px;">${e.name}</td>
          <td style="text-align: center; font-weight: 700; width: 80px;">${e.predicate}</td>
          <td>${e.description || "-"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4" style="text-align: center; color: #64748b;">Tidak ada kegiatan ekstrakurikuler.</td></tr>`;

  const achievementRows = data.achievements.length > 0
    ? data.achievements.map((a, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600; width: 200px;">${a.title}</td>
          <td style="text-align: center; font-weight: 600; width: 100px;">${a.level}</td>
          <td>${a.description || "-"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4" style="text-align: center; color: #64748b;">Tidak ada catatan prestasi.</td></tr>`;

  const p5Rows = data.p5.length > 0
    ? data.p5.map((p, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600; width: 250px;">${p.theme}</td>
          <td style="text-align: center; font-weight: 700; width: 80px;">${p.predicate}</td>
          <td>${p.description || "-"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4" style="text-align: center; color: #64748b;">Tidak ada projek P5.</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Hasil Belajar (Rapor)</title>
      <style>${commonStyle}</style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-placeholder">LOGO<br>YAYASAN</div>
        <div class="school-details">
          <p class="school-yayasan">YAYASAN PENDIDIKAN</p>
          <h1 class="school-name">${data.school.name}</h1>
          <p class="school-info">NPSN: ${data.school.npsn} | Alamat: ${data.school.address}</p>
        </div>
        <div class="logo-placeholder">LOGO<br>SEKOLAH</div>
      </div>
      <div class="header-line-2"></div>

      <div class="document-title">LAPORAN HASIL BELAJAR (RAPOR)</div>

      <div class="grid-info">
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Nama Siswa</span>
            <span class="info-value">: ${data.student.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">NIS / NISN</span>
            <span class="info-value">: ${data.student.nis} / ${data.student.nisn}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Kelas</span>
            <span class="info-value">: ${data.student.className}</span>
          </div>
        </div>
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Semester</span>
            <span class="info-value">: ${data.academicYear.semester}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tahun Ajaran</span>
            <span class="info-value">: ${data.academicYear.year}</span>
          </div>
        </div>
      </div>

      <div class="section-title">A. Nilai Akademik</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Mata Pelajaran</th>
            <th style="text-align: center; width: 60px;">Nilai</th>
            <th style="text-align: center; width: 60px;">Predikat</th>
            <th>Deskripsi Capaian Kompetensi</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows}
        </tbody>
      </table>

      <div class="section-title">B. Ekstrakurikuler</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Kegiatan Ekstrakurikuler</th>
            <th style="text-align: center; width: 80px;">Predikat</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${extracurricularRows}
        </tbody>
      </table>

      <div class="section-title">C. Prestasi</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Jenis Prestasi</th>
            <th style="text-align: center; width: 100px;">Tingkat</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${achievementRows}
        </tbody>
      </table>

      <div class="section-title">D. Projek Penguatan Profil Pelajar Pancasila (P5)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Tema Projek</th>
            <th style="text-align: center; width: 80px;">Predikat</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${p5Rows}
        </tbody>
      </table>

      <div class="section-title">E. Kehadiran</div>
      <table class="data-table" style="width: 300px; margin-bottom: 25px;">
        <thead>
          <tr>
            <th>Status Kehadiran</th>
            <th style="text-align: center; width: 100px;">Jumlah Hari</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sakit (S)</td>
            <td style="text-align: center; font-weight: 600;">${data.attendance.sick}</td>
          </tr>
          <tr>
            <td>Izin (I)</td>
            <td style="text-align: center; font-weight: 600;">${data.attendance.permission}</td>
          </tr>
          <tr>
            <td>Tanpa Keterangan (A)</td>
            <td style="text-align: center; font-weight: 600;">${data.attendance.absent}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">F. Catatan Wali Kelas</div>
      <div class="notes-box">
        ${data.homeroomTeacherNotes || "Tingkatkan terus belajarmu dan tetap jaga kedisiplinan."}
      </div>

      <div class="signatures-container">
        <div class="signature-block">
          <p>Orang Tua/Wali,</p>
          <div class="signature-space"></div>
          <p style="border-bottom: 1px solid #0f172a; display: inline-block; width: 150px; margin: 0;"></p>
        </div>
        <div class="signature-block">
          <p>Kota, ${data.printDate}<br>Wali Kelas,</p>
          <div class="signature-space"></div>
          <p style="border-bottom: 1px solid #0f172a; display: inline-block; width: 150px; margin: 0; font-weight: bold;">Wali Kelas</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAttendanceReportHtml(data: {
  school: { name: string; npsn: string; address: string };
  className: string;
  academicYear: { year: string; semester: string };
  students: Array<{ name: string; present: number; sick: number; permission: number; absent: number }>;
  printDate: string;
}) {
  const rows = data.students.length > 0
    ? data.students.map((s, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600;">${s.name}</td>
          <td style="text-align: center; font-weight: bold; color: #16a34a;">${s.present}</td>
          <td style="text-align: center; font-weight: bold; color: #d97706;">${s.sick}</td>
          <td style="text-align: center; font-weight: bold; color: #2563eb;">${s.permission}</td>
          <td style="text-align: center; font-weight: bold; color: #dc2626;">${s.absent}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="6" style="text-align: center; color: #64748b;">Belum ada data absensi kelas.</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Rekap Absensi Kelas</title>
      <style>${commonStyle}</style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-placeholder">LOGO<br>YAYASAN</div>
        <div class="school-details">
          <p class="school-yayasan">YAYASAN PENDIDIKAN</p>
          <h1 class="school-name">${data.school.name}</h1>
          <p class="school-info">NPSN: ${data.school.npsn} | Alamat: ${data.school.address}</p>
        </div>
        <div class="logo-placeholder">LOGO<br>SEKOLAH</div>
      </div>
      <div class="header-line-2"></div>

      <div class="document-title">REKAP KEHADIRAN SISWA</div>

      <div class="grid-info">
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Kelas</span>
            <span class="info-value">: ${data.className}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Semester</span>
            <span class="info-value">: ${data.academicYear.semester}</span>
          </div>
        </div>
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Tahun Ajaran</span>
            <span class="info-value">: ${data.academicYear.year}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tanggal Cetak</span>
            <span class="info-value">: ${data.printDate}</span>
          </div>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Nama Siswa</th>
            <th style="text-align: center; width: 80px;">Hadir (H)</th>
            <th style="text-align: center; width: 80px;">Sakit (S)</th>
            <th style="text-align: center; width: 80px;">Izin (I)</th>
            <th style="text-align: center; width: 80px;">Alfa (A)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

export function generateTeachingJournalHtml(data: {
  school: { name: string; npsn: string; address: string };
  teacher: { name: string; nip: string };
  journals: Array<{ date: string; topic: string; objectives: string; method: string; reflection: string }>;
  printDate: string;
}) {
  const rows = data.journals.length > 0
    ? data.journals.map((j, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="width: 80px;">${j.date}</td>
          <td style="font-weight: 600; width: 120px;">${j.topic}</td>
          <td>${j.objectives}</td>
          <td style="width: 100px;">${j.method}</td>
          <td>${j.reflection || "-"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="6" style="text-align: center; color: #64748b;">Belum ada jurnal mengajar.</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Jurnal Mengajar Guru</title>
      <style>${commonStyle}</style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-placeholder">LOGO<br>YAYASAN</div>
        <div class="school-details">
          <p class="school-yayasan">YAYASAN PENDIDIKAN</p>
          <h1 class="school-name">${data.school.name}</h1>
          <p class="school-info">NPSN: ${data.school.npsn} | Alamat: ${data.school.address}</p>
        </div>
        <div class="logo-placeholder">LOGO<br>SEKOLAH</div>
      </div>
      <div class="header-line-2"></div>

      <div class="document-title">JURNAL MENGAJAR GURU</div>

      <div class="grid-info" style="margin-bottom: 15px;">
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Nama Guru</span>
            <span class="info-value">: ${data.teacher.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">NIP</span>
            <span class="info-value">: ${data.teacher.nip || "-"}</span>
          </div>
        </div>
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Tanggal Cetak</span>
            <span class="info-value">: ${data.printDate}</span>
          </div>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Tanggal</th>
            <th>Topik</th>
            <th>Tujuan Pembelajaran</th>
            <th>Metode</th>
            <th>Refleksi</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

export function generateAssessmentReportHtml(data: {
  school: { name: string; npsn: string; address: string };
  assessment: { title: string; type: string; date: string; className: string; subjectName: string; teacherName: string };
  stats: { average: number; max: number; min: number };
  scores: Array<{ studentName: string; score: number; notes: string }>;
  printDate: string;
}) {
  const rows = data.scores.length > 0
    ? data.scores.map((s, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600;">${s.studentName}</td>
          <td style="text-align: center; font-weight: 700; width: 100px;">${s.score}</td>
          <td>${s.notes || "-"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4" style="text-align: center; color: #64748b;">Belum ada nilai siswa untuk asesmen ini.</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Asesmen</title>
      <style>${commonStyle}</style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-placeholder">LOGO<br>YAYASAN</div>
        <div class="school-details">
          <p class="school-yayasan">YAYASAN PENDIDIKAN</p>
          <h1 class="school-name">${data.school.name}</h1>
          <p class="school-info">NPSN: ${data.school.npsn} | Alamat: ${data.school.address}</p>
        </div>
        <div class="logo-placeholder">LOGO<br>SEKOLAH</div>
      </div>
      <div class="header-line-2"></div>

      <div class="document-title">LAPORAN HASIL ASESMEN</div>

      <div class="grid-info" style="margin-bottom: 15px;">
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Judul Asesmen</span>
            <span class="info-value">: ${data.assessment.title}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Jenis / Mapel</span>
            <span class="info-value">: ${data.assessment.type} / ${data.assessment.subjectName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Kelas</span>
            <span class="info-value">: ${data.assessment.className}</span>
          </div>
        </div>
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Guru Pengampu</span>
            <span class="info-value">: ${data.assessment.teacherName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tanggal Pelaksanaan</span>
            <span class="info-value">: ${data.assessment.date}</span>
          </div>
        </div>
      </div>

      <div class="section-title">Ringkasan Statistik Kelas</div>
      <table class="data-table" style="width: 400px; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="text-align: center;">Rata-Rata Nilai</th>
            <th style="text-align: center;">Nilai Tertinggi</th>
            <th style="text-align: center;">Nilai Terendah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; font-size: 14px; font-weight: 800; color: #1e3a8a;">${data.stats.average}</td>
            <td style="text-align: center; font-size: 14px; font-weight: 800; color: #16a34a;">${data.stats.max}</td>
            <td style="text-align: center; font-size: 14px; font-weight: 800; color: #dc2626;">${data.stats.min}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">Daftar Nilai Siswa</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Nama Siswa</th>
            <th style="text-align: center; width: 100px;">Nilai</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

export function generateStudentListHtml(data: {
  school: { name: string; npsn: string; address: string };
  className: string;
  academicYear: { year: string; semester: string };
  students: Array<{ name: string; nis: string; nisn: string; gender: string }>;
  printDate: string;
}) {
  const rows = data.students.length > 0
    ? data.students.map((s, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600;">${s.name}</td>
          <td style="text-align: center; width: 120px;">${s.nis}</td>
          <td style="text-align: center; width: 120px;">${s.nisn}</td>
          <td style="text-align: center; width: 80px;">${s.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="5" style="text-align: center; color: #64748b;">Belum ada siswa aktif di kelas ini.</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Daftar Siswa</title>
      <style>${commonStyle}</style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-placeholder">LOGO<br>YAYASAN</div>
        <div class="school-details">
          <p class="school-yayasan">YAYASAN PENDIDIKAN</p>
          <h1 class="school-name">${data.school.name}</h1>
          <p class="school-info">NPSN: ${data.school.npsn} | Alamat: ${data.school.address}</p>
        </div>
        <div class="logo-placeholder">LOGO<br>SEKOLAH</div>
      </div>
      <div class="header-line-2"></div>

      <div class="document-title">DAFTAR SISWA KELAS</div>

      <div class="grid-info">
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Kelas</span>
            <span class="info-value">: ${data.className}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Semester / TA</span>
            <span class="info-value">: ${data.academicYear.semester} / ${data.academicYear.year}</span>
          </div>
        </div>
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Tanggal Cetak</span>
            <span class="info-value">: ${data.printDate}</span>
          </div>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Nama Lengkap</th>
            <th style="text-align: center; width: 120px;">NIS</th>
            <th style="text-align: center; width: 120px;">NISN</th>
            <th style="text-align: center; width: 80px;">Jenis Kelamin</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

export function generateTeacherListHtml(data: {
  school: { name: string; npsn: string; address: string };
  teachers: Array<{ name: string; nip: string; gender: string; isHomeroom: string }>;
  printDate: string;
}) {
  const rows = data.teachers.length > 0
    ? data.teachers.map((t, idx) => `
        <tr>
          <td style="text-align: center; width: 40px;">${idx + 1}</td>
          <td style="font-weight: 600;">${t.name}</td>
          <td style="text-align: center; width: 150px;">${t.nip || "-"}</td>
          <td style="text-align: center; width: 100px;">${t.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
          <td style="text-align: center; width: 120px;">${t.isHomeroom}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="5" style="text-align: center; color: #64748b;">Belum ada guru terdaftar.</td></tr>`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Daftar Guru</title>
      <style>${commonStyle}</style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-placeholder">LOGO<br>YAYASAN</div>
        <div class="school-details">
          <p class="school-yayasan">YAYASAN PENDIDIKAN</p>
          <h1 class="school-name">${data.school.name}</h1>
          <p class="school-info">NPSN: ${data.school.npsn} | Alamat: ${data.school.address}</p>
        </div>
        <div class="logo-placeholder">LOGO<br>SEKOLAH</div>
      </div>
      <div class="header-line-2"></div>

      <div class="document-title">DAFTAR TENAGA PENDIDIK (GURU)</div>

      <div class="grid-info">
        <div class="info-group">
          <div class="info-row">
            <span class="info-label">Tanggal Cetak</span>
            <span class="info-value">: ${data.printDate}</span>
          </div>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 40px;">No</th>
            <th>Nama Lengkap</th>
            <th style="text-align: center; width: 150px;">NIP</th>
            <th style="text-align: center; width: 100px;">Jenis Kelamin</th>
            <th style="text-align: center; width: 120px;">Wali Kelas</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

export function generateSanctionReportHtml(data: {
  school: { foundationName?: string; regionalName?: string; name: string; accreditation?: string; address?: string; phone?: string; email?: string; website?: string; logoUrl?: string };
  student: { name: string; nisn: string; className: string };
  sanction: { sanctionType: string; cumulativePoints: number; issuedDate: string; notes?: string };
  printDate: string;
}) {
  const foundation = data.school.foundationName || "YAYASAN HANG TUAH PENGURUS";
  const regional = data.school.regionalName || "DAERAH SURABAYA";
  const schoolName = data.school.name || "SMP HANG TUAH 5 SIDOARJO";
  const accreditation = data.school.accreditation || "Terakreditasi \" A \"";
  const address = data.school.address || "Perum TNI AL Blok B. 16 / 18 TELP. (031) 8060725, Sidoarjo 61721";
  const email = data.school.email || "smpht5sda@gmail.com";
  const website = data.school.website || "www.smphangtuah5sidoarjo.sch.id";
  const logo = data.school.logoUrl || "/logo-hangtuah.png";

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Surat Peringatan Kedisiplinan</title>
      <style>${commonStyle}</style>
    </head>
    <body style="font-family: sans-serif; color: #000; padding: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 4px solid #000; padding-bottom: 6px;">
        <div style="width: 96px; height: 96px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          <img src="${logo}" alt="Logo Yayasan" style="height: 96px; width: 96px; object-fit: contain;" />
        </div>
        <div style="flex-grow: 1; text-align: center; padding: 0 10px;">
          <h2 style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2;">${foundation}</h2>
          <h2 style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2;">${regional}</h2>
          <h1 style="font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 4px 0 2px 0; line-height: 1;">${schoolName}</h1>
          <p style="font-size: 13px; font-weight: 600; margin: 0;">${accreditation}</p>
          <p style="font-size: 11px; font-weight: bold; margin: 4px 0 0 0;">${address}</p>
          <p style="font-size: 10px; font-weight: bold; color: #003399; margin: 2px 0 0 0;">Email : ${email}, website : ${website}</p>
        </div>
        <div style="width: 96px; flex-shrink: 0;"></div>
      </div>
      <div style="border-bottom: 1px solid #000; margin-top: 2px; margin-bottom: 24px;"></div>

      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; text-decoration: underline; letter-spacing: 1px; margin: 0;">SURAT PERINGATAN KEDISIPLINAN</h2>
        <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 4px;">NOMOR: SP/${data.sanction.sanctionType}/${new Date().getFullYear()}</p>
      </div>

      <div style="font-size: 12px; margin-bottom: 20px; line-height: 1.8;">
        <p>Berdasarkan catatan rekam jejak kedisiplinan siswa pada platform GuruHub, dengan ini menerangkan bahwa:</p>
        <table style="width: 100%; margin: 12px 0; font-size: 12px;">
          <tr>
            <td style="width: 140px; font-weight: bold;">Nama Siswa</td>
            <td style="width: 10px;">:</td>
            <td style="font-weight: bold;">${data.student.name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">NISN</td>
            <td>:</td>
            <td>${data.student.nisn || "-"}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Kelas</td>
            <td>:</td>
            <td>${data.student.className}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Total Poin Demerit</td>
            <td>:</td>
            <td style="color: #dc2626; font-weight: bold;">${data.sanction.cumulativePoints} Poin Demerit</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Tingkat Sanksi</td>
            <td>:</td>
            <td><strong style="color: #4f46e5;">${data.sanction.sanctionType}</strong></td>
          </tr>
        </table>

        <p style="margin-top: 12px;">
          Catatan / Tindakan Pembinaan:<br>
          <em>${data.sanction.notes || "Siswa bersangkutan diminta untuk segera melakukan konseling bersama Tim Bimbingan Konseling (BK) dan melengkapi berkas komitmen kedisiplinan."}</em>
        </p>
      </div>

      <table style="width: 100%; margin-top: 48px; font-size: 11px; text-align: center;">
        <tr>
          <td style="width: 33.33%; vertical-align: top;">
            <p style="margin-bottom: 60px;">Wali Kelas</p>
            <p style="font-weight: bold; text-decoration: underline;">( .................................... )</p>
          </td>
          <td style="width: 33.33%; vertical-align: top;">
            <p style="margin-bottom: 60px;">Guru Bimbingan Konseling (BK)</p>
            <p style="font-weight: bold; text-decoration: underline;">( .................................... )</p>
          </td>
          <td style="width: 33.33%; vertical-align: top;">
            <p style="margin-bottom: 60px;">Mengetahui,<br>Kepala Sekolah</p>
            <p style="font-weight: bold; text-decoration: underline;">( .................................... )</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
