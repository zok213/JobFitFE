import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const data = await req.json();

    if (!data.cvText || !data.jobDescription) {
      return NextResponse.json(
        { error: "Missing CV text or job description" },
        { status: 400 }
      );
    }

    console.log(
      "🚀 Job Match API received request",
      data.jobDescription.substring(0, 100) + "..."
    );

    // Gửi text từ CV và mô tả công việc đến Jina DeepSearch API
    console.log("🔌 Connecting to Jina AI DeepSearch API");

    const jinaApiKey =
      "jina_bafb743236fb458fb79db0dcaca4dd6cOcq6cZEzckw2sGbJgdvuy4fNvqHR";

    // Cấu trúc payload cho API
    const payload = {
      model: "jina-deepsearch-v1",
      messages: [
        {
          role: "user",
          content: `Analyze how well this candidate's CV matches the job description:
          
CV Text:
"""
${data.cvText}
"""

Job Description:
"""
${data.jobDescription}
"""

Please provide a comprehensive job match analysis with the following sections:
1. Match Score: Give an overall match percentage (0-100%) and brief explanation
2. Skills Match: List matching skills, missing skills, and exceeding skills
3. Experience Match: Analyze how the candidate's experience aligns with job requirements
4. Education Match: Evaluate educational requirements vs. candidate's qualifications
5. Key Strengths: Highlight the candidate's most relevant strengths for this role
6. Improvement Areas: Skills or experiences the candidate could develop to better match
7. Recommendations: Specific advice for the candidate to improve their fit for this role

Format the response in Markdown with clear headings and organized information.`,
        },
      ],
      stream: false,
      temperature: 0.5,
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
      return NextResponse.json(
        {
          error: `Jina AI API responded with status ${response.status}: ${errorText}`,
        },
        { status: response.status }
      );
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
      console.error("❌ No content found in Jina AI response");
      return NextResponse.json(
        { error: "No content found in Jina AI response" },
        { status: 500 }
      );
    }

    // Phân tích nội dung để lấy điểm match
    const matchScore = extractMatchScore(content);

    // Trả về kết quả phân tích
    return NextResponse.json({
      analysis: content,
      matchScore: matchScore,
      timestamp: new Date().toISOString(),
    });
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

// Hàm trích xuất điểm match từ phân tích
function extractMatchScore(content: string): number {
  // Tìm phần trăm match trong nội dung
  const matchPattern = /match(?:\s+score)?(?:\s*:?\s*)(\d{1,3})(?:\s*%)?/i;
  const match = content.match(matchPattern);

  if (match && match[1]) {
    const score = parseInt(match[1], 10);
    return score >= 0 && score <= 100 ? score : 0;
  }

  // Nếu không tìm thấy, trả về 0
  return 0;
}
