const MAX_RETRIES = 3;
let retryCount = 0;

function initChartViewer() {
  const chartList = document.getElementById("chart_list");
  const viewerFrame = document.getElementById("chart_viewer_iframe");

  if (!chartList || !viewerFrame) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(initChartViewer, 500); // Thử lại sau 500ms
      return;
    }
    console.error("Essential elements not found after retries");
    return;
  }

  // Phần còn lại của code...

  if (!chartList) {
    console.error("Chart list container not found");
    return;
  }

  // Hàm hiển thị chart trong iframe
  const showChart = (imagePath) => {
    if (!viewerFrame) {
      console.error("Viewer iframe not found");
      return;
    }

    try {
      const encodedPath = encodeURIComponent(imagePath);
      viewerFrame.src = `/view-webp.html?image=${encodedPath}`;

      // Hiển thị iframe nếu đang ẩn
      if (viewerFrame.style.display === "none") {
        viewerFrame.style.display = "block";
      }
    } catch (error) {
      console.error("Error loading chart:", error);
      alert("Không thể tải biểu đồ. Vui lòng thử lại.");
    }
  };

  // Load danh sách chart
  fetch("/data/chart-list.json")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data))
        throw new Error("Invalid data format: expected array");

      // Xóa nội dung cũ
      chartList.innerHTML = "";

      // Thêm mỗi chart vào danh sách
      data.forEach((chart) => {
        if (!chart.image_path || !chart.image_desc) {
          console.warn("Invalid chart item:", chart);
          return;
        }

        const listItem = document.createElement("li");
        const link = document.createElement("a");

        link.href = "#";
        link.textContent = chart.image_desc;
        link.onclick = (e) => {
          e.preventDefault();
          showChart(chart.image_path);
        };

        listItem.appendChild(link);
        chartList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error loading chart list:", error);
      chartList.innerHTML =
        '<li class="error">Không tải được danh sách biểu đồ. Vui lòng tải lại trang.</li>';
    });
}

document.addEventListener("DOMContentLoaded", initChartViewer);
