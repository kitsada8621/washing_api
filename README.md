# ขั้นตอนการติดตั้ง
#### ฐานข้อมูล
- สร้างฐานข้อมูล Mysql ชื่อว่า  `washing_db`
#### โปรเจ็ค
- copy project ไปยังเครื่อง `git clone https://github.com/kitsada8621/washing_api.git`
- ทำการ run คำสั่ง `npm install`
- จากนั้นไปยังไฟล์ `.env` ทำการตรวจสอบความถูกต้องของ config ฐานข้อมูล `DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_PORT`
- กำหนด `LINE_TOKEN` 
- ทำการกำหนดเวลาซักผ้า  `WASHING_EXPIRE`
#### เริ่มต้นการใช้งาน
- ทำการ start docker บนเครื่องให้เรียบร้อย
- run คำสั้ง `docker-compose up -d ` เพื่อทำการเริ่มต้น project บน docker
- run คำสั้ง `docker-compose logs -f ` ติดตามการทำงานของ project