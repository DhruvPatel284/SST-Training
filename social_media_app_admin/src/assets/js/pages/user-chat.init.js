/*
  Chat UI integration (Velzon markup) -> NestJS chat APIs
*/
(function () {
  const cfg = window.__CHAT_CONFIG__ || {};
  const apiBase = cfg.apiBase || "/user/chats/api";
  const selfUserId = cfg.selfUserId;

  const userListEl = document.getElementById("userList");
  const convoEl = document.getElementById("users-conversation");
  const loaderEl = document.getElementById("elmLoader");
  const chatForm = document.getElementById("chatinput-form");
  const chatInput = document.getElementById("chat-input");
  const chatInputFeedback = document.querySelector(".chat-input-feedback");
  const chatSearchInput = document.getElementById("chatSearchInput");

  let currentChatId = cfg.chatId || null;
  let chatIndex = [];

  function escapeHtml(str) {
    return (str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function fmtTime(d) {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function fetchJson(url, opts) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      ...opts,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.error || "Request failed");
    }
    return data;
  }

  function setHeader(otherUser) {
    const name = otherUser?.name || cfg.otherUserName || "Select a chat";
    const img =
      otherUser?.profile_image
        ? "/uploads/users/" + otherUser.profile_image
        : cfg.otherUserProfileImage || "/assets/images/users/user-dummy-img.jpg";

    document.querySelectorAll(".username").forEach((el) => (el.textContent = name));
    const avatar = document.querySelector(".user-chat-topbar .user-own-img img");
    if (avatar) avatar.setAttribute("src", img || "/assets/images/users/user-dummy-img.jpg");
    const offcanvasImg = document.querySelector(".profile-offcanvas .profile-img");
    if (offcanvasImg) offcanvasImg.setAttribute("src", img || "/assets/images/users/user-dummy-img.jpg");
  }

  function renderChatList(items) {
    if (!userListEl) return;
    userListEl.innerHTML = "";

    const filtered = (items || []).filter((c) => c.type === "direct" && c.otherUser);
    filtered.forEach((c, idx) => {
      const isActive = currentChatId ? Number(currentChatId) === Number(c.chatId) : idx === 0;
      const badge =
        c.unreadCount && c.unreadCount > 0
          ? `<div class="ms-auto"><span class="badge bg-dark-subtle text-body rounded p-1">${c.unreadCount}</span></div>`
          : "";
      const profileImg = c.otherUser.profile_image
        ? `<img src="/uploads/users/${escapeHtml(c.otherUser.profile_image)}" class="rounded-circle img-fluid userprofile" alt=""><span class="user-status"></span>`
        : `<img src="/assets/images/users/user-dummy-img.jpg" class="rounded-circle img-fluid userprofile" alt=""><span class="user-status"></span>`;

      userListEl.insertAdjacentHTML(
        "beforeend",
        `<li data-name="direct-message" class="${isActive ? "active" : ""}">
          <a href="javascript:void(0);" data-chat-id="${c.chatId}">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 chat-user-img align-self-center me-2 ms-0">
                <div class="avatar-xxs">${profileImg}</div>
              </div>
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-truncate mb-0">${escapeHtml(c.otherUser.name)}</p>
                <small class="text-muted text-truncate d-block">${escapeHtml(c.lastMessage?.content || "")}</small>
              </div>
              ${badge}
            </div>
          </a>
        </li>`,
      );
    });

    // click handlers
    userListEl.querySelectorAll("a[data-chat-id]").forEach((a) => {
      a.addEventListener("click", async () => {
        const chatId = Number(a.getAttribute("data-chat-id"));
        const chat = chatIndex.find((x) => Number(x.chatId) === chatId);
        currentChatId = chatId;
        userListEl.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
        a.closest("li")?.classList.add("active");
        setHeader(chat?.otherUser);
        await loadMessages(chatId);
        await loadChatList();
      });
    });

    if (!currentChatId && filtered.length > 0) {
      currentChatId = filtered[0].chatId;
      setHeader(filtered[0].otherUser);
      loadMessages(currentChatId);
    }
  }

  function renderMessages(messages) {
    if (!convoEl) return;
    convoEl.innerHTML = "";
    (messages || []).forEach((m) => {
      const isRight = (m.senderId || null) === (selfUserId || null);
      const align = isRight ? "right" : "left";
      const time = fmtTime(m.createdAt);
      const text = escapeHtml(m.content || "");

      const avatarHtml = !isRight
        ? `<div class="chat-avatar">
            <img src="${m.senderProfileImage ? "/uploads/users/" + escapeHtml(m.senderProfileImage) : "/assets/images/users/user-dummy-img.jpg"}" alt="">
          </div>`
        : "";

      const dropdownHtml = isRight
        ? `<div class="dropdown align-self-start message-box-drop">
            <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="ri-more-2-fill"></i>
            </a>
            <div class="dropdown-menu">
              <a class="dropdown-item copy-message" href="#" data-msg="${escapeHtml(m.content || "")}">
                <i class="ri-file-copy-line me-2 text-muted align-bottom"></i>Copy
              </a>
              <a class="dropdown-item delete-message" href="#" data-message-id="${m.id}">
                <i class="ri-delete-bin-5-line me-2 text-muted align-bottom"></i>Delete
              </a>
            </div>
          </div>`
        : "";

      convoEl.insertAdjacentHTML(
        "beforeend",
        `<li class="chat-list ${align}" id="msg-${m.id}">
          <div class="conversation-list">
            ${avatarHtml}
            <div class="user-chat-content">
              <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                  <p class="mb-0 ctext-content">${text}</p>
                </div>
                ${dropdownHtml}
              </div>
              <div class="conversation-name"><small class="text-muted time">${escapeHtml(time)}</small></div>
            </div>
          </div>
        </li>`,
      );
    });

    convoEl.querySelectorAll(".copy-message").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const txt = el.getAttribute("data-msg") || "";
        navigator.clipboard?.writeText(txt);
      });
    });
    convoEl.querySelectorAll(".delete-message").forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = Number(el.getAttribute("data-message-id"));
        if (!currentChatId || !id) return;
        try {
          await fetchJson(`${apiBase}/${currentChatId}/messages/${id}/delete`, { method: "POST" });
          const row = document.getElementById(`msg-${id}`);
          if (row) row.querySelector(".ctext-content").textContent = "This message was deleted";
        } catch (err) {
          console.error(err);
        }
      });
    });

    scrollToBottom();
  }

  function scrollToBottom() {
    try {
      const wrap = document.querySelector("#chat-conversation .simplebar-content-wrapper");
      if (wrap) {
        wrap.scrollTo({ top: wrap.scrollHeight, behavior: "smooth" });
        return;
      }
    } catch (e) {}
    const container = document.getElementById("chat-conversation");
    if (container) container.scrollTop = container.scrollHeight;
  }

  async function loadChatList() {
    if (!userListEl) return;
    const data = await fetchJson(`${apiBase}/list`);
    chatIndex = data.chats || [];
    renderChatList(chatIndex);
  }

  async function loadMessages(chatId) {
    if (!convoEl) return;
    if (loaderEl) loaderEl.style.display = "block";
    const data = await fetchJson(`${apiBase}/${chatId}/messages`);
    if (loaderEl) loaderEl.style.display = "none";
    renderMessages(data.messages || []);
  }

  async function ensureDirectChat() {
    if (cfg.mode !== "direct") return;
    if (currentChatId) return;
    if (!cfg.otherUserId) return;

    const data = await fetchJson(`${apiBase}/direct`, {
      method: "POST",
      body: JSON.stringify({ otherUserId: cfg.otherUserId }),
    });
    currentChatId = data.chatId;
  }

  if (chatSearchInput && userListEl) {
    chatSearchInput.addEventListener("input", () => {
      const q = (chatSearchInput.value || "").toLowerCase();
      userListEl.querySelectorAll("li").forEach((li) => {
        const name = li.querySelector(".text-truncate")?.textContent?.toLowerCase() || "";
        li.style.display = name.includes(q) ? "" : "none";
      });
    });
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = (chatInput?.value || "").trim();
      if (!text) {
        chatInputFeedback?.classList.add("show");
        setTimeout(() => chatInputFeedback?.classList.remove("show"), 2000);
        return;
      }
      if (!currentChatId) return;

      try {
        await fetchJson(`${apiBase}/${currentChatId}/messages`, {
          method: "POST",
          body: JSON.stringify({ content: text }),
        });
        chatInput.value = "";
        await loadMessages(currentChatId);
        await loadChatList();
      } catch (err) {
        console.error(err);
        if (typeof Swal !== "undefined") {
          Swal.fire(
            "Cannot send message",
            err?.message || "You must follow this user before sending a new message.",
            "warning",
          );
        }
      }
    });
  }

  // Emoji picker (optional)
  try {
    if (window.FgEmojiPicker && document.querySelector(".chat-input")) {
      // eslint-disable-next-line no-undef
      new FgEmojiPicker({
        trigger: [".emoji-btn"],
        removeOnSelection: false,
        closeButton: true,
        position: ["top", "right"],
        preFetch: true,
        dir: "/assets/libs/fg-emoji-picker",
        insertInto: document.querySelector(".chat-input"),
      });
    }
  } catch (e) {}

  (async function init() {
    try {
      await ensureDirectChat();
      if (cfg.mode === "direct" && currentChatId) {
        setHeader({ name: cfg.otherUserName, profile_image: null });
        await loadMessages(currentChatId);
        return;
      }
      await loadChatList();
    } catch (e) {
      console.error(e);
    }
  })();
})();

