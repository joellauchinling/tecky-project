let tableBody = document.querySelector("table tbody");
let tableRow = tableBody.rows[0];
// tableRow.remove();

async function loadinfo() {
  console.log("loading ctm info...");
  let res = await fetch("/customer/info");
  console.log("res", res);
  // console.log('response content-type:', res.headers.get('content-type'));
  // console.log('response status: ', res.status)
  // if (!res.ok) {
  //     let message = await res.text()
  //     console.log('failed to load ctm info:', message);
  //     return
  // };
  // if(res.headers.get('content-type') == 'application/json') {
  let json = await res.json();
  console.log("json", json);

  let is_vip;
  if (json.is_vip == 1) {
    is_vip = "👑 VIP會員";
  } else {
    is_vip = "❤️ 普通會員";
  }

  let discount;
  if (json.discount == null || json.discount == "" || json.discount == 0) {
    discount = "升級成為VIP會員";
  } else {
    discount = json.discount + "%";
  }

  let consumption;
  if (json.consumption == null || json.consumption == "" || json.consumption == 0) {
    consumption = "$ 0";
  } else {
    consumption = "$" + json.consumption;
  }

  document.querySelector(".ctm-name").textContent = json.username;
  document.querySelector(".ctm-is_vip").textContent = is_vip;
  document.querySelector(".ctm-consumption").textContent = consumption;
  document.querySelector(".ctm-discount").textContent = discount;

}
loadinfo();
