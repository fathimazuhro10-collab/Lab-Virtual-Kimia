// Teacher Management Module
class TeacherManager {
    constructor() {
        this.students = [
            {
                id: 1,
                name: "Ahmad Faiz",
                class: "XII IPA 1",
                xp: 2450,
                level: 12,
                quizzes: [
                    { date: "2024-11-01", type: "Quiz Cepat", score: 80, time: "3:45" },
                    { date: "2024-11-03", type: "Challenge Harian", score: 95, time: "8:20" },
                    { date: "2024-11-05", type: "Quiz Cepat", score: 75, time: "4:10" }
                ],
                experiments: [
                    { date: "2024-11-02", name: "Identifikasi Asam Basa", completion: 100 },
                    { date: "2024-11-04", name: "Reaksi Endoterm & Eksoterm", completion: 85 }
                ],
                games: [
                    { date: "2024-11-01", name: "Periodic Puzzle", score: 850 },
                    { date: "2024-11-03", name: "Chem Match", score: 720 }
                ]
            },
            {
                id: 2,
                name: "Siti Nurhaliza",
                class: "XII IPA 1",
                xp: 2100,
                level: 10,
                quizzes: [
                    { date: "2024-11-01", type: "Quiz Cepat", score: 90, time: "3:20" },
                    { date: "2024-11-03", type: "Challenge Harian", score: 85, time: "7:45" },
                    { date: "2024-11-05", type: "Quiz Cepat", score: 95, time: "3:55" }
                ],
                experiments: [
                    { date: "2024-11-02", name: "Identifikasi Asam Basa", completion: 95 },
                    { date: "2024-11-04", name: "Reaksi Endoterm & Eksoterm", completion: 90 }
                ],
                games: [
                    { date: "2024-11-01", name: "Periodic Puzzle", score: 920 },
                    { date: "2024-11-03", name: "Chem Match", score: 780 }
                ]
            },
            {
                id: 3,
                name: "Budi Santoso",
                class: "XII IPA 2",
                xp: 1800,
                level: 8,
                quizzes: [
                    { date: "2024-11-01", type: "Quiz Cepat", score: 70, time: "4:30" },
                    { date: "2024-11-03", type: "Challenge Harian", score: 75, time: "9:15" },
                    { date: "2024-11-05", type: "Quiz Cepat", score: 80, time: "4:45" }
                ],
                experiments: [
                    { date: "2024-11-02", name: "Identifikasi Asam Basa", completion: 80 },
                    { date: "2024-11-04", name: "Reaksi Endoterm & Eksoterm", completion: 75 }
                ],
                games: [
                    { date: "2024-11-01", name: "Periodic Puzzle", score: 650 },
                    { date: "2024-11-03", name: "Chem Match", score: 580 }
                ]
            }
        ];
    }

    // Show teacher dashboard
    showTeacherDashboard() {
        console.log('showTeacherDashboard called');
        
        try {
            // Hide all existing sections first
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            
            // Remove existing teacher dashboard if any
            const existingDashboard = document.getElementById('teacher-dashboard');
            if (existingDashboard) {
                existingDashboard.remove();
            }
            
            const mainContent = document.querySelector('.main-content');
            if (!mainContent) {
                console.error('Main content not found');
                return;
            }
            
            // Create teacher dashboard HTML directly
            mainContent.innerHTML = `
                <section id="teacher-dashboard" class="content-section active" style="display: block;">
                    <div class="teacher-container">
                        <div class="teacher-header">
                            <h2>Dashboard Guru - ChemLab Academy</h2>
                            <div class="teacher-actions">
                                <div class="export-group">
                                    <button class="btn-primary" onclick="teacherManager.exportAllData('csv')">
                                        📊 Export CSV
                                    </button>
                                    <button class="btn-danger" onclick="teacherManager.exportAllData('pdf')">
                                        📕 Export PDF
                                    </button>
                                </div>
                                <button class="btn-secondary" onclick="teacherManager.showClassStats()">
                                    📈 Statistik Kelas
                                </button>
                            </div>
                        </div>

                        <div class="class-filter">
                            <label>Filter Kelas:</label>
                            <select id="class-filter" onchange="teacherManager.filterByClass()">
                                <option value="all">Semua Kelas</option>
                                <option value="XII IPA 1">XII IPA 1</option>
                                <option value="XII IPA 2">XII IPA 2</option>
                            </select>
                        </div>

                        <div class="students-table-container">
                            <h3>Data Siswa</h3>
                            <table class="students-table" id="students-table">
                                <thead>
                                    <tr>
                                        <th>Nama Siswa</th>
                                        <th>Kelas</th>
                                        <th>Level</th>
                                        <th>Total XP</th>
                                        <th>Rata-rata Quiz</th>
                                        <th>Eksperimen Selesai</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="students-tbody">
                                    <tr><td colspan="7">Loading data siswa...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            `;

            console.log('Teacher dashboard HTML created');
            
            // Wait a bit for DOM to update, then render table
            setTimeout(() => {
                this.renderStudentsTable();
            }, 100);
            
        } catch (error) {
            console.error('Error creating teacher dashboard:', error);
            alert('Terjadi error saat membuat dashboard guru: ' + error.message);
        }
    }

    // Render students table
    renderStudentsTable(filteredStudents = null) {
        try {
            const students = filteredStudents || this.students;
            console.log('Rendering students table with', students.length, 'students');
            
            const tbody = document.getElementById('students-tbody');
            if (!tbody) {
                console.error('students-tbody element not found');
                setTimeout(() => this.renderStudentsTable(filteredStudents), 200);
                return;
            }
            
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Tidak ada data siswa</td></tr>';
                return;
            }
            
            tbody.innerHTML = students.map(student => {
                try {
                    const avgQuiz = student.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / student.quizzes.length;
                    const completedExperiments = student.experiments.filter(exp => exp.completion >= 80).length;
                    
                    return `
                        <tr>
                            <td><strong>${student.name}</strong></td>
                            <td><span class="class-badge">${student.class}</span></td>
                            <td><span class="level-badge">Level ${student.level}</span></td>
                            <td><span class="xp-badge">${student.xp.toLocaleString()} XP</span></td>
                            <td><span class="quiz-score">${avgQuiz.toFixed(1)}%</span></td>
                            <td><span class="experiment-progress">${completedExperiments}/${student.experiments.length}</span></td>
                            <td>
                                <button class="btn-small btn-info" onclick="teacherManager.viewStudentDetail(${student.id})" title="Lihat Detail">
                                    👁️ Detail
                                </button>
                                <div class="download-buttons">
                                    <button class="btn-small btn-success" onclick="teacherManager.exportStudentData(${student.id}, 'txt')" title="Download TXT">
                                        📄 TXT
                                    </button>
                                    <button class="btn-small btn-danger" onclick="teacherManager.exportStudentData(${student.id}, 'pdf')" title="Download PDF">
                                        📕 PDF
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                } catch (studentError) {
                    console.error('Error rendering student:', student, studentError);
                    return `<tr><td colspan="7">Error loading student: ${student.name}</td></tr>`;
                }
            }).join('');
            
            console.log('Students table rendered successfully');
            
        } catch (error) {
            console.error('Error in renderStudentsTable:', error);
            const tbody = document.getElementById('students-tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7">Error loading data: ' + error.message + '</td></tr>';
            }
        }
    }

    // Filter by class
    filterByClass() {
        const selectedClass = document.getElementById('class-filter').value;
        if (selectedClass === 'all') {
            this.renderStudentsTable();
        } else {
            const filtered = this.students.filter(student => student.class === selectedClass);
            this.renderStudentsTable(filtered);
        }
    }

    // View student detail
    viewStudentDetail(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const modal = document.createElement('div');
        modal.className = 'modal student-detail-modal';
        modal.innerHTML = `
            <div class="modal-content student-detail-content">
                <div class="modal-header">
                    <h3>Detail Siswa: ${student.name}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="student-detail-body">
                    <div class="student-info">
                        <div class="info-card">
                            <h4>Informasi Umum</h4>
                            <p><strong>Nama:</strong> ${student.name}</p>
                            <p><strong>Kelas:</strong> ${student.class}</p>
                            <p><strong>Level:</strong> ${student.level}</p>
                            <p><strong>Total XP:</strong> ${student.xp}</p>
                        </div>
                    </div>

                    <div class="activity-tabs">
                        <button class="tab-btn active" onclick="teacherManager.showTab('quizzes', ${studentId})">Quiz</button>
                        <button class="tab-btn" onclick="teacherManager.showTab('experiments', ${studentId})">Eksperimen</button>
                        <button class="tab-btn" onclick="teacherManager.showTab('games', ${studentId})">Games</button>
                    </div>

                    <div class="tab-content" id="tab-content-${studentId}">
                        ${this.renderQuizzesTab(student)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="teacherManager.exportStudentData(${studentId})">
                        📥 Download Laporan
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Tutup
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Show different tabs in student detail
    showTab(tabName, studentId) {
        const student = this.students.find(s => s.id === studentId);
        const tabContent = document.getElementById(`tab-content-${studentId}`);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        switch(tabName) {
            case 'quizzes':
                tabContent.innerHTML = this.renderQuizzesTab(student);
                break;
            case 'experiments':
                tabContent.innerHTML = this.renderExperimentsTab(student);
                break;
            case 'games':
                tabContent.innerHTML = this.renderGamesTab(student);
                break;
        }
    }

    // Render quiz tab
    renderQuizzesTab(student) {
        return `
            <div class="quiz-results-table">
                <h4>Hasil Quiz</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Jenis Quiz</th>
                            <th>Skor</th>
                            <th>Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${student.quizzes.map(quiz => `
                            <tr>
                                <td>${quiz.date}</td>
                                <td>${quiz.type}</td>
                                <td>${quiz.score}%</td>
                                <td>${quiz.time}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="quiz-stats">
                    <p><strong>Rata-rata Skor:</strong> ${(student.quizzes.reduce((sum, q) => sum + q.score, 0) / student.quizzes.length).toFixed(1)}%</p>
                    <p><strong>Total Quiz:</strong> ${student.quizzes.length}</p>
                </div>
            </div>
        `;
    }

    // Render experiments tab
    renderExperimentsTab(student) {
        return `
            <div class="experiments-table">
                <h4>Hasil Eksperimen</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Nama Eksperimen</th>
                            <th>Penyelesaian</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${student.experiments.map(exp => `
                            <tr>
                                <td>${exp.date}</td>
                                <td>${exp.name}</td>
                                <td>${exp.completion}%</td>
                                <td>
                                    <span class="status ${exp.completion >= 80 ? 'completed' : 'incomplete'}">
                                        ${exp.completion >= 80 ? 'Selesai' : 'Belum Selesai'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Render games tab
    renderGamesTab(student) {
        return `
            <div class="games-table">
                <h4>Hasil Games</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Nama Game</th>
                            <th>Skor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${student.games.map(game => `
                            <tr>
                                <td>${game.date}</td>
                                <td>${game.name}</td>
                                <td>${game.score}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="games-stats">
                    <p><strong>Total Skor Games:</strong> ${student.games.reduce((sum, g) => sum + g.score, 0)}</p>
                </div>
            </div>
        `;
    }

    // Export single student data
    exportStudentData(studentId, format = 'txt') {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        if (format === 'pdf') {
            this.exportStudentDataPDF(student);
        } else {
            this.exportStudentDataTXT(student);
        }
    }

    // Export student data as TXT
    exportStudentDataTXT(student) {
        const avgQuiz = student.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / student.quizzes.length;
        const completedExperiments = student.experiments.filter(exp => exp.completion >= 80).length;
        const totalGameScore = student.games.reduce((sum, game) => sum + game.score, 0);

        const reportData = `
LAPORAN AKTIVITAS SISWA - CHEMLAB ACADEMY
==========================================

INFORMASI SISWA:
Nama: ${student.name}
Kelas: ${student.class}
Level: ${student.level}
Total XP: ${student.xp}
Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}

RINGKASAN PERFORMA:
- Rata-rata Skor Quiz: ${avgQuiz.toFixed(1)}%
- Eksperimen Selesai: ${completedExperiments}/${student.experiments.length}
- Total Skor Games: ${totalGameScore}

DETAIL QUIZ:
${student.quizzes.map(quiz => 
    `- ${quiz.date}: ${quiz.type} - Skor: ${quiz.score}% (Waktu: ${quiz.time})`
).join('\n')}

DETAIL EKSPERIMEN:
${student.experiments.map(exp => 
    `- ${exp.date}: ${exp.name} - Penyelesaian: ${exp.completion}%`
).join('\n')}

DETAIL GAMES:
${student.games.map(game => 
    `- ${game.date}: ${game.name} - Skor: ${game.score}`
).join('\n')}

==========================================
Laporan dibuat otomatis oleh ChemLab Academy
        `;

        this.downloadFile(`Laporan_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`, reportData);
    }

    // Export student data as PDF
    exportStudentDataPDF(student) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Set font
            doc.setFont('helvetica');
            
            // Header
            doc.setFontSize(18);
            doc.setTextColor(52, 73, 94);
            doc.text('LAPORAN AKTIVITAS SISWA', 20, 20);
            doc.setFontSize(14);
            doc.text('ChemLab Academy', 20, 30);
            
            // Line separator
            doc.setDrawColor(52, 73, 94);
            doc.line(20, 35, 190, 35);
            
            // Student info
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let yPos = 50;
            
            doc.text(`Nama: ${student.name}`, 20, yPos);
            yPos += 8;
            doc.text(`Kelas: ${student.class}`, 20, yPos);
            yPos += 8;
            doc.text(`Level: ${student.level}`, 20, yPos);
            yPos += 8;
            doc.text(`Total XP: ${student.xp.toLocaleString()}`, 20, yPos);
            yPos += 8;
            doc.text(`Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}`, 20, yPos);
            yPos += 15;
            
            // Performance summary
            const avgQuiz = student.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / student.quizzes.length;
            const completedExperiments = student.experiments.filter(exp => exp.completion >= 80).length;
            const totalGameScore = student.games.reduce((sum, game) => sum + game.score, 0);
            
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('RINGKASAN PERFORMA', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(`• Rata-rata Skor Quiz: ${avgQuiz.toFixed(1)}%`, 25, yPos);
            yPos += 7;
            doc.text(`• Eksperimen Selesai: ${completedExperiments}/${student.experiments.length}`, 25, yPos);
            yPos += 7;
            doc.text(`• Total Skor Games: ${totalGameScore.toLocaleString()}`, 25, yPos);
            yPos += 15;
            
            // Quiz details
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('DETAIL QUIZ', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            student.quizzes.forEach(quiz => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${quiz.date}: ${quiz.type} - Skor: ${quiz.score}% (Waktu: ${quiz.time})`, 25, yPos);
                yPos += 6;
            });
            yPos += 10;
            
            // Experiments details
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('DETAIL EKSPERIMEN', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            student.experiments.forEach(exp => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${exp.date}: ${exp.name} - Penyelesaian: ${exp.completion}%`, 25, yPos);
                yPos += 6;
            });
            yPos += 10;
            
            // Games details
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('DETAIL GAMES', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            student.games.forEach(game => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${game.date}: ${game.name} - Skor: ${game.score.toLocaleString()}`, 25, yPos);
                yPos += 6;
            });
            
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text('Laporan dibuat otomatis oleh ChemLab Academy', 20, 285);
                doc.text(`Halaman ${i} dari ${pageCount}`, 170, 285);
            }
            
            // Save PDF
            const filename = `Laporan_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            alert(`File PDF "${filename}" berhasil didownload!`);
            
        } catch (error) {
            console.error('Error creating PDF:', error);
            alert('Terjadi error saat membuat PDF. Menggunakan format TXT sebagai alternatif.');
            this.exportStudentDataTXT(student);
        }
    }

    // Export all students data
    exportAllData(format = 'csv') {
        if (format === 'pdf') {
            this.exportAllDataPDF();
        } else {
            this.exportAllDataCSV();
        }
    }

    // Export all data as CSV
    exportAllDataCSV() {
        const allData = this.students.map(student => {
            const avgQuiz = student.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / student.quizzes.length;
            const completedExperiments = student.experiments.filter(exp => exp.completion >= 80).length;
            const totalGameScore = student.games.reduce((sum, game) => sum + game.score, 0);

            return {
                nama: student.name,
                kelas: student.class,
                level: student.level,
                totalXP: student.xp,
                rataRataQuiz: avgQuiz.toFixed(1),
                eksperimenSelesai: `${completedExperiments}/${student.experiments.length}`,
                totalSkorGames: totalGameScore
            };
        });

        const csvContent = this.convertToCSV(allData);
        this.downloadFile(`Laporan_Semua_Siswa_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
    }

    // Export all data as PDF
    exportAllDataPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(18);
            doc.setTextColor(52, 73, 94);
            doc.text('LAPORAN SEMUA SISWA', 20, 20);
            doc.setFontSize(14);
            doc.text('ChemLab Academy', 20, 30);
            doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 40);
            
            // Line separator
            doc.setDrawColor(52, 73, 94);
            doc.line(20, 45, 190, 45);
            
            let yPos = 60;
            
            // Table header
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Nama', 20, yPos);
            doc.text('Kelas', 60, yPos);
            doc.text('Level', 90, yPos);
            doc.text('XP', 110, yPos);
            doc.text('Avg Quiz', 130, yPos);
            doc.text('Eksperimen', 155, yPos);
            yPos += 5;
            
            // Line under header
            doc.line(20, yPos, 190, yPos);
            yPos += 10;
            
            // Student data
            this.students.forEach(student => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                const avgQuiz = student.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / student.quizzes.length;
                const completedExperiments = student.experiments.filter(exp => exp.completion >= 80).length;
                
                doc.text(student.name, 20, yPos);
                doc.text(student.class, 60, yPos);
                doc.text(student.level.toString(), 90, yPos);
                doc.text(student.xp.toLocaleString(), 110, yPos);
                doc.text(`${avgQuiz.toFixed(1)}%`, 130, yPos);
                doc.text(`${completedExperiments}/${student.experiments.length}`, 155, yPos);
                yPos += 8;
            });
            
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text('Laporan dibuat otomatis oleh ChemLab Academy', 20, 285);
                doc.text(`Halaman ${i} dari ${pageCount}`, 170, 285);
            }
            
            const filename = `Laporan_Semua_Siswa_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            alert(`File PDF "${filename}" berhasil didownload!`);
            
        } catch (error) {
            console.error('Error creating PDF:', error);
            alert('Terjadi error saat membuat PDF. Menggunakan format CSV sebagai alternatif.');
            this.exportAllDataCSV();
        }
    }

    // Convert data to CSV
    convertToCSV(data) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        return headers + '\n' + rows;
    }

    // Download file
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        alert(`File "${filename}" berhasil didownload!`);
    }

    // Show class statistics
    showClassStats() {
        const stats = this.calculateClassStats();
        
        const modal = document.createElement('div');
        modal.className = 'modal stats-modal';
        modal.innerHTML = `
            <div class="modal-content stats-content">
                <div class="modal-header">
                    <h3>Statistik Kelas</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="stats-body">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h4>Total Siswa</h4>
                            <div class="stat-number">${stats.totalStudents}</div>
                        </div>
                        <div class="stat-card">
                            <h4>Rata-rata Level</h4>
                            <div class="stat-number">${stats.avgLevel}</div>
                        </div>
                        <div class="stat-card">
                            <h4>Rata-rata Quiz</h4>
                            <div class="stat-number">${stats.avgQuizScore}%</div>
                        </div>
                        <div class="stat-card">
                            <h4>Eksperimen Selesai</h4>
                            <div class="stat-number">${stats.completionRate}%</div>
                        </div>
                    </div>
                    
                    <div class="class-breakdown">
                        <h4>Breakdown per Kelas</h4>
                        ${Object.entries(stats.byClass).map(([className, classStats]) => `
                            <div class="class-stat">
                                <h5>${className}</h5>
                                <p>Siswa: ${classStats.count} | Avg Level: ${classStats.avgLevel} | Avg Quiz: ${classStats.avgQuiz}%</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="export-group">
                        <button class="btn-primary" onclick="teacherManager.exportClassStats('txt')">
                            📄 Download TXT
                        </button>
                        <button class="btn-danger" onclick="teacherManager.exportClassStats('pdf')">
                            📕 Download PDF
                        </button>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Tutup
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Calculate class statistics
    calculateClassStats() {
        const totalStudents = this.students.length;
        const avgLevel = (this.students.reduce((sum, s) => sum + s.level, 0) / totalStudents).toFixed(1);
        
        const allQuizScores = this.students.flatMap(s => s.quizzes.map(q => q.score));
        const avgQuizScore = (allQuizScores.reduce((sum, score) => sum + score, 0) / allQuizScores.length).toFixed(1);
        
        const totalExperiments = this.students.reduce((sum, s) => sum + s.experiments.length, 0);
        const completedExperiments = this.students.reduce((sum, s) => 
            sum + s.experiments.filter(exp => exp.completion >= 80).length, 0);
        const completionRate = ((completedExperiments / totalExperiments) * 100).toFixed(1);

        // By class breakdown
        const byClass = {};
        this.students.forEach(student => {
            if (!byClass[student.class]) {
                byClass[student.class] = { students: [], count: 0 };
            }
            byClass[student.class].students.push(student);
            byClass[student.class].count++;
        });

        Object.keys(byClass).forEach(className => {
            const classStudents = byClass[className].students;
            byClass[className].avgLevel = (classStudents.reduce((sum, s) => sum + s.level, 0) / classStudents.length).toFixed(1);
            
            const classQuizScores = classStudents.flatMap(s => s.quizzes.map(q => q.score));
            byClass[className].avgQuiz = (classQuizScores.reduce((sum, score) => sum + score, 0) / classQuizScores.length).toFixed(1);
        });

        return {
            totalStudents,
            avgLevel,
            avgQuizScore,
            completionRate,
            byClass
        };
    }

    // Export class statistics
    exportClassStats(format = 'txt') {
        if (format === 'pdf') {
            this.exportClassStatsPDF();
        } else {
            this.exportClassStatsTXT();
        }
    }

    // Export class statistics as TXT
    exportClassStatsTXT() {
        const stats = this.calculateClassStats();
        
        const statsReport = `
STATISTIK KELAS - CHEMLAB ACADEMY
=================================

RINGKASAN UMUM:
- Total Siswa: ${stats.totalStudents}
- Rata-rata Level: ${stats.avgLevel}
- Rata-rata Skor Quiz: ${stats.avgQuizScore}%
- Tingkat Penyelesaian Eksperimen: ${stats.completionRate}%

BREAKDOWN PER KELAS:
${Object.entries(stats.byClass).map(([className, classStats]) => 
    `${className}:
  - Jumlah Siswa: ${classStats.count}
  - Rata-rata Level: ${classStats.avgLevel}
  - Rata-rata Quiz: ${classStats.avgQuiz}%`
).join('\n\n')}

=================================
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Laporan dibuat otomatis oleh ChemLab Academy
        `;

        this.downloadFile(`Statistik_Kelas_${new Date().toISOString().split('T')[0]}.txt`, statsReport);
    }

    // Export class statistics as PDF
    exportClassStatsPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const stats = this.calculateClassStats();
            
            // Header
            doc.setFontSize(18);
            doc.setTextColor(52, 73, 94);
            doc.text('STATISTIK KELAS', 20, 20);
            doc.setFontSize(14);
            doc.text('ChemLab Academy', 20, 30);
            doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 40);
            
            // Line separator
            doc.setDrawColor(52, 73, 94);
            doc.line(20, 45, 190, 45);
            
            let yPos = 60;
            
            // Summary statistics
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('RINGKASAN UMUM', 20, yPos);
            yPos += 15;
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Total Siswa: ${stats.totalStudents}`, 25, yPos);
            yPos += 10;
            doc.text(`Rata-rata Level: ${stats.avgLevel}`, 25, yPos);
            yPos += 10;
            doc.text(`Rata-rata Skor Quiz: ${stats.avgQuizScore}%`, 25, yPos);
            yPos += 10;
            doc.text(`Tingkat Penyelesaian Eksperimen: ${stats.completionRate}%`, 25, yPos);
            yPos += 20;
            
            // Class breakdown
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('BREAKDOWN PER KELAS', 20, yPos);
            yPos += 15;
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            Object.entries(stats.byClass).forEach(([className, classStats]) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(12);
                doc.setTextColor(52, 73, 94);
                doc.text(className, 25, yPos);
                yPos += 10;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(`• Jumlah Siswa: ${classStats.count}`, 30, yPos);
                yPos += 7;
                doc.text(`• Rata-rata Level: ${classStats.avgLevel}`, 30, yPos);
                yPos += 7;
                doc.text(`• Rata-rata Quiz: ${classStats.avgQuiz}%`, 30, yPos);
                yPos += 15;
            });
            
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text('Laporan dibuat otomatis oleh ChemLab Academy', 20, 285);
                doc.text(`Halaman ${i} dari ${pageCount}`, 170, 285);
            }
            
            const filename = `Statistik_Kelas_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            alert(`File PDF "${filename}" berhasil didownload!`);
            
        } catch (error) {
            console.error('Error creating PDF:', error);
            alert('Terjadi error saat membuat PDF. Menggunakan format TXT sebagai alternatif.');
            this.exportClassStatsTXT();
        }
    }
}

// Initialize teacher manager
const teacherManager = new TeacherManager();
console.log('TeacherManager initialized:', teacherManager);