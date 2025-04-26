# Cấu hình API cho JobFit.AI

Tài liệu này hướng dẫn cách cấu hình các API key cần thiết cho các chức năng AI trong dự án JobFit.AI.

## Các API key cần thiết

Dự án sử dụng các API sau:

1. **DeepSeek API**: Chức năng tạo mô tả công việc (JD)
2. **OpenAI API**: Backup cho chức năng AI khi DeepSeek không khả dụng
3. **ElevenLabs API**: Chức năng text-to-speech (TTS)
4. **AssemblyAI API**: Chức năng speech-to-text (STT)

## Cấu hình Local Development

### Bước 1: Tạo file .env

Tạo file `.env` trong thư mục gốc dự án với nội dung sau:

```
# DeepSeek API
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key

# OpenAI API
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# ElevenLabs API
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key

# AssemblyAI API
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

Thay thế `your_xxx_api_key` bằng API key thực tế của bạn.

### Bước 2: Khởi động lại server

Sau khi cấu hình API key, khởi động lại development server:

```bash
npm run dev
# hoặc
yarn dev
```

## Cấu hình trên Vercel

Khi deploy lên Vercel, bạn cần cấu hình biến môi trường trong Vercel Dashboard:

### Bước 1: Đăng nhập vào Vercel Dashboard

Truy cập [Vercel Dashboard](https://vercel.com/dashboard) và đăng nhập vào tài khoản của bạn.

### Bước 2: Chọn dự án JobFitFE

Từ dashboard, chọn dự án `JobFitFE` của bạn.

### Bước 3: Cấu hình Environment Variables

1. Click vào tab **Settings**
2. Chọn mục **Environment Variables**
3. Thêm các biến môi trường sau:

```
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

4. Click **Save** để lưu cấu hình

### Bước 4: Redeploy dự án

Sau khi cấu hình biến môi trường, bạn cần redeploy dự án để các thay đổi có hiệu lực:

1. Truy cập tab **Deployments**
2. Chọn **Redeploy** từ menu

## Xử lý sự cố

### Lỗi API không có sẵn

Nếu chức năng tạo JD báo lỗi "Không thể kết nối với dịch vụ AI", hãy kiểm tra:

1. API key đã được cấu hình đúng chưa
2. API key có hoạt động không (thử test trên trang chủ của nhà cung cấp)
3. Đảm bảo server có thể kết nối với API endpoint

### Lỗi khi deploy lên Vercel

Nếu chức năng hoạt động ở local nhưng không hoạt động khi deploy lên Vercel:

1. Kiểm tra logs trong Vercel Dashboard
2. Đảm bảo các biến môi trường đã được cấu hình trong Vercel
3. Xác nhận rằng bạn đã redeploy dự án sau khi cấu hình biến môi trường

## Hỗ trợ

Nếu bạn gặp vấn đề với việc cấu hình API, vui lòng liên hệ team phát triển qua email support@jobfit.ai
