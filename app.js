/**
 * Varuna Traders - Main Application Controller
 * Handles star rating routing, AI SEO review generation,
 * clipboard copying with Google Maps launch, WhatsApp private grievance routing,
 * QR standee display, and local configuration management.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // Default Settings & Local Storage Persistence
  // --------------------------------------------------------------------------
  const DEFAULT_SETTINGS = {
    storeName: "Varuna Traders",
    tagline: "Household & Kitchenware Store",
    ownerName: "Varun",
    whatsapp: "919125271978", // Owner's WhatsApp (+91 91252 71978)
    googleMapsUrl: "https://maps.app.goo.gl/e6FyBFidXckdq3vH8",
    phone: "+91 91252 71978",
    geminiApiKey: ""
  };

  let currentSettings = { ...DEFAULT_SETTINGS };

  function loadSettings() {
    try {
      const stored = localStorage.getItem("varuna_traders_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically upgrade any old demo placeholders to the owner's official details
        if (parsed.googleMapsUrl && parsed.googleMapsUrl.includes("ChIJVarunaTradersDemo")) {
          parsed.googleMapsUrl = DEFAULT_SETTINGS.googleMapsUrl;
        }
        if (parsed.whatsapp && parsed.whatsapp.includes("9876543210")) {
          parsed.whatsapp = DEFAULT_SETTINGS.whatsapp;
          parsed.phone = DEFAULT_SETTINGS.phone;
        }
        currentSettings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn("Could not load stored settings, using defaults.", e);
    }
    applySettingsToUI();
  }

  function saveSettings(newSettings) {
    currentSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem("varuna_traders_settings", JSON.stringify(currentSettings));
    applySettingsToUI();
    showToast("Settings saved successfully!", "success");
  }

  function applySettingsToUI() {
    const brandStoreName = document.getElementById("brandStoreName");
    const brandTagline = document.getElementById("brandTagline");
    const footerStoreName = document.getElementById("footerStoreName");
    const qrStoreName = document.getElementById("qrStoreName");
    const callOwnerNumber = document.getElementById("callOwnerNumber");
    const btnCallOwner = document.getElementById("btnCallOwner");

    if (brandStoreName) brandStoreName.textContent = currentSettings.storeName;
    if (brandTagline) brandTagline.textContent = currentSettings.tagline;
    if (footerStoreName) footerStoreName.textContent = currentSettings.storeName;
    if (qrStoreName) qrStoreName.textContent = currentSettings.storeName;
    if (callOwnerNumber) callOwnerNumber.textContent = currentSettings.phone;
    if (btnCallOwner) btnCallOwner.href = `tel:${currentSettings.phone.replace(/\s+/g, "")}`;
  }

  loadSettings();

  // --------------------------------------------------------------------------
  // State Variables
  // --------------------------------------------------------------------------
  let selectedStars = 0;
  let selectedAspects = ["owner", "kitchenware", "pricing"];
  let selectedIssue = "Product Quality";
  let qrCodeInstance = null;

  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const starsContainer = document.getElementById("starsContainer");
  const starButtons = Array.from(document.querySelectorAll(".star-btn"));
  const ratingFeedback = document.getElementById("ratingFeedback");

  const flow5Star = document.getElementById("flow5Star");
  const flowPrivate = document.getElementById("flowPrivate");

  // 5-Star Elements
  const aspectsGrid = document.getElementById("aspectsGrid");
  const customItemInput = document.getElementById("customItemInput");
  const btnGenerateReview = document.getElementById("btnGenerateReview");
  const btnShuffleReview = document.getElementById("btnShuffleReview");
  const reviewTextarea = document.getElementById("reviewTextarea");
  const btnCopyAndGoGoogle = document.getElementById("btnCopyAndGoGoogle");

  // 1-4 Star Elements
  const custName = document.getElementById("custName");
  const issuePills = document.getElementById("issuePills");
  const privateFeedbackText = document.getElementById("privateFeedbackText");
  const btnSendWhatsApp = document.getElementById("btnSendWhatsApp");

  // Modals & Triggers
  const btnOpenQr = document.getElementById("btnOpenQr");
  const qrModal = document.getElementById("qrModal");
  const btnCloseQr = document.getElementById("btnCloseQr");
  const btnPrintQr = document.getElementById("btnPrintQr");
  const qrCanvasContainer = document.getElementById("qrCanvasContainer");

  const btnOpenSettings = document.getElementById("btnOpenSettings");
  const settingsModal = document.getElementById("settingsModal");
  const btnCloseSettings = document.getElementById("btnCloseSettings");
  const settingsForm = document.getElementById("settingsForm");
  const btnResetSettings = document.getElementById("btnResetSettings");

  // Inputs in settings
  const settingStoreName = document.getElementById("settingStoreName");
  const settingOwnerName = document.getElementById("settingOwnerName");
  const settingWhatsapp = document.getElementById("settingWhatsapp");
  const settingGoogleMapsUrl = document.getElementById("settingGoogleMapsUrl");
  const settingPhone = document.getElementById("settingPhone");
  const settingGeminiApiKey = document.getElementById("settingGeminiApiKey");

  // --------------------------------------------------------------------------
  // Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = "normal", duration = 3500) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type === "success" ? "success" : ""}`;
    toast.innerHTML = `<span>${type === "success" ? "✓" : "ℹ"}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(16px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --------------------------------------------------------------------------
  // Star Rating Interaction & Routing Logic
  // --------------------------------------------------------------------------
  const feedbackLabels = {
    1: { text: "1 Star: We sincerely apologize. We want to resolve this immediately.", class: "stars-below" },
    2: { text: "2 Stars: Not up to standard? Please tell the owner directly.", class: "stars-below" },
    3: { text: "3 Stars: Fair, but we strive for excellence. How can we improve?", class: "stars-below" },
    4: { text: "4 Stars: Good! Let the owner know what we can do better.", class: "stars-below" },
    5: { text: "5 Stars: Excellent! Thank you so much for your support! 🌟", class: "stars-5" }
  };

  function updateStarDisplay(rating) {
    starButtons.forEach((btn) => {
      const val = parseInt(btn.dataset.value, 10);
      if (val <= rating) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function setStarHover(rating) {
    starButtons.forEach((btn) => {
      const val = parseInt(btn.dataset.value, 10);
      if (val <= rating) {
        btn.classList.add("hover");
      } else {
        btn.classList.remove("hover");
      }
    });
  }

  function clearStarHover() {
    starButtons.forEach((btn) => btn.classList.remove("hover"));
  }

  starButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const val = parseInt(btn.dataset.value, 10);
      setStarHover(val);
    });

    btn.addEventListener("mouseleave", () => {
      clearStarHover();
    });

    btn.addEventListener("click", () => {
      const val = parseInt(btn.dataset.value, 10);
      handleRatingSelect(val);
    });
  });

  function handleRatingSelect(rating) {
    selectedStars = rating;
    updateStarDisplay(rating);

    const feedback = feedbackLabels[rating];
    ratingFeedback.textContent = feedback.text;
    ratingFeedback.className = `rating-feedback ${feedback.class}`;

    if (rating === 5) {
      // 5-Star Flow: AI SEO Generator & Google Maps
      flowPrivate.classList.remove("active");
      flow5Star.classList.add("active");

      // Auto generate a review if textarea is empty
      if (!reviewTextarea.value.trim()) {
        triggerAiGeneration();
      }

      flow5Star.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // 1-4 Stars Flow: Private Grievance to WhatsApp
      flow5Star.classList.remove("active");
      flowPrivate.classList.add("active");

      flowPrivate.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // --------------------------------------------------------------------------
  // 5-Star AI Review Generator Logic
  // --------------------------------------------------------------------------
  // Aspect Chip Toggle
  if (aspectsGrid) {
    aspectsGrid.addEventListener("click", (e) => {
      const chip = e.target.closest(".aspect-chip");
      if (!chip) return;

      const aspect = chip.dataset.aspect;
      if (chip.classList.contains("selected")) {
        // Prevent deselecting if it's the last one
        if (selectedAspects.length > 1) {
          chip.classList.remove("selected");
          selectedAspects = selectedAspects.filter((a) => a !== aspect);
        } else {
          showToast("Keep at least one highlight selected!", "normal", 2000);
        }
      } else {
        chip.classList.add("selected");
        selectedAspects.push(aspect);
      }

      // Re-generate review with updated aspects
      triggerAiGeneration();
    });
  }

  async function triggerAiGeneration() {
    const customItem = customItemInput.value.trim();
    reviewTextarea.placeholder = "AI is crafting your SEO-friendly review...";

    try {
      let generatedText = "";
      if (currentSettings.geminiApiKey) {
        generatedText = await ReviewEngine.generateWithGemini(
          currentSettings.geminiApiKey,
          currentSettings.storeName,
          selectedAspects,
          customItem
        );
      } else {
        generatedText = ReviewEngine.generateReview({
          storeName: currentSettings.storeName,
          selectedAspects: selectedAspects,
          customerCustomInput: customItem
        });
      }
      typewriteText(reviewTextarea, generatedText);
    } catch (err) {
      console.error(err);
      reviewTextarea.value = ReviewEngine.generateReview({
        storeName: currentSettings.storeName,
        selectedAspects: selectedAspects,
        customerCustomInput: customItem
      });
    }
  }

  let activeTypingTimer = null;

  // Realistic Typing Effect (cancels previous animation so text is never scrambled)
  function typewriteText(element, fullText) {
    if (activeTypingTimer) {
      clearInterval(activeTypingTimer);
      activeTypingTimer = null;
    }
    element.value = "";
    let i = 0;
    const speed = fullText.length > 150 ? 6 : 10;
    activeTypingTimer = setInterval(() => {
      if (i < fullText.length) {
        element.value += fullText.charAt(i);
        i++;
      } else {
        clearInterval(activeTypingTimer);
        activeTypingTimer = null;
      }
    }, speed);
  }

  if (btnGenerateReview) {
    btnGenerateReview.addEventListener("click", () => {
      triggerAiGeneration();
      showToast("✨ AI generated a new SEO review!", "success", 2000);
    });
  }

  if (btnShuffleReview) {
    btnShuffleReview.addEventListener("click", () => {
      triggerAiGeneration();
      showToast("🎲 Shuffled review variation!", "normal", 2000);
    });
  }

  if (customItemInput) {
    customItemInput.addEventListener("change", () => {
      triggerAiGeneration();
    });
  }

  // Copy to Clipboard and Auto Open Google Maps
  if (btnCopyAndGoGoogle) {
    btnCopyAndGoGoogle.addEventListener("click", async () => {
      const reviewText = reviewTextarea.value.trim();
      if (!reviewText) {
        showToast("Please write or generate a review first!", "normal");
        return;
      }

      // 1. Copy to clipboard
      let copySuccess = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(reviewText);
          copySuccess = true;
        } catch (err) {
          console.warn("Clipboard API failed, trying fallback:", err);
        }
      }

      if (!copySuccess) {
        reviewTextarea.select();
        document.execCommand("copy");
        copySuccess = true;
      }

      showToast("📋 Review copied! Launching Google Maps... Paste & Post!", "success", 4500);

      // 2. Open Google Maps in new tab
      setTimeout(() => {
        const mapsUrl = currentSettings.googleMapsUrl || "https://maps.google.com";
        window.open(mapsUrl, "_blank", "noopener,noreferrer");
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 1-4 Stars Private Grievance to Owner's WhatsApp
  // --------------------------------------------------------------------------
  if (issuePills) {
    issuePills.addEventListener("click", (e) => {
      const pill = e.target.closest(".issue-pill");
      if (!pill) return;
      document.querySelectorAll(".issue-pill").forEach((p) => p.classList.remove("selected"));
      pill.classList.add("selected");
      selectedIssue = pill.dataset.issue;
    });
  }

  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener("click", () => {
      const customerName = custName.value.trim() || "Valued Customer";
      let rawPhone = currentSettings.whatsapp.replace(/\D/g, "");

      if (!rawPhone) {
        rawPhone = "919125271978";
      } else if (rawPhone.length === 10) {
        rawPhone = "91" + rawPhone;
      }

      // Format clean message for WhatsApp
      const lines = [
        `*Private Customer Feedback for ${currentSettings.storeName}*`,
        `⭐ *Rating:* ${selectedStars} / 5 Stars`,
        `👤 *Customer:* ${customerName}`,
        `⚠️ *Area of Concern:* ${selectedIssue}`,
        details ? `📝 *Feedback/Issue:* ${details}` : "",
        `\n_Sent directly from the store review portal to resolve with the owner._`
      ].filter(Boolean);

      const messageText = lines.join("\n");
      const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(messageText)}`;

      showToast("Opening WhatsApp to message owner privately...", "success", 3000);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  // --------------------------------------------------------------------------
  // Modal: Counter QR Code Standee
  // --------------------------------------------------------------------------
  function renderQrCode() {
    if (!qrCanvasContainer) return;
    qrCanvasContainer.innerHTML = "";

    // Generate QR code for the current URL or counter page
    const pageUrl = window.location.href;
    if (typeof QRCode !== "undefined") {
      qrCodeInstance = new QRCode(qrCanvasContainer, {
        text: pageUrl,
        width: 220,
        height: 220,
        colorDark: "#0f5132",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }

  if (btnOpenQr) {
    btnOpenQr.addEventListener("click", () => {
      qrModal.classList.add("active");
      renderQrCode();
    });
  }

  if (btnCloseQr) {
    btnCloseQr.addEventListener("click", () => {
      qrModal.classList.remove("active");
    });
  }

  if (btnPrintQr) {
    btnPrintQr.addEventListener("click", () => {
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // Modal: Owner Settings Configuration
  // --------------------------------------------------------------------------
  if (btnOpenSettings) {
    btnOpenSettings.addEventListener("click", () => {
      // Pre-fill inputs
      settingStoreName.value = currentSettings.storeName;
      settingOwnerName.value = currentSettings.ownerName;
      settingWhatsapp.value = currentSettings.whatsapp;
      settingGoogleMapsUrl.value = currentSettings.googleMapsUrl;
      settingPhone.value = currentSettings.phone;
      settingGeminiApiKey.value = currentSettings.geminiApiKey || "";

      settingsModal.classList.add("active");
    });
  }

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener("click", () => {
      settingsModal.classList.remove("active");
    });
  }

  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = {
        storeName: settingStoreName.value.trim() || DEFAULT_SETTINGS.storeName,
        ownerName: settingOwnerName.value.trim() || DEFAULT_SETTINGS.ownerName,
        whatsapp: settingWhatsapp.value.trim().replace(/\D/g, "") || DEFAULT_SETTINGS.whatsapp,
        googleMapsUrl: settingGoogleMapsUrl.value.trim() || DEFAULT_SETTINGS.googleMapsUrl,
        phone: settingPhone.value.trim() || DEFAULT_SETTINGS.phone,
        geminiApiKey: settingGeminiApiKey.value.trim()
      };
      saveSettings(updated);
      settingsModal.classList.remove("active");

      // Re-render review if currently in 5-star view
      if (selectedStars === 5) {
        triggerAiGeneration();
      }
    });
  }

  if (btnResetSettings) {
    btnResetSettings.addEventListener("click", () => {
      if (confirm("Reset all settings back to defaults?")) {
        saveSettings(DEFAULT_SETTINGS);
        settingStoreName.value = DEFAULT_SETTINGS.storeName;
        settingOwnerName.value = DEFAULT_SETTINGS.ownerName;
        settingWhatsapp.value = DEFAULT_SETTINGS.whatsapp;
        settingGoogleMapsUrl.value = DEFAULT_SETTINGS.googleMapsUrl;
        settingPhone.value = DEFAULT_SETTINGS.phone;
        settingGeminiApiKey.value = "";
      }
    });
  }

  // Close modals on clicking overlay backdrop
  [qrModal, settingsModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    }
  });

  // Current year in footer
  const yearElem = document.getElementById("currentYear");
  if (yearElem) yearElem.textContent = new Date().getFullYear();
});
