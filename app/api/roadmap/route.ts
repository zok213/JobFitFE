import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked"; // Thêm thư viện marked để chuyển đổi markdown sang HTML

// API route để tương tác trực tiếp với Jina AI API
export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const data = await req.json();
    console.log(
      "🚀 API route received request:",
      data.chatInput.substring(0, 100) + "..."
    );

    try {
      // Gọi trực tiếp đến Jina AI DeepSearch API thay vì qua Python proxy
      console.log("🔌 Connecting directly to Jina AI API");

      const jinaApiKey =
        "jina_6849ca29ece94fda8e4266c14764c40dTky_rfQjF8-aRKKXzbnSkJwgfYUc";

      // Cấu trúc payload cho API
      const payload = {
        model: "jina-deepsearch-v1",
        messages: [
          {
            role: "user",
            content: `Tạo một lộ trình chi tiết dựa trên đề tài: "${data.chatInput}". 
Cấu trúc lộ trình cần có:

1. Tiêu đề chính mô tả lộ trình
2. Giới thiệu ngắn gọn về lộ trình
3. Các giai đoạn phát triển (ít nhất 4 giai đoạn), mỗi giai đoạn cần có:
   - Tiêu đề giai đoạn và khung thời gian
   - Mô tả rõ ràng về mục tiêu của giai đoạn
   - Danh sách các kỹ năng cốt lõi cần phát triển (3-5 kỹ năng)
   - Với MỖI kỹ năng, cung cấp 1 link cụ thể đến nguồn học tập chất lượng
   - Danh sách nguồn học tập khuyến nghị (3-5 nguồn), bao gồm:
     * Khóa học online (kèm link cụ thể đến từng khóa học)
     * Sách và tài liệu (kèm link mua hoặc đọc online)
     * Dự án thực hành (mô tả ngắn gọn và link đến hướng dẫn nếu có)
   - Các cột mốc quan trọng cần đạt được trong giai đoạn

4. Lời khuyên bổ sung và hướng phát triển tiếp theo

Đảm bảo mỗi link đều là link thực tế đến trang web chính thức, không sử dụng link giả. Với khóa học, ưu tiên các nguồn nổi tiếng như Coursera, Udemy, edX, v.v.
Format kết quả dưới dạng Markdown với các tiêu đề, danh sách có đánh dấu, và links được nhúng đúng cách.`,
          },
        ],
        stream: false,
        temperature: 0.7,
      };

      // Gọi đến Jina AI API
      const response = await fetch(
        "https://deepsearch.jina.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${jinaApiKey}`,
            "User-Agent": "Mozilla/5.0",
          },
          body: JSON.stringify(payload),
          // Thêm timeout để tránh chờ quá lâu
          signal: AbortSignal.timeout(120000), // 120 giây timeout
        }
      );

      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Jina AI API error:", response.status, errorText);

        // Sử dụng backend Python như fallback
        console.log("⚠️ Falling back to Python backend proxy");
        return await callPythonBackend(data);
      }

      // Xử lý kết quả từ Jina AI API
      const jinaResult = await response.json();
      console.log("✅ Received response from Jina AI API");

      // Trích xuất nội dung
      let content = "";
      if (jinaResult.choices && jinaResult.choices.length > 0) {
        const choice = jinaResult.choices[0];
        if (choice.message && choice.message.content) {
          content = choice.message.content;
        } else if (choice.text) {
          content = choice.text;
        }
      }

      if (!content) {
        console.error("❌ No content found in Jina AI response, falling back");
        return await callPythonBackend(data);
      }

      // Chuyển đổi markdown sang HTML
      try {
        // Sử dụng marked để chuyển đổi markdown sang HTML với cast để tránh lỗi kiểu
        const html = marked.parse(content as string);
        const enhancedHtml = addStylesToHTML(html);

        // Trả về cả hai định dạng markdown và HTML
        console.log("📤 Returning content to frontend");
        return NextResponse.json({
          text: content, // Vẫn giữ phiên bản markdown để tương thích ngược
          html: enhancedHtml, // Thêm phiên bản HTML
          nonce: String(Date.now()),
        });
      } catch (error) {
        console.error("❌ Error converting markdown to HTML:", error);
        // Nếu có lỗi khi chuyển đổi HTML, vẫn trả về markdown
        return NextResponse.json({
          text: content,
          nonce: String(Date.now()),
        });
      }
    } catch (error) {
      console.error("💥 Error connecting to Jina AI directly:", error);
      console.log("⚠️ Falling back to Python backend proxy");

      // Fallback tới backend Python nếu có lỗi
      return await callPythonBackend(data);
    }
  } catch (error) {
    console.error("💥 API route error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// Hàm thêm style đặc biệt cho HTML để làm nổi bật links
function addStylesToHTML(html: string): string {
  // Thêm CSS và các style cần thiết
  return `
    <div class="roadmap-content">
      <style>
        .roadmap-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #171717;
          border-bottom: 2px solid #d9f99d;
          padding-bottom: 0.5rem;
        }
        .roadmap-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #171717;
          border-left: 4px solid #a3e635;
          padding-left: 0.75rem;
        }
        .roadmap-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          color: #404040;
        }
        .roadmap-content ul {
          margin-top: 1rem;
          margin-bottom: 1rem;
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .roadmap-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .roadmap-content a {
          color: #65a30d;
          text-decoration: none;
          font-weight: 500;
          padding: 0.1rem 0.3rem;
          background-color: #f7fee7;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
        }
        .roadmap-content a:hover {
          color: #4d7c0f;
          background-color: #ecfccb;
        }
        .roadmap-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .roadmap-content strong {
          font-weight: 600;
          color: #171717;
        }
        .roadmap-content blockquote {
          border-left: 3px solid #a3e635;
          padding-left: 1rem;
          margin-left: 0;
          color: #525252;
          font-style: italic;
          margin: 1.5rem 0;
        }
        .roadmap-content code {
          background: #f5f5f5;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.9em;
          font-family: Consolas, Monaco, 'Andale Mono', monospace;
        }
        .roadmap-content pre {
          background: #f8f8f8;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .roadmap-content pre code {
          background: transparent;
          padding: 0;
        }
        .roadmap-content img {
          max-width: 100%;
          border-radius: 4px;
          margin: 1.5rem 0;
        }
        .roadmap-content hr {
          border: 0;
          height: 1px;
          background: #d9f99d;
          margin: 2rem 0;
        }
        .roadmap-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .roadmap-content th {
          background: #f7fee7;
          padding: 0.5rem;
          border: 1px solid #d9f99d;
          font-weight: 600;
        }
        .roadmap-content td {
          padding: 0.5rem;
          border: 1px solid #e5e5e5;
        }
        .roadmap-content tr:nth-child(even) {
          background: #fafafa;
        }
        @media print {
          .roadmap-content {
            font-size: 12pt;
          }
          .roadmap-content h1 {
            font-size: 18pt;
          }
          .roadmap-content h2 {
            font-size: 16pt;
          }
          .roadmap-content h3 {
            font-size: 14pt;
          }
        }
      </style>
      ${html}
    </div>
  `;
}

// Hàm gọi đến Python backend như fallback
async function callPythonBackend(data: any) {
  // Lấy URL Python API từ biến môi trường
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  console.log("🔌 Connecting to Python API at:", apiUrl);

  // Gọi đến Python API server
  const response = await fetch(`${apiUrl}/api/roadmap/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatInput: data.chatInput,
    }),
    // Thêm timeout để tránh chờ quá lâu
    signal: AbortSignal.timeout(60000), // 60 giây timeout
  });

  // Kiểm tra nếu response không thành công
  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Python API error:", response.status, errorText);
    return NextResponse.json(
      { error: `API responded with status ${response.status}: ${errorText}` },
      { status: response.status }
    );
  }

  // Trả về kết quả cho frontend
  const result = await response.json();
  console.log(
    "✅ Received response from Python API:",
    result.text ? `${result.text.substring(0, 100)}...` : "No text in response"
  );

  // Thử chuyển đổi markdown sang HTML
  try {
    const html = marked.parse(result.text as string);
    result.html = addStylesToHTML(html);
  } catch (error) {
    console.error("Error converting markdown to HTML in fallback:", error);
    // Không có HTML, frontend sẽ sử dụng markdown
  }

  return NextResponse.json(result);
}
