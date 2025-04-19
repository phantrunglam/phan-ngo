const MAX_RETRIES = 3;
let retryCount = 0;

function initChartViewer() {
  const chartList = document.getElementById("chart_list");

  if (!chartList) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(initChartViewer, 500);
      return;
    }
    console.error("Không tìm thấy danh sách chart");
    return;
  }

  // Hàm mở popup/pdf tùy loại file
  const openChart = (chart) => {
    const width = screen.width * 0.9;
    const height = screen.height * 0.9;
    const features = `width=${width},height=${height},top=50,left=50,resizable=yes,scrollbars=yes`;

    if (chart.file_type === "pdf") {
      // Sửa: Không thêm .pdf nữa vì đã có trong path
      const url = `/vn/view-pdf.html?pdf=${encodeURIComponent(
        chart.image_path
      )}`;
      window.open(url, "pdfViewer", features);
    } else {
      const url = `/vn/view-webp.html?image=${encodeURIComponent(
        chart.image_path
      )}`;
      window.open(url, "imageViewer", features);
    }
  };

  // Tải danh sách từ JSON
  fetch("/data/chart-list.json")
    .then((response) => response.json())
    .then((data) => {
      chartList.innerHTML = "";

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
          openChart(chart);
        };

        listItem.appendChild(link);
        chartList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Lỗi tải danh sách:", error);
      chartList.innerHTML =
        '<li class="error">Không tải được danh sách. Vui lòng thử lại.</li>';
    });
}

document.addEventListener("DOMContentLoaded", initChartViewer);
