# Agnos Hospital - Real-time Patient Registration System

This project is a responsive, real-time patient registration system developed as part of the Agnos candidate assignment. It features a synchronized interface between a **Patient Form** and a **Staff Dashboard**, allowing staff to monitor patient data entry in real-time.
---------------------------------------------------------------------------------------
**Live Demo:** [https://job-as.vercel.app/]
**Repository:** [https://github.com/tanawatmix/JobAs.git]
---------------------------------------------------------------------------------------
## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Database & Real-time:** Supabase (PostgreSQL)
- **Form Management:** React Hook Form
- **Authentication:** Custom Context (Phone-based ID & LocalStorage)
- **Deployment:** Vercel

git clone [https://github.com/tanawatmix/JobAs.git]
---------------------------------------------------------------------------------------
staff test
username : staff
password : 1234

---------------------------------------------------------------------------------------
Database Setup

CREATE TABLE patients (
  id text PRIMARY KEY,
  first_name text,
  middle_name text,
  last_name text,
  dob text,
  gender text,
  phone text,
  email text,
  address text,
  pref_language text,
  nationality text,
  religion text,
  emergency_contact_name text,
  emergency_contact_rel text,
  chronic_disease text,
  allergies text,
  status text,
  updated_at timestamptz DEFAULT now()
);

-- Enable Realtime

alter publication supabase_realtime add table patients;
---------------------------------------------------------------------------------------

โครงสร้างโปรเจกต์: ใช้ Next.js (App Router) แยกโฟลเดอร์ชัดเจนระหว่างหน้าเว็บ (App), ชิ้นส่วนหน้าจอ (Components), และระบบจัดการข้อมูล (Context) เพื่อให้อ่านง่ายและขยายต่อได้สะดวก
การออกแบบ (UX/UI): ยึดจากการใช้งานที่ง่ายสุดเพื่อให้สะดวกต่อการใช้งานในทุกช่วงวัย ดูง่ายสบายตาเป็นมิตรต่อผู้ใช้ มีautosave 
ระบบ Real-time: ใช้ Supabase WebSockets ซิงค์ข้อมูลทันทีที่ผู้ป่วยพิมพ์ เจ้าหน้าที่เห็นสถานะสดๆ (กำลังกรอก/ส่งแล้ว) โดยไม่ต้องรีเฟรชหน้าจอ
