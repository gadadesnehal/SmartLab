
function showMessage(message) {
  alert(message);
}

// Set today's date as the earliest collection date.
const collectionDate = document.getElementById("collectionDate");

const now = new Date();
const localToday = new Date(
  now.getTime() - now.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

if (collectionDate) {
  collectionDate.min = localToday;
}

// Patient home sample collection demo form.
const collectionForm = document.getElementById("collectionForm");

if (collectionForm) {
  collectionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("patientName").value.trim();
    const phone = document.getElementById("patientPhone").value.trim();
    const address = document.getElementById("collectionAddress").value.trim();
    const date = collectionDate.value;
    const time = document.getElementById("collectionTime").value;
    const message = document.getElementById("collectionMessage");

    if (!name || !phone || !address || !date || !time) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      message.textContent = "Enter a valid 10-digit phone number.";
      return;
    }

    if (date < localToday) {
      message.textContent = "Choose today or a future date.";
      return;
    }

    message.textContent =
  "Demo request submitted for " + name +
  " on " + date + " at " + time +
  ". No real booking has been created.";

    collectionForm.reset();
    collectionDate.min = localToday;
  });
}

// Download a clearly labelled fictional demo report.
function downloadDemoReport() {
  const content = [
    "SMARTLAB - DEMO REPORT",
    "DEMONSTRATION ONLY - NOT A REAL MEDICAL REPORT",
    "",
    "Test: Blood Glucose",
    "Patient: Sample Demo Patient",
    "Date: 18 October 2026",
    "Result: No medical result provided",
    "",
    "This file is only for demonstrating the website.",
    "Do not use it for medical decisions."
  ].join("\n");

  const file = new Blob([content], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "SmartLab-Demo-Report.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
}

// Lab Owner: update a booking's displayed status.
document.querySelectorAll(".owner-status").forEach(function (select) {
  select.addEventListener("change", function () {
    const row = select.closest("tr");
    const statusCell = row.querySelector("td:nth-child(5)");

    if (!statusCell) return;

    const status = select.value;
    const badge = document.createElement("span");

    badge.className = "status";

    if (status === "Report Ready") {
      badge.classList.add("status-ready");
    } else {
      badge.classList.add("status-progress");
    }

    badge.textContent = status;
    statusCell.replaceChildren(badge);
  });
});

// Lab Owner: demo staff assignment.

/* SmartLab - Demo Staff Assignment */
const staffForm = document.getElementById("staffForm");

function displayStaffAssignments() {
  // Load actual saved bookings into Staff Assign and Report Upload.
function loadBookingDropdowns() {
  const staffBooking = document.getElementById("staffBooking");
  const reportBooking = document.getElementById("reportBooking");

  let bookings = [];

  try {
    bookings = JSON.parse(
      localStorage.getItem("smartLabBookings") || "[]"
    );

    if (!Array.isArray(bookings)) bookings = [];
  } catch (error) {
    bookings = [];
  }

  [staffBooking, reportBooking].forEach(function (dropdown) {
    if (!dropdown) return;

    dropdown.replaceChildren();

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = "Select booking";
    dropdown.appendChild(firstOption);

    bookings.forEach(function (booking) {
      if (!booking.id) return;

      const option = document.createElement("option");
      option.value = String(booking.id);
      option.textContent =
        booking.id + " - " +
        (booking.patient || "Patient") + " - " +
        (booking.test || "Test");

      dropdown.appendChild(option);
    });
  });
}

loadBookingDropdowns();
  const list = document.getElementById("staffAssignmentList");
  if (!list) return;

  const assignments = JSON.parse(
    localStorage.getItem("smartLabStaffAssignments") || "[]"
  );

  list.innerHTML = "";

  if (assignments.length === 0) {
    list.textContent = "No staff assignments yet.";
    return;
  }

  assignments.forEach(function (assignment) {
    const item = document.createElement("div");
    item.className = "staff-assignment-item";

    const details = document.createElement("p");
    details.textContent =
      "Booking: " + assignment.booking +
      " | Staff: " + assignment.staff;

    const status = document.createElement("p");
    status.textContent = "Assignment Status: " + assignment.status;

    item.appendChild(details);
    item.appendChild(status);
    list.appendChild(item);
  });
}

if (staffForm) {
  staffForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const booking = document.getElementById("staffBooking").value;
    const staff = document.getElementById("staffMember").value;
    const message = document.getElementById("staffMessage");

    if (!booking || !staff) {
      message.textContent = "Please select a booking and staff member.";
      return;
    }

    const assignments = JSON.parse(
      localStorage.getItem("smartLabStaffAssignments") || "[]"
    );

    const existingIndex = assignments.findIndex(function (item) {
      return item.booking === booking;
    });

    const newAssignment = {
      booking: booking,
      staff: staff,
      status: "Assigned (Demo)"
    };

    if (existingIndex >= 0) {
      assignments[existingIndex] = newAssignment;
    } else {
      assignments.push(newAssignment);
    }

    localStorage.setItem(
      "smartLabStaffAssignments",
      JSON.stringify(assignments)
    );

    message.textContent =
      staff + " assigned to " + booking + " (Demo).";

    displayStaffAssignments();
  });
}

displayStaffAssignments();


// Lab Owner: validate and preview a demo report upload.
const reportForm = document.getElementById("reportForm");

if (reportForm) {
  
const reportForm = document.getElementById("reportForm");

if (reportForm) {
  
function openSmartLabDB() {
  return new Promise(function (resolve, reject) {
    const request = indexedDB.open("SmartLabDemoDB", 1);

    request.onupgradeneeded = function () {
      const db = request.result;

      if (!db.objectStoreNames.contains("reports")) {
        db.createObjectStore("reports", { keyPath: "bookingId" });
      }
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function saveDemoReportFile(bookingId, file) {
  const db = await openSmartLabDB();

  return new Promise(function (resolve, reject) {
    const transaction = db.transaction("reports", "readwrite");

    transaction.objectStore("reports").put({
      bookingId: bookingId,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileBlob: file
    });

    transaction.oncomplete = function () {
      db.close();
      resolve();
    };

    transaction.onerror = function () {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = function () {
      db.close();
      reject(transaction.error);
    };
  });
}

const reportForm = document.getElementById("reportForm");

if (reportForm) {
  reportForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const bookingId = document.getElementById("reportBooking").value;
    const fileInput = document.getElementById("reportFile");
    const file = fileInput.files[0];
    const message = document.getElementById("reportMessage");

    if (!bookingId || !file) {
      message.textContent = "Please select a booking and a demo report file.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.textContent = "For this demo, choose a file smaller than 5 MB.";
      return;
    }

    try {
      await saveDemoReportFile(bookingId, file);

      const reports = JSON.parse(
        localStorage.getItem("smartLabDemoReports") || "[]"
      );

      const demoReport = {
        bookingId: bookingId,
        fileName: file.name,
        uploadedAt: new Date().toLocaleString(),
        note: "DEMO REPORT — NOT A REAL TEST RESULT"
      };

      const index = reports.findIndex(function (report) {
        return report.bookingId === bookingId;
      });

      if (index >= 0) {
        reports[index] = demoReport;
      } else {
        reports.push(demoReport);
      }

      localStorage.setItem("smartLabDemoReports", JSON.stringify(reports));
      if (typeof window.updateSmartLabStatistics === "function") {
  window.updateSmartLabStatistics();
}
      message.textContent =
        "Demo file saved in this browser for " + bookingId +
        ". Open Patient Dashboard to download it.";

      fileInput.value = "";
    } catch (error) {
      message.textContent =
        "Could not save this file in the browser. Try a smaller file.";
    }
  });
}

}

}


function displayOwnerBookings() {
  
/* SmartLab - Booking Search and Filter */
(function () {
  const searchInput = document.getElementById("bookingSearch");
  const statusFilter = document.getElementById("bookingStatusFilter");
  const clearButton = document.getElementById("clearBookingFilters");
  const tbody = document.getElementById("ownerBookingRows");

  if (!searchInput || !statusFilter || !clearButton || !tbody) {
    return;
  }

  function filterBookings() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const dateInput = document.getElementById("bookingDateFilter");
const selectedDate = dateInput ? dateInput.value : "";

    const savedBookings = JSON.parse(
      localStorage.getItem("smartLabBookings") || "[]"
    );

    const matchingBookings = savedBookings.filter(function (booking) {
      const searchableText = [
        booking.id,
        booking.patient,
        booking.test
      ].join(" ").toLowerCase();

      const matchesSearch = searchableText.includes(searchText);
      const matchesStatus =
        !selectedStatus || (booking.status || "Confirmed (Demo)") === selectedStatus;
      const matchesDate =
      !selectedDate || booking.date === selectedDate;
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Hide all existing booking rows first.
    Array.from(tbody.querySelectorAll("tr")).forEach(function (row) {
      row.style.display = "none";
    });

    if (matchingBookings.length === 0) {
      let emptyRow = document.getElementById("noFilteredBookings");

      if (!emptyRow) {
        emptyRow = document.createElement("tr");
        emptyRow.id = "noFilteredBookings";

        const cell = document.createElement("td");
        cell.colSpan = 7;
        cell.textContent = "No matching bookings found.";
        emptyRow.appendChild(cell);
        tbody.appendChild(emptyRow);
      }

      emptyRow.style.display = "";
      return;
    }

    const emptyRow = document.getElementById("noFilteredBookings");
    if (emptyRow) emptyRow.style.display = "none";

    // Match displayed rows by booking ID.
    Array.from(tbody.querySelectorAll("tr")).forEach(function (row) {
      if (row.id === "noFilteredBookings") return;

      const firstCell = row.querySelector("td");
      if (!firstCell) return;

      const bookingId = firstCell.textContent.trim();
      const matches = matchingBookings.some(function (booking) {
        return String(booking.id || "Demo booking") === bookingId;
      });

      if (matches) row.style.display = "";
    });
  }

  searchInput.addEventListener("input", filterBookings);
  statusFilter.addEventListener("change", filterBookings);
  const dateInput = document.getElementById("bookingDateFilter");

if (dateInput) {
  dateInput.addEventListener("change", filterBookings);
}
  clearButton.addEventListener("click", function () {
    searchInput.value = "";
    statusFilter.value = "";
    if (dateInput) {
  dateInput.value = "";
}
    filterBookings();
  });
})();

  const tbody = document.getElementById("ownerBookingRows");
  if (!tbody) return;

  const bookings = JSON.parse(
    localStorage.getItem("smartLabBookings") || "[]"
  );

  tbody.replaceChildren();

  if (bookings.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = "No patient bookings found yet.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  bookings.forEach(function (booking) {
    const row = document.createElement("tr");

    const values = [
      booking.id || "Demo booking",
      booking.patient || "Demo patient",
      booking.test || "Not specified",
      booking.method || "Lab Visit",
      booking.status || "Confirmed (Demo)"
    ];

    values.forEach(function (value, index) {
      const cell = document.createElement("td");

      if (index === 4) {
        const status = document.createElement("span");
        status.className = "status status-progress";
        status.textContent = value;
        cell.appendChild(status);
      } else {
        cell.textContent = value;
      }

      row.appendChild(cell);
    });

    // Booking status update
    const actionCell = document.createElement("td");
    const select = document.createElement("select");
    select.className = "owner-status";
    select.setAttribute(
      "aria-label",
      "Update status for " + booking.id
    );

    [
      "Confirmed (Demo)",
      "Booked",
      "Sample Collected",
      "Processing",
      "Report Ready",
      "Cancelled (Demo)"
    ].forEach(function (statusValue) {
      const option = document.createElement("option");
      option.value = statusValue;
      option.textContent = statusValue;

      if (statusValue === (booking.status || "Confirmed (Demo)")) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    const statusText = document.createElement("span");
    statusText.textContent = booking.status || "Confirmed (Demo)";
    statusText.style.display = "none";

    select.addEventListener("change", function () {
      const savedBookings = JSON.parse(
        localStorage.getItem("smartLabBookings") || "[]"
      );

      const target = savedBookings.find(function (item) {
        return item.id === booking.id;
      });

      if (target) {
        const oldStatus = target.status || "Confirmed (Demo)";
        const newStatus = select.value;

        if (oldStatus !== newStatus) {
          target.status = newStatus;

          localStorage.setItem(
            "smartLabBookings",
            JSON.stringify(savedBookings)
          );

          saveSmartLabNotification(
            "Booking " + booking.id +
            " status updated: " + newStatus,
            booking.id
          );

          values[4] = newStatus;
          statusText.textContent = newStatus;
        }
      }
    });

    actionCell.appendChild(select);
    actionCell.appendChild(statusText);
    row.appendChild(actionCell);

    // Payment status
    const paymentCell = document.createElement("td");
    const paymentSelect = document.createElement("select");
    paymentSelect.className = "owner-payment";
    paymentSelect.setAttribute(
      "aria-label",
      "Payment status for " + booking.id
    );

    ["Pending (Demo)", "Paid (Demo)"].forEach(function (paymentValue) {
      const option = document.createElement("option");
      option.value = paymentValue;
      option.textContent = paymentValue;

      if (
        paymentValue ===
        (booking.paymentStatus || "Pending (Demo)")
      ) {
        option.selected = true;
      }

      paymentSelect.appendChild(option);
    });

    paymentSelect.addEventListener("change", function () {
      const savedBookings = JSON.parse(
        localStorage.getItem("smartLabBookings") || "[]"
      );

      const target = savedBookings.find(function (item) {
        return item.id === booking.id;
      });

      if (!target) {
        alert("Booking not found. Please refresh the page.");
        return;
      }

      target.paymentStatus = paymentSelect.value;

      localStorage.setItem(
        "smartLabBookings",
        JSON.stringify(savedBookings)
      );

      saveSmartLabNotification(
        "Payment status for booking " + booking.id +
        " updated: " + paymentSelect.value,
        booking.id
      );

      alert("Payment status updated (Demo).");
    });

    paymentCell.appendChild(paymentSelect);
    row.appendChild(paymentCell);

    tbody.appendChild(row);
  });

  const total = document.getElementById("ownerTotalBookings");
  if (total) total.textContent = bookings.length;
}

displayOwnerBookings();



/* SmartLab - Patient Booking History */
(function () {
  function loadPatientBookingHistory() {
    const rows = document.getElementById("bookingRows");

    // Patient booking table nasel tar kahi karu naka.
    if (!rows) return;

    let bookings = [];

    try {
      bookings = JSON.parse(
        localStorage.getItem("smartLabBookings") || "[]"
      );

      if (!Array.isArray(bookings)) bookings = [];
    } catch (error) {
      bookings = [];
    }

    // Newest booking first
    bookings = bookings.slice().reverse();

    const totalElement = document.getElementById("totalBookings");
    const pendingElement = document.getElementById("pendingTests");
    const readyElement = document.getElementById("readyReports");

    if (totalElement) {
      totalElement.textContent = bookings.length;
    }

    if (pendingElement) {
      pendingElement.textContent = bookings.filter(function (booking) {
        const status = String(booking.status || "").toLowerCase();

        return (
          status.includes("pending") ||
          status.includes("progress") ||
          status.includes("confirmed")
        );
      }).length;
    }

    if (readyElement) {
      // Reports feature currently demo-only.
      readyElement.textContent = "0";
    }

    rows.replaceChildren();

    if (bookings.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 5;
      cell.textContent =
        "No bookings found. Book a test to see your booking history here.";
      cell.style.textAlign = "center";
      cell.style.padding = "20px";

      row.appendChild(cell);
      rows.appendChild(row);
      return;
    }

    bookings.forEach(function (booking) {
      const row = document.createElement("tr");

      const values = [
        booking.test || "—",
        booking.laboratory || "—",
        booking.date || "—",
        booking.price || "—",
        booking.status || "Confirmed (Demo)",
        booking.paymentStatus || "Pending (Demo)",
      ];

      
values.forEach(function (value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
});

const actionCell = document.createElement("td");
const currentStatus = String(booking.status || "").toLowerCase();

if (currentStatus.includes("cancelled")) {
  actionCell.textContent = "Booking cancelled";
} else if (currentStatus.includes("report ready") || !booking.id) {
  actionCell.textContent = "Cancellation unavailable";
} else {
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "small-btn";
  cancelButton.textContent = "Cancel Booking";

  cancelButton.addEventListener("click", function () {
    if (!confirm("Do you want to cancel this demo booking?")) return;

    let savedBookings = [];

    try {
      savedBookings = JSON.parse(
        localStorage.getItem("smartLabBookings") || "[]"
      );
    } catch (error) {
      alert("Unable to read bookings.");
      return;
    }

    const target = savedBookings.find(function (item) {
      return item.id === booking.id;
    });

    if (!target) {
      alert("Booking not found. Refresh the page and try again.");
      return;
    }

    const status = String(target.status || "").toLowerCase();

    if (status.includes("cancelled") || status.includes("report ready")) {
      alert("This booking can no longer be cancelled.");
      loadPatientBookingHistory();
      return;
    }

    target.status = "Cancelled (Demo)";

    localStorage.setItem(
      "smartLabBookings",
      JSON.stringify(savedBookings)
    );

    if (typeof saveSmartLabNotification === "function") {
      saveSmartLabNotification(
        "Your booking " + booking.id + " has been cancelled (Demo).",
        booking.id
      );
    }

    loadPatientBookingHistory();
    alert("Demo booking cancelled successfully.");
  });

  actionCell.appendChild(cancelButton);
}

row.appendChild(actionCell);

const receiptCell = document.createElement("td");

const viewButton = document.createElement("button");
viewButton.type = "button";
viewButton.className = "small-btn";
viewButton.textContent = "View Receipt";

viewButton.addEventListener("click", function () {
  const receiptWindow = window.open("", "_blank");

  if (!receiptWindow) {
    alert("Popup blocked. Please allow popups.");
    return;
  }

  const doc = receiptWindow.document;
  doc.title = "SmartLab Demo Receipt";

  const heading = doc.createElement("h1");
  heading.textContent = "SmartLab - Bill Receipt (Demo)";
  doc.body.appendChild(heading);

  const details = [
    ["Receipt Number", "SL-" + (booking.id || "DEMO")],
    ["Patient", booking.patient || "—"],
    ["Test", booking.test || "—"],
    ["Laboratory", booking.laboratory || "—"],
    ["Booking Date", booking.date || "—"],
    ["Amount", booking.price || "—"],
    ["Payment Status", booking.paymentStatus || "Pending (Demo)"]
  ];

  details.forEach(function (item) {
    const p = doc.createElement("p");
    const strong = doc.createElement("strong");
    strong.textContent = item[0] + ": ";
    p.appendChild(strong);
    p.appendChild(doc.createTextNode(item[1]));
    doc.body.appendChild(p);
  });

  const note = doc.createElement("p");
  note.textContent =
    "Demo receipt only. Not proof of actual payment or a tax invoice.";
  doc.body.appendChild(note);

  const pdfButton = doc.createElement("button");
  pdfButton.textContent = "Download PDF / Print";
  pdfButton.addEventListener("click", function () {
    receiptWindow.print();
  });
  doc.body.appendChild(pdfButton);
});

const pdfButton = document.createElement("button");
pdfButton.type = "button";
pdfButton.className = "small-btn";
pdfButton.textContent = "Download PDF";

pdfButton.addEventListener("click", function () {
  viewButton.click();
});

receiptCell.appendChild(viewButton);
receiptCell.appendChild(pdfButton);
row.appendChild(receiptCell);

rows.appendChild(row)

    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      loadPatientBookingHistory
    );
  } else {
    loadPatientBookingHistory();
  }

  // Lab Owner dashboard madhun status update zalyavar
  // Patient Dashboard refresh kelyas navin status disel.
  window.addEventListener("storage", function (event) {
    if (event.key === "smartLabBookings") {
      loadPatientBookingHistory();
    }
  });
})();

/* SmartLab - Patient Notifications */

function saveSmartLabNotification(message, bookingId) {
  let notifications = [];

  try {
    notifications = JSON.parse(
      localStorage.getItem("smartLabNotifications") || "[]"
    );

    if (!Array.isArray(notifications)) notifications = [];
  } catch (error) {
    notifications = [];
  }

  notifications.push({
    id: Date.now() + "-" + Math.random(),
    bookingId: bookingId || "",
    message: message,
    time: new Date().toLocaleString()
  });

  localStorage.setItem(
    "smartLabNotifications",
    JSON.stringify(notifications)
  );
}

function displaySmartLabNotifications() {
  const container = document.getElementById("patientNotifications");
  if (!container) return;

  let notifications = [];

  try {
    notifications = JSON.parse(
      localStorage.getItem("smartLabNotifications") || "[]"
    );

    if (!Array.isArray(notifications)) notifications = [];
  } catch (error) {
    notifications = [];
  }

  container.replaceChildren();

  if (notifications.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No new notifications.";
    container.appendChild(message);
    return;
  }

  notifications.slice().reverse().forEach(function (notification) {
    const item = document.createElement("div");
    item.className = "notification-item";

    const text = document.createElement("p");
    text.textContent = notification.message;

    const time = document.createElement("small");
    time.textContent = notification.time;

    item.append(text, time);
    container.appendChild(item);
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    displaySmartLabNotifications
  );
} else {
  displaySmartLabNotifications();
}

window.addEventListener("storage", function (event) {
  if (
    event.key === "smartLabNotifications" ||
    event.key === "smartLabBookings"
  ) {
    displaySmartLabNotifications();
  }
});


/* SmartLab - Automatic Dashboard Statistics */
(function () {
  function updateSmartLabStatistics() {
    const bookings = JSON.parse(
      localStorage.getItem("smartLabBookings") || "[]"
    );

    const totalElement = document.getElementById("ownerTotalBookings");
    const pendingElement = document.getElementById("ownerPendingSamples");
    const readyElement = document.getElementById("ownerReportsReady");

    if (!totalElement || !pendingElement || !readyElement) {
      return;
    }

    const activeBookings = bookings.filter(function (booking) {
      return booking.status !== "Cancelled (Demo)";
    });

    const pendingBookings = activeBookings.filter(function (booking) {
      const status = booking.status || "Confirmed (Demo)";
      return status !== "Report Ready";
    });

    const readyBookings = activeBookings.filter(function (booking) {
      return booking.status === "Report Ready";
    });

    totalElement.textContent = bookings.length;
    pendingElement.textContent = pendingBookings.length;
    readyElement.textContent = readyBookings.length;
  }

  updateSmartLabStatistics();

  window.addEventListener("storage", updateSmartLabStatistics);

  window.updateSmartLabStatistics = updateSmartLabStatistics;
})();


/* SmartLab - Daily Business Report */
(function () {
  const dateInput = document.getElementById("businessReportDate");
  if (!dateInput) return;

  function updateDailyReport() {
    let bookings = [];

    try {
      bookings = JSON.parse(
        localStorage.getItem("smartLabBookings") || "[]"
      );

      if (!Array.isArray(bookings)) bookings = [];
    } catch (error) {
      bookings = [];
    }

    const selectedDate = dateInput.value;

    const dailyBookings = bookings.filter(function (booking) {
      return (
        String(booking.date || "").slice(0, 10) === selectedDate &&
        !String(booking.status || "").toLowerCase().includes("cancelled")
      );
    });

    const uniquePatients = new Set(
      dailyBookings
        .map(function (booking) {
          return String(booking.phone || booking.patient || "").trim().toLowerCase();
        })
        .filter(Boolean)
    );

    function getAmount(value) {
      const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
      return Number.isFinite(amount) ? amount : 0;
    }

    const received = dailyBookings
      .filter(function (booking) {
        return String(booking.paymentStatus || "").toLowerCase().includes("paid");
      })
      .reduce(function (sum, booking) {
        return sum + getAmount(booking.price);
      }, 0);

    const pending = dailyBookings
      .filter(function (booking) {
        return !String(booking.paymentStatus || "").toLowerCase().includes("paid");
      })
      .reduce(function (sum, booking) {
        return sum + getAmount(booking.price);
      }, 0);

    document.getElementById("dailyPatients").textContent =
      uniquePatients.size;

    document.getElementById("dailyBookings").textContent =
      dailyBookings.length;

    document.getElementById("dailyReceived").textContent =
      "₹" + received.toLocaleString("en-IN");

    document.getElementById("dailyPending").textContent =
      "₹" + pending.toLocaleString("en-IN");

    document.getElementById("dailyReportMessage").textContent =
      dailyBookings.length
        ? "Showing demo bookings for " + selectedDate + "."
        : "No bookings found for this date.";
  }

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  if (!dateInput.value) {
    dateInput.value = localToday;
  }

  dateInput.addEventListener("change", updateDailyReport);
  updateDailyReport();

  window.updateDailyBusinessReport = updateDailyReport;
})();
