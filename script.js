// ========================================
// GARDEN AI
// ระบบวิเคราะห์พรรณไม้ด้วยปัญญาประดิษฐ์
// ========================================


const MODEL_URL = "./my_model/";


let model;


// ----------------------------------------
// โหลดโมเดล AI
// ----------------------------------------


async function loadModel() {


    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";


    model = await tmImage.load(
        modelURL,
        metadataURL
    );


    console.log("GARDEN AI โหลดโมเดลสำเร็จ");
}


// ----------------------------------------
// แสดงภาพที่ผู้ใช้เลือก
// ----------------------------------------


document
    .getElementById("imageInput")
    .addEventListener("change", function(event) {


        const file = event.target.files[0];


        if (!file) {
            return;
        }


        const image =
            document.getElementById("preview");


        image.src =
            window.URL.createObjectURL(file);


        image.style.display = "block";


    });


// ----------------------------------------
// แปลงชื่อ Class ของ AI
// เป็นภาษาที่ผู้ใช้เข้าใจ
// ----------------------------------------


function translateClass(className) {


    const name =
        className.toLowerCase();


    if (
        name.includes("Xishuangbanna ") ||
        name.includes("สิบสองปันนา")
    ) {


        return {
            title: "สิบสองปันนา",
            icon: "🌱",
            advice:
                "ต้นอยู่บริเวณหน้าอาคารประถม"
        };


    }


    if (
        name.includes("Garden Gardenia ") ||
        name.includes("พุดซ้อน") ||
        name.includes("พุดซ้อน")
    ) {


        return {
            title: "พุดซ้อน",
            icon: "🌿",
            advice:
                "ต้นอยู่บริเวณโดมหน้าโรงเรียน"
        };


    }


    if (
        name.includes("Foxtail palm") ||
        name.includes("ปาล์มหางกระรอก") ||
        name.includes("ปาล์มหางกระรอก")
    ) {


        return {
            title: "ปาล์มหางกระรอก",
            icon: "🍂",
            advice:
                "ต้นอยู่บริเวณสนามบาสเกตบอลหน้าห้องวิชาการ"
        };


    }


    if (
        name.includes("Yellow elder") ||
        name.includes("ทองอุไร") ||
        name.includes("ทองอุไร")
    ) {


        return {
            title: "ทองอุไร",
            icon: "🍂",
            advice:
                "ต้นอยู่บริเวณโดมหน้าโรงเรียน"
        };


    }



    // กรณีชื่อ Class ไม่ตรงกับที่กำหนด


    return {
        title: className,
        icon: "🌿",
        advice:
            "ควรตรวจสอบผลการวิเคราะห์ร่วมกับพรรณไม้จริง"
    };


}


// ----------------------------------------
// วิเคราะห์ระดับความมั่นใจ
// ----------------------------------------


function getConfidenceLevel(probability) {


    if (probability >= 85) {


        return {
            level: "ความมั่นใจสูง",
            className: "confidence-high"
        };


    }


    if (probability >= 60) {


        return {
            level: "ความมั่นใจปานกลาง",
            className: "confidence-medium"
        };


    }


    return {
        level: "ความมั่นใจต่ำ",
        className: "confidence-low"
    };


}


// ----------------------------------------
// วิเคราะห์ภาพด้วย AI
// ----------------------------------------


async function analyzeImage() {


    const imageInput =
        document.getElementById("imageInput");


    const result =
        document.getElementById("result");


    const loading =
        document.getElementById("loading");


    // ตรวจสอบว่ามีรูปหรือไม่


    if (imageInput.files.length === 0) {


        result.innerHTML = `
            <div class="result-card confidence-low">
                <h3>⚠️ กรุณาเลือกรูปพรรณไม้</h3>
                <p>
                    เลือกรูปพรรณไม้ก่อนเริ่มการวิเคราะห์
                </p>
            </div>
        `;


        return;
    }


    try {


        // โหลดโมเดล


        if (!model) {


            loading.innerHTML =
                "<p>🤖 กำลังเตรียม AI...</p>";


            await loadModel();


        }


        loading.innerHTML =
            "<p>🔍 AI กำลังวิเคราะห์ภาพ...</p>";


        result.innerHTML = "";


        // ภาพที่ต้องการวิเคราะห์


        const image =
            document.getElementById("preview");


        // ส่งภาพให้ AI วิเคราะห์


        const prediction =
            await model.predict(image);
            console.log("ผลการทำนายจาก GARDEN AI:");


            console.table(prediction);


        // ------------------------------------
        // หาผลลัพธ์ที่มีความมั่นใจสูงสุด
        // ------------------------------------


        let highestPrediction =
            prediction[0];


        for (
            let i = 1;
            i < prediction.length;
            i++
        ) {


            if (
                prediction[i].probability >
                highestPrediction.probability
            ) {


                highestPrediction =
                    prediction[i];


            }


        }


        // ------------------------------------
        // เตรียมข้อมูลผลลัพธ์
        // ------------------------------------


        const className =
            highestPrediction.className;


        const probability =
            highestPrediction.probability * 100;


        const percentage =
            probability.toFixed(2);


        const resultInfo =
            translateClass(className);


        const confidence =
            getConfidenceLevel(probability);
            // เก็บผลการวิเคราะห์ล่าสุด
window.latestResult = {


    title: resultInfo.title,


    icon: resultInfo.icon,


    percentage: percentage,


    confidence: confidence.level,


    advice: resultInfo.advice,


    date: new Date().toLocaleDateString("th-TH"),


    time: new Date().toLocaleTimeString(
        "th-TH",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    )


};


        // บันทึกประวัติการวิเคราะห์
        saveHistory(
           resultInfo.title,
           percentage,
           confidence.level
        );


        // ------------------------------------
        // แสดงผล
        // ------------------------------------


        result.innerHTML = `


            <div class="result-card ${confidence.className}">


                <div class="result-icon">
                    ${resultInfo.icon}
                </div>


                <h3>
                    ผลการวิเคราะห์
                </h3>


                <h2>
                    ${resultInfo.title}
                </h2>


                <div class="confidence-number">
                    ${percentage}%
                </div>


                <p class="confidence-text">
                    ${confidence.level}
                </p>


                <hr>


                <h4>
                    💡 คำแนะนำ
                </h4>


                <p>
                    ${resultInfo.advice}
                </p>


                <small>
                    * ผลลัพธ์เป็นการประเมินจากโมเดล AI
                    ควรใช้ร่วมกับการตรวจสอบพรรณไม้จริง
                </small>


            </div>


        `;


        loading.innerHTML = "";
        document.getElementById(
    "reportButton"
).style.display = "inline-block";


    } catch (error) {


        console.error(error);


        loading.innerHTML = "";


        result.innerHTML = `


            <div class="result-card confidence-low">


                <h3>
                    ❌ ไม่สามารถวิเคราะห์ภาพได้
                </h3>


                <p>
                    กรุณาลองใหม่อีกครั้ง
                </p>


                <small>
                    ${error.message}
                </small>


            </div>


        `;


    }


}


// ----------------------------------------
// โหลด AI เมื่อเปิดหน้าเว็บ
// ----------------------------------------


loadModel();
showStatistics();
showHistory();


// ========================================
// ระบบประวัติการวิเคราะห์
// ========================================


function saveHistory(title, percentage, confidence) {


    const history =
        JSON.parse(
            localStorage.getItem("GARDENHistory")
        ) || [];


    const now = new Date();


    const record = {


        title: title,


        percentage: percentage,


        confidence: confidence,


        date: now.toLocaleDateString("th-TH"),


        time: now.toLocaleTimeString(
            "th-TH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )


    };


    history.unshift(record);


    // เก็บไว้ไม่เกิน 20 รายการ
    if (history.length > 20) {
        history.pop();
    }


    localStorage.setItem(
        "GARDENHistory",
        JSON.stringify(history)
    );
    
    showStatistics();


}


// ========================================
// แสดงประวัติ
// ========================================


function showHistory() {


    const historyContainer =
        document.getElementById("history");


    const history =
        JSON.parse(
            localStorage.getItem("GARDENHistory")
        ) || [];


    if (history.length === 0) {


        historyContainer.innerHTML = `
            <div class="history-card">
                <h3>📋 ประวัติการวิเคราะห์</h3>
                <p>ยังไม่มีประวัติการวิเคราะห์</p>
            </div>
        `;


        return;
    }


    let html = `
        <div class="history-card">


            <h3>
                📋 ประวัติการวิเคราะห์
            </h3>
    `;


    history.forEach(function(item) {


        html += `


            <div class="history-item">


                <strong>
                    🌿 ${item.title}
                </strong>


                <p>
                    📊 ความมั่นใจ:
                    <strong>
                        ${item.percentage}%
                    </strong>
                </p>


                <p>
                    ${item.confidence}
                </p>


                <small>
                    ${item.date}
                    เวลา ${item.time} น.
                </small>


            </div>


        `;


    });


    html += `
        </div>
    `;


    historyContainer.innerHTML =
        html;


}


// ========================================
// ล้างประวัติ
// ========================================


function clearHistory() {


    const confirmDelete =
        confirm(
            "ต้องการล้างประวัติทั้งหมดหรือไม่?"
        );


    if (!confirmDelete) {
        return;
    }


    localStorage.removeItem(
        "GARDENHistory"
    );


    showHistory();


}


// ========================================
// GARDEN AI - สถิติการวิเคราะห์
// ========================================


function showStatistics() {


    const statistics =
        document.getElementById("statistics");


    const history =
        JSON.parse(
            localStorage.getItem("GARDENHistory")
        ) || [];


    // ยังไม่มีข้อมูล
    if (history.length === 0) {


        statistics.innerHTML = "";


        return;
    }


    // นับจำนวนแต่ละประเภท
    let XishuangbannaCount = 0;
    let GardenGardeniaCount = 0;
    let FoxtailpalmCount = 0;
    let YellowelderCount = 0;



    history.forEach(function(item) {


        if (
            item.title.includes("สิบสองปันนา")
        ) {


            XishuangbannaCount++;


        }
        else if (
            item.title.includes("พุดซ้อน")
        ) {


            GardenGardeniaCount++;


        }
        else if (
            item.title.includes("ปาล์มหางกระรอก") ||
            item.title.includes("ปาล์มหางกระรอก")
        ) {


            FoxtailpalmCount++;


        }
        else if (
            item.title.includes("ทองอุไร")
        ) {


            YellowelderCount++;


        }


    });


    statistics.innerHTML = `


        <div class="statistics-card">


            <h3>
                📊 สถิติการวิเคราะห์
            </h3>


            <div class="stat-grid">


                <div class="stat-box">


                    <div class="stat-number">
                        ${history.length}
                    </div>


                    <div>
                        วิเคราะห์ทั้งหมด
                    </div>


                </div>


                <div class="stat-box Xishuangbanna">


                    <div class="stat-number">
                        ${XishuangbannaCount}
                    </div>


                    <div>
                        🌿 สิบสองปันนา
                    </div>


                </div>


                <div class="stat-box Garden Gardenia">


                    <div class="stat-number">
                        ${GardenGardeniaCount}
                    </div>


                    <div>
                        🌱 พุดซ้อน
                    </div>


                </div>


                <div class="stat-box Foxtail palm">


                    <div class="stat-number">
                        ${FoxtailpalmCount}
                    </div>


                    <div>
                        🍂 ปาล์มหางกระรอก
                    </div>


                </div>


                <div class="stat-box Yellow elder">


                    <div class="stat-number">
                        ${YellowelderCount}
                    </div>


                    <div>
                        🌱 ทองอุไร
                    </div>


                </div>


            </div>
    `;
}


// ========================================
// สร้างรายงานผลการวิเคราะห์
// ========================================


function createReport() {


    if (!window.latestResult) {


        alert(
            "กรุณาวิเคราะห์ภาพก่อนสร้างรายงาน"
        );


        return;
    }


    const data =
        window.latestResult;


    const reportWindow =
        window.open(
            "",
            "_blank"
        );


    reportWindow.document.write(`


        <!DOCTYPE html>


        <html lang="th">


        <head>


            <meta charset="UTF-8">


            <title>
                GARDEN AI - รายงานผล
            </title>


            <style>


                body {


                    font-family:
                    Arial,
                    sans-serif;


                    background:
                    #f5f7fb;


                    padding:
                    40px;


                    color:
                    #222;


                }


                .report {


                    max-width:
                    700px;


                    margin:
                    auto;


                    background:
                    white;


                    padding:
                    40px;


                    border-radius:
                    20px;


                    box-shadow:
                    0 8px 30px
                    rgba(
                        0,
                        0,
                        0,
                        0.08
                    );


                }


                h1 {


                    text-align:
                    center;


                    margin-bottom:
                    5px;


                }


                .subtitle {


                    text-align:
                    center;


                    color:
                    #666;


                    margin-bottom:
                    30px;


                }


                .result {


                    text-align:
                    center;


                    padding:
                    25px;


                    border:
                    3px solid
                    #2e8b57;


                    border-radius:
                    15px;


                }


                .icon {


                    font-size:
                    55px;


                }


                .title {


                    font-size:
                    28px;


                    font-weight:
                    bold;


                    margin:
                    15px 0;


                }


                .percentage {


                    font-size:
                    45px;


                    font-weight:
                    bold;


                    color:
                    #2e8b57;


                }


                .advice {


                    margin-top:
                    25px;


                    line-height:
                    1.8;


                }


                .warning {


                    margin-top:
                    30px;


                    padding:
                    15px;


                    background:
                    #f5f5f5;


                    border-radius:
                    10px;


                    font-size:
                    14px;


                    color:
                    #666;


                }


                .print-button {


                    display:
                    block;


                    margin:
                    30px auto 0;


                    padding:
                    12px 25px;


                    border:
                    none;


                    border-radius:
                    10px;


                    background:
                    #234a8a;


                    color:
                    white;


                    cursor:
                    pointer;


                    font-size:
                    16px;


                }


                @media print {


                    body {


                        background:
                        white;


                        padding:
                        0;


                    }


                    .report {


                        box-shadow:
                        none;


                    }


                    .print-button {


                        display:
                        none;


                    }


                }


            </style>


        </head>


        <body>


            <div class="report">


                <h1>
                    🌿 GARDEN AI
                </h1>


                <div class="subtitle">
                    ระบบวิเคราะห์พรรณไม้
                    ด้วยปัญญาประดิษฐ์
                </div>


                <div class="result">


                    <div class="icon">
                        ${data.icon}
                    </div>


                    <div class="title">
                        ${data.title}
                    </div>


                    <div class="percentage">
                        ${data.percentage}%
                    </div>


                    <strong>
                        ${data.confidence}
                    </strong>


                </div>


                <div class="advice">


                    <h3>
                        💡 คำแนะนำ
                    </h3>


                    <p>
                        ${data.advice}
                    </p>


                </div>


                <p>
                    📅 วันที่:
                    ${data.date}
                </p>


                <p>
                    🕐 เวลา:
                    ${data.time} น.
                </p>


                <div class="warning">


                    ⚠️ ผลการวิเคราะห์นี้เป็น
                    การประเมินจากโมเดล AI
                    ควรใช้ร่วมกับการตรวจสอบ
                    สภาพพรรณไม้จริงก่อนตัดสินใจ


                </div>


                <button
                    class="print-button"
                    onclick="window.print()"
                >
                    🖨️ พิมพ์ / บันทึกเป็น PDF
                </button>


            </div>


        </body>


        </html>


    `);


    reportWindow.document.close();


}


