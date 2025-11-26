// Chuyển tab 
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab");
const slider = document.querySelector(".slider");

tabBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {

        // Active nút
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Active nội dung tương ứng
        const target = btn.dataset.target;  // ví dụ: "info"
        tabContents.forEach(cnt => {
            if (cnt.id === target) {
                cnt.classList.add("active");
            } else {
                cnt.classList.remove("active");
            }
        });

        // Slider chạy mượt
        const percent = 100 / tabBtns.length;
        slider.style.left = `${index * percent}%`;
    });
});

// MÔN HỌC PHỤ TRÁCH
const courses = [
    {
        id: "IT101",
        code: "IT101",
        title: "Tin học đại cương",
        credits: "3",
        classes: "2",
        teacher: "GV. Trần Thị Mai Chi",
        schedule: [
            { day: 2, start: 7, end: 9, room: "A203" },
            { day: 4, start: 7, end: 9, room: "A203" }
        ],
        size: "52/60",
        status: "Còn chỗ",
        type: "theory"
    },
    {
        id: "WEB201",
        code: "WEB201",
        title: "Lập trình Web cơ bản",
        credits: "3",
        classes: "1",
        teacher: "GV. Trần Thị Mai Chi",
        schedule: [
            { day: 3, start: 9, end: 11, room: "B102" }
        ],
        size: "60/60",
        status: "Hết chỗ",
        type: "theory"
    },
    {
        id: "JS301",
        code: "JS301",
        title: "Lập trình JavaScript nâng cao",
        credits: "3",
        classes: "1",
        teacher: "GV. Trần Thị Mai Chi",
        schedule: [
            { day: 5, start: 13, end: 15, room: "C305" }
        ],
        size: "48/50",
        status: "Còn chỗ",
        type: "practice"
    },
    {
        id: "DB202",
        code: "DB202",
        title: "Cơ sở dữ liệu",
        credits: "4",
        classes: "1",
        teacher: "GV. Trần Thị Mai Chi",
        schedule: [
            { day: 6, start: 7, end: 10, room: "A402" }
        ],
        size: "40/40",
        status: "Hết chỗ",
        type: "theory"
    },
    {
        id: "JAVA401",
        code: "JAVA401",
        title: "Lập trình Java nâng cao",
        credits: "4",
        classes: "1",
        teacher: "GV. Trần Thị Mai Chi",
        schedule: [
            { day: 7, start: 7, end: 10, room: "B210" }
        ],
        size: "37/45",
        status: "Còn chỗ",
        type: "practice"
    },
    {
        id: "MATH100",
        code: "MATH100",
        title: "Toán rời rạc",
        credits: "3",
        classes: "1",
        teacher: "GV. Trần Thị Mai Chi",
        schedule: [
            { day: 5, start: 7, end: 10, room: "A108" }
        ],
        size: "55/60",
        status: "Còn chỗ",
        type: "theory"
    }
];



const container = document.getElementById('courses');

function createCourseNode(item) {
    const el = document.createElement('div');
    el.className = 'course';

    el.innerHTML = `
  <div class="header">
    <div class="left">
      <div class="icon-box">📘</div>
      <div class="meta">
        <div class="code-title">
          <span class="code">${item.code}</span>
          <span class="title">${item.title}</span>
        </div>
        <div class="teacher">👤 <strong>${item.teacher}</strong></div>
      </div>
    </div>

    <div class="right">
      <div class="badges">
        <span class="badge credit">${item.credits} tín</span>
        <span class="badge cls">${item.classes} lớp</span>
      </div>
      <div class="chev">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="panel">
      <div class="col">
        <p class="label">⏰ Lịch học:</p>
        ${item.schedule
            .map(s => `<p class="sub">Thứ ${s.day}: ${s.start}:00 - ${s.end}:00 (${s.room})</p>`)
            .join('')}

        <p class="label">👥 Sĩ số:</p>
        <p class="sub">${item.size} sinh viên</p>
      </div>

      <div class="col">
        <p class="label">📍 Phòng học:</p>
        <p class="sub">${item.schedule[0].room}</p>

        <p class="label">📚 Trạng thái:</p>
        <span class="status ${item.status.toLowerCase()}">${item.status}</span>
      </div>
    </div>
  </div>
  `;

    const header = el.querySelector('.header');
    const content = el.querySelector('.content');

    header.addEventListener('click', () => {
        const opened = el.classList.contains('open');
        document.querySelectorAll('.course.open').forEach(c => {
            c.classList.remove('open');
            c.querySelector('.content').style.maxHeight = null;
        });

        if (!opened) {
            el.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });

    return el;
}

courses.forEach(c => container.appendChild(createCourseNode(c)));

// ================================

// LỊCH DẠY

// ================================
function renderSchedule() {
    const days = [2, 3, 4, 5, 6, 7];
    const sessions = ["sang", "chieu"];

    // Reset bảng trước
    days.forEach(d =>
        sessions.forEach(s => {
            const cell = document.getElementById(`t${d}-${s}`);
            if (cell) {
                cell.className = "cell empty";
                cell.innerHTML = "";
            }
        })
    );

    // Reset danh sách môn dưới bảng
    const listContainer = document.getElementById("class-list-container");
    if (listContainer) listContainer.innerHTML = "";

    let totalClasses = 0;
    let totalSessions = 0;
    let daySet = new Set();

    // Duyệt tất cả môn trong courses[]
    courses.forEach(course => {
        course.schedule.forEach(s => {
            totalClasses++;
            totalSessions++;
            daySet.add(s.day);

            const session = s.start < 12 ? "sang" : "chieu";
            const cell = document.getElementById(`t${s.day}-${session}`);

            if (cell) {
                const color = course.type === "theory" ? "type-theory" : "type-practice";

                cell.className = `cell class ${color}`;
                cell.innerHTML = `
          <b>${course.code}</b><br>
          <span style="font-size:12px">${course.title}</span><br>
          <small>${s.room}</small>
        `;
            }

            // List bên dưới
            if (listContainer) {
                listContainer.innerHTML += `
          <li><span class="dot ${course.type === 'theory' ? 'c-blue' : 'c-orange'}"></span>
          <b>${course.code}</b> – Thứ ${s.day} (${s.start}:00-${s.end}:00)</li>
        `;
            }
        });
    });

    // Update thống kê
    document.getElementById("stat-count").innerText = totalClasses;
    document.getElementById("stat-sessions").innerText = totalSessions;
    document.getElementById("stat-days").innerText = daySet.size;
}

document.querySelector('[data-target="schedule"]').addEventListener("click", renderSchedule);

// ĐĂNG XUẤT
function logout() {
    if (confirm("Đăng xuất?")) { localStorage.removeItem("currentUser"); window.location.href = "/QuanLyTinChi/index.html"; }
}