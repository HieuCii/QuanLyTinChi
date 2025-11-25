/* FILE NÀY DÙNG ĐỂ CHẠY TEST GIAO DIỆN (MOCK DATA)
   Khi nào code xong Backend Node.js thì sẽ bỏ file này đi.
*/

// 1. Hàm hiển thị thông báo (Giữ nguyên code của bạn vì rất tốt)
function showToast(message, type = "success") {
  const overlay = document.getElementById("toast-overlay");
  const toast = document.getElementById("toast");

  if (!overlay || !toast) return; // Tránh lỗi nếu thiếu HTML

  toast.className = type === "success" ? "toast-success" : "toast-error";
  toast.innerText = message;

  // Hiện overlay + toast
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "auto";

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "scale(1)";
  }, 50);

  // Ẩn sau 2 giây
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "scale(.8)";

    setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }, 200);
  }, 2000);
}

// 2. Hàm xử lý đăng nhập giả lập
function login() {
  // Lưu ý: Đảm bảo bên HTML input có id="ma" và id="matkhau"
  const userInput = document.getElementById("ma");
  const passInput = document.getElementById("matkhau");

  if (!userInput || !passInput) {
    console.error("Lỗi: Không tìm thấy ô nhập liệu trong HTML");
    return;
  }

  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  // Danh sách tài khoản test (Thêm Admin vào đây)
  const accounts = {
    "SV001": "123",
    "SV002": "456",
    "GV001": "abc",
    "admin": "admin" // Thêm admin để test
  };

  // Kiểm tra tài khoản
  if (accounts[user] && accounts[user] === pass) {
    showToast("Đăng nhập thành công! Đang chuyển hướng...", "success");

    // Lưu thông tin để trang sau biết ai đang đăng nhập
    // Giả lập object user giống như Backend trả về
    const userData = {
      username: user,
      role: user === 'admin' ? 'admin' : (user.startsWith('GV') ? 'teacher' : 'student')
    };
    localStorage.setItem("currentUser", JSON.stringify(userData));

    // --- XỬ LÝ CHUYỂN TRANG (Quan trọng) ---
    // Vì file index.html nằm ở root, các trang con nằm trong folder pages/

    setTimeout(() => {
      if (user === "admin") {
        // Chuyển đến thư mục admin
        window.location.href = "pages/admin/dashboard.html";
      }
      else if (user.substring(0, 2).toUpperCase() === "GV") {
        // Chuyển đến thư mục giảng viên
        window.location.href = "pages/teacher/dashboard.html";
      }
      else if (user.substring(0, 2).toUpperCase() === "SV") {
        // Chuyển đến thư mục sinh viên
        window.location.href = "pages/student/dashboard.html";
      }
      else {
        showToast("Tài khoản không xác định được quyền hạn!", "error");
      }

    }, 1500); // Đợi 1.5s để người dùng đọc thông báo
  } else {
    showToast("Sai tên đăng nhập hoặc mật khẩu!", "error");
  }
}

// Bắt sự kiện phím Enter để đăng nhập nhanh
document.addEventListener('keydown', function (event) {
  if (event.key === "Enter") {
    login();
  }
});