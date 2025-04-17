// menu.js - Tạo menu động với responsive support
document.addEventListener("DOMContentLoaded", function () {
  // Tạo menu HTML (giữ nguyên)
  const menuHTML = `
    <ul id="menu_row_id">
        <li class="menu_item active_menu_item" data-tooltip="Trang chủ gia phả">
            <a href="/vn/index.html">Trang chủ</a>
        </li>
        <li class="menu_item search_item" >
            <input type="text" id="search_input" placeholder="Tìm kiếm Nhân vật...">
            <div class="search-dropdown"></div>
        </li>
        <li class="menu_item" data-tooltip="Danh sách thành viên họ tộc">
            <a href="/vn/personlist.html">Họ tộc</a>
        </li>
        <li class="menu_item" data-tooltip="Danh sách các gia đình">
            <a href="/vn/familylist.html">Gia đình</a>
        </li>
        <li class="menu_item" data-tooltip="Các phả đồ gia phả">
            <a href="/vn/chartlist.html">Phả đồ</a>
        </li>
        <li class="menu_item" data-tooltip="Nguồn tài liệu tham khảo">
            <a href="/vn/sourcelist.html">Nguồn tham chiếu</a>
        </li>
        <li class="menu_item" data-tooltip="Các Thống kê về thành viên gia tộc">
            <a href="/vn/statistics.html">Thống kê</a>
        </li>
        <li class="menu_item has_submenu"> <a href="#">Liên hệ</a>
    <ul class="submenu">
        <li><a href="/vn/contact-google-form.html">Cập nhật thông tin thành viên</a></li>
        <li><a href="/vn/feedback.html">Trao đổi góp ý</a></li>
    </ul>
    </li>
        <li class="menu_item" data-tooltip="Hướng dẫn sử dụng" id="help-trigger">
            <a href="#">Hướng dẫn</a>
        </li>
        <li class="menu_item" data-tooltip="Quay lại trang trước">
            <button id="back_button" onclick="window.history.back();">⬅ Back</button>
        </li>
    </ul>
    `;

  // Chèn menu vào container
  const menuContainer = document.getElementById("menu_id");
  if (menuContainer) {
    menuContainer.innerHTML = menuHTML;

    // Khởi tạo tooltips
    initTooltips();

    // Thiết lập modal help
    setupHelpModal();

    // Thêm responsive support
    setupResponsiveMenu();
  }

  // Khôi phục trạng thái active menu
  highlightActiveMenu();
});

// ========================
// RESPONSIVE MENU SUPPORT
// ========================
function setupResponsiveMenu() {
  const mobileBreakpoint = 768;
  let mobileCSSLoaded = false;

  // Kiểm tra kích thước màn hình
  function checkViewport() {
    const isMobile = window.innerWidth <= mobileBreakpoint;

    if (isMobile) {
      loadMobileCSS();
      convertToMobileMenu();
    } else {
      convertToDesktopMenu();
    }
  }

  // Load mobile.css khi cần
  function loadMobileCSS() {
    if (!mobileCSSLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/css/mobile.css";
      document.head.appendChild(link);
      mobileCSSLoaded = true;
    }
  }

  // Chuyển đổi sang menu mobile
  function convertToMobileMenu() {
    const menu = document.getElementById("menu_row_id");
    if (!menu) return;

    // Thêm hamburger button nếu chưa có
    if (!document.getElementById("hamburger-btn")) {
      const hamburger = document.createElement("button");
      hamburger.id = "hamburger-btn";
      hamburger.innerHTML = "☰ Menu";
      hamburger.style.cssText = `
                display: block;
                width: 100%;
                padding: 10px;
                background: #2c3e50;
                color: white;
                border: none;
                font-size: 16px;
                cursor: pointer;
            `;

      menu.parentNode.insertBefore(hamburger, menu);

      hamburger.addEventListener("click", function () {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
      });
    }

    // Ẩn menu ban đầu trên mobile
    menu.style.display = "none";
  }

  // Khôi phục menu desktop
  function convertToDesktopMenu() {
    const menu = document.getElementById("menu_row_id");
    const hamburger = document.getElementById("hamburger-btn");

    if (menu) {
      menu.style.display = "";
    }

    if (hamburger) {
      hamburger.remove();
    }
  }

  // Kiểm tra ngay khi tải trang
  checkViewport();

  // Theo dõi thay đổi kích thước cửa sổ
  window.addEventListener("resize", function () {
    // Sử dụng debounce để tối ưu hiệu suất
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(checkViewport, 200);
  });
}

// ========================
// CÁC HÀM CŨ GIỮ NGUYÊN
// ========================
function initTooltips() {
  const tooltipStyle = document.createElement("style");
  tooltipStyle.textContent = `
        /* Tooltip styles */
        .menu_item {
            position: relative;
        }
        .menu_item::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 100;
            pointer-events: none;
        }
        .menu_item:hover::after {
            opacity: 1;
            visibility: visible;
        }

        /* Search dropdown styles */
        .search-dropdown {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
        }
        .search-dropdown.show {
            display: block;
        }
        .result-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: background 0.2s;
        }
        .result-item:hover, .result-item.highlight {
            background-color: #f0f0f0;
        }
        .no-results {
            padding: 8px;
            color: #666;
            font-style: italic;
        }
        .match-highlight {
            background-color: #ffeb3b;
            font-weight: bold;
        }
        
        /* Tắt tooltip khi search active */
        .search_item.active-search::after {
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `;
  document.head.appendChild(tooltipStyle);
}

function setupHelpModal() {
  // Giữ nguyên như cũ
  const trigger = document.getElementById("help-trigger");
  if (!trigger) return;

  trigger.addEventListener("click", async function (e) {
    e.preventDefault();

    // Tạo modal với cấu trúc đơn giản
    const modal = document.createElement("div");
    modal.className = "help-modal";
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s;
        `;

    modal.innerHTML = `
            <div class="help-modal-content" style="
                background: white;
                width: 80%;
                max-width: 900px;
                height: 80vh;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div class="help-modal-header" style="
                    padding: 15px;
                    background: #2c3e50;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0;">Hướng dẫn sử dụng</h2>
                    <span class="help-modal-close" style="
                        font-size: 24px;
                        cursor: pointer;
                    ">&times;</span>
                </div>
                <iframe 
                    id="help-iframe" 
                    src="/vn/help/help.html" 
                    style="
                        flex: 1;
                        width: 100%;
                        border: none;
                    "
                    loading="lazy"
                ></iframe>
            </div>
        `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Hiển thị modal với hiệu ứng mờ dần
    setTimeout(() => {
      modal.style.opacity = "1";
    }, 10);

    // Xử lý đóng modal
    const closeModal = () => {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = "";
      }, 300);
    };

    modal
      .querySelector(".help-modal-close")
      .addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeModal()
    );
  });
}

function highlightActiveMenu() {
  // Giữ nguyên như cũ
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll(".menu_item");

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link && link.getAttribute("href") === currentPath) {
      item.classList.add("active_menu_item");
    } else {
      item.classList.remove("active_menu_item");
    }
  });
}
