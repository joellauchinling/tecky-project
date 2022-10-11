// let ctmList = document.querySelector('.ctm-list')
// let table = ctmList.querySelector('.table')

let tableBody = document.querySelector("#table tbody");
let tableRow = tableBody.rows[0];
tableRow.remove();

async function loadCtmList() {
  console.log("loading ctm list...");
  let res = await fetch("/staff/ctmLists");
  tableBody.textContent = "";
  console.log("res", res);
  console.log("response content-type:", res.headers.get("content-type"));
  console.log("response status: ", res.status);
  if (!res.ok) {
    let message = await res.text();
    console.log("failed to load customer list:", message);
    return;
  }
  // if(res.headers.get('content-type') == 'application/json') {
  //     let json = await res.json()
  //     console.log('json', json);
  // }
  let json = await res.json();
  console.log("json", json);

  for (let ctm of json) {
    let node = tableRow.cloneNode(true);

    let role;
    if (ctm.is_vip == 1) {
      role = "👑";
    } else {
      role = "❤️";
    }

    let discount;
    if (ctm.discount == 0 || ctm.discount == null) {
      discount = 0 + "%";
    } else {
      discount = ctm.discount + '%';
    }

    let consumption;
    if (ctm.consumption == 0 || ctm.consumption == null) {
      consumption = '$' + 0
    } else {
      consumption = ctm.consumption
    }

    // node.querySelector('.ctm-sendEmail').innerHTML =
    // `<input class="sendEmailCheck" type="checkbox" value=${ctm.ctmEmail}></input>`
    node.querySelector(".ctm-id").textContent = ctm.id;
    node.querySelector(".ctm-name").textContent = ctm.username;
    node.querySelector(".ctm-level").textContent = role;
    node.querySelector(".ctm-discount").textContent = discount;
    node.querySelector(".ctm-consumption").textContent = consumption;
    node.querySelector(
      ".ctm-email"
    ).innerHTML = `<a href="mailto:${ctm.email}">📨</a>`;
    tableBody.appendChild(node);
  }
}
loadCtmList();

// let emailList = []

// const sendEmailButton = document.querySelector('.sendEmailButton')
// sendEmailButton.addEventListener('click', (e)=> {
//     sendEmail()
// })

// function sendEmail() {
//     const cb = document.querySelectorAll('.sendEmailCheck');

//     for (c of cb) {
//         if (c.checked){
//             emailList.push(c.value)
//         }
//     }
//     console.log(emailList);
//     let a = document.querySelector('.sendEmail').attr('href',`mailto:abe@gmail.com`)
//     console.log('a',a);
// }
