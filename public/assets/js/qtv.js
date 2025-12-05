// ===========================
// TAB CHÍNH (Quản lý tài khoản / CTK)
// ===========================
// const mainTabs = document.querySelectorAll(".main-tab");
const allSections = document.querySelectorAll("main .tab-content");








// ===========================
// TAB CON (Sinh viên / Giảng viên)
// ===========================
const subTabs = document.querySelectorAll(".tab-btn");



// ===========================
// TAB CON (Sinh viên / Giảng viên)
// ===========================
const infoTabs = document.querySelectorAll(".tab-btn.info");
const infoSlider = document.querySelector("#slider_info");

infoTabs.forEach(btn => {
  btn.addEventListener("click", () => {

    infoTabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll("#info_students, #info_teachers")
      .forEach(sec => sec.classList.remove("active"));

    const tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.add("active");

    infoSlider.style.left = btn.offsetLeft + "px";
    infoSlider.style.width = btn.offsetWidth + "px";
  });
});


/* ============================
   DỮ LIỆU SINH VIÊN MẪU
============================ */

let students = [
  { id: "SV001", name: "Nguyễn Văn A", email: "a@gmail.com", major: "CNTT", year: 3, active: true },
  { id: "SV002", name: "Trần Thị B", email: "b@gmail.com", major: "Kế toán", year: 2, active: true },
  { id: "SV003", name: "Phạm Văn C", email: "c@gmail.com", major: "CNTT", year: 4, active: false }
];

let editIndex = -1; // chỉ số sinh viên đang sửa



/* ============================
   HIỂN THỊ DANH SÁCH SINH VIÊN
============================ */

function renderStudents(list = students) {
  let html = "";

  list.forEach((s, index) => {
    html += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.major}</td>
        <td>${s.year}</td>
        <td>
          <span class="status ${s.active ? 'active' : 'inactive'}">
            ${s.active ? "Đang học" : "Nghỉ"}
          </span>
        </td>
        <td>
          <button class="action-btn btn-edit" onclick="openEditModal(${index})">
                <i class="fa-solid fa-pen"></i> Sửa
            </button>
            <button class="action-btn btn-delete" onclick="deleteStudent(${index})">
                <i class="fa-solid fa-trash"></i> Xóa
            </button>
        </td>

      </tr>
    `;
  });

  document.getElementById("studentTable").innerHTML = html;
  updateStats();
}



/* ============================
   CẬP NHẬT THỐNG KÊ
============================ */

function updateStats() {
  document.getElementById("totalStudent").innerText = students.length;
  document.getElementById("activeStudent").innerText =
    students.filter(s => s.active).length;
}



/* ============================
   TÌM KIẾM SINH VIÊN
============================ */

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filtered = students.filter(s =>
    s.id.toLowerCase().includes(keyword) ||
    s.name.toLowerCase().includes(keyword) ||
    s.email.toLowerCase().includes(keyword) ||
    s.major.toLowerCase().includes(keyword)
  );

  renderStudents(filtered);
});



/* ============================
   THÊM SINH VIÊN
============================ */

document.getElementById("btnAdd").addEventListener("click", () => {
  document.getElementById("modal").style.display = "flex";
});

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function addStudent() {
  let id = document.getElementById("masv").value;
  let name = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let major = document.getElementById("major").value;
  let year = document.getElementById("year").value;

  if (!id || !name || !email || !major || !year) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  students.push({
    id, name, email, major,
    year: Number(year),
    active: true
  });

  closeModal();
  clearAddForm();
  renderStudents();
}

function clearAddForm() {
  document.getElementById("masv").value = "";
  document.getElementById("fullname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("major").value = "";
  document.getElementById("year").value = "";
}



/* ============================
   SỬA SINH VIÊN
============================ */

function openEditModal(index) {
  editIndex = index;
  const s = students[index];

  document.getElementById("edit_id").value = s.id;
  document.getElementById("edit_name").value = s.name;
  document.getElementById("edit_email").value = s.email;
  document.getElementById("edit_major").value = s.major;
  document.getElementById("edit_year").value = s.year;
  document.getElementById("edit_active").value = s.active;

  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
  const id = document.getElementById("edit_id").value;
  const name = document.getElementById("edit_name").value;
  const email = document.getElementById("edit_email").value;
  const major = document.getElementById("edit_major").value;
  const year = Number(document.getElementById("edit_year").value);
  const active = document.getElementById("edit_active").value === "true";

  students[editIndex] = { id, name, email, major, year, active };

  closeEditModal();
  renderStudents();
}



/* ============================
   XÓA SINH VIÊN
============================ */

function deleteStudent(index) {
  if (confirm("Bạn có chắc muốn xóa sinh viên này?")) {
    students.splice(index, 1);
    renderStudents();
  }
}



/* ============================
   KHỞI TẠO KHI VÀO TRANG
============================ */



/* ============================================
   DỮ LIỆU GIẢNG VIÊN MẪU
============================================ */
let teachers = [
  { id: "GV001", name: "Lê Văn Hùng", email: "hung@uneti.edu.vn", faculty: "CNTT", active: true },
  { id: "GV002", name: "Nguyễn Thị Hoa", email: "hoa@uneti.edu.vn", faculty: "Kế toán", active: true },
  { id: "GV003", name: "Phạm Quốc Bảo", email: "bao@uneti.edu.vn", faculty: "Ngôn ngữ Anh", active: false }
];

let editTeacherIndex = -1;


/* ============================================
   HIỂN THỊ DANH SÁCH GIẢNG VIÊN
============================================ */
function renderTeachers(list = teachers) {
  let html = "";

  list.forEach((t, index) => {
    html += `
      <tr>
        <td>${t.id}</td>
        <td>${t.name}</td>
        <td>${t.email}</td>
        <td>${t.faculty}</td>
        <td>
          <span class="status ${t.active ? 'active' : 'inactive'}">
            ${t.active ? "Đang dạy" : "Nghỉ"}
          </span>
        </td>
        <td>
          <button class="action-btn btn-edit" onclick="openEditTeacher(${index})">
            <i class="fa-solid fa-pen"></i> Sửa
          </button>
          <button class="action-btn btn-delete" onclick="deleteTeacher(${index})">
            <i class="fa-solid fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
    `;
  });

  document.getElementById("teacherTable").innerHTML = html;
  updateTeacherStats();
}


/* ============================================
   THỐNG KÊ
============================================ */
function updateTeacherStats() {
  document.getElementById("totalTeacher").innerText = teachers.length;
  document.getElementById("activeTeacher").innerText =
    teachers.filter(t => t.active).length;
}


/* ============================================
   TÌM KIẾM GIẢNG VIÊN
============================================ */
document.getElementById("searchTeacher").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filtered = teachers.filter(t =>
    t.id.toLowerCase().includes(keyword) ||
    t.name.toLowerCase().includes(keyword) ||
    t.email.toLowerCase().includes(keyword) ||
    t.faculty.toLowerCase().includes(keyword)
  );

  renderTeachers(filtered);
});


/* ============================================
   THÊM GIẢNG VIÊN
============================================ */
document.getElementById("btnAddTeacher").addEventListener("click", () => {
  document.getElementById("modalTeacher").style.display = "flex";
});

function closeTeacherModal() {
  document.getElementById("modalTeacher").style.display = "none";
}

function addTeacher() {
  let id = document.getElementById("magv").value;
  let name = document.getElementById("fullname_gv").value;
  let email = document.getElementById("email_gv").value;
  let faculty = document.getElementById("faculty_gv").value;

  if (!id || !name || !email || !faculty) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  teachers.push({
    id, name, email, faculty,
    active: true
  });

  closeTeacherModal();
  clearAddTeacherForm();
  renderTeachers();
}

function clearAddTeacherForm() {
  document.getElementById("magv").value = "";
  document.getElementById("fullname_gv").value = "";
  document.getElementById("email_gv").value = "";
  document.getElementById("faculty_gv").value = "";
}


/* ============================================
   SỬA GIẢNG VIÊN
============================================ */
function openEditTeacher(index) {
  editTeacherIndex = index;
  const t = teachers[index];

  document.getElementById("edit_id_gv").value = t.id;
  document.getElementById("edit_name_gv").value = t.name;
  document.getElementById("edit_email_gv").value = t.email;
  document.getElementById("edit_faculty_gv").value = t.faculty;
  document.getElementById("edit_active_gv").value = t.active;

  document.getElementById("editModalTeacher").style.display = "flex";
}

function closeEditTeacher() {
  document.getElementById("editModalTeacher").style.display = "none";
}

function saveEditTeacher() {
  const id = document.getElementById("edit_id_gv").value;
  const name = document.getElementById("edit_name_gv").value;
  const email = document.getElementById("edit_email_gv").value;
  const faculty = document.getElementById("edit_faculty_gv").value;
  const active = document.getElementById("edit_active_gv").value === "true";

  teachers[editTeacherIndex] = { id, name, email, faculty, active };

  closeEditTeacher();
  renderTeachers();
}


/* ============================================
   XÓA GIẢNG VIÊN
============================================ */
function deleteTeacher(index) {
  if (confirm("Bạn có chắc muốn xóa giảng viên này?")) {
    teachers.splice(index, 1);
    renderTeachers();
  }
}

// KHỞI TẠO TRANG LẦN ĐẦU
window.onload = () => {
  // Hiện mặc định danh sách
  renderStudents();
  renderTeachers();
};

// CHƯƠNG TRÌNH KHUNG


















// QUẢN LÝ CHƯƠNG TRÌNH KHUNG

let tempCTK = {};

// // Lấy các phần tử cần thiết
// const tabNav = document.getElementById('mainTabNav');
// const slider_ctk = tabNav.querySelector('.slider-ctk');
// const allButtons = tabNav.querySelectorAll('.tab-btn-ctk');

// // HÀM 1: Cập nhật vị trí thanh Slider
// function updateSliderPosition(element) {
//   // element.offsetLeft: Vị trí của nút so với lề trái
//   // element.offsetWidth: Chiều rộng của nút
//   slider_ctk.style.left = element.offsetLeft + "px";
//   slider_ctk.style.width = element.offsetWidth + "px";
// }

// // Khởi tạo ban đầu (cho tab đang active mặc định)
// const activeBtn = tabNav.querySelector('.tab-btn-ctk.active');
// if (activeBtn) updateSliderPosition(activeBtn);

// // HÀM 2: Xử lý sự kiện chuyển Tab (Dùng Event Delegation)
// tabNav.addEventListener('click', function (e) {
//   // Tìm nút tab gần nhất mà user click vào
//   const clickedBtn = e.target.closest('.tab-btn-ctk');

//   // Nếu không bấm trúng nút hoặc bấm trúng nút đang active rồi thì thôi
//   if (!clickedBtn || clickedBtn.classList.contains('active')) return;

//   // A. XỬ LÝ GIAO DIỆN (NÚT)
//   // 1. Xóa active cũ
//   tabNav.querySelector('.tab-btn-ctk.active')?.classList.remove('active');
//   // 2. Thêm active mới
//   clickedBtn.classList.add('active');
//   // 3. Di chuyển slider
//   updateSliderPosition(clickedBtn);

//   // B. XỬ LÝ NỘI DUNG (CONTENT)
//   // 1. Ẩn nội dung cũ
//   document.querySelector('.tab-pane-ctk.active')?.classList.remove('active');

//   // 2. Hiện nội dung mới dựa trên data-tab
//   const targetId = clickedBtn.dataset.tab; // Lấy giá trị "tab-ctk", "tab-hp"...
//   const targetContent = document.getElementById(targetId);

//   if (targetContent) {
//     targetContent.classList.add('active');

//     // C. (NÂNG CAO) GỌI HÀM RIÊNG CỦA TỪNG TAB
//     // Ví dụ: Bấm sang tab học phí mới bắt đầu tính tiền
//     if (targetId === 'tab-hocphi') {
//       console.log("Đã chuyển sang tab học phí, đang tính toán lại...");
//       // calculateTuition(); // Gọi hàm tính học phí của bạn ở đây
//     }
//   }
// });

// // HÀM XỬ LÝ KHI RESIZE CỬA SỔ (Để slider không bị lệch)
// window.addEventListener('resize', () => {
//   const currentActive = tabNav.querySelector('.tab-btn-ctk.active');
//   if (currentActive) updateSliderPosition(currentActive);
// });

// HAM THONG BAO LOI
function showToast({ title, message, type = 'success' }) {
  const main = document.getElementById("toast-container");
  if (main) {
    const toast = document.createElement("div");
    toast.classList.add("toast", `toast--${type}`);
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `
            <div class="toast__icon"><i class="fa-solid ${icon}"></i></div>
            <div class="toast__body"><h3 class="toast__title">${title}</h3><p class="toast__msg">${message}</p></div>
        `;
    main.appendChild(toast);
    setTimeout(() => main.removeChild(toast), 3500);
  }
}

// XỬ LÝ NÚT THÊM CHƯƠNG TRÌNH KHUNG MỚI
document.getElementById("btnAddCTK").addEventListener("click", function () {
  document.getElementById("modalCTK").style.display = "flex";
});

function closeModalCTK() {
  document.getElementById("modalCTK").style.display = "none";
}


const khoaSelect = document.getElementById("khoa_ctkNew");
const nganhSelect = document.getElementById("chuyenNganh_ctkNew");

khoaSelect.addEventListener("change", function () {
  const khoa = this.value;

  // Xóa chuyên ngành cũ
  nganhSelect.innerHTML = '<option value=""></option>';

  if (khoa && nganhTheoKhoa[khoa]) {
    nganhTheoKhoa[khoa].forEach(nganh => {
      const opt = document.createElement("option");
      opt.value = nganh;
      opt.textContent = nganh;
      nganhSelect.appendChild(opt);
    });
  }
});

const new_CTK = [];
function addCTK() {
  let id_ctk = document.getElementById("maCTK_ctkNew").value;
  let khoa = document.getElementById("khoa_ctkNew").value;
  let hoc_ky = document.getElementById("hocKy_ctkNew").value;
  let cn = document.getElementById("chuyenNganh_ctkNew").value;

  if (!id_ctk || !khoa || !hoc_ky || !cn) {
    showToast({ title: "Lỗi", message: "Vui lòng nhập đầy đủ thông tin", type: "error" });
    return;
  }

  // LƯU TẠM THÔNG TIN CTK
  tempCTK = {
    maCTK: id_ctk,
    khoa,
    hocKy: hoc_ky,
    chuyenNganh: cn,
    hocPhan: []   // tạm để rỗng
  };

  console.log("CTK tạm:", tempCTK);

  closeModalCTK();
  addHP();  // mở modal học phần
}

function closeAddHP() {
  document.getElementById("addHP_ctk").style.display = "none";
}

function addHP() {
  document.getElementById("addHP_ctk").style.display = "flex";

  let indexHP = 1;
  document.getElementById("btnAddHocPhan").addEventListener("click", () => {
    const box = document.createElement("div");
    box.className = "hocphan-box";
    // Animation fade in
    box.style.animation = "fade 0.5s";

    box.innerHTML = `
        <hr style="border-top:1px dashed #ccc; margin: 15px 0;">
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <h4 style="margin:0; color:#555">Học phần thêm mới ${indexHP}</h4>
            <button class="removeHP" style="width:auto; padding:5px 10px; background:#ff4d4d; color:#fff; border:none; border-radius:4px; cursor:pointer;">Xóa</button>
        </div>
        Mã lớp HP <input type="text" class="malophp_ctk">
        Tên môn học <input type="text" class="tenmh_ctk">
        <div style="display:flex; gap:10px;">
            <div style="flex:1">Số TC <input type="number" class="sotc_ctk"></div>
            <div style="flex:1">Số Tiết <input type="number" class="sotiet_ctk"></div>
        </div>
        <label>Loại học phần:</label>
        <div class="toggle-group">
            <input type="radio" id="bb_${indexHP}_true" name="batbuoc_${indexHP}" value="true" checked>
            <label for="bb_${indexHP}_true">Bắt buộc</label>
            <input type="radio" id="bb_${indexHP}_false" name="batbuoc_${indexHP}" value="false">
            <label for="bb_${indexHP}_false">Tự chọn</label>
            <div class="slider-ctk"></div>
        </div>
    `;

    document.getElementById("hocphanContainer").appendChild(box);

    box.querySelector(".removeHP").onclick = function () {
      box.remove();
    };

    indexHP++;
  });



}

function saveHocPhan() {

  const maHP0 = document.getElementById("malophp_ctk").value.trim();
  const tenMH0 = document.getElementById("tenmh_ctk").value.trim();
  const soTC0 = Number(document.getElementById("sotc_ctk").value);
  const soTiet0 = Number(document.getElementById("sotiet_ctk").value);
  const batBuoc0 = document.querySelector('input[name="batbuoc_0"]:checked')?.value === "true";

  if (!maHP0 || !tenMH0 || !soTC0 || !soTiet0) {
    showToast({ title: "Lỗi", message: "Vui lòng nhập đầy đủ học phần chính!", type: "error" });
    return;
  }

  tempCTK.hocPhan.push({
    maHP: maHP0,
    tenMH: tenMH0,
    soTC: soTC0,
    soTiet: soTiet0,
    batBuoc: batBuoc0
  });

  // 🔥 2. Lưu các học phần thêm mới
  const boxes = document.querySelectorAll(".hocphan-box");
  let hpIndex = 1;

  boxes.forEach((box) => {
    const maHP = box.querySelector(".malophp_ctk").value.trim();
    const tenMH = box.querySelector(".tenmh_ctk").value.trim();
    const soTC = Number(box.querySelector(".sotc_ctk").value);
    const soTiet = Number(box.querySelector(".sotiet_ctk").value);

    const batBuoc = box.querySelector(`input[name="batbuoc_${hpIndex}"]:checked`).value === "true";

    if (!maHP || !tenMH || !soTC || !soTiet) {
      showToast({ title: "Lỗi", message: `Thiếu thông tin ở học phần ${hpIndex}`, type: "error" });
      return;
    }

    tempCTK.hocPhan.push({
      maHP,
      tenMH,
      soTC,
      soTiet,
      batBuoc
    });

    hpIndex++;
  });

  console.log("Kết quả:", tempCTK);
  showToast({ title: "OK", message: "Lưu đầy đủ học phần!", type: "success" });
  closeAddHP();

  // đóng modal học phần
  document.getElementById("addHP_ctk").style.display = "none";

  if (tempCTK.hocPhan.length > 0) {
    // 🔥 BƯỚC MỚI: ĐẨY CTK VÀO DANH SÁCH CHÍNH
    allCTK.push({ ...tempCTK, soHocPhan: tempCTK.hocPhan.length }); // Lưu và tính số HP

    // Cập nhật giao diện
    renderCTKTable(allCTK); // Gọi hàm hiển thị bảng

    showToast({ title: "Thành công", message: "Đã thêm Chương trình khung mới!", type: "success" });

    // Reset dữ liệu tạm và đóng modal
    tempCTK = {};
    document.getElementById("addHP_ctk").style.display = "none";
    document.getElementById("hocphanContainer").innerHTML = ''; // Xóa các học phần thêm mới
  } else {
    showToast({ title: "Lỗi", message: "Chưa có học phần nào được thêm!", type: "error" });
  }

}


const nganhTheoKhoa = {
  "CNTT": ["Công nghệ phần mềm", "Mạng máy tính", "Khoa học dữ liệu"],
  "QTKD": ["Quản trị nhân sự", "Marketing", "Kinh doanh quốc tế"],
  "KT": ["Kế toán doanh nghiệp", "Kiểm toán"]
};

document.getElementById("filterKhoa").addEventListener("change", function () {
  const khoa = this.value;
  const selectNganh = document.getElementById("filterNganh");

  selectNganh.innerHTML = "<option value=''> Chọn ngành </option>";

  if (nganhTheoKhoa[khoa]) {
    nganhTheoKhoa[khoa].forEach(n => {
      let opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      selectNganh.appendChild(opt);
    });
  }
});

// ==========================================
// 1. TẠO DATA MẪU (Dữ liệu giả lập)
// ==========================================
const allCTK = [
  {
    maCTK: "CTK_CNTT_01",
    khoa: "CNTT",
    chuyenNganh: "Công nghệ phần mềm",
    hocKy: "3",
    hocPhan: [{}, {}, {}, {}, {}] // Giả vờ có 5 môn
  },
  {
    maCTK: "CTK_CNTT_02",
    khoa: "CNTT",
    chuyenNganh: "Mạng máy tính",
    hocKy: "1",
    hocPhan: [{}, {}, {}] // Giả vờ có 3 môn
  },
  {
    maCTK: "CTK_QTKD_01",
    khoa: "QTKD",
    chuyenNganh: "Marketing",
    hocKy: "2",
    hocPhan: [{}, {}, {}, {}]
  },
  {
    maCTK: "CTK_QTKD_02",
    khoa: "QTKD",
    chuyenNganh: "Quản trị nhân lực",
    hocKy: "4",
    hocPhan: [{}, {}]
  },
  {
    maCTK: "CTK_KT_01",
    khoa: "KT",
    chuyenNganh: "Kế toán doanh nghiệp",
    hocKy: "3",
    hocPhan: [{}, {}, {}, {}, {}, {}]
  },
  {
    maCTK: "CTK_KT_02",
    khoa: "KT",
    chuyenNganh: "Kiểm toán",
    hocKy: "1",
    hocPhan: [{}]
  },
    {
    maCTK: "CTK_CNTT_011",
    khoa: "CNTT",
    chuyenNganh: "Công nghệ phần mềm",
    hocKy: "3",
    hocPhan: [
        { maHP: "JAVA1", tenMH: "Lập trình Java", soTC: 3, soTiet: 45, batBuoc: true },
        { maHP: "CSDL", tenMH: "Cơ sở dữ liệu", soTC: 3, soTiet: 45, batBuoc: true },
        { maHP: "WEB1", tenMH: "Thiết kế Web", soTC: 3, soTiet: 45, batBuoc: false }
    ]
  },
  {
    maCTK: "CTK_CNTT_021",
    khoa: "CNTT",
    chuyenNganh: "Mạng máy tính",
    hocKy: "1",
    hocPhan: [
        { maHP: "THDC", tenMH: "Tin học đại cương", soTC: 3, soTiet: 45, batBuoc: true },
        { maHP: "MMT1", tenMH: "Nhập môn Mạng", soTC: 3, soTiet: 45, batBuoc: true }
    ]
  },
  {
    maCTK: "CTK_KT_011",
    khoa: "KT",
    chuyenNganh: "Kế toán doanh nghiệp",
    hocKy: "2",
    hocPhan: [
        { maHP: "KTZC", tenMH: "Kinh tế vi mô", soTC: 3, soTiet: 45, batBuoc: true }
    ]
  }
];

// ==========================================
// 2. HÀM HIỂN THỊ BẢNG (RENDER)
// ==========================================
function renderCTKTable(data) {
  const tbody = document.getElementById("ctkResult");
  tbody.innerHTML = ''; // Xóa sạch dữ liệu cũ

  // Nếu không có dữ liệu thì thông báo
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Không tìm thấy kết quả nào.</td></tr>`;
    return;
  }

  // Duyệt qua từng phần tử và tạo dòng <tr>
  data.forEach(ctk => {
    // Đếm số lượng học phần
    const soLuongHP = ctk.hocPhan ? ctk.hocPhan.length : 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ctk.maCTK}</td>
      <td>${ctk.khoa}</td>
      <td>${ctk.chuyenNganh}</td>
      <td style="text-align: center;">Học kỳ ${ctk.hocKy}</td>
      <td style="text-align: center;">${soLuongHP}</td>
      <td>
         <button class="action-btn btn-detail" title="Xem chi tiết" onclick="viewDetailCTK('${ctk.maCTK}')">
            <i class="fa-solid fa-eye"></i>
         </button>
         
         <button class="action-btn btn-delete" title="Xóa" onclick="deleteCTK('${ctk.maCTK}')">
            <i class="fa-solid fa-trash"></i>
         </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 3. XỬ LÝ SỰ KIỆN LỌC (FILTER)
// ==========================================
document.getElementById("btnFilterCTK").addEventListener("click", function () {
  // Lấy giá trị từ các ô input/select
  const valKhoa = document.getElementById("filterKhoa").value;
  const valNganh = document.getElementById("filterNganh").value;
  const valHocKy = document.getElementById("filterHocKy").value; // Lưu ý: Đã đổi ID từ filterKhoaHoc sang filterNam

  console.log("Đang lọc với:", valKhoa, valNganh, valHocKy);

  // Thực hiện lọc mảng allCTK
  const ketQuaLoc = allCTK.filter(item => {
    // Logic: Nếu ô lọc để trống ("") thì coi như đúng (lấy hết).
    // Nếu ô lọc có giá trị, thì phải trùng khớp với dữ liệu.

    const khopKhoa = (valKhoa === "") || (item.khoa === valKhoa);
    const khopNganh = (valNganh === "") || (item.chuyenNganh === valNganh);
    const khopHocKy = (valHocKy === "") || (item.hocKy == valHocKy); // Dùng == để so sánh chuỗi "1" và số 1

    return khopKhoa && khopNganh && khopHocKy;
  });

  // Hiển thị kết quả lọc được
  renderCTKTable(ketQuaLoc);

  // Thông báo nếu không tìm thấy
  if (ketQuaLoc.length === 0) {
    // Gọi hàm toast của bạn (nếu có)
    if (typeof showToast === "function") {
      showToast({ title: "Thông báo", message: "Không có chương trình khung nào khớp!", type: "info" });
    }
  }
});


function viewDetailCTK(maCTK) {
    console.log("Đang xem chi tiết:", maCTK); // Log để kiểm tra

    // 1. Tìm CTK tương ứng trong mảng allCTK
    const item = allCTK.find(c => c.maCTK === maCTK);

    if (!item) {
        showToast({ title: "Lỗi", message: "Không tìm thấy dữ liệu CTK!", type: "error" });
        return;
    }

    // 2. Điền thông tin header (Thông tin chung)
    document.getElementById("detail_maCTK").textContent = item.maCTK;
    document.getElementById("detail_khoa").textContent = item.khoa;
    document.getElementById("detail_nganh").textContent = item.chuyenNganh;
    document.getElementById("detail_hocky").textContent = "Học kỳ " + item.hocKy;

    // 3. Render danh sách học phần vào bảng trong Modal
    const tbodyDetail = document.getElementById("detail_body");
    tbodyDetail.innerHTML = ""; // Xóa dữ liệu cũ

    if (item.hocPhan && item.hocPhan.length > 0) {
        item.hocPhan.forEach(hp => {
            const tr = document.createElement("tr");
            
            // Xử lý hiển thị loại môn (Màu sắc badge)
            // Nếu batBuoc là true hoặc chuỗi "true"
            const isBatBuoc = (hp.batBuoc === true || hp.batBuoc === "true");
            const badgeClass = isBatBuoc ? 'badge-red' : 'badge-green';
            const badgeText = isBatBuoc ? 'Bắt buộc' : 'Tự chọn';

            tr.innerHTML = `
                <td><b>${hp.maHP}</b></td>
                <td>${hp.tenMH}</td>
                <td class="text-center">${hp.soTC}</td>
                <td class="text-center">${hp.soTiet}</td>
                <td class="text-center">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </td>
            `;
            tbodyDetail.appendChild(tr);
        });
    } else {
        tbodyDetail.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 20px; color: #777;">Chưa có học phần nào được gán.</td></tr>`;
    }

    // 4. Hiển thị Modal
    document.getElementById("modalDetailCTK").style.display = "flex";
}

function closeDetailCTK() {
    document.getElementById("modalDetailCTK").style.display = "none";
}

// Đóng modal khi click ra ngoài vùng trắng
window.onclick = function(event) {
    const modal = document.getElementById("modalDetailCTK");
    if (event.target === modal) {
        closeDetailCTK();
    }
}

// ==========================================
// HÀM XÓA CHƯƠNG TRÌNH KHUNG
// ==========================================
function deleteCTK(maCTK) {
    // 1. Xác nhận người dùng có chắc chắn muốn xóa không
    // (Dùng confirm của trình duyệt cho đơn giản và nhanh)
    if (!confirm(`Bạn có chắc chắn muốn xóa chương trình khung có mã: ${maCTK} không? Hành động này không thể hoàn tác.`)) {
        return; // Nếu người dùng bấm "Hủy" thì dừng lại
    }

    // 2. Tìm vị trí (index) của phần tử cần xóa trong mảng allCTK
    const index = allCTK.findIndex(item => item.maCTK === maCTK);

    if (index !== -1) {
        // 3. Xóa 1 phần tử tại vị trí tìm thấy
        allCTK.splice(index, 1);

        // 4. Cập nhật lại giao diện bảng
        // Lưu ý: Nếu đang lọc thì nên gọi lại hàm lọc, nhưng để đơn giản ta load lại tất cả
        renderCTKTable(allCTK);

        // 5. Hiển thị thông báo thành công
        showToast({ 
            title: "Thành công", 
            message: `Đã xóa chương trình khung ${maCTK}`, 
            type: "success" 
        });
    } else {
        // Trường hợp lỗi không tìm thấy (hiếm khi xảy ra nếu click từ bảng)
        showToast({ 
            title: "Lỗi", 
            message: "Không tìm thấy dữ liệu cần xóa!", 
            type: "error" 
        });
    }
}


// ==========================================
// QUẢN LÝ MÔN HỌC
// ==========================================

// ===============================================
// 1. DỮ LIỆU & BIẾN TOÀN CỤC (Đã đổi tên với tiền tố mh_)
// ===============================================

// Dữ liệu CTK giả lập (Riêng biệt cho trang này)
const mh_allCTK = [
    {
        maCTK: "CTK_CNTT_01",
        hocPhan: [
            { maHP: "JAVA1", tenMH: "Lập trình Java", soTC: 3 },
            { maHP: "CSDL", tenMH: "Cơ sở dữ liệu", soTC: 3 }
        ]
    },
    {
        maCTK: "CTK_CNTT_02",
        hocPhan: [
            { maHP: "MMT", tenMH: "Mạng máy tính", soTC: 3 },
            { maHP: "JAVA1", tenMH: "Lập trình Java", soTC: 3 }
        ]
    }
];

// Biến lưu trữ DB lớp (Riêng biệt)
let mh_classDatabase = {}; 

// Biến trạng thái (Riêng biệt)
let mh_currentMaHP = null;      // Mã môn đang chọn
let mh_editingClassIndex = -1;  // -1: Thêm mới, >=0: Index đang sửa

// ===============================================
// 2. KHỞI TẠO
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
    mh_loadSubjectsFromCTK();
});

// Hàm lấy danh sách môn học duy nhất
function mh_loadSubjectsFromCTK() {
    const uniqueSubjects = [];
    const map = new Map();

    mh_allCTK.forEach(ctk => {
        if (ctk.hocPhan) {
            ctk.hocPhan.forEach(hp => {
                if (!map.has(hp.maHP)) {
                    map.set(hp.maHP, true);
                    uniqueSubjects.push(hp);
                }
            });
        }
    });

    mh_renderSubjectTable(uniqueSubjects);
}

// ===============================================
// 3. RENDER BẢNG MÔN HỌC CHÍNH
// ===============================================
function mh_renderSubjectTable(subjects) {
    const tbody = document.getElementById("mh_courseTable"); // ID mới
    tbody.innerHTML = "";

    // Lọc tìm kiếm
    const searchVal = document.getElementById("mh_searchMonHoc").value.toLowerCase(); // ID mới

    const filtered = subjects.filter(s => 
        s.tenMH.toLowerCase().includes(searchVal) || 
        s.maHP.toLowerCase().includes(searchVal)
    );

    filtered.forEach(sub => {
        // Đếm số lớp hiện có
        const existingClasses = mh_classDatabase[sub.maHP] ? mh_classDatabase[sub.maHP].length : 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><b>${sub.maHP}</b></td>
            <td>${sub.tenMH}</td>
            <td style="text-align: center;">${sub.soTC}</td>
            <td style="text-align: center;">${existingClasses}</td>
            <td>
                <button class="action-btn" onclick="mh_openClassManager('${sub.maHP}', '${sub.tenMH}')" title="Quản lý lớp">
                    <i class="fa-solid fa-chalkboard-user"></i> Quản lý lớp
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Sự kiện tìm kiếm
document.getElementById("mh_searchMonHoc").addEventListener("keyup", () => mh_loadSubjectsFromCTK());

// ===============================================
// 4. XỬ LÝ QUẢN LÝ LỚP
// ===============================================

// Mở Modal
function mh_openClassManager(maHP, tenMH) {
    mh_currentMaHP = maHP;
    document.getElementById("mh_currentSubjectName").textContent = tenMH + ` (${maHP})`; // ID mới
    document.getElementById("mh_modalClassManager").style.display = "flex"; // ID mới
    
    mh_cancelEditMode(); 
    mh_renderClassList();
}

// Đóng Modal
function mh_closeModal() {
    document.getElementById("mh_modalClassManager").style.display = "none";
    mh_loadSubjectsFromCTK(); 
}

// Lưu lớp (Save)
function mh_handleSaveClass() {
    // Lấy giá trị từ form (ID mới)
    const tenLop = document.getElementById("mh_inpTenLop").value.trim();
    const phong = document.getElementById("mh_inpPhong").value.trim();
    const gv = document.getElementById("mh_inpGV").value.trim();
    const siSo = parseInt(document.getElementById("mh_inpSiSo").value);
    const tietBD = parseInt(document.getElementById("mh_inpTietBD").value);
    const tietKT = parseInt(document.getElementById("mh_inpTietKT").value);

    // Validate
    if (!tenLop || !phong || !siSo || !tietBD || !tietKT) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    
    if (tietBD >= tietKT) {
        alert("Lỗi: Tiết bắt đầu phải nhỏ hơn tiết kết thúc!");
        return;
    }

    // Logic giữ dữ liệu cũ
    let trangThai = 1; 
    let daDangKy = 0;

    if (mh_editingClassIndex !== -1) {
        const oldClass = mh_classDatabase[mh_currentMaHP][mh_editingClassIndex];
        trangThai = oldClass.trangThai;
        daDangKy = oldClass.daDangKy || 0;
    }

    const classData = {
        tenLop, phong, gv, siSo, tietBD, tietKT, 
        trangThai, daDangKy
    };

    if (!mh_classDatabase[mh_currentMaHP]) {
        mh_classDatabase[mh_currentMaHP] = [];
    }

    if (mh_editingClassIndex === -1) {
        mh_classDatabase[mh_currentMaHP].push(classData);
    } else {
        mh_classDatabase[mh_currentMaHP][mh_editingClassIndex] = classData;
    }

    mh_cancelEditMode();
    mh_renderClassList();
}

// Xóa lớp
function mh_deleteClass(index) {
    if (confirm("Bạn chắc chắn muốn xóa lớp này?")) {
        mh_classDatabase[mh_currentMaHP].splice(index, 1);
        if (mh_editingClassIndex === index) {
            mh_cancelEditMode();
        }
        mh_renderClassList();
    }
}

// Sửa lớp (Đưa lên form)
function mh_editClass(index) {
    const cls = mh_classDatabase[mh_currentMaHP][index];
    
    document.getElementById("mh_inpTenLop").value = cls.tenLop;
    document.getElementById("mh_inpPhong").value = cls.phong;
    document.getElementById("mh_inpGV").value = cls.gv;
    document.getElementById("mh_inpSiSo").value = cls.siSo;
    document.getElementById("mh_inpTietBD").value = cls.tietBD;
    document.getElementById("mh_inpTietKT").value = cls.tietKT;

    mh_editingClassIndex = index;
    
    // Đổi giao diện nút (ID mới)
    document.getElementById("mh_formTitle").innerHTML = `<i class="fa-solid fa-pen"></i> Đang sửa lớp: ${cls.tenLop}`;
    document.getElementById("mh_formTitle").style.color = "#f39c12";
    
    const btnSave = document.getElementById("mh_btnSaveClass");
    btnSave.innerHTML = `<i class="fa-solid fa-save"></i> Lưu thay đổi`;
    btnSave.className = "modal-btn btn-warning"; // Lưu ý class style

    document.getElementById("mh_btnCancelEdit").style.display = "inline-flex";
}

// Hủy sửa
function mh_cancelEditMode() {
    mh_editingClassIndex = -1;
    
    document.getElementById("mh_inpTenLop").value = "";
    document.getElementById("mh_inpPhong").value = "";
    document.getElementById("mh_inpGV").value = "";
    document.getElementById("mh_inpSiSo").value = "";
    document.getElementById("mh_inpTietBD").value = "";
    document.getElementById("mh_inpTietKT").value = "";

    document.getElementById("mh_formTitle").innerHTML = `<i class="fa-solid fa-plus-circle"></i> Mở lớp mới`;
    document.getElementById("mh_formTitle").style.color = "#555";
    
    const btnSave = document.getElementById("mh_btnSaveClass");
    btnSave.innerHTML = `Lưu lớp học`;
    btnSave.className = "modal-btn btn-add";

    document.getElementById("mh_btnCancelEdit").style.display = "none";
}

// Đổi trạng thái (Khóa/Mở)
function mh_toggleClassStatus(index) {
    const currentStatus = mh_classDatabase[mh_currentMaHP][index].trangThai;
    mh_classDatabase[mh_currentMaHP][index].trangThai = currentStatus == 1 ? 0 : 1;
    mh_renderClassList();
}

// Render danh sách lớp
function mh_renderClassList() {
    const tbody = document.getElementById("mh_classTableBody"); // ID mới
    tbody.innerHTML = "";

    const classes = mh_classDatabase[mh_currentMaHP] || [];

    if (classes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 20px; color: #999;">Chưa có lớp nào được mở.</td></tr>`;
        return;
    }

    classes.forEach((cls, index) => {
        const tr = document.createElement("tr");
        
        const statusBadge = cls.trangThai == 1 
            ? `<span class="badge badge-green">Đang mở</span>` 
            : `<span class="badge badge-red">Đã khóa</span>`;
        
        const toggleIcon = cls.trangThai == 1 ? "fa-lock" : "fa-lock-open";
        const toggleTitle = cls.trangThai == 1 ? "Khóa lớp" : "Mở lớp";
        const toggleClass = cls.trangThai == 1 ? "btn-secondary" : "btn-primary";

        const currentDK = cls.daDangKy || 0;
        const siSoColor = currentDK >= cls.siSo ? "color: red; font-weight: bold;" : "";

        tr.innerHTML = `
            <td><b>${cls.tenLop}</b></td>
            <td>${cls.phong}</td>
            <td>${cls.gv}</td>
            <td class="text-center">${cls.tietBD} - ${cls.tietKT}</td>
            <td class="text-center" style="${siSoColor}">
                ${currentDK} / ${cls.siSo}
            </td>
            <td class="text-center">${statusBadge}</td>
            <td class="text-center">
                <button onclick="mh_toggleClassStatus(${index})" class="action-btn ${toggleClass}" title="${toggleTitle}">
                    <i class="fa-solid ${toggleIcon}"></i>
                </button>
                <button onclick="mh_editClass(${index})" class="action-btn btn-warning" title="Sửa">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="mh_deleteClass(${index})" class="action-btn btn-danger" title="Xóa">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}





// ==========================================
// QUẢN LÝ HỌC PHÍ
// ==========================================


// QUẢN LÝ HỌC PHÍ
let defaultPrice = 500000;

const studentsHP = [
  { name: "Nguyễn Văn A", major: "Mạng máy tính", class: "CNTT3A", credits: 15, paid: 6750000 },
  { name: "Trần Thị B", major: "Công nghệ phần mềm", class: "CNTT2B", credits: 12, paid: 0 },
  { name: "Lê Hữu C", major: "Hệ thống thông tin", class: "HTTT1C", credits: 18, paid: 5000000 },
  { name: "Phạm Thị D", major: "Khoa học dữ liệu", class: "KHDL2A", credits: 20, paid: 8000000 },

  // thêm dữ liệu nhiều trường hợp
  { name: "Ngô Minh E", major: "An ninh mạng", class: "ANM1A", credits: 14, paid: 7000000 },
  { name: "Bùi Văn F", major: "Mạng máy tính", class: "CNTT3B", credits: 10, paid: 0 },
  { name: "Đặng Thị G", major: "Công nghệ phần mềm", class: "CNTT2C", credits: 22, paid: 9000000 },
  { name: "Hoàng Hữu H", major: "IoT & Embedded", class: "IOT2A", credits: 16, paid: 3000000 }
];

function renderTable() {
  const filter = document.getElementById("majorFilter").value;
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  let totalRevenue = 0;
  let totalCredits = 0;

  studentsHP
    .filter(s => filter === "all" || s.major === filter)
    .forEach(s => {
      const totalFee = s.credits * defaultPrice;
      totalRevenue += totalFee;
      totalCredits += s.credits;

      let status = "";
      let badgeClass = "";

      if (s.paid >= totalFee) { status = "Đã đóng"; badgeClass = "paid"; }
      else if (s.paid === 0) { status = "Chưa đóng"; badgeClass = "unpaid"; }
      else { status = `Đóng thiếu (${(totalFee - s.paid).toLocaleString()}đ)`; badgeClass = "partial"; }

      tbody.innerHTML += `
        <tr>
          <td>${s.name}</td>
          <td>${s.major}</td>
          <td>${s.class}</td>
          <td>${s.credits}</td>
          <td>${defaultPrice.toLocaleString()}đ</td>
          <td>${totalFee.toLocaleString()}đ</td>
          <td>${s.paid.toLocaleString()}đ</td>
          <td><span class="badge-hocPhi ${badgeClass}">${status}</span></td>
        </tr>`;
    });

  document.getElementById("defaultFeeDisplay").innerText = defaultPrice.toLocaleString() + " VNĐ";
  document.getElementById("totalRevenue").innerText = totalRevenue.toLocaleString() + " VNĐ";
  document.getElementById("totalCredits").innerText = totalCredits;
}

document.getElementById("updateBtn").addEventListener("click", () => {
  const newFee = Number(document.getElementById("defaultFeeInput").value);
  if (newFee <= 0) return alert("Học phí phải lớn hơn 0!");
  defaultPrice = newFee;
  renderTable();
});

document.getElementById("majorFilter").addEventListener("change", renderTable);

renderTable();
// ==========================================
// 4. KHỞI TẠO: HIỂN THỊ TẤT CẢ KHI VÀO TRANG
// ==========================================
// Gọi hàm này ngay khi file JS chạy để bảng không bị trống
renderCTKTable(allCTK);




// ================================================================
// 1. HÀM CẤU HÌNH SLIDER ĐA NĂNG (DÙNG CHUNG)
// ================================================================
function setupTabSystem({ navId, btnClass, sliderClass }) {
    const container = document.getElementById(navId);
    if (!container) return null;

    const buttons = container.querySelectorAll(`.${btnClass}`);
    const slider = container.querySelector(`.${sliderClass}`);

    // Hàm cập nhật vị trí slider
    const updateSlider = (targetBtn) => {
        if (!targetBtn || !slider) return;
        // Gán vị trí và độ rộng
        slider.style.left = targetBtn.offsetLeft + "px";
        slider.style.width = targetBtn.offsetWidth + "px";
    };

    // Gán sự kiện click cho các nút
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Active giao diện nút
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Di chuyển slider
            updateSlider(btn);

            // Hiện nội dung tab tương ứng
            const targetId = btn.dataset.tab;
            
            // Nếu là nhóm CTK thì ẩn các tab-pane-ctk đi trước
            if (navId === "mainTabNav") {
                document.querySelectorAll(".tab-pane-ctk").forEach(el => el.classList.remove("active"));
            }
            // Nếu là nhóm Account thì ẩn info đi trước
            if (navId === "accountTabNav") {
                document.getElementById("info_students").classList.remove("active");
                document.getElementById("info_teachers").classList.remove("active");
            }

            // Hiện content mới
            const content = document.getElementById(targetId);
            if(content) content.classList.add("active");
        });
    });

    // Cập nhật khi co giãn màn hình
    window.addEventListener("resize", () => {
        const activeBtn = container.querySelector(`.${btnClass}.active`);
        if (activeBtn) updateSlider(activeBtn);
    });

    // Trả về các hàm để dùng bên ngoài
    return { 
        updateSlider, 
        getActiveBtn: () => container.querySelector(`.${btnClass}.active`) 
    };
}

// ================================================================
// 2. KHỞI TẠO (CHẠY KHI TRANG LOAD)
// ================================================================
let ctkSystem; // Biến lưu trữ hệ thống tab CTK
let accountSystem;

document.addEventListener("DOMContentLoaded", () => {
    
    // A. Khởi tạo Slider cho Quản lý tài khoản
    accountSystem = setupTabSystem({
        navId: "accountTabNav",
        btnClass: "tab-btn",
        sliderClass: "slider"
    });
    // Kích hoạt lần đầu
    if(accountSystem) accountSystem.updateSlider(accountSystem.getActiveBtn());


    // B. Khởi tạo Slider cho Chương trình khung (PHẦN BẠN ĐANG LỖI)
    ctkSystem = setupTabSystem({
        navId: "mainTabNav",
        btnClass: "tab-btn-ctk",
        sliderClass: "slider-ctk"
    });
    // Kích hoạt lần đầu
    if(ctkSystem) ctkSystem.updateSlider(ctkSystem.getActiveBtn());
});


// ================================================================
// 3. XỬ LÝ CHUYỂN TAB CHÍNH (FIX LỖI MẤT SLIDER CTK)
// ================================================================
// ================================================================
// 3. XỬ LÝ CHUYỂN TAB CHÍNH (FIX LỖI MẤT SLIDER CTK)
// ================================================================
const mainTabs = document.querySelectorAll(".main-tab");
const sectionAccount = document.getElementById("account-manager");
const sectionCTK = document.getElementById("chuong_trinh_khung");

mainTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // 1. Active giao diện nút chính (Menu trái)
        mainTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const tabName = tab.dataset.tab;

        // 2. Ẩn/Hiện nội dung chính
        if (tabName === "chuong_trinh_khung") {
            sectionAccount.style.display = "none";
            sectionCTK.style.display = "block"; // Dùng block để container mở ra

            // 3. KÍCH HOẠT LẠI SLIDER
            // Lý do: Khi display: none, width = 0. Khi hiện lại phải tính lại ngay.
            if (ctkSystem) {
                // Lấy nút đang active hiện tại của CTK
                const currentBtn = ctkSystem.getActiveBtn();
                
                // Buộc trình duyệt vẽ lại giao diện rồi mới tính toán (setTimeout 0 hoặc requestAnimationFrame)
                requestAnimationFrame(() => {
                    ctkSystem.updateSlider(currentBtn);
                });
            }

        } else {
            // Quay về tab Account
            sectionAccount.style.display = "block";
            sectionCTK.style.display = "none";
            
            // Cập nhật lại slider bên Account (phòng hờ bị lệch khi resize)
            if (accountSystem) {
                const currentBtn = accountSystem.getActiveBtn();
                requestAnimationFrame(() => {
                    accountSystem.updateSlider(currentBtn);
                });
            }
        }
    });
});


function logout() {
  if (confirm("Đăng xuất?")) { localStorage.removeItem("currentUser"); window.location.href = "/QuanLyTinChi/index.html"; }
}