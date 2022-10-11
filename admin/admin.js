let tableBody = document.querySelector("#staffTable tbody");
let tableRow = tableBody.rows[0];
tableRow.remove();

async function loadStaffList() {
  let res = await fetch("/admin");
  let json = await res.json();
  tableBody.textContent = "";
  for (let staff of json) {
    let tr = tableRow.cloneNode(true);
    tr.cells[0].textContent = staff.id;
    tr.cells[1].textContent = staff.username;

    let activateBtn = tr.cells[3].querySelector(".activateBtn");
    let deactivateBtn = tr.cells[3].querySelector(".deactivateBtn");

    async function updateStatus(status) {
      let json = await fetch(`/admin/${staff.id}?status=${status}`, {
        method: "PATCH",
      });
      if (json.error) {
        let toast = await toastController.create({
          message: json.error,
          color: "danger",
          duration: 4000,
        });
        toast.present();
        return;
      }
      let toast = await toastController.create({
        message: "Updated Status",
        duration: 3000,
      });
      toast.present();
      loadStaffList();
    }

    activateBtn.addEventListener("click", () => updateStatus("activate"));
    deactivateBtn.addEventListener("click", () => updateStatus("deactivate"));

    if (staff.deactivated_time) {
      tr.cells[2].textContent = "Deactivated";
      deactivateBtn.hidden = true;
    } else {
      tr.cells[2].textContent = "Activated";
      activateBtn.hidden = true;
    }
    tableBody.appendChild(tr);
  }
}
loadStaffList();

async function addStaff(form) {
  let res = await fetch("/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value,
      re_password: form.re_password.value,
    }),
  });
  let json = await res.json();
  if (json.error) {
    let toast = await toastController.create({
      message: json.error,
      color: "danger",
      duration: 4000,
    });
    toast.present();
    return;
  }
  let toast = await toastController.create({
    message: "Added Staff",
    duration: 3000,
  });
  toast.present();
  loadStaffList();
  form.reset();
}

async function logout() {
  let res = await fetch("/logout", { method: "POST" });
  if (res.ok) {
    let toast = await toastController.create({
      message: "你已成功登出，即將跳回主頁",
      duration: 2000,
    });
    toast.present();
    setTimeout(() => {
      location.href = "/index.html";
    }, 2000);
  }
  return;
}
