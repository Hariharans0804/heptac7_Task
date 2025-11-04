// // utils/api.js
// import { API_HOST } from "@env";

// export const apiCall = async ({ endpoint, method = "GET", body = null }) => {
//   try {
//     // 1) sanitize base
//     let base = API_HOST || "";
//     // remove wrapping quotes if .env had them
//     base = base.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");

//     // ensure base ends with /
//     if (!base.endsWith("/")) {
//       base = base + "/";
//     }

//     // 2) sanitize endpoint
//     // allow both "form" and "/form"
//     let path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

//     const url = `${base}${path}`;
//     console.log("API_HOST (clean) ->", base);
//     console.log("FETCH ->", url);

//     const headers = {};

//     if (body) {
//       headers["Content-Type"] = "application/json";
//     }

//     const response = await fetch(url, {
//       method,
//       headers,
//       body: body ? JSON.stringify(body) : undefined,
//     });

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { message: "Unknown error from server" };
//       }
//       throw new Error(
//         errorData.message ||
//           errorData.error ||
//           `HTTP error! status: ${response.status}`
//       );
//     }

//     // crudcrud returns JSON
//     let data = null;
//     try {
//       data = await response.json();
//     } catch {
//       data = { success: true };
//     }

//     return { success: true, data };
//   } catch (error) {
//     console.error("API Error:", error);
//     return { success: false, error: error.message };
//   }
// };


// utils/api.js
import { API_HOST } from "@env";

export const apiCall = async ({ endpoint, method = "GET", body = null }) => {
  let base = API_HOST || "";

  // Sanitize .env
  base = base.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");
  if (!base.endsWith("/")) base += "/";

  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${base}${path}`;

  console.log("API_HOST (clean) ->", base);
  console.log("FETCH ->", url);

  try {
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // --- handle non-OK response ---
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData.message = response.statusText || "Unknown server error";
      }

      // throw an error with status + message
      throw {
        type: "HTTP_ERROR",
        status: response.status,
        message:
          errorData.message ||
          errorData.error ||
          `HTTP Error ${response.status} ${response.statusText}`,
      };
    }

    // --- parse success response ---
    let data;
    try {
      data = await response.json();
    } catch {
      data = { success: true };
    }

    return { success: true, status: response.status, data };
  } catch (error) {
    // --- Network Error (no connection / DNS / CORS) ---
    if (error.message === "Network request failed") {
      console.error("🌐 Network Error: Unable to reach server");
      return {
        success: false,
        status: 0,
        error: "Network request failed. Check your internet or API URL.",
      };
    }

    // --- HTTP error thrown manually above ---
    if (error.type === "HTTP_ERROR") {
      console.error(`❌ HTTP ${error.status}: ${error.message}`);
      return {
        success: false,
        status: error.status,
        error: error.message,
      };
    }

    // --- Unknown / unexpected ---
    console.error("❗ Unexpected API Error:", error);
    return {
      success: false,
      status: 0,
      error: error.message || "Unexpected error occurred",
    };
  }
};
