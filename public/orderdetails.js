let table = document.querySelector('table')
let tableBody = table.tBodies[0]

tableBody.remove()


async function loadOrderList() {
    let orderList = await fetch('/order');
    orderList = await orderList.json()

    for (let order of orderList) {
        let node = tableBody.cloneNode(true)

        let expandBtn = node.querySelector('.expandBtn')
        let collapseBtn = node.querySelector('.collapseBtn')

        collapseBtn.hidden = true
        node.rows[1].hidden = true
        expandBtn.addEventListener('click', () => {
            collapseBtn.hidden = false
            expandBtn.hidden = true
            node.rows[1].hidden = false
        })
        collapseBtn.addEventListener('click', () => {
            collapseBtn.hidden = true
            expandBtn.hidden = false
            node.rows[1].hidden = true
        })
        console.log(order);
        node.querySelector('.order-id').textContent = order.id
        if (order.date != "Invalid Date") {
            node.querySelector('.order-paymentDate').textContent = order.date
        }
        // if (order.payment_status){
            let payment_status;
            if (order.payment_status == 'confirmed'){
                payment_status = "已確認"
            } else if (order.payment_status == 'pending'){
                payment_status = "待確認"
            // } else if (order.payment_status == 'waitingUpload'){
            //     payment_status = "待上傳"
            } else {
                payment_status = null
            }
            
            if (!payment_status) {
                node.querySelector('.order-paymentStatus').innerHTML = `<a href="receiptSubmit.html?orderId=${order.id}">待上傳</a>`
            } else {
                node.querySelector('.order-paymentStatus').textContent = payment_status
            }
        // }  else {
        //     node.querySelector('.order-paymentStatus')
        // }
        // else {
        //     payment_status = "已確認"
        // }

        

        let status;
        if (order.status == "readying") {
            status = "備貨中"
        } else if (order.status =="shipping") {
            status = "已出貨"
        } else if (order.status =="closed") {
            status = "完成"
        } else if (order.status =="pendingCancel") {
            status = "等待取消"
        } else if (order.status =="acceptCancel") {
            status = "已取消"
        } else {
            status = "待確認"
        }

        node.querySelector('.order-orderStatus').textContent = status
        node.querySelector('.order-orderedAmount').textContent = order.amount

        node.querySelector('.cancelOrderBtn').innerHTML = `<ion-button size="small" onclick="cancelOrder(${order.id})">取消訂單</ion-button>`
        // subTable
        let orderItems = await fetch(`/order/items`)
        // let orderItems = await fetch(`/order/5/items`);
        orderItems = await orderItems.json();

        for(let item of orderItems) {
            if (item.order_id == order.id){
                let subT = node.querySelector('.subTable');
                let subTBody = subT.tBodies[0]
                let dataNode = subTBody.rows[0].cloneNode(true)

                dataNode.querySelector('.order_id').textContent = item.name;
                dataNode.querySelector('.order_qty').textContent = item.quantity;
                dataNode.querySelector('.order_amount').textContent = item.amount;
                dataNode.querySelector('.order_photo').innerHTML = `
                <img src="../itemPhoto/${item.photo}" alt="${item.name}">
                `;
                subT.appendChild(dataNode)
            }
        }

        table.appendChild(node)
    }
}
loadOrderList()

//cancel order button
async function cancelOrder(id) {

    const alert = document.createElement('ion-alert');
    alert.header = '你確定要取消訂單嗎？';
    alert.message= '確定後，職員會與你聯絡跟進! <br> 進一步資訊請查看電郵'
    alert.cssClass = 'custom-alert';
    alert.buttons = [
        {
        text: '返回',
        cssClass: 'alert-button-cancel'
        },
        {
        text: '確定取消',
        cssClass: 'alert-button-confirm'
        }
    ];

    document.body.appendChild(alert);
    await alert.present();

    document.querySelector('.alert-button-confirm').addEventListener('click', async() => {
        console.log();
            let json = await fetch(`/order/${id}?status=pendingCancel`, {
                method: "PATCH",
            });
            if (json.error) {
                console.log(json.error);
                return;
            }
            console.log("success");
            location.reload(); 
    })
}