import React, { useEffect, useState } from "react";
import { createChat } from "@n8n/chat";

interface ChatWidgetProps {
  webhookUrl?: string;
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  customClass?: string;
  role?: "general" | "employer" | "employee";
  customMessages?: string[];
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  webhookUrl = "https://mrhuy.app.n8n.cloud/webhook/3a5c6e88-046d-4af9-a0ec-df9dc40981cd/chat",
  title = "JobFit Assistant",
  subtitle = "Xin chào! Tôi có thể giúp gì cho bạn?",
  inputPlaceholder = "Nhập câu hỏi của bạn...",
  customClass = "",
  role = "general",
  customMessages,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Xác định webhook URL và các thông điệp tùy theo role
  const getWebhookUrl = () => {
    switch (role) {
      case "employer":
        return "https://mrhuy.app.n8n.cloud/webhook/employer-support-bot/chat";
      case "employee":
        return "https://mrhuy.app.n8n.cloud/webhook/employee-support-bot/chat";
      default:
        return webhookUrl;
    }
  };

  const getInitialMessages = () => {
    if (customMessages && customMessages.length > 0) {
      return customMessages;
    }

    switch (role) {
      case "employer":
        return [
          "Xin chào nhà tuyển dụng! 👋",
          "Tôi là trợ lý JobFit dành cho nhà tuyển dụng. Tôi có thể giúp bạn tạo mô tả công việc, quản lý ứng viên, hoặc giải đáp các thắc mắc về quy trình tuyển dụng.",
        ];
      case "employee":
        return [
          "Xin chào! 👋",
          "Tôi là trợ lý JobFit dành cho ứng viên. Tôi có thể giúp bạn tìm kiếm việc làm phù hợp, cải thiện CV, hoặc chuẩn bị cho phỏng vấn.",
        ];
      default:
        return [
          "Xin chào! 👋",
          "Tôi là trợ lý JobFit. Tôi có thể giúp gì cho bạn?",
        ];
    }
  };

  const getFooterText = () => {
    switch (role) {
      case "employer":
        return "Powered by JobFit AI for Employers";
      case "employee":
        return "Powered by JobFit AI for Job Seekers";
      default:
        return "Powered by JobFit AI";
    }
  };

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      // Thêm CSS biến tùy chỉnh cho màu lime green
      const style = document.createElement("style");
      style.innerHTML = `
        :root {
          --chat--color-primary: #84cc16; /* lime-500 */
          --chat--color-primary-shade-50: #65a30d; /* lime-600 */
          --chat--color-primary-shade-100: #4d7c0f; /* lime-700 */
          --chat--color-secondary: #84cc16; /* lime-500 */
          --chat--color-secondary-shade-50: #65a30d; /* lime-600 */
          --chat--toggle--background: #84cc16; /* lime-500 */
          --chat--toggle--hover--background: #65a30d; /* lime-600 */
          --chat--toggle--active--background: #4d7c0f; /* lime-700 */
          --chat--message--user--background: #84cc16; /* lime-500 */
        }
      `;
      document.head.appendChild(style);

      const chatInstance = createChat({
        webhookUrl: getWebhookUrl(),
        mode: "window",
        i18n: {
          en: {
            title,
            subtitle,
            footer: getFooterText(),
            getStarted: "Bắt đầu trò chuyện",
            inputPlaceholder,
            closeButtonTooltip: "Đóng",
          },
        },
        initialMessages: getInitialMessages(),
        metadata: {
          // Thêm metadata mà bạn muốn gửi cùng với mỗi yêu cầu chat
          source: "jobfit-frontend",
          version: "1.0.0",
          userRole: role,
        },
      });

      // Cleanup function
      return () => {
        // Xóa style khi component unmount
        if (style.parentNode) {
          document.head.removeChild(style);
        }

        // Nếu API của n8n/chat thay đổi thì chúng ta có thể bỏ phần này
        try {
          const chatElement = document.getElementById("n8n-chat");
          if (chatElement) {
            // Xóa các phần tử con từ chat container
            while (chatElement.firstChild) {
              chatElement.removeChild(chatElement.firstChild);
            }
          }
        } catch (error) {
          console.error("Error cleaning up chat widget:", error);
        }
      };
    }
  }, [webhookUrl, title, subtitle, inputPlaceholder, role, customMessages]);

  // Không render gì trong SSR
  if (!isClient) return null;

  return (
    <div id="n8n-chat" className={customClass}>
      {/* n8n Chat sẽ được tự động chèn vào đây */}
    </div>
  );
};

export default ChatWidget;
