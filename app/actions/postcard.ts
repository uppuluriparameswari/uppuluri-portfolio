
"use server";

import { Resend } from "resend";

interface PostcardPayload {
  name?: string;
  message: string;
  country?: string;
  website?: string;
  stampSeed: number;
}

// Escape user input before inserting it into HTML emails
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function sendPostcard(data: PostcardPayload) {
  try {
    const name =
      typeof data.name === "string" ? data.name.trim() : "";

    const message =
      typeof data.message === "string" ? data.message : "";

    const country =
      typeof data.country === "string" ? data.country.trim() : "";

    const website =
      typeof data.website === "string" ? data.website.trim() : "";

    const { stampSeed } = data;

    // Message validation (no character limit)
    if (!message.trim()) {
      return {
        success: false,
        error: "A message is required.",
      };
    }

    // Name validation
    if (name.length > 80) {
      return {
        success: false,
        error: "Name cannot exceed 80 characters.",
      };
    }

    // Location validation
    if (country.length > 80) {
      return {
        success: false,
        error: "Location cannot exceed 80 characters.",
      };
    }

    // Website validation (optional)
    if (website) {
      if (website.length > 2048) {
        return {
          success: false,
          error: "Website URL is too long.",
        };
      }

      try {
        const parsedUrl = new URL(website);

        if (
          !["http:", "https:"].includes(parsedUrl.protocol) ||
          !parsedUrl.hostname.includes(".")
        ) {
          throw new Error("Invalid URL");
        }
      } catch {
        return {
          success: false,
          error: "Please enter a valid website URL starting with https://",
        };
      }
    }

    // Stamp validation
    if (
      !Number.isInteger(stampSeed) ||
      stampSeed < 0 ||
      stampSeed > 11
    ) {
      return {
        success: false,
        error: "Invalid postage stamp selection.",
      };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = "parameswari.u@outlook.com";

    // Development mode
    if (!apiKey) {
      console.log("💌 [Dev Mode — Postcard Received]:", {
        name: name || "Anonymous",
        message,
        country: country || "Not specified",
        website: website || "Not provided",
        stampSeed,
      });

      return { success: true };
    }

    // Escape user-provided values before inserting into HTML
    const safeName = escapeHtml(name || "Anonymous");
    const safeMessage = escapeHtml(message);
    const safeCountry = escapeHtml(country || "Not specified");
    const safeWebsite = escapeHtml(website);

    const resend = new Resend(apiKey);

    const { data: resData, error: resError } =
      await resend.emails.send({
        from: "Postcard Desk <onboarding@resend.dev>",
        to: recipientEmail,
        subject: `New Postcard from ${
          name || "a visitor"
        } (${country || "Global"})`,

        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #fafaf9; color: #111215;">

            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e4e4e7; padding-bottom: 12px; margin-bottom: 20px;">

              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a;">
                Incoming Postcard Stamp #${stampSeed + 1}
              </span>

              <span style="font-size: 11px; color: #c28e38; font-weight: 600;">
                BLR INBOX
              </span>

            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #111215; white-space: pre-wrap; overflow-wrap: anywhere; margin: 0 0 24px 0;">"${safeMessage}"</p>

            <div style="border-top: 1px solid #e4e4e7; padding-top: 16px; font-size: 12px; color: #52525b; line-height: 1.5;">

              <p style="margin: 4px 0;">
                <strong>Sender:</strong> ${safeName}
              </p>

              <p style="margin: 4px 0;">
                <strong>Location:</strong> ${safeCountry}
              </p>

              ${
                website
                  ? `
                    <p style="margin: 4px 0; overflow-wrap: anywhere;">
                      <strong>Website:</strong>
                      <a href="${safeWebsite}" style="color: #c28e38;">
                        ${safeWebsite}
                      </a>
                    </p>
                  `
                  : ""
              }

            </div>
          </div>
        `,
      });

    // Handle Resend errors
    if (resError) {
      console.error("❌ Resend API Error:", resError);

      return {
        success: false,
        error: "Unable to deliver your postcard. Please try again.",
      };
    }

    console.log("✅ Postcard delivered! Resend ID:", resData?.id);

    return { success: true };

  } catch (error) {
    console.error("Failed to send postcard:", error);

    return {
      success: false,
      error: "Unable to dispatch postcard right now. Please try again.",
    };
  }
}
