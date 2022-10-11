// const { getLineAndCharacterOfPosition } = require("typescript");

let table = document.querySelector('table')
let tableBody = table.tBodies[0]

tableBody.remove();

let data;

// let fakedata = [{
//     "order-id" : 2,
//     "payment-date" : 2022-9-22,
//     "payment-status" : "pending",
//     "order-amount" :300,
//     "payment-evidence" : "empty"
// }]

async function loadOrderList() {
    let res = await fetch('/order')
    if (!res.ok) {
        let message = await res.text()
        console.log('failed to load order list:', message);
        return
    };
    data = await res.json()

    for (let order of data) {
        let node = tableBody.cloneNode(true)
        let expandBtn = node.querySelector('.expandBtn')
        let collapseBtn = node.querySelector('.collapseBtn')

    collapseBtn.hidden = true;
    node.rows[1].hidden = true;
    expandBtn.addEventListener("click", () => {
      collapseBtn.hidden = false;
      expandBtn.hidden = true;
      node.rows[1].hidden = false;
    });
    collapseBtn.addEventListener("click", () => {
      collapseBtn.hidden = true;
      expandBtn.hidden = false;
      node.rows[1].hidden = true;
    });

        node.querySelector('.order-id').textContent = order.id
        // node.querySelector('.user-id').textContent = order.user_id
        if (order.date != "Invalid Date") {
            node.querySelector('.payment-date').textContent = order.date
        }
        
        console.log(order);
        let paymentStatus;
        if (order.payment_status == "pending") {
            paymentStatus = "待確認"
        } else if (order.payment_status =="confirmed") {
            paymentStatus = "已確認"
        } else {
            paymentStatus = "待上傳"
        }

        node.querySelector('.payment-status').textContent = paymentStatus
        
        let orderStatus;
       if (order.status =="readying") {
            orderStatus = "備貨中"
        } else if (order.status =="shipping") {
            orderStatus = "已出貨"   
        } else if (order.status =="closed") {
            orderStatus = "完成"
        } else if (order.status =="pendingCancel") {
            orderStatus = "等待取消"
        } else if (order.status =="acceptCancel") {
            orderStatus = "已取消"
        } else {
            orderStatus = "待確認"
        }

        node.querySelector('.order-status').textContent = orderStatus

        let editClicked = false;

            node.querySelector('.edit').addEventListener('click',function(){
                if (!editClicked) {
                    let pOption;
                    let wOption;
                    let cOption;
                    // let pcOption;
                    // let acOption;

                    if(order.payment_status == 'pending'){
                        pOption = `<option value="pending" selected>待確認</option>`
                        wOption = `<option value="waitingUpload">待上傳</option>`
                        cOption = `<option value="confirmed">已確認</option>`

                    } else if(order.payment_status == 'confirmed'){
                        pOption = `<option value="pending">待確認</option>`
                        wOption = `<option value="waitingUpload">待上傳</option>`
                        cOption = `<option value="confirmed" selected>已確認</option>`

                    } else {
                        pOption = `<option value="pending" >待確認</option>`
                        wOption = `<option value="waitingUpload" selected>待上傳</option>`
                        cOption = `<option value="confirmed">已確認</option>`
                    } 
                    
                    
                
                    node.querySelector('.payment-status').innerHTML = 
                    `<select id="result_${order.id}">
                        ${pOption}
                        ${wOption}
                        ${cOption}
                    </select>` ;

                    let rOption;
                    let sOption;
                    let clOption;
                    let pcOption;
                    let acOption;
                    let wcOption;

                    if (order.status == 'readying') {
                        rOption = `<option value="readying" selected>備貨中</option>`
                        sOption = `<option value="shipping">已出貨</option>`
                        clOption = `<option value="closed">完成</option>`
                        pcOption = `<option value="pendingCancel">等待取消</option>`
                        acOption = `<option value="acceptCancel">已取消</option>`
                        wcOption = `<option value="waitingConfirm">待確認</option>`
                    } else if (order.status == 'shipping') {
                        rOption = `<option value="readying">備貨中</option>`
                        sOption = `<option value="shipping" selected>已出貨</option>`
                        clOption = `<option value="closed">完成</option>`
                        pcOption = `<option value="pendingCancel">等待取消</option>`
                        acOption = `<option value="acceptCancel">已取消</option>`
                        wcOption = `<option value="waitingConfirm">待確認</option>`
                    } else if (order.status == 'closed') {
                        rOption = `<option value="readying">備貨中</option>`
                        sOption = `<option value="shipping">已出貨</option>`
                        clOption = `<option value="closed" selected>完成</option>`
                        pcOption = `<option value="pendingCancel">等待取消</option>`
                        acOption = `<option value="acceptCancel">已取消</option>`
                        wcOption = `<option value="waitingConfirm">待確認</option>`
                    } else if (order.status == 'pendingCancel') {
                        rOption = `<option value="readying">備貨中</option>`
                        sOption = `<option value="shipping">已出貨</option>`
                        clOption = `<option value="closed">完成</option>`
                        pcOption = `<option value="pendingCancel" selected>等待取消</option>`
                        acOption = `<option value="acceptCancel">已取消</option>`
                        wcOption = `<option value="waitingConfirm">待確認</option>`
                    } else if (order.status == 'acceptCancel') {
                        rOption = `<option value="readying">備貨中</option>`
                        sOption = `<option value="shipping">已出貨</option>`
                        clOption = `<option value="closed">完成</option>`
                        pcOption = `<option value="pendingCancel">等待取消</option>`
                        acOption = `<option value="acceptCancel" selected>已取消</option>`
                        wcOption = `<option value="waitingConfirm">待確認</option>`
                    } else {
                        rOption = `<option value="readying">備貨中</option>`
                        sOption = `<option value="shipping">已出貨</option>`
                        clOption = `<option value="closed">完成</option>`
                        pcOption = `<option value="pendingCancel">等待取消</option>`
                        acOption = `<option value="acceptCancel">已取消</option>`
                        wcOption = `<option value="waitingConfirm" selected>待確認</option>`
                    }

                    node.querySelector('.order-status').innerHTML = 
                    `<select id="order_result_${order.id}">
                        ${rOption}
                        ${sOption}
                        ${clOption}
                        ${pcOption}
                        ${acOption}
                        ${wcOption}
                    </select>` ;

                    async function updateStatus(payment_status,status) {
                        console.log(payment_status,status);
                        let json = await fetch(`/order/${order.id}?status=${status}&payment_status=${payment_status}`, {
                            method: "PATCH",
                        });
                        if (json.error) {
                            console.log(json.error);
                            return;
                        }
                        console.log("success");
                        location.reload(); 
                    };

                    const button = document.createElement("td");
                    button.innerHTML=`<ion-button size="small" class="here">儲存</ion-button></td>`
                    button.addEventListener('click', () => updateStatus(document.querySelector(`#result_${order.id}`).value, document.querySelector(`#order_result_${order.id}`).value) )
                    button.style.justifyContent = 'center'


                    node.querySelector('.here').appendChild(button)

                    editClicked = true;
                }
            })

        node.querySelector('.order-amount').textContent = order.amount
        node.querySelector('.payment-evidence').innerHTML = `<img src="../receipt/${order.evidence}" alt="Empty" width="80" height="150">`


        table.appendChild(node)
    }
}
loadOrderList();
