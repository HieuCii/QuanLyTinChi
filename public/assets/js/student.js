document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  // 1. LOGIC CHUYỂN TAB (TAB SWITCHING)
  // ============================================================
  const buttons = document.querySelectorAll(".tab-btn");
  const tabs = document.querySelectorAll(".tab-content");

  if (buttons.length > 0) {
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        tabs.forEach(t => t.classList.remove("active"));
        btn.classList.add("active");

        const tabId = btn.getAttribute("data-tab");
        const targetTab = document.getElementById(tabId);
        if (targetTab) targetTab.classList.add("active");

        // Nếu vào tab Lịch học thì vẽ lại lịch ngay
        if (tabId === 'schedule') renderSchedule();
      });
    });
  }

  // ============================================================
  // 2. DỮ LIỆU ĐA DẠNG (DATA MOCKUP)
  // ============================================================
  /* Trạng thái (status):
     - 'open': Đang cho ĐK (SV được Hủy, chưa hiện lịch)
     - 'closed': Đã chốt (SV không được Hủy, ĐÃ hiện lịch)
     
     Loại (type):
     - 'theory': Lý thuyết (Màu Xanh)
     - 'practice': Thực hành (Màu Cam)
  */
  let availableCourses = [
    // 1. [Lý thuyết] Đã ĐK + Đã Chốt => Hiện lịch Xanh + Cấm Hủy
    // (Đây là môn sẽ gây trùng lịch với môn số 7 bên dưới)
    {
      id: "CS101", name: "Nhập môn KH Máy tính", credits: 3, teacher: "TS. Nguyễn Văn A",
      time: "Thứ 2, Thứ 4 (7:00-9:00)", room: "A101",
      current: 60, max: 60, status: "closed", type: "theory"
    },

    // 2. [Thực hành] Đã ĐK + Đã Chốt => Hiện lịch Cam + Cấm Hủy
    {
      id: "CS101_LAB", name: "Thực hành Nhập môn KHMT", credits: 1, teacher: "Thầy Trợ Giảng",
      time: "Thứ 3 (13:00-15:00)", room: "Lab 1",
      current: 30, max: 30, status: "closed", type: "practice"
    },

    // 3. [Lý thuyết] Đã ĐK + Vẫn Mở => Nút Hủy (Đỏ) + KHÔNG hiện lịch
    {
      id: "ENG101", name: "Tiếng Anh Cơ bản", credits: 2, teacher: "Cô Sarah",
      time: "Thứ 7 (8:00-11:00)", room: "E202",
      current: 55, max: 60, status: "open", type: "theory"
    },

    // 4. [Lý thuyết] Chưa ĐK + Lớp Đầy => Nút Disable "Đầy"
    {
      id: "NET101", name: "Quản trị mạng", credits: 3, teacher: "Thầy Hùng",
      time: "Thứ 3 (7:00-11:00)", room: "Lab 5",
      current: 60, max: 60, status: "open", type: "theory"
    },

    // 5. [Lý thuyết] Đã ĐK + Lớp Đầy => Nút Hủy (Đỏ) - Vẫn được hủy để nhường chỗ
    {
      id: "WEB202", name: "Lập trình Frontend", credits: 3, teacher: "ThS. Phạm D",
      time: "Thứ 3, Thứ 5 (9:00-11:00)", room: "Lab 2",
      current: 40, max: 40, status: "open", type: "theory"
    },

    // 6. [Lý thuyết] Chưa ĐK + Lớp Đã Chốt => Nút Disable "Đóng"
    {
      id: "JP101", name: "Tiếng Nhật", credits: 2, teacher: "Cô Yoko",
      time: "Thứ 6 (13:00-15:00)", room: "A202",
      current: 30, max: 40, status: "closed", type: "theory"
    },

    // 7. [Lý thuyết] Chưa ĐK + Trùng Lịch với CS101 (Thứ 2: 8h-10h)
    // -> Test chức năng chặn trùng lịch
    {
      id: "MATH101", name: "Toán Cao cấp (Trùng lịch)", credits: 3, teacher: "Cô C",
      time: "Thứ 2 (8:00-10:00)", room: "B202",
      current: 50, max: 60, status: "open", type: "theory"
    }
  ];

  // Danh sách các môn sinh viên đã đăng ký sẵn
  let myRegisteredCourses = ["CS101", "CS101_LAB", "WEB202", "ENG101"];


  // ============================================================
  // 3. CÁC HÀM XỬ LÝ LOGIC (HELPER FUNCTIONS)
  // ============================================================

  // Hàm A: Phân tích chuỗi thời gian thành object để so sánh
  // Input: "Thứ 2, Thứ 4 (7:00-9:00)"
  // Output: [{day: 2, start: 7, end: 9}, {day: 4, start: 7, end: 9}]
  function parseSchedule(timeString) {
    let schedule = [];
    const timeMatch = timeString.match(/\((\d+):00-(\d+):00\)/);
    if (!timeMatch) return [];

    const start = parseInt(timeMatch[1]);
    const end = parseInt(timeMatch[2]);
    const daysMatch = timeString.match(/Thứ (\d)/g);

    if (daysMatch) {
      daysMatch.forEach(d => {
        const day = parseInt(d.split(' ')[1]);
        schedule.push({ day: day, start: start, end: end });
      });
    }
    return schedule;
  }

  // Hàm B: Kiểm tra trùng lịch (Time Conflict Check)
  function isConflict(newCourseId) {
    const newCourse = availableCourses.find(c => c.id === newCourseId);
    const newSchedule = parseSchedule(newCourse.time);

    for (let registeredId of myRegisteredCourses) {
      const registeredCourse = availableCourses.find(c => c.id === registeredId);
      const registeredSchedule = parseSchedule(registeredCourse.time);

      for (let newSlot of newSchedule) {
        for (let existingSlot of registeredSchedule) {
          if (newSlot.day === existingSlot.day) {
            // Logic trùng giờ: (StartA < EndB) && (StartB < EndA)
            if (newSlot.start < existingSlot.end && existingSlot.start < newSlot.end) {
              return {
                conflict: true,
                conflictWith: registeredCourse.name,
                day: newSlot.day,
                time: `${existingSlot.start}h-${existingSlot.end}h`
              };
            }
          }
        }
      }
    }
    return { conflict: false };
  }

  // Hàm C: Kiểm tra xem lớp có đang diễn ra NGAY BÂY GIỜ không?
  function isHappeningNow(day, timeString) {
    const now = new Date();
    const jsDay = now.getDay();
    // Map JS Day (0=CN, 1=T2...) sang hệ "Thứ X" (2,3,4,5,6,7,CN=8)
    // Lưu ý: Code này giả định Thứ 2 tương ứng số 2.
    const mapDay = jsDay === 0 ? 8 : jsDay + 1;

    // Nếu hôm nay không phải thứ đó -> False
    if (parseInt(day) !== mapDay) return false;

    const currentHour = now.getHours();
    const timeMatch = timeString.match(/\((\d+):00-(\d+):00\)/);
    if (timeMatch) {
      const start = parseInt(timeMatch[1]);
      const end = parseInt(timeMatch[2]);
      if (currentHour >= start && currentHour < end) return true;
    }
    return false;
  }

  // ============================================================
  // 4. RENDER DANH SÁCH MÔN (TAB 2)
  // ============================================================
  const courseTableBody = document.getElementById("courseTable");
  const searchInput = document.getElementById("searchInput");

  function renderCourses(data) {
    if (!courseTableBody) return;
    courseTableBody.innerHTML = "";

    data.forEach(course => {
      let isFull = course.current >= course.max;
      let isClosed = course.status === "closed";
      let isRegistered = myRegisteredCourses.includes(course.id);
      let actionBtn = '';
      let statusBadge = '';

      // --- LOGIC NÚT BẤM ---
      if (isRegistered) {
        if (isClosed) {
          actionBtn = `<button class="btn-action" disabled style="background:#607d8b; cursor:not-allowed" title="Lớp đã chốt">Đã chốt</button>`;
        } else {
          actionBtn = `<button class="btn-action btn-cancel" onclick="handleCancel('${course.id}')">Hủy</button>`;
        }
      } else if (isClosed) {
        actionBtn = `<button class="btn-action" disabled title="Hết hạn">Đóng</button>`;
      } else if (isFull) {
        actionBtn = `<button class="btn-action" disabled title="Hết chỗ">Đầy</button>`;
      } else {
        actionBtn = `<button class="btn-action" onclick="handleRegister('${course.id}')">Đăng ký</button>`;
      }

      // --- LOGIC BADGE ---
      if (isRegistered) {
        if (isClosed) statusBadge = `<span class="badge" style="background:#4caf50">Chính thức</span>`;
        else statusBadge = `<span class="badge" style="background:#2196F3">Đã ĐK</span>`;
      }
      else if (isClosed) statusBadge = `<span class="badge" style="background:#6c757d">Đã khóa</span>`;
      else if (isFull) statusBadge = `<span class="badge danger">Đầy</span>`;
      else statusBadge = `<span class="badge success">Đang mở</span>`;

      // Icon phân loại
      let typeIcon = course.type === 'theory' ? '<i class="fa-solid fa-book-open"></i>' : '<i class="fa-solid fa-laptop-code"></i>';

      const row = `
                <tr>
                    <td><b>${course.id}</b></td>
                    <td style="font-weight:500">${typeIcon} ${course.name}</td>
                    <td style="text-align:center">${course.credits}</td>
                    <td>${course.teacher}</td>
                    <td><div class="icon-text"><i class="fa-regular fa-clock"></i> ${course.time}</div></td>
                    <td><div class="icon-text"><i class="fa-solid fa-location-dot"></i> ${course.room}</div></td>
                    <td><div class="icon-text"><i class="fa-solid fa-user-group"></i> 
                        <span style="font-weight:bold; color:${isFull ? 'red' : 'inherit'}">${course.current}</span>/${course.max}
                    </div></td>
                    <td>${statusBadge}</td>
                    <td style="text-align:right">${actionBtn}</td>
                </tr>
            `;
      courseTableBody.innerHTML += row;
    });

    if (data.length === 0) {
      courseTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#999;">Không tìm thấy môn học!</td></tr>`;
    }
  }

  // ============================================================
  // 5. RENDER LỊCH HỌC & THỐNG KÊ (TAB 3)
  // ============================================================
  function renderSchedule() {
    // Reset bảng
    const days = [2, 3, 4, 5, 6, 7];
    const sessions = ['sang', 'chieu'];
    days.forEach(d => sessions.forEach(s => {
      const el = document.getElementById(`t${d}-${s}`);
      if (el) { el.className = "cell empty"; el.innerHTML = ""; }
    }));

    // Reset List
    const listContainer = document.getElementById("class-list-container");
    if (listContainer) listContainer.innerHTML = "";

    // Biến thống kê
    let stats = { classes: 0, sessions: 0, days: new Set() };

    myRegisteredCourses.forEach(courseId => {
      const course = availableCourses.find(c => c.id === courseId);
      // CHỈ HIỆN LỊCH CỦA LỚP ĐÃ CHỐT
      if (!course || course.status !== 'closed') return;

      // Thống kê
      stats.classes++;
      stats.sessions += (course.time.match(/Thứ/g) || []).length;
      (course.time.match(/Thứ (\d)/g) || []).forEach(d => stats.days.add(d));

      // Vẽ List bên dưới
      if (listContainer) {
        let dotClass = course.type === 'theory' ? 'c-blue' : 'c-orange';
        listContainer.innerHTML += `<li><span class="dot ${dotClass}"></span><b>${course.id}</b> – ${course.name}</li>`;
      }

      // Vẽ Grid
      days.forEach(d => {
        if (course.time.includes(`Thứ ${d}`)) {
          const timeMatch = course.time.match(/\((\d+):/);
          if (timeMatch) {
            const start = parseInt(timeMatch[1]);
            const sess = start < 12 ? 'sang' : 'chieu';
            const cell = document.getElementById(`t${d}-${sess}`);

            if (cell) {
              let color = course.type === 'theory' ? 'type-theory' : 'type-practice';
              let active = isHappeningNow(d, course.time) ? 'happening-now' : '';

              cell.className = `cell class ${color} ${active}`;
              cell.innerHTML = `
                                <div style="float:right"><i class="fa-solid fa-circle-check" style="opacity:0.5; font-size:12px"></i></div>
                                <b>${course.id}</b><br>
                                <span style="font-size:12px">${course.name}</span><br>
                                <small>${course.room}</small>
                            `;
            }
          }
        }
      });
    });

    // Update Stats UI
    const elCount = document.getElementById("stat-count");
    const elSess = document.getElementById("stat-sessions");
    const elDays = document.getElementById("stat-days");
    if (elCount) elCount.innerText = stats.classes;
    if (elSess) elSess.innerText = stats.sessions;
    if (elDays) elDays.innerText = stats.days.size;
  }

  // ============================================================
  // 6. ACTIONS (ĐĂNG KÝ & HỦY)
  // ============================================================

  // Xử lý Tìm kiếm
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const k = e.target.value.toLowerCase().trim();
      renderCourses(availableCourses.filter(c =>
        c.name.toLowerCase().includes(k) || c.id.toLowerCase().includes(k)
      ));
    });
  }
  // Render lần đầu
  renderCourses(availableCourses);

  // Xử lý Đăng ký (Global)
  window.handleRegister = function (id) {
    const c = availableCourses.find(x => x.id === id);
    if (!c) return;

    // 1. Check cơ bản
    if (c.status === 'closed') { alert("Lớp đã khóa sổ!"); return; }
    if (c.current >= c.max) { alert("Lớp đầy!"); return; }

    // 2. CHECK TRÙNG LỊCH (QUAN TRỌNG)
    const check = isConflict(id);
    if (check.conflict) {
      alert(`⛔ KHÔNG THỂ ĐĂNG KÝ!\n\nBị trùng lịch với môn: ${check.conflictWith}\nThời gian trùng: Thứ ${check.day} (${check.time})`);
      return;
    }

    // 3. Tiến hành đăng ký
    if (confirm(`Đăng ký môn: ${c.name}?`)) {
      c.current++;
      myRegisteredCourses.push(id);
      alert("Đăng ký thành công!");
      if (searchInput) searchInput.value = "";
      renderCourses(availableCourses);
      renderSchedule();
    }
  };

  // Xử lý Hủy (Global)
  window.handleCancel = function (id) {
    const c = availableCourses.find(x => x.id === id);

    // Check khóa lớp
    if (c.status === 'closed') { alert("Lớp đã chốt, không được hủy!"); return; }

    if (confirm(`Hủy đăng ký: ${c.name}?`)) {
      c.current--;
      const idx = myRegisteredCourses.indexOf(id);
      if (idx > -1) myRegisteredCourses.splice(idx, 1);
      alert("Đã hủy!");
      if (searchInput) searchInput.value = "";
      renderCourses(availableCourses);
      renderSchedule();
    }
  };
});

function logout() {
  if (confirm("Đăng xuất?")) { localStorage.removeItem("currentUser"); window.location.href = "/QuanLyTinChi/index.html"; }
}
