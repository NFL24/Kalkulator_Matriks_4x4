function getMatrix() {
    const matrix = [];
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            const inputElement = document.getElementById(`cell${i * 4 + j}`);
            const value = parseInt(inputElement.value);
            if (isNaN(value)) {
                inputElement.value = 0;
                row.push(0);
            } else {
                row.push(value);
            }
        }
        matrix.push(row);
    }
    return matrix;
  }
  
  //fungsi untuk mendapatkan minor matrix
  function getMinor(matrix, row, col) {
    return matrix.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
  }
  
  //fungsi helper untuk membuat tabel matrix HTML
  function createMatrixTable(matrix, title = '') {
    let html = title ? `<p class="matrix-title">${title}</p>` : '';
    html += '<table class="matrix-display">';
    for (let i = 0; i < matrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            html += `<td>${matrix[i][j]}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
  }
  
  function unifiedCalculation(matrix) {
    let htmlResult = `
        <div class="method-section">
            <h2>PENYELESAIAN DETERMINAN 4x4</h2>
            <p>Membandingkan Metode Minor-Kofaktor vs Metode Sarrus dalam satu perhitungan dengan ekspansi baris pertama.</p>
            ${createMatrixTable(matrix, 'Matriks Asli:')} 
                <p><strong>Rumus Umum:</strong> det(A) = Σ(j=1→4) a[i][j] x C[i][j]</p>
                <p><strong>C[i][j]:</strong> (-1)^j x det(M[i][j])</p>
                <p><strong>M[i][j]:</strong> Minor 3x3 setelah menghapus baris pertama dan masing-masing kolom j</p>
            </div>
        </div>
    `;
  
    let det1 = 0; 
    let det2 = 0; 
    let finalSteps = '';
  
    for (let j = 0; j < 4; j++) {
        const element = matrix[0][j];
        const minor = getMinor(matrix, 0, j);
        const cofactorSign = ((-1) ** j);
  
        //perhitungan dengan Minor Kofaktor
        const a = minor[0], b = minor[1], c = minor[2];
        const clm1 = a[0] * (b[1] * c[2] - b[2] * c[1]);  
        const clm2 = a[1] * (b[0] * c[2] - b[2] * c[0]);  
        const clm3 = a[2] * (b[0] * c[1] - b[1] * c[0]);  
        const minorDet1 = clm1 - clm2 + clm3;
  
        //perhitungan dengan Sarrus
        const pos1 = a[0] * b[1] * c[2];
        const pos2 = a[1] * b[2] * c[0];
        const pos3 = a[2] * b[0] * c[1];
        const neg1 = a[2] * b[1] * c[0];
        const neg2 = a[0] * b[2] * c[1];
        const neg3 = a[1] * b[0] * c[2];
        const minorDet2 = pos1 + pos2 + pos3 - (neg1 + neg2 + neg3);
  
        //perhitungan kofaktor dan kontribusi
        const cofactor1 = cofactorSign * minorDet1;
        const cofactor2 = cofactorSign * minorDet2;
        const contribution1 = element * cofactor1;
        const contribution2 = element * cofactor2;
  
        det1 += contribution1;
        det2 += contribution2;
  
        htmlResult += `
            <div class="calculation-step">
                <h3>Langkah ${j + 1}: Elemen A[0][${j}] = ${element}</h3>
                <div class="step-details">
                    <p><strong>Minor 3x3 untuk A[0][${j}]:</strong></p>
                    ${createMatrixTable(minor)}
                    
                    <div class="method-comparison">
                        <div class="method-box method1">
                            <h4>METODE MINOR-KOFAKTOR</h4>
                            <p class="minor-detail">det(m₀₀) = ${a[0]} × (${b[1]} × ${c[2]} - ${b[2]} × ${c[1]}) = ${a[0]} × ${b[1] * c[2] - b[2] * c[1]} = ${clm1}</p>
                            <p class="minor-detail">det(m₀₁) = ${a[1]} × (${b[0]} × ${c[2]} - ${b[2]} × ${c[0]}) = ${a[1]} × ${b[0] * c[2] - b[2] * c[0]} = ${clm2}</p>
                            <p class="minor-detail">det(m₀₂) = ${a[2]} × (${b[0]} × ${c[1]} - ${b[1]} × ${c[0]}) = ${a[2]} × ${b[0] * c[1] - b[1] * c[0]} = ${clm3}</p>
                            <p><strong>det(M₀${j}) = ${clm1} - (${clm2}) + ${clm3} = ${minorDet1}</strong></p>
                        </div>
                        
                        <div class="method-box method2">
                            <h4>METODE SARRUS</h4>
                            <p class="sarrus-detail">Diagonal Kanan ke Kiri: (${a[0]} × ${b[1]} × ${c[2]}) + (${a[1]} × ${b[2]} × ${c[0]}) + (${a[2]} × ${b[0]} × ${c[1]})</p>
                            <p class="sarrus-detail">= ${pos1} + ${pos2} + ${pos3} = ${pos1 + pos2 + pos3}</p>
                            <p class="sarrus-detail">Diagonal Kiri ke Kanan: (${a[2]} × ${b[1]} × ${c[0]}) + (${a[0]} × ${b[2]} × ${c[1]}) + (${a[1]} × ${b[0]} × ${c[2]})</p>
                            <p class="sarrus-detail">= ${neg1} + ${neg2} + ${neg3} = ${neg1 + neg2 + neg3}</p>
                            <p><strong>det(M₀${j}) = ${pos1 + pos2 + pos3} - ${neg1 + neg2 + neg3} = ${minorDet2}</strong></p>
                        </div>
                    </div>
                    
                    <div class="verification-box">
                        <p><strong>✅Verifikasi :</strong> Kedua metode menghasilkan det(M₀${j}) = ${minorDet1 === minorDet2 ? minorDet1 : `${minorDet1} vs ${minorDet2} ❌`}</p>
                        <p><strong>Kofaktor   :</strong> C₀${j} = (-1)^${j} × ${minorDet1} = ${cofactorSign} × ${minorDet1} = ${cofactor1}</p>
                        <p><strong>Kontribusi :</strong> ${element} × ${cofactor1} = ${contribution1}</p>
                    </div>
                </div>
            </div>
        `;
  
        finalSteps += `
            <tr>
                <td style="font-weight: bold;">A[0][${j}] = ${element}</td>
                <td>${minorDet1}</td>
                <td>(-1)^${j} = ${cofactorSign}</td>
                <td>${cofactor1}</td>
                <td>${element} × ${cofactor1} = ${contribution1}</td>
            </tr>
        `;
    }
  
    htmlResult += `
        <div class="final-determinant">
            <h3>RINGKASAN PERHITUNGAN</h3>
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>Elemen</th>
                        <th>det(Minor)</th>
                        <th>Tanda</th>
                        <th>Kofaktor</th>
                        <th>Kontribusi</th>
                    </tr>
                </thead>
                <tbody>
                    ${finalSteps}
                </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 15px;">
                <h2 style="font-size: 2.2em; margin-bottom: 15px;">DETERMINAN FINAL</h2>
                <p style="font-size: 3em; font-weight: bold; margin: 10px 0;">${det1}</p>
                <p style="font-size: 1.2em; opacity: 0.9;">
                    ${det1 === det2 ? 
                        `✅ Kedua metode menghasilkan hasil yang sama: ${det1}` : 
                        `⚠️ Perbedaan hasil - Method1: ${det1}, Method2: ${det2}`
                    }
                </p>
                <p style="font-size: 1em; opacity: 0.8; margin-top: 15px;">
                    Kedua metode menggunakan ekspansi kofaktor yang sama pada baris pertama,<br>
                    hanya berbeda dalam cara menghitung determinan minor 3x3.
                </p>
            </div>
        </div>
    `;
  
    return [htmlResult, det1];
  }
  
  //fungsi untuk detail metode 1 (Minor-Kofaktor) 
  function method1(matrix) {
    let htmlResult = `
        <div class="method-section">
            <h2>METODE 1: Minor-Kofaktor</h2>
            <p>Menggunakan ekspansi kofaktor sepanjang baris pertama dengan perhitungan determinan minor 3x3.</p>
            ${createMatrixTable(matrix, 'Matriks Asli:')}
        </div>
    `;
    let det = 0;
  
    for (let j = 0; j < 4; j++) {
        const minor = getMinor(matrix, 0, j);
        const a = minor[0], b = minor[1], c = minor[2];
        const clm1 = a[0] * (b[1] * c[2] - b[2] * c[1]);  
        const clm2 = a[1] * (b[0] * c[2] - b[2] * c[0]);  
        const clm3 = a[2] * (b[0] * c[1] - b[1] * c[0]);  
        const minorDet = clm1 - clm2 + clm3;
        const cofactorSign = ((-1) ** j);
        const cofactor = cofactorSign * minorDet;
        const contribution = matrix[0][j] * cofactor; 
        det += contribution; 
  
        htmlResult += `
            <div class="calculation-step">
                <h3>Langkah ${j + 1}: Elemen A[0][${j}] = ${matrix[0][j]}</h3>
                <div class="step-details">
                    <p>Minor 3x3 untuk A[0][${j}]:</p>
                    ${createMatrixTable(minor)}
                    <p class="minor-detail">det(m₀₀) = ${a[0]} × (${b[1]} × ${c[2]} - ${b[2]} × ${c[1]}) = ${a[0]} × ${b[1] * c[2] - b[2] * c[1]} = ${clm1}</p>
                    <p class="minor-detail">det(m₀₁) = ${a[1]} × (${b[0]} × ${c[2]} - ${b[2]} × ${c[0]}) = ${a[1]} × ${b[0] * c[2] - b[2] * c[0]} = ${clm2}</p>
                    <p class="minor-detail">det(m₀₂) = ${a[2]} × (${b[0]} × ${c[1]} - ${b[1]} × ${c[0]}) = ${a[2]} × ${b[0] * c[1] - b[1] * c[0]} = ${clm3}</p>
                    <p class="minor-detail">det(M₀${j}) = ${clm1} - (${clm2}) + ${clm3} = ${minorDet}</p>
                    <p>Kofaktor C₀${j} = (-1)^(0+${j}) × det(M₀${j}) = ${cofactorSign} × ${minorDet} = ${cofactor}</p>
                    <p><strong>Kontribusi = Elemen × Kofaktor = ${matrix[0][j]} × ${cofactor} = ${contribution}</strong></p>
                </div>
            </div>
        `;
    }
  
    htmlResult += `
        <div class="final-determinant">
            <h3>Total Determinan (Metode Minor-Kofaktor): ${det}</h3>
        </div>
    `;
    return [htmlResult, det];
  }
  
  //fungsi untuk detail metode 2 (Sarrus)  
  function method2(matrix) {
    let htmlResult = `
        <div class="method-section">
            <h2>METODE 2: Metode Sarrus</h2>
            <p>Menggunakan ekspansi kofaktor sepanjang baris pertama dengan determinan minor 3x3 dihitung menggunakan aturan Sarrus.</p>
            ${createMatrixTable(matrix, 'Matriks Asli:')}
        </div>
    `;
    let det = 0;
  
    for (let j = 0; j < 4; j++) {
        const minor = getMinor(matrix, 0, j);
        const a = minor[0], b = minor[1], c = minor[2];
        const pos1 = a[0] * b[1] * c[2];
        const pos2 = a[1] * b[2] * c[0];
        const pos3 = a[2] * b[0] * c[1];
        const neg1 = a[2] * b[1] * c[0];
        const neg2 = a[0] * b[2] * c[1];
        const neg3 = a[1] * b[0] * c[2];
        const minorDet = pos1 + pos2 + pos3 - (neg1 + neg2 + neg3);
        const cofactorSign = ((-1) ** j); 
        const cofactor = cofactorSign * minorDet; 
        const contribution = matrix[0][j] * cofactor; 
        det += contribution; 
  
        htmlResult += `
            <div class="calculation-step">
                <h3>Langkah ${j + 1}: Elemen A[0][${j}] = ${matrix[0][j]}</h3>
                <div class="step-details">
                    <p>Minor 3x3 untuk A[0][${j}]:</p>
                    ${createMatrixTable(minor)}
                    <p>Perhitungan Minor 3x3 (Aturan Sarrus):</p>
                    <p class="sarrus-detail">Diagonal Kanan ke Kiri: (${a[0]} × ${b[1]} × ${c[2]}) + (${a[1]} × ${b[2]} × ${c[0]}) + (${a[2]} × ${b[0]} × ${c[1]}) = ${pos1} + ${pos2} + ${pos3} = ${pos1 + pos2 + pos3}</p>
                    <p class="sarrus-detail">Diagonal Kiri ke Kanan: (${a[2]} × ${b[1]} × ${c[0]}) + (${a[0]} × ${b[2]} × ${c[1]}) + (${a[1]} × ${b[0]} × ${c[2]}) = ${neg1} + ${neg2} + ${neg3} = ${neg1 + neg2 + neg3}</p>
                    <p>Determinan Minor det(M₀${j}) = (${pos1 + pos2 + pos3}) - (${neg1 + neg2 + neg3}) = ${minorDet}</p>
                    <p>Kofaktor C₀${j} = (-1)^(0+${j}) × det(M₀${j}) = ${cofactorSign} × ${minorDet} = ${cofactor}</p>
                    <p><strong>Kontribusi = Elemen × Kofaktor = ${matrix[0][j]} × ${cofactor} = ${contribution}</strong></p>
                </div>
            </div>
        `;
    }
  
    htmlResult += `
        <div class="final-determinant">
            <h3>Total Determinan (Metode Sarrus): ${det}</h3>
        </div>
    `;
    return [htmlResult, det];
  }
  
  //fungsi untuk menampilkan tab
  function showTab(id) {
    const panes = document.querySelectorAll('.tab-pane');
    const buttons = document.querySelectorAll('.tab-button');
    panes.forEach(pane => pane.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelector(`[onclick="showTab('${id}')"]`).classList.add('active');
  }
  
  //fungsi utama untuk menghitung
  function calculate() {
    const outputUnified = document.getElementById("unified");
    const output1 = document.getElementById("method1");
    const output2 = document.getElementById("method2");
    const summary = document.getElementById("kesimpulan");
    const loading = document.getElementById("loading");
  
    outputUnified.innerHTML = output1.innerHTML = output2.innerHTML = summary.innerHTML = "";
    loading.style.display = "flex";
  
    const matrix = getMatrix();
  
    setTimeout(() => {
        //untuk menghitung dengan semua metode
        const [unifiedResult, finalDet] = unifiedCalculation(matrix);
        const [res1, det1] = method1(matrix);
        const [res2, det2] = method2(matrix);
  
        //untuk menampilkan hasil
        outputUnified.innerHTML = unifiedResult;
        output1.innerHTML = res1;
        output2.innerHTML = res2;
  
        summary.innerHTML = `
            <div class="summary-section">
                <h2>Kesimpulan Akhir</h2>
                <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 15px; margin: 20px 0;">
                    <h3>Ringkasan Metode Perhitungan :</h3>
                    <div style="text-align: left; max-width: 700px; margin: 20px auto;">
                        <p style="margin: 15px 0; font-size: 1.1em;">
                            <strong>🔹 Metode Minor-Kofaktor :</strong> Menggunakan ekspansi kofaktor dengan perhitungan manual determinan 3x3 menggunakan rumus a₀(b₁c₂ - b₂c₁) - a₁(b₀c₂ - b₂c₀) + a₂(b₀c₁ - b₁c₀)
                        </p>
                        <p style="margin: 15px 0; font-size: 1.1em;">
                            <strong>🔹 Metode Sarrus :</strong> Menggunakan ekspansi kofaktor dengan aturan Sarrus untuk determinan 3x3 (diagonal kanan dikurangi diagonal kiri)
                        </p>
                        <p style="margin: 15px 0; font-size: 1.1em;">
                            <strong>🔹 Prinsip Dasar :</strong> Kedua metode menggunakan rumus yang sama: det(A) = Σ a₀ⱼ × C₀ⱼ dimana C₀ⱼ = (-1)ʲ × det(M₀ⱼ)
                        </p>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; margin: 20px 0;">
                    <h3 style="color: #fff; font-size: 1.8em; margin-bottom: 20px;">DETERMINAN FINAL</h3>
                    <p style="font-size: 3.5em; font-weight: bold; margin: 15px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${finalDet}</p>
                    <div style="display: flex; justify-content: space-around; margin-top: 25px; flex-wrap: wrap;">
                        <div style="background: rgba(76,175,80,0.3); padding: 15px; border-radius: 10px; margin: 5px; flex: 1; min-width: 200px;">
                            <p style="font-size: 1.1em;"><strong>Metode Minor-Kofaktor :</strong></p>
                            <p style="font-size: 1.5em; font-weight: bold;">${det1}</p>
                        </div>
                        <div style="background: rgba(33,150,243,0.3); padding: 15px; border-radius: 10px; margin: 5px; flex: 1; min-width: 200px;">
                            <p style="font-size: 1.1em;"><strong>Metode Sarrus :</strong></p>
                            <p style="font-size: 1.5em; font-weight: bold;">${det2}</p>
                        </div>
                    </div>
                </div>
  
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p class="comparison-result ${det1 === det2 ? 'match' : 'mismatch'}" style="font-size: 1.3em; margin: 0; padding: 15px; border-radius: 8px;">
                        ${det1 === det2 ? 
                            "✅ Kedua metode menghasilkan hasil yang identik! Perhitungan sudah benar." : 
                            `⚠️ Terdapat perbedaan hasil! Method1: ${det1}, Method2: ${det2}. Periksa kembali perhitungan.`
                        }
                    </p>
                </div>
  
                <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <p style="font-size: 1.1em; font-style: italic; opacity: 0.9;">
                        <strong>Catatan :</strong> Kedua metode memberikan hasil yang identik karena menggunakan prinsip ekspansi kofaktor yang sama. 
                        Perbedaan hanya terletak pada cara menghitung determinan minor 3x3: 
                        Metode 1 menggunakan perhitungan manual, sedangkan Metode 2 menggunakan aturan Sarrus.
                    </p>
                </div>
            </div>
        `;
  
        loading.style.display = "none";
        showTab('unified'); 
  
        //render LaTeX jika tersedia
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise();
        }
    }, 1200); //biar agak delay 
  }
  
  //fungsi untuk mengisi matrix dengan nilai random
  function fillRandom() {
    for (let i = 0; i < 16; i++) {
        document.getElementById(`cell${i}`).value = Math.floor(Math.random() * 21 - 10); // -10 hingga 10
    }
  }
  
  //fungsi untuk mereset matrix
  function resetMatrix() {
    for (let i = 0; i < 16; i++) {
        document.getElementById(`cell${i}`).value = 0;
    }
    //mengclear hasil dan kembali ke tab default
    document.getElementById("unified").innerHTML = "";
    document.getElementById("method1").innerHTML = "";
    document.getElementById("method2").innerHTML = "";
    document.getElementById("kesimpulan").innerHTML = "";
    showTab('unified');
  }
  
  //event listener untuk initialization
  document.addEventListener('DOMContentLoaded', () => {
    showTab('unified');
    
    //menambahkan event listener untuk input matrix
    for (let i = 0; i < 16; i++) {
        const input = document.getElementById(`cell${i}`);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculate();
            }
        });
    }
  });
  
  //menambahkan MathJax untuk rendering LaTeX
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.id = 'MathJax-script';
  script.async = true;
  document.head.appendChild(script);