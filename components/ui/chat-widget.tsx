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
  subtitle = "Hello! How can I help you today?",
  inputPlaceholder = "Type your question...",
  customClass = "",
  role = "general",
  customMessages,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Define webhook URL and messages based on role
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
          "Hello employer! 👋",
          "I'm the JobFit assistant for employers. I can help you create job descriptions, manage candidates, or answer questions about the recruitment process.",
        ];
      case "employee":
        return [
          "Hello! 👋",
          "I'm the JobFit assistant for job seekers. I can help you find suitable jobs, improve your CV, or prepare for interviews.",
        ];
      default:
        return ["Hello! 👋", "I'm the JobFit assistant. How can I help you?"];
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
      // Add custom CSS variables for lime green color
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
            getStarted: "Start conversation",
            inputPlaceholder,
            closeButtonTooltip: "Close",
          },
        },
        initialMessages: getInitialMessages(),
        metadata: {
          // Add metadata to send with each chat request
          source: "jobfit-frontend",
          version: "1.0.0",
          userRole: role,
        },
      });

      // Cleanup function
      return () => {
        // Remove style when component unmounts
        if (style.parentNode) {
          document.head.removeChild(style);
        }

        // If n8n/chat API changes we can remove this part
        try {
          const chatElement = document.getElementById("n8n-chat");
          if (chatElement) {
            // Remove children from chat container
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

  // Don't render anything during SSR
  if (!isClient) return null;

  return (
    <div id="n8n-chat" className={customClass}>
      {/* n8n Chat will be automatically inserted here */}
    </div>
  );
};

export default ChatWidget;
