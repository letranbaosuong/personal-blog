# Netlify Deployment Guide

## 📋 Cấu hình trên Netlify UI

### 1. Basic Settings

Trên trang https://app.netlify.com/start/deploy, điền các thông tin sau:

**Team:**
```
letranbaosuong
```

**Project name:**
```
letranbaosuong
```
- URL sẽ là: `https://letranbaosuong.netlify.app`
- Bạn có thể đổi tên sau khi deploy

### 2. Build Settings

**Branch to deploy:**
```
main
```

**Base directory:**
```
(để trống)
```

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Functions directory:**
```
(để trống - không cần)
```

### 3. Environment Variables

Click "Add environment variables" và thêm các biến sau:

#### Required (Bắt buộc):

**NEXT_PUBLIC_SITE_URL**
```
Value: https://letranbaosuong.netlify.app
```
- Hoặc domain tùy chỉnh của bạn nếu có

#### Optional (Tùy chọn - nếu dùng Firebase):

**NEXT_PUBLIC_FIREBASE_API_KEY**
```
Value: your_firebase_api_key
```

**NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
```
Value: your_project_id.firebaseapp.com
```

**NEXT_PUBLIC_FIREBASE_PROJECT_ID**
```
Value: your_firebase_project_id
```

**NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
```
Value: your_project_id.appspot.com
```

**NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
```
Value: your_messaging_sender_id
```

**NEXT_PUBLIC_FIREBASE_APP_ID**
```
Value: your_firebase_app_id
```

**NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID**
```
Value: your_measurement_id
```

> **Lưu ý:** Nếu không dùng Firebase, bạn có thể bỏ qua các biến Firebase.

### 4. Deploy

Sau khi điền đầy đủ thông tin:

1. Click **"Deploy letranbaosuong"** button
2. Netlify sẽ:
   - Clone repository từ GitHub
   - Install dependencies: `npm install`
   - Run build: `npm run build`
   - Deploy to: `https://letranbaosuong.netlify.app`

## 🔧 Sau khi Deploy

### 1. Kiểm tra Build Log

Vào **Deploys** tab để xem build log:
- ✅ Build successful → Site đã live
- ❌ Build failed → Xem log để debug

### 2. Custom Domain (Optional)

Nếu có domain riêng:

1. Vào **Domain settings**
2. Click **Add custom domain**
3. Nhập domain của bạn (vd: `yourdomain.com`)
4. Cấu hình DNS records theo hướng dẫn

### 3. HTTPS

Netlify tự động enable HTTPS:
- Let's Encrypt SSL certificate
- Auto-renewal
- Force HTTPS redirect

### 4. Build Hooks (Optional)

Tạo build hook để trigger deploy từ ngoài:

1. Vào **Site settings** > **Build & deploy** > **Build hooks**
2. Click **Add build hook**
3. Copy webhook URL

## 📝 Cấu hình tối ưu

File `netlify.toml` đã được tạo với:

✅ Next.js Runtime plugin
✅ Security headers
✅ Cache optimization
✅ Node.js 20

## 🚀 Auto Deploy

Mỗi khi push code lên branch `main`:
- Netlify tự động build và deploy
- Không cần thao tác gì thêm

## 🔍 Troubleshooting

### Build fails với error "Out of memory"

**Solution:**
Thêm env var:
```
NODE_OPTIONS=--max-old-space-size=4096
```

### 404 trên các routes

**Solution:**
Đảm bảo `netlify.toml` có `[[plugins]]` với `@netlify/plugin-nextjs`

### Images không load

**Solution:**
Kiểm tra `NEXT_PUBLIC_SITE_URL` đã đúng chưa

## 📚 Resources

- [Netlify Next.js Docs](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

## ✅ Checklist trước khi Deploy

- [x] Đã tạo file `netlify.toml`
- [x] Đã config build settings đúng
- [x] Đã add environment variables cần thiết
- [x] Code đã push lên GitHub
- [ ] Click "Deploy" button
- [ ] Đợi build hoàn thành
- [ ] Test site trên `https://letranbaosuong.netlify.app`
