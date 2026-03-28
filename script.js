const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const modeToggle = document.getElementById("modeToggle");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

const toYouTubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
};

if (modeToggle) {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  modeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const courseList = document.getElementById("courseList");
const noResults = document.getElementById("noResults");

const filterCourses = () => {
  if (!courseList) return;
  const query = (searchInput?.value || "").trim().toLowerCase();
  const category = categoryFilter?.value || "all";
  const cards = courseList.querySelectorAll(".course-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const instructor = (card.dataset.instructor || "").toLowerCase();
    const cardCategory = card.dataset.category || "";
    const bySearch = !query || title.includes(query) || instructor.includes(query);
    const byCategory = category === "all" || cardCategory === category;
    const show = bySearch && byCategory;
    card.classList.toggle("hidden", !show);
    if (show) visibleCount += 1;
  });

  if (noResults) {
    noResults.classList.toggle("hidden", visibleCount !== 0);
  }
};

if (searchInput || categoryFilter) {
  searchInput?.addEventListener("input", filterCourses);
  categoryFilter?.addEventListener("change", filterCourses);
}

const animateProgress = () => {
  const fills = document.querySelectorAll(".progress-fill");
  const percents = document.querySelectorAll(".percent");

  fills.forEach((bar) => {
    const value = Number(bar.dataset.progress || 0);
    requestAnimationFrame(() => {
      bar.style.width = `${value}%`;
    });
  });

  percents.forEach((item) => {
    const target = Number(item.dataset.value || 0);
    let current = 0;
    const tick = () => {
      if (current < target) {
        current += 1;
        item.textContent = `${current}%`;
        requestAnimationFrame(tick);
      } else {
        item.textContent = `${target}%`;
      }
    };
    tick();
  });
};

if (document.body.dataset.page === "progress") {
  animateProgress();
}

const enrollBtn = document.getElementById("enrollBtn");
const enrollMessage = document.getElementById("enrollMessage");
let activeCourseId = "js";

if (document.body.dataset.page === "details") {
  const courseData = {
    js: {
      title: "Modern JavaScript Bootcamp",
      description: "A project-first course that takes you from core JavaScript to modern patterns for building responsive, maintainable web applications.",
      video: "https://youtu.be/BI1o2H9z9fo?si=_9aFCPIK8OE9GZHH",
      instructor: "Aisha Khan",
      instructorBio: "Senior Frontend Engineer with 9+ years teaching web development and mentoring junior engineers.",
      duration: "10h 30m",
      level: "Beginner to Intermediate",
      rating: "4.8",
      modules: [
        "Module 1: JavaScript fundamentals and variables",
        "Module 2: Arrays, objects, and reusable functions",
        "Module 3: DOM interactions and events",
        "Module 4: Async flows with promises and fetch",
        "Module 5: Mini project and deployment basics"
      ]
    },
    ui: {
      title: "UI Design System Mastery",
      description: "Learn how to build scalable design systems, reusable components, and pixel-perfect user interfaces for modern products.",
      video: "https://youtu.be/opTANvl9G1g?si=6I0ae09sALMqB7FS",
      instructor: "Ravi Menon",
      instructorBio: "Product Designer and design systems consultant helping teams ship consistent UI faster.",
      duration: "8h 10m",
      level: "Beginner",
      rating: "4.9",
      modules: [
        "Module 1: Visual hierarchy and spacing systems",
        "Module 2: Typography scales and color foundations",
        "Module 3: Component patterns and variants",
        "Module 4: Documentation and team handoff",
        "Module 5: Design system capstone"
      ]
    },
    biz: {
      title: "Business Storytelling",
      description: "Craft persuasive narratives for pitches, stakeholder meetings, and product communication using practical frameworks.",
      video: "https://youtu.be/xKOnbcAp9go?si=Rr6l2sTyo03UMnRh",
      instructor: "Neha Arora",
      instructorBio: "Communication coach who has trained startup founders and product teams on impactful storytelling.",
      duration: "6h 45m",
      level: "All Levels",
      rating: "4.6",
      modules: [
        "Module 1: Story arc for business communication",
        "Module 2: Building presentations with clarity",
        "Module 3: Speaking with confidence",
        "Module 4: Persuasive messaging for teams",
        "Module 5: Final pitch walkthrough"
      ]
    },
    data: {
      title: "Data Analytics for Beginners",
      description: "Understand analytics workflows from data cleaning to dashboard insights and communicate decisions backed by numbers.",
      video: "https://youtu.be/wQQR60KtnFY?si=cxwgv91En7yKxg4Y",
      instructor: "Karan Patel",
      instructorBio: "Data analyst and mentor focused on beginner-friendly analytics with real-world examples.",
      duration: "11h 00m",
      level: "Beginner",
      rating: "4.7",
      modules: [
        "Module 1: Data fundamentals and metrics",
        "Module 2: Spreadsheet and cleaning basics",
        "Module 3: Intro to visualization",
        "Module 4: Reading dashboards and trends",
        "Module 5: Analytics mini project"
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("course");
  activeCourseId = courseData[requestedId] ? requestedId : "js";
  const selected = courseData[activeCourseId];

  const titleEl = document.getElementById("courseTitle");
  const descEl = document.getElementById("courseDescription");
  const sourceEl = document.getElementById("courseVideoSource");
  const videoLinkEl = document.getElementById("courseVideoLink");
  const videoEl = document.querySelector(".video-wrap video");
  const frameEl = document.getElementById("courseVideoFrame");
  const modulesEl = document.getElementById("courseModules");
  const instructorEl = document.getElementById("courseInstructor");
  const bioEl = document.getElementById("instructorBio");
  const durationEl = document.getElementById("courseDuration");
  const levelEl = document.getElementById("courseLevel");
  const ratingEl = document.getElementById("courseRating");

  if (titleEl) titleEl.textContent = selected.title;
  if (descEl) descEl.textContent = selected.description;
  const youtubeEmbedUrl = toYouTubeEmbedUrl(selected.video);
  if (youtubeEmbedUrl && frameEl && videoEl) {
    frameEl.src = youtubeEmbedUrl;
    frameEl.classList.remove("hidden");
    videoEl.classList.add("hidden");
  } else if (sourceEl && videoEl && frameEl) {
    sourceEl.src = selected.video;
    videoEl.classList.remove("hidden");
    frameEl.classList.add("hidden");
    frameEl.src = "";
    videoEl.load();
  }
  if (videoLinkEl) videoLinkEl.href = selected.video;
  if (instructorEl) instructorEl.textContent = selected.instructor;
  if (bioEl) bioEl.textContent = selected.instructorBio;
  if (durationEl) durationEl.textContent = `Duration: ${selected.duration}`;
  if (levelEl) levelEl.textContent = `Level: ${selected.level}`;
  if (ratingEl) ratingEl.textContent = `Rating: ${selected.rating}`;
  if (modulesEl) {
    modulesEl.innerHTML = "";
    selected.modules.forEach((moduleText) => {
      const li = document.createElement("li");
      li.textContent = moduleText;
      modulesEl.appendChild(li);
    });
  }
}

if (enrollBtn && enrollMessage) {
  const enrolled = localStorage.getItem(`enrolled-${activeCourseId}`) === "yes";
  if (enrolled) enrollMessage.classList.remove("hidden");

  enrollBtn.addEventListener("click", () => {
    localStorage.setItem(`enrolled-${activeCourseId}`, "yes");
    enrollMessage.classList.remove("hidden");
  });
}

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error = "";

    if (!name?.value.trim()) {
      error = "Please enter your name.";
    } else if (!emailPattern.test(email?.value.trim() || "")) {
      error = "Please enter a valid email address.";
    } else if ((message?.value.trim().length || 0) < 10) {
      error = "Message should be at least 10 characters.";
    }

    formMessage.classList.remove("hidden");
    if (error) {
      formMessage.textContent = error;
      formMessage.style.color = "#d7263d";
      return;
    }

    formMessage.textContent = "Message sent successfully. We will get back to you soon.";
    formMessage.style.color = "#0b8f79";
    contactForm.reset();
  });
}
