
// for submission button

let upload = document.querySelector('#upload')


upload.addEventListener('submit', async event => {
    console.log(event);
    event.preventDefault()
    let formData = new FormData(upload)
    let res
    try {
        res = await fetch(upload.action, {
            method: upload.method
            , body: formData
        })
    }catch (error) {
        
        const alert = document.createElement('ion-alert');
        alert.header = '錯誤';
        alert.subHeader = '上傳失敗 ';
        alert.message = '請查看網絡連接，請再嘗試或聯絡客服';
        alert.buttons = ['確定並返回'];
        document.body.appendChild(alert);
        await alert.present();
        return 
    }
    console.log('submit memo response:', res);
    let text = await res.text()
    console.log('submit memo result', text);
    console.log(res.ok);
    if (res.ok) {
        const alert = document.createElement('ion-alert');
        alert.header = '通知';
        alert.subHeader = '上傳成功 ';
        alert.buttons = ['確定並返回'];
        document.body.appendChild(alert);
        await alert.present();

        } else {
            const alert = document.createElement('ion-alert');
            alert.header = '通知';
            alert.subHeader = '上傳失敗，請稍後再試 ';
            alert.buttons = ['確定並返回'];
            document.body.appendChild(alert);
            await alert.present();
        }
    })


